// =========================================================================
// PINYIN POP! - SUPABASE CLIENT & CLOUD SYNC ENGINE
// Đồng bộ tiến độ học tập đa thiết bị (Máy tính <-> Điện thoại)
// =========================================================================

(function() {
  'use strict';

  class PinyinPopCloudSync {
    constructor() {
      this.client = null;
      this.currentUser = null;
      this.syncDebounceTimer = null;
      this.isSyncing = false;
      this.lastSyncTime = null;
      this.listeners = new Set();
      this.initClient();
    }

    /**
     * Khởi tạo Supabase client nếu đã cấu hình
     */
    initClient() {
      const config = window.SUPABASE_CONFIG || {};
      const url = config.url && config.url.trim();
      const key = config.anonKey && config.anonKey.trim();

      if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
        try {
          this.client = window.supabase.createClient(url, key, {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true
            }
          });

          // Lắng nghe sự kiện đăng nhập / đăng xuất
          this.client.auth.onAuthStateChange(async (event, session) => {
            this.currentUser = session ? session.user : null;
            this.notifyStatusChange(event);

            if (event === 'SIGNED_IN' && this.currentUser) {
              console.log('✅ Đã đăng nhập Supabase:', this.currentUser.email);
              // Tự động đồng bộ 2 chiều ngay khi đăng nhập
              await this.syncBidirectional();
            } else if (event === 'SIGNED_OUT') {
              console.log('🚪 Đã đăng xuất Supabase');
              this.currentUser = null;
            }
          });

          // Kiểm tra session hiện tại
          this.client.auth.getSession().then(({ data: { session } }) => {
            this.currentUser = session ? session.user : null;
            if (this.currentUser) {
              this.syncBidirectional();
            }
            this.notifyStatusChange('INITIAL_CHECK');
          });

          return true;
        } catch (e) {
          console.error('Lỗi khởi tạo Supabase Client:', e);
          return false;
        }
      }
      return false;
    }

    isConfigured() {
      const config = window.SUPABASE_CONFIG || {};
      return !!(config.url && config.anonKey && config.url.startsWith('http') && !config.url.includes('YOUR_SUPABASE'));
    }

    isLoggedIn() {
      return !!this.currentUser;
    }

    getUser() {
      return this.currentUser;
    }

    getUserDisplayName() {
      if (!this.currentUser) return 'Khách';
      const meta = this.currentUser.user_metadata || {};
      return meta.full_name || meta.display_name || (this.currentUser.email ? this.currentUser.email.split('@')[0] : 'Học viên');
    }

    /* =====================================================================
       AUTHENTICATION APIs
       ===================================================================== */
    async signUp(email, password, displayName = '') {
      if (!this.client) {
        if (!this.initClient()) {
          return { error: { message: 'Chưa cấu hình Supabase URL & Anon Key!' } };
        }
      }

      try {
        const { data, error } = await this.client.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: displayName.trim() || email.split('@')[0]
            }
          }
        });

        if (error) throw error;
        if (data && data.user) {
          this.currentUser = data.user;
          await this.syncBidirectional();
        }
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    }

    async signIn(email, password) {
      if (!this.client) {
        if (!this.initClient()) {
          return { error: { message: 'Chưa cấu hình Supabase URL & Anon Key!' } };
        }
      }

      try {
        const { data, error } = await this.client.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (error) throw error;
        if (data && data.user) {
          this.currentUser = data.user;
          await this.syncBidirectional();
        }
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    }

    async signOut() {
      if (!this.client) return { error: null };
      try {
        const { error } = await this.client.auth.signOut();
        this.currentUser = null;
        this.notifyStatusChange('SIGNED_OUT');
        return { error };
      } catch (err) {
        return { error: err };
      }
    }

    async resetPassword(email) {
      if (!this.client) {
        if (!this.initClient()) {
          return { error: { message: 'Chưa cấu hình Supabase URL & Anon Key!' } };
        }
      }
      try {
        const { data, error } = await this.client.auth.resetPasswordForEmail(email.trim());
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    }

    /* =====================================================================
       DATA SYNC ENGINE (ĐỒNG BỘ 2 CHIỀU THÔNG MINH)
       ===================================================================== */
    /**
     * Thu thập toàn bộ tiến độ hiện tại từ localStorage
     */
    gatherLocalProgress() {
      const getJson = (key, fallback = []) => {
        try {
          const val = localStorage.getItem(key);
          return val ? JSON.parse(val) : fallback;
        } catch (e) {
          return fallback;
        }
      };

      const getInt = (key, fallback = 0) => {
        try {
          const val = localStorage.getItem(key);
          return val ? parseInt(val, 10) : fallback;
        } catch (e) {
          return fallback;
        }
      };

      return {
        flashcard_mastered: getJson('pinyin_pop_mastered', []),
        flashcard_review: getJson('pinyin_pop_review', []),
        flashcard_favs: getJson('pinyin_pop_favs', []),
        stroke_completed_count: getInt('hs_completed_chars', 0),
        stroke_correct_count: getInt('hs_correct_strokes', 0),
        stroke_total_attempts: getInt('hs_total_attempts', 0),
        stroke_streak: getInt('hs_current_streak', 0),
        stroke_completed_chars: getJson('hs_completed_list', []),
        pinyin_pop_highscore: getInt('pinyin_pop_highscore', 0),
        tone_master_score: getInt('tone_master_score', 0),
        puzzle_score: getInt('puzzle_score', 0),
        extra_data: getJson('pinyin_pop_extra_data', {})
      };
    }

    /**
     * Hợp nhất dữ liệu Cloud vào Local (Giữ nguyên tối đa tiến độ cả 2 nơi)
     */
    mergeRemoteIntoLocal(remote) {
      if (!remote) return;

      const mergeSets = (key, remoteArr) => {
        try {
          const localArr = JSON.parse(localStorage.getItem(key) || '[]');
          const combined = Array.from(new Set([...localArr, ...(remoteArr || [])]));
          localStorage.setItem(key, JSON.stringify(combined));
          return combined;
        } catch (e) {
          return remoteArr || [];
        }
      };

      const mergeMaxInt = (key, remoteVal) => {
        try {
          const localVal = parseInt(localStorage.getItem(key) || '0', 10);
          const maxVal = Math.max(localVal, remoteVal || 0);
          localStorage.setItem(key, maxVal.toString());
          return maxVal;
        } catch (e) {
          return remoteVal || 0;
        }
      };

      // Hợp nhất Flashcard (Union of arrays)
      mergeSets('pinyin_pop_mastered', remote.flashcard_mastered);
      mergeSets('pinyin_pop_review', remote.flashcard_review);
      mergeSets('pinyin_pop_favs', remote.flashcard_favs);

      // Hợp nhất Tập Viết Chữ Hán
      mergeMaxInt('hs_completed_chars', remote.stroke_completed_count);
      mergeMaxInt('hs_correct_strokes', remote.stroke_correct_count);
      mergeMaxInt('hs_total_attempts', remote.stroke_total_attempts);
      mergeMaxInt('hs_current_streak', remote.stroke_streak);
      mergeSets('hs_completed_list', remote.stroke_completed_chars);

      // Hợp nhất Điểm số Game
      mergeMaxInt('pinyin_pop_highscore', remote.pinyin_pop_highscore);
      mergeMaxInt('tone_master_score', remote.tone_master_score);
      mergeMaxInt('puzzle_score', remote.puzzle_score);

      // Bắn event để giao diện đang mở tự cập nhật hiển thị ngay lập tức
      window.dispatchEvent(new CustomEvent('cloud-progress-updated', {
        detail: {
          syncedAt: new Date().toISOString()
        }
      }));
    }

    /**
     * Đồng bộ hai chiều (Pull -> Merge -> Push)
     */
    async syncBidirectional() {
      if (!this.client || !this.currentUser || this.isSyncing) return false;
      this.isSyncing = true;
      this.notifyStatusChange('SYNCING');

      try {
        const userId = this.currentUser.id;

        // 1. Tải tiến độ hiện tại từ Supabase
        const { data: remoteData, error: pullErr } = await this.client
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (pullErr) {
          console.warn('Lỗi tải dữ liệu Cloud:', pullErr);
        }

        // 2. Hợp nhất dữ liệu Cloud vào Local nếu đã có trên cloud
        if (remoteData) {
          this.mergeRemoteIntoLocal(remoteData);
        }

        // 3. Lấy dữ liệu Local tổng hợp sau khi hợp nhất để đẩy ngược lên Cloud
        const mergedData = this.gatherLocalProgress();
        mergedData.user_id = userId;
        mergedData.updated_at = new Date().toISOString();

        const { error: pushErr } = await this.client
          .from('user_progress')
          .upsert(mergedData, { onConflict: 'user_id' });

        if (pushErr) {
          console.error('Lỗi lưu dữ liệu Cloud:', pushErr);
          this.isSyncing = false;
          this.notifyStatusChange('SYNC_ERROR');
          return false;
        }

        this.lastSyncTime = new Date();
        this.isSyncing = false;
        this.notifyStatusChange('SYNC_SUCCESS');
        console.log('☁️ Đồng bộ Cloud thành công:', this.lastSyncTime.toLocaleTimeString());
        return true;
      } catch (err) {
        console.error('Lỗi trong quá trình đồng bộ:', err);
        this.isSyncing = false;
        this.notifyStatusChange('SYNC_ERROR');
        return false;
      }
    }

    /**
     * Kích hoạt đồng bộ có độ trễ (Debounced Sync)
     * Tránh gửi request liên tục khi người dùng đang học nhanh
     */
    triggerDebouncedSync(delay = 1800) {
      if (!this.isLoggedIn()) return;
      if (this.syncDebounceTimer) {
        clearTimeout(this.syncDebounceTimer);
      }
      this.syncDebounceTimer = setTimeout(() => {
        this.syncBidirectional();
      }, delay);
    }

    notifyStatusChange(status) {
      const payload = {
        status: status,
        isLoggedIn: this.isLoggedIn(),
        user: this.currentUser,
        displayName: this.getUserDisplayName(),
        lastSync: this.lastSyncTime,
        isSyncing: this.isSyncing,
        isConfigured: this.isConfigured()
      };

      window.dispatchEvent(new CustomEvent('cloud-sync-status', { detail: payload }));
      this.listeners.forEach(fn => {
        try { fn(payload); } catch (e) {}
      });
    }

    onStatusChange(fn) {
      if (typeof fn === 'function') {
        this.listeners.add(fn);
      }
    }
  }

  // Khởi tạo Singleton toàn cục
  window.PinyinAuth = new PinyinPopCloudSync();

})();
