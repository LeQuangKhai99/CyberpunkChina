// =========================================================================
// PINYIN POP! - ADMIN DASHBOARD & USER MANAGEMENT CONTROLLER
// Quản lý học viên, báo cáo thống kê KPI và phân quyền Supabase
// =========================================================================

(function() {
  'use strict';

  class AdminDashboardApp {
    constructor() {
      this.supabase = null;
      this.currentUser = null;
      this.usersData = []; // Mảng kết hợp giữa profiles & user_progress
      this.selectedUser = null;
      this.activeTab = 'tabDashboard';
      this.searchTerm = '';
      this.roleFilter = 'all';
      this.sortBy = 'newest';
      
      this.init();
    }

    async init() {
      this.initClock();
      this.bindGuardForm();
      this.bindTabs();
      this.bindTableFilters();
      this.bindUserModal();

      // Kiểm tra trạng thái xác thực và phân quyền
      await this.checkAuthAndRole();
    }

    initClock() {
      const clockEl = document.getElementById('adminClock');
      if (!clockEl) return;
      const update = () => {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('vi-VN');
      };
      update();
      setInterval(update, 1000);
    }

    /* =====================================================================
       SECURITY & AUTH GUARD
       ===================================================================== */
    async checkAuthAndRole() {
      const config = window.SUPABASE_CONFIG || {};
      if (!config.url || !config.anonKey || !window.supabase) {
        this.showGuardError('Chưa cấu hình Supabase URL & Anon Key trong supabase-config.js!');
        return;
      }

      this.supabase = window.supabase.createClient(config.url, config.anonKey);

      const { data: { session } } = await this.supabase.auth.getSession();
      if (!session || !session.user) {
        this.showGuardLogin('Vui lòng đăng nhập tài khoản Admin để truy cập hệ thống.');
        return;
      }

      this.currentUser = session.user;

      // Kiểm tra quyền role trong bảng profiles
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', this.currentUser.id)
        .maybeSingle();

      if (error || !profile || profile.role !== 'admin') {
        this.showGuardError('⛔ TỪ CHỐI TRUY CẬP: Tài khoản của bạn (' + this.currentUser.email + ') là Học Viên thường, không có quyền Quản Trị Viên (Admin).');
        return;
      }

      // Đã xác thực quyền Admin hợp lệ
      this.unlockAdminPanel(profile);
    }

    showGuardLogin(msg) {
      document.getElementById('adminGuardOverlay').style.display = 'flex';
      document.getElementById('adminMainContainer').style.display = 'none';
      document.getElementById('guardTitle').textContent = 'KHU VỰC QUẢN TRỊ ADMIN';
      document.getElementById('guardDesc').textContent = msg;
      document.getElementById('adminLoginForm').style.display = 'block';
    }

    showGuardError(msg) {
      document.getElementById('adminGuardOverlay').style.display = 'flex';
      document.getElementById('adminMainContainer').style.display = 'none';
      document.getElementById('guardIcon').textContent = '⛔';
      document.getElementById('guardTitle').textContent = 'KHÔNG CÓ QUYỀN TRUY CẬP';
      document.getElementById('guardDesc').innerHTML = msg;
      document.getElementById('adminLoginForm').style.display = 'none';
    }

    unlockAdminPanel(adminProfile) {
      document.getElementById('adminGuardOverlay').style.display = 'none';
      document.getElementById('adminMainContainer').style.display = 'flex';

      const emailEl = document.getElementById('adminUserEmail');
      const avatarEl = document.getElementById('adminAvatarSm');
      if (emailEl) emailEl.textContent = this.currentUser.email;
      if (avatarEl) {
        const name = adminProfile.display_name || this.currentUser.email;
        avatarEl.textContent = name.charAt(0).toUpperCase();
      }

      // Tải dữ liệu toàn bộ hệ thống
      this.loadAllSystemData();
    }

    bindGuardForm() {
      const form = document.getElementById('adminLoginForm');
      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value.trim();
        const pwd = document.getElementById('adminPassword').value;
        const alertEl = document.getElementById('adminGuardAlert');
        const submitBtn = document.getElementById('btnAdminLoginSubmit');

        alertEl.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳ Đang kiểm tra quyền...</span>';

        try {
          const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password: pwd
          });

          if (error) throw error;
          await this.checkAuthAndRole();
        } catch (err) {
          alertEl.className = 'admin-guard-alert error';
          let m = err.message;
          if (m.includes('Email not confirmed')) {
            m = 'Email chưa được kích hoạt. Hãy vào Supabase ➔ Authentication ➔ Users ➔ Bấm dấu [...] cạnh email chọn "Confirm user".';
          } else if (m.includes('Invalid login credentials')) {
            m = 'Email hoặc mật khẩu không chính xác.';
          }
          alertEl.innerHTML = `❌ ${m}`;
          alertEl.style.display = 'block';
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>🚀 Đăng Nhập Quản Trị</span>';
        }
      });

      // Nút logout
      const btnLogout = document.getElementById('btnAdminLogout');
      if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
          if (this.supabase) await this.supabase.auth.signOut();
          window.location.reload();
        });
      }

      // Nút làm mới dữ liệu
      const btnRefresh = document.getElementById('btnRefreshData');
      if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
          btnRefresh.disabled = true;
          btnRefresh.innerHTML = '⏳ <span>Đang tải...</span>';
          this.loadAllSystemData().then(() => {
            btnRefresh.disabled = false;
            btnRefresh.innerHTML = '🔄 <span>Làm Mới</span>';
          });
        });
      }
    }

    /* =====================================================================
       DATA LOADING & MERGING
       ===================================================================== */
    async loadAllSystemData() {
      if (!this.supabase) return;

      try {
        // 1. Tải tất cả hồ sơ người dùng
        const { data: profiles, error: pErr } = await this.supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (pErr) throw pErr;

        // 2. Tải tất cả tiến độ học tập
        const { data: progressList, error: progErr } = await this.supabase
          .from('user_progress')
          .select('*');

        if (progErr) throw progErr;

        // Tạo map tiến độ theo user_id
        const progressMap = new Map();
        (progressList || []).forEach(prog => {
          progressMap.set(prog.user_id, prog);
        });

        // Hợp nhất dữ liệu học viên
        this.usersData = (profiles || []).map(p => {
          const prog = progressMap.get(p.id) || {};
          return {
            id: p.id,
            email: p.email || 'N/A',
            display_name: p.display_name || p.email.split('@')[0],
            role: p.role || 'user',
            created_at: p.created_at,
            updated_at: p.updated_at,
            // Tiến độ Flashcard
            mastered: Array.isArray(prog.flashcard_mastered) ? prog.flashcard_mastered : [],
            review: Array.isArray(prog.flashcard_review) ? prog.flashcard_review : [],
            favs: Array.isArray(prog.flashcard_favs) ? prog.flashcard_favs : [],
            // Tiến độ Viết chữ
            stroke_completed: prog.stroke_completed_count || 0,
            stroke_correct: prog.stroke_correct_count || 0,
            stroke_total: prog.stroke_total_attempts || 0,
            stroke_streak: prog.stroke_streak || 0,
            stroke_chars: Array.isArray(prog.stroke_completed_chars) ? prog.stroke_completed_chars : [],
            // Kỷ lục game
            highscore_pop: prog.pinyin_pop_highscore || 0,
            score_tone: prog.tone_master_score || 0,
            score_puzzle: prog.puzzle_score || 0,
            last_synced: prog.updated_at || p.updated_at
          };
        });

        // Cập nhật số đếm trên tab
        const usersCountEl = document.getElementById('tabUsersCount');
        if (usersCountEl) usersCountEl.textContent = this.usersData.length;

        // Render Dashboard KPI & Table
        this.renderDashboardAnalytics();
        this.renderUsersTable();

      } catch (err) {
        console.error('Lỗi tải dữ liệu Admin:', err);
        alert('Không thể tải dữ liệu: ' + err.message);
      }
    }

    /* =====================================================================
       DASHBOARD ANALYTICS & KPIS
       ===================================================================== */
    renderDashboardAnalytics() {
      const totalUsers = this.usersData.length;
      let totalMasteredWords = 0;
      let totalStrokes = 0;
      let highestScore = 0;
      let highestScoreUser = 'Chưa có';
      let maxStreak = 0;

      this.usersData.forEach(u => {
        totalMasteredWords += u.mastered.length;
        totalStrokes += u.stroke_completed;
        if (u.highscore_pop > highestScore) {
          highestScore = u.highscore_pop;
          highestScoreUser = u.display_name;
        }
        if (u.stroke_streak > maxStreak) {
          maxStreak = u.stroke_streak;
        }
      });

      // KPI Elements
      document.getElementById('kpiTotalUsers').textContent = totalUsers.toLocaleString();
      document.getElementById('kpiTotalMastered').textContent = totalMasteredWords.toLocaleString();
      document.getElementById('kpiTotalStrokes').textContent = totalStrokes.toLocaleString();
      document.getElementById('kpiHighScore').textContent = highestScore.toLocaleString();
      document.getElementById('kpiHighScoreHolder').textContent = `Kỷ lục: ${highestScoreUser}`;
      document.getElementById('kpiMaxStreak').textContent = `${maxStreak} 🔥`;

      // Phân bổ tỷ lệ hoạt động
      const totalActions = totalMasteredWords + totalStrokes + (highestScore > 0 ? 100 : 10);
      const pctFlashcard = Math.round((totalMasteredWords / (totalActions || 1)) * 100);
      const pctStroke = Math.round((totalStrokes / (totalActions || 1)) * 100);
      const pctArcade = Math.max(10, 100 - pctFlashcard - pctStroke);
      const pctTone = 15;

      document.getElementById('barPctFlashcard').textContent = `${pctFlashcard}%`;
      document.getElementById('barFillFlashcard').style.width = `${pctFlashcard}%`;

      document.getElementById('barPctStroke').textContent = `${pctStroke}%`;
      document.getElementById('barFillStroke').style.width = `${pctStroke}%`;

      document.getElementById('barPctArcade').textContent = `${pctArcade}%`;
      document.getElementById('barFillArcade').style.width = `${pctArcade}%`;

      document.getElementById('barPctTone').textContent = `${pctTone}%`;
      document.getElementById('barFillTone').style.width = `${pctTone}%`;

      // Render Leaderboard (Top 5 học viên chăm chỉ)
      this.renderLeaderboard();
    }

    renderLeaderboard() {
      const container = document.getElementById('leaderboardList');
      if (!container) return;

      const sorted = [...this.usersData].sort((a, b) => {
        const scoreA = (a.mastered.length * 10) + (a.stroke_completed * 20) + a.highscore_pop;
        const scoreB = (b.mastered.length * 10) + (b.stroke_completed * 20) + b.highscore_pop;
        return scoreB - scoreA;
      }).slice(0, 5);

      if (sorted.length === 0) {
        container.innerHTML = '<div style="color:#64748b;padding:12px;">Chưa có học viên nào trong hệ thống.</div>';
        return;
      }

      container.innerHTML = sorted.map((u, idx) => {
        const rank = idx + 1;
        const initial = u.display_name.charAt(0).toUpperCase();
        const totalPts = (u.mastered.length * 10) + (u.stroke_completed * 20) + u.highscore_pop;
        return `
          <div class="leader-item">
            <div class="leader-meta">
              <span class="leader-rank top-${rank}">#${rank}</span>
              <div class="leader-avatar">${initial}</div>
              <div>
                <div class="leader-name">${u.display_name}</div>
                <div style="font-size:10px;color:#94a3b8;">${u.mastered.length} từ thuộc • ${u.stroke_completed} chữ viết</div>
              </div>
            </div>
            <span class="leader-score-pill">${totalPts.toLocaleString()} ĐIỂM</span>
          </div>
        `;
      }).join('');
    }

    /* =====================================================================
       USER MANAGEMENT TABLE
       ===================================================================== */
    renderUsersTable() {
      const tbody = document.getElementById('usersTableBody');
      if (!tbody) return;

      let filtered = this.usersData.filter(u => {
        const matchSearch = u.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            u.display_name.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchRole = this.roleFilter === 'all' || u.role === this.roleFilter;
        return matchSearch && matchRole;
      });

      // Sắp xếp
      filtered.sort((a, b) => {
        if (this.sortBy === 'mastered') return b.mastered.length - a.mastered.length;
        if (this.sortBy === 'strokes') return b.stroke_completed - a.stroke_completed;
        if (this.sortBy === 'highscore') return b.highscore_pop - a.highscore_pop;
        return new Date(b.created_at) - new Date(a.created_at); // 'newest'
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="table-loading">Không tìm thấy học viên nào phù hợp bộ lọc.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(u => {
        const initial = u.display_name.charAt(0).toUpperCase();
        const accuracy = u.stroke_total > 0
          ? Math.round((u.stroke_correct / u.stroke_total) * 100)
          : 100;

        const roleBadge = u.role === 'admin'
          ? `<span class="badge-tag-role admin">👑 Admin</span>`
          : `<span class="badge-tag-role user">👤 Học viên</span>`;

        const lastSyncedStr = u.last_synced
          ? new Date(u.last_synced).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
          : 'Chưa đồng bộ';

        return `
          <tr>
            <td>
              <div class="table-user-cell">
                <div class="table-avatar">${initial}</div>
                <div class="table-user-meta">
                  <span class="table-user-name">${u.display_name}</span>
                  <span class="table-user-email">${u.email}</span>
                </div>
              </div>
            </td>
            <td>${roleBadge}</td>
            <td>
              <strong style="color:#60a5fa;">${u.mastered.length}</strong> / 5.000 từ
              <div class="bar-track" style="height:4px;width:90px;margin-top:4px;">
                <div class="bar-fill fill-blue" style="width:${Math.min(100, (u.mastered.length / 100) * 100)}%;"></div>
              </div>
            </td>
            <td>
              <strong style="color:#f472b6;">${u.stroke_completed}</strong> chữ (${accuracy}%)
            </td>
            <td>
              <span style="color:#fbbf24;font-weight:800;">⭐ ${u.highscore_pop.toLocaleString()}</span>
            </td>
            <td>
              <span style="font-size:11px;color:#94a3b8;">${lastSyncedStr}</span>
            </td>
            <td style="text-align: right;">
              <button class="btn-table-action btn-view-user" data-id="${u.id}">
                👁️ Chi Tiết
              </button>
            </td>
          </tr>
        `;
      }).join('');

      // Gắn sự kiện xem chi tiết
      tbody.querySelectorAll('.btn-view-user').forEach(btn => {
        btn.addEventListener('click', () => {
          const userId = btn.getAttribute('data-id');
          this.openUserDetailModal(userId);
        });
      });
    }

    bindTableFilters() {
      const searchInput = document.getElementById('inputSearchUser');
      const clearBtn = document.getElementById('btnClearSearch');
      const roleSelect = document.getElementById('filterRole');
      const sortSelect = document.getElementById('sortBy');

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchTerm = e.target.value.trim();
          this.renderUsersTable();
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          this.searchTerm = '';
          this.renderUsersTable();
        });
      }

      if (roleSelect) {
        roleSelect.addEventListener('change', (e) => {
          this.roleFilter = e.target.value;
          this.renderUsersTable();
        });
      }

      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.sortBy = e.target.value;
          this.renderUsersTable();
        });
      }
    }

    /* =====================================================================
       USER DETAIL POPUP MODAL & ROLE MANAGEMENT
       ===================================================================== */
    openUserDetailModal(userId) {
      const user = this.usersData.find(u => u.id === userId);
      if (!user) return;
      this.selectedUser = user;

      const modal = document.getElementById('userDetailModalBackdrop');
      const nameEl = document.getElementById('modalUserName');
      const emailEl = document.getElementById('modalUserEmail');
      const avatarEl = document.getElementById('modalUserAvatar');
      const masteredEl = document.getElementById('modalStatMastered');
      const strokesEl = document.getElementById('modalStatStrokes');
      const accEl = document.getElementById('modalStatAccuracy');
      const scoreEl = document.getElementById('modalStatScore');
      const cloudEl = document.getElementById('modalVocabCloud');
      const countEl = document.getElementById('modalVocabCount');
      const roleEl = document.getElementById('modalCurrentRole');

      nameEl.textContent = user.display_name;
      emailEl.textContent = user.email;
      avatarEl.textContent = user.display_name.charAt(0).toUpperCase();

      masteredEl.textContent = user.mastered.length;
      strokesEl.textContent = user.stroke_completed;
      scoreEl.textContent = user.highscore_pop.toLocaleString();
      roleEl.textContent = user.role.toUpperCase();

      const accuracy = user.stroke_total > 0
        ? Math.round((user.stroke_correct / user.stroke_total) * 100)
        : 100;
      accEl.textContent = `${accuracy}%`;

      // Hiển thị danh sách từ đã thuộc
      countEl.textContent = user.mastered.length;
      if (user.mastered.length > 0) {
        cloudEl.innerHTML = user.mastered.map(w => `<span class="word-tag-chip">${w}</span>`).join('');
      } else {
        cloudEl.innerHTML = `<em>Học viên này chưa đánh dấu thuộc từ vựng nào.</em>`;
      }

      modal.classList.add('active');
    }

    bindUserModal() {
      const modal = document.getElementById('userDetailModalBackdrop');
      const closeBtn = document.getElementById('btnCloseUserModal');
      const toggleRoleBtn = document.getElementById('btnToggleRoleAction');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('active');
        });
      }

      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.remove('active');
        });
      }

      // Đổi vai trò Admin / User
      if (toggleRoleBtn) {
        toggleRoleBtn.addEventListener('click', async () => {
          if (!this.selectedUser) return;
          const newRole = this.selectedUser.role === 'admin' ? 'user' : 'admin';
          const confirmMsg = `Bạn có chắc muốn chuyển vai trò của ${this.selectedUser.email} thành "${newRole.toUpperCase()}"?`;
          if (!confirm(confirmMsg)) return;

          toggleRoleBtn.disabled = true;
          toggleRoleBtn.textContent = '⏳ Đang lưu...';

          try {
            const { error } = await this.supabase
              .from('profiles')
              .update({ role: newRole })
              .eq('id', this.selectedUser.id);

            if (error) throw error;

            this.selectedUser.role = newRole;
            document.getElementById('modalCurrentRole').textContent = newRole.toUpperCase();
            alert(`✅ Đã chuyển vai trò thành công sang: ${newRole.toUpperCase()}`);
            this.renderUsersTable();
          } catch (err) {
            alert('❌ Lỗi cập nhật vai trò: ' + err.message);
          } finally {
            toggleRoleBtn.disabled = false;
            toggleRoleBtn.textContent = '🔄 Chuyển vai trò (Admin / User)';
          }
        });
      }

      // Xóa sạch tiến độ học tập của học viên
      const resetProgressBtn = document.getElementById('btnResetUserProgressAction');
      if (resetProgressBtn) {
        resetProgressBtn.addEventListener('click', async () => {
          if (!this.selectedUser) return;
          const confirmMsg = `⚠️ Bạn có chắc chắn muốn XÓA SẠCH toàn bộ tiến độ học của học viên "${this.selectedUser.email}" về 0?`;
          if (!confirm(confirmMsg)) return;

          resetProgressBtn.disabled = true;
          resetProgressBtn.textContent = '⏳ Đang xóa...';

          try {
            const emptyProg = {
              user_id: this.selectedUser.id,
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

            const { error } = await this.supabase
              .from('user_progress')
              .upsert(emptyProg, { onConflict: 'user_id' });

            if (error) throw error;

            // Cập nhật dữ liệu local của admin
            this.selectedUser.mastered = [];
            this.selectedUser.stroke_completed = 0;
            this.selectedUser.stroke_correct = 0;
            this.selectedUser.stroke_total = 0;
            this.selectedUser.highscore_pop = 0;
            this.selectedUser.last_synced = emptyProg.updated_at;

            // Cập nhật lại UI modal
            document.getElementById('modalStatMastered').textContent = '0';
            document.getElementById('modalStatStrokes').textContent = '0';
            document.getElementById('modalStatAccuracy').textContent = '100%';
            document.getElementById('modalStatScore').textContent = '0';
            document.getElementById('modalVocabCount').textContent = '0';
            document.getElementById('modalVocabCloud').innerHTML = `<em>Học viên này chưa đánh dấu thuộc từ vựng nào.</em>`;

            alert(`✅ Đã xóa sạch tiến độ của ${this.selectedUser.email} về 0!`);
            this.renderDashboardAnalytics();
            this.renderUsersTable();
          } catch (err) {
            alert('❌ Lỗi khi xóa tiến độ: ' + err.message);
          } finally {
            resetProgressBtn.disabled = false;
            resetProgressBtn.textContent = '🗑️ Xóa sạch tiến độ học';
          }
        });
      }
    }

    bindTabs() {
      const tabDash = document.getElementById('tabBtnDashboard');
      const tabUsers = document.getElementById('tabBtnUsers');
      const paneDash = document.getElementById('tabDashboard');
      const paneUsers = document.getElementById('tabUsers');

      if (tabDash && tabUsers) {
        tabDash.addEventListener('click', () => {
          tabDash.classList.add('active');
          tabUsers.classList.remove('active');
          paneDash.classList.add('active');
          paneUsers.classList.remove('active');
        });

        tabUsers.addEventListener('click', () => {
          tabUsers.classList.add('active');
          tabDash.classList.remove('active');
          paneUsers.classList.add('active');
          paneDash.classList.remove('active');
        });
      }
    }
  }

  // Khởi tạo ứng dụng Admin khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    window.AdminApp = new AdminDashboardApp();
  });

})();
