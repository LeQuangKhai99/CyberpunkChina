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
      this.userRole = 'user';
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
            if (this.currentUser) {
              await this.ensureProfileAndProgress(this.currentUser);
              await this.checkUserRole();
            } else {
              this.userRole = 'user';
            }
            this.notifyStatusChange(event);

            if (event === 'SIGNED_IN' && this.currentUser) {
              console.log('✅ Đã đăng nhập Supabase:', this.currentUser.email, 'Role:', this.userRole);
              await this.syncBidirectional({ mode: 'login' });
            } else if (event === 'SIGNED_OUT') {
              console.log('🚪 Đã đăng xuất Supabase');
              this.currentUser = null;
              this.userRole = 'user';
              this.clearLocalProgress();
            }
          });

          // Kiểm tra session hiện tại
          this.client.auth.getSession().then(async ({ data: { session } }) => {
            this.currentUser = session ? session.user : null;
            if (this.currentUser) {
              await this.ensureProfileAndProgress(this.currentUser);
              await this.checkUserRole();
              await this.syncBidirectional({ mode: 'session_restore' });
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

    /**
     * Đảm bảo mọi User khi đăng nhập/đăng ký đều có hồ sơ trong bảng profiles và user_progress
     */
    async ensureProfileAndProgress(user, fullName = null) {
      if (!this.client || !user) return;
      try {
        const displayName = fullName || user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'Học viên');

        // 1. Kiểm tra và bổ sung bảng profiles nếu chưa có
        const { data: existingProfile } = await this.client
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .maybeSingle();

        if (!existingProfile) {
          const isAdminEmail = (user.email === 'admin@pinyinpop.com' || user.email === 'admin@gmail.com');
          await this.client.from('profiles').insert({
            id: user.id,
            email: user.email,
            display_name: displayName,
            role: isAdminEmail ? 'admin' : 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          console.log('✨ Đã tự động tạo hồ sơ profile cho user:', user.email);
        }

        // 2. Kiểm tra và bổ sung bảng user_progress nếu chưa có
        const { data: existingProgress } = await this.client
          .from('user_progress')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!existingProgress) {
          await this.client.from('user_progress').insert({
            user_id: user.id,
            flashcard_mastered: [],
            flashcard_review: [],
            flashcard_favs: [],
            stroke_completed_count: 0,
            stroke_correct_count: 0,
            stroke_total_attempts: 0,
            stroke_streak: 0,
            stroke_completed_chars: [],
            pinyin_pop_highscore: 0,
            tone_master_score: 0,
            puzzle_score: 0,
            extra_data: {},
            updated_at: new Date().toISOString()
          });
          console.log('✨ Đã tự động tạo tiến độ user_progress cho user:', user.email);
        }
      } catch (err) {
        console.warn('ensureProfileAndProgress warning:', err);
      }
    }

    async checkUserRole() {
      if (!this.client || !this.currentUser) {
        this.userRole = 'user';
        return 'user';
      }
      try {
        const { data, error } = await this.client
          .from('profiles')
          .select('role')
          .eq('id', this.currentUser.id)
          .maybeSingle();

        if (error) {
          console.warn('Lỗi lấy quyền người dùng:', error);
          this.userRole = 'user';
        } else {
          this.userRole = (data && data.role === 'admin') ? 'admin' : 'user';
        }
        return this.userRole;
      } catch (e) {
        this.userRole = 'user';
        return 'user';
      }
    }

    getUserRole() {
      return this.userRole;
    }

    isAdmin() {
      return this.userRole === 'admin';
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
          await this.ensureProfileAndProgress(data.user, displayName);
          await this.checkUserRole();
          if (data.session) {
            await this.syncBidirectional({ mode: 'register' });
          }
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
          await this.ensureProfileAndProgress(data.user);
          await this.checkUserRole();
          await this.syncBidirectional({ mode: 'login' });
        }
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    }

    async signOut() {
      if (!this.client) {
        this.clearLocalProgress();
        return { error: null };
      }
      try {
        const { error } = await this.client.auth.signOut();
        this.currentUser = null;
        this.userRole = 'user';
        // Xóa sạch tiến độ lưu tạm trên máy này để không bị dính sang tài khoản khác
        this.clearLocalProgress();
        this.notifyStatusChange('SIGNED_OUT');
        return { error };
      } catch (err) {
        this.clearLocalProgress();
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
       DATA SYNC ENGINE (CÁCH LY DỮ LIỆU TỪNG USER & ĐỒNG BỘ 2 CHIỀU)
       ===================================================================== */
    /**
     * Xóa sạch tiến độ học tập trên máy khi Đăng Xuất hoặc Đổi Tài Khoản
     */
    clearLocalProgress() {
      const keys = [
        'pinyin_pop_mastered',
        'pinyin_pop_review',
        'pinyin_pop_favs',
        'hs_completed_chars',
        'hs_correct_strokes',
        'hs_total_attempts',
        'hs_current_streak',
        'hs_completed_list',
        'pinyin_pop_highscore',
        'tone_master_score',
        'puzzle_score',
        'pinyin_pop_extra_data',
        'pinyin_pop_active_uid'
      ];
      keys.forEach(key => {
        try { localStorage.removeItem(key); } catch (e) {}
      });

      // Thông báo cho tất cả màn hình (Flashcard, Tập viết, Arcade) reset bộ đếm về 0 ngay lập tức
      window.dispatchEvent(new CustomEvent('cloud-progress-updated', {
        detail: {
          reset: true,
          syncedAt: new Date().toISOString()
        }
      }));
    }

    /**
     * Nạp chính xác dữ liệu của một tài khoản từ Cloud vào LocalStorage
     */
    overwriteLocalWithRemote(remote) {
      if (!remote) return;

      const setJson = (key, val, fallback = '[]') => {
        try {
          localStorage.setItem(key, JSON.stringify(val || (fallback === '[]' ? [] : {})));
        } catch (e) {}
      };

      const setInt = (key, val) => {
        try {
          localStorage.setItem(key, ((val || 0)).toString());
        } catch (e) {}
      };

      // Flashcards
      setJson('pinyin_pop_mastered', remote.flashcard_mastered || []);
      setJson('pinyin_pop_review', remote.flashcard_review || []);
      setJson('pinyin_pop_favs', remote.flashcard_favs || []);

      // Tập Viết Chữ Hán
      setInt('hs_completed_chars', remote.stroke_completed_count || 0);
      setInt('hs_correct_strokes', remote.stroke_correct_count || 0);
      setInt('hs_total_attempts', remote.stroke_total_attempts || 0);
      setInt('hs_current_streak', remote.stroke_streak || 0);
      setJson('hs_completed_list', remote.stroke_completed_chars || []);

      // Game & Kỷ lục
      setInt('pinyin_pop_highscore', remote.pinyin_pop_highscore || 0);
      setInt('tone_master_score', remote.tone_master_score || 0);
      setInt('puzzle_score', remote.puzzle_score || 0);
      setJson('pinyin_pop_extra_data', remote.extra_data || {}, '{}');

      // Bắn event để giao diện đang mở cập nhật hiển thị theo tài khoản mới
      window.dispatchEvent(new CustomEvent('cloud-progress-updated', {
        detail: {
          type: 'overwrite',
          syncedAt: new Date().toISOString()
        }
      }));
    }

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
     * Hợp nhất dữ liệu Cloud vào Local (khi cùng 1 user học trên nhiều thiết bị)
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

      mergeSets('pinyin_pop_mastered', remote.flashcard_mastered);
      mergeSets('pinyin_pop_review', remote.flashcard_review);
      mergeSets('pinyin_pop_favs', remote.flashcard_favs);

      mergeMaxInt('hs_completed_chars', remote.stroke_completed_count);
      mergeMaxInt('hs_correct_strokes', remote.stroke_correct_count);
      mergeMaxInt('hs_total_attempts', remote.stroke_total_attempts);
      mergeMaxInt('hs_current_streak', remote.stroke_streak);
      mergeSets('hs_completed_list', remote.stroke_completed_chars);

      mergeMaxInt('pinyin_pop_highscore', remote.pinyin_pop_highscore);
      mergeMaxInt('tone_master_score', remote.tone_master_score);
      mergeMaxInt('puzzle_score', remote.puzzle_score);

      window.dispatchEvent(new CustomEvent('cloud-progress-updated', {
        detail: {
          syncedAt: new Date().toISOString()
        }
      }));
    }

    /**
     * Đặt lại tiến độ của người dùng hiện tại về 0 (Cả Cloud lẫn Local)
     */
    async resetUserProgress() {
      if (!this.client || !this.currentUser) return false;
      try {
        const userId = this.currentUser.id;
        const emptyProgress = {
          user_id: userId,
          flashcard_mastered: [],
          flashcard_review: [],
          flashcard_favs: [],
          stroke_completed_count: 0,
          stroke_correct_count: 0,
          stroke_total_attempts: 0,
          stroke_streak: 0,
          stroke_completed_chars: [],
          pinyin_pop_highscore: 0,
          tone_master_score: 0,
          puzzle_score: 0,
          extra_data: {},
          updated_at: new Date().toISOString()
        };

        const { error } = await this.client
          .from('user_progress')
          .upsert(emptyProgress, { onConflict: 'user_id' });

        if (error) throw error;

        // Xóa sạch Local
        this.clearLocalProgress();
        localStorage.setItem('pinyin_pop_active_uid', userId);

        this.lastSyncTime = new Date();
        this.notifyStatusChange('SYNC_SUCCESS');
        return true;
      } catch (e) {
        console.error('Lỗi đặt lại tiến độ:', e);
        return false;
      }
    }

    /**
     * Đồng bộ hai chiều thông minh có cô lập tài khoản
     */
    async syncBidirectional(options = {}) {
      if (!this.client || !this.currentUser || this.isSyncing) return false;
      this.isSyncing = true;
      this.notifyStatusChange('SYNCING');

      try {
        const userId = this.currentUser.id;
        const activeUid = localStorage.getItem('pinyin_pop_active_uid');
        const isAccountSwitch = activeUid && activeUid !== userId;

        // Đảm bảo user có bản ghi trong profiles và user_progress
        await this.ensureProfileAndProgress(this.currentUser);

        // 1. Tải tiến độ hiện tại từ Supabase
        const { data: remoteData, error: pullErr } = await this.client
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (pullErr) {
          console.warn('Lỗi tải dữ liệu Cloud:', pullErr);
        }

        // Phát hiện chuyển đổi tài khoản trên cùng trình duyệt:
        if (isAccountSwitch) {
          console.log('🔄 Đổi tài khoản:', activeUid, '->', userId, '. Làm sạch bộ nhớ máy của tài khoản cũ.');
          this.clearLocalProgress();
          localStorage.setItem('pinyin_pop_active_uid', userId);
          if (remoteData) {
            this.overwriteLocalWithRemote(remoteData);
          }
          this.lastSyncTime = new Date();
          this.isSyncing = false;
          this.notifyStatusChange('SYNC_SUCCESS');
          return true;
        }

        // Đánh dấu UID đang hoạt động trên máy
        localStorage.setItem('pinyin_pop_active_uid', userId);

        // Chế độ Đăng Nhập (Login): Nạp chính xác dữ liệu của tài khoản này
        if (options.mode === 'login' || options.mode === 'session_restore') {
          if (remoteData) {
            this.overwriteLocalWithRemote(remoteData);
          } else {
            this.clearLocalProgress();
            localStorage.setItem('pinyin_pop_active_uid', userId);
          }
        } else if (options.mode === 'register') {
          // Vừa tạo tài khoản mới: Lưu lại tiến độ khách vừa học
          const localData = this.gatherLocalProgress();
          localData.user_id = userId;
          localData.updated_at = new Date().toISOString();

          await this.client
            .from('user_progress')
            .upsert(localData, { onConflict: 'user_id' });
        } else {
          // Đồng bộ tự động định kỳ trong lúc đang học:
          if (remoteData) {
            this.mergeRemoteIntoLocal(remoteData);
          }

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
