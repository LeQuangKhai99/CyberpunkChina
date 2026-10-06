// =========================================================================
// PINYIN POP! - AUTH MODAL & USER NAVIGATION CONTROLLER
// Quản lý Modal Đăng Nhập, Đăng Ký, Trạng Thái Đồng Bộ và Cấu Hình
// =========================================================================

(function() {
  'use strict';

  class AuthModalController {
    constructor() {
      this.backdrop = null;
      this.dialog = null;
      this.chipBtn = null;
      this.currentTab = 'login';
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    setup() {
      this.injectModalHtml();
      this.mountAuthChip();
      this.bindEvents();
      this.updateState();

      // Lắng nghe sự kiện từ Cloud Sync Engine
      window.addEventListener('cloud-sync-status', () => this.updateState());
      window.addEventListener('cloud-progress-updated', () => this.updateProfileStats());
    }

    /**
     * Tìm vị trí thích hợp trên Navbar để chèn nút Đăng Nhập / Profile
     */
    mountAuthChip() {
      let mountContainer = document.getElementById('authChipMount');

      if (!mountContainer) {
        // Tìm các container hành động có sẵn trên từng trang
        const possibleSelectors = [
          '.portal-navbar',
          '.hs-header-actions',
          '.fc-header-actions',
          '.tm-header-actions',
          '.pz-header-actions',
          '.cyber-hud'
        ];

        for (const selector of possibleSelectors) {
          const el = document.querySelector(selector);
          if (el) {
            mountContainer = el;
            break;
          }
        }
      }

      this.chipBtn = document.createElement('button');
      this.chipBtn.className = 'pp-auth-chip-btn';
      this.chipBtn.id = 'ppAuthChipBtn';
      this.chipBtn.type = 'button';
      this.chipBtn.title = 'Đăng nhập để đồng bộ tiến độ học giữa Máy tính & Điện thoại';

      if (mountContainer) {
        if (mountContainer.classList.contains('portal-navbar')) {
          mountContainer.appendChild(this.chipBtn);
        } else if (mountContainer.firstChild) {
          mountContainer.insertBefore(this.chipBtn, mountContainer.firstChild);
        } else {
          mountContainer.appendChild(this.chipBtn);
        }
      } else {
        // Fallback: Nút nổi góc phải trên cùng
        this.chipBtn.classList.add('pp-auth-chip-floating');
        document.body.appendChild(this.chipBtn);
      }

      this.chipBtn.addEventListener('click', () => {
        if (window.PinyinAuth && window.PinyinAuth.isLoggedIn()) {
          this.openModal('profile');
        } else {
          this.openModal('login');
        }
      });
    }

    /**
     * Khởi tạo giao diện Modal vào cuối body
     */
    injectModalHtml() {
      if (document.getElementById('ppAuthBackdrop')) return;

      const modalHtml = `
        <div class="pp-auth-backdrop" id="ppAuthBackdrop">
          <div class="pp-auth-dialog" id="ppAuthDialog">
            <button type="button" class="pp-auth-close-btn" id="ppAuthCloseBtn" title="Đóng">✕</button>

            <!-- Header -->
            <div class="pp-auth-header">
              <div class="pp-auth-emblem">☁️</div>
              <h3 class="pp-auth-title" id="ppModalTitle">PINYIN POP CLOUD</h3>
              <p class="pp-auth-subtitle" id="ppModalSub">Đồng bộ tiến độ học tập giữa Máy tính & Điện thoại</p>
            </div>

            <!-- Tab Switcher -->
            <div class="pp-auth-tabs" id="ppAuthTabs">
              <button type="button" class="pp-auth-tab active" data-tab="login">Đăng Nhập</button>
              <button type="button" class="pp-auth-tab" data-tab="register">Đăng Ký</button>
            </div>

            <!-- Body Contents -->
            <div class="pp-auth-body">
              <div class="pp-auth-alert" id="ppAuthAlert"></div>

              <!-- PANE 1: ĐĂNG NHẬP -->
              <div class="pp-auth-pane active" id="paneLogin">
                <form id="formLogin">
                  <div class="pp-form-group">
                    <label class="pp-form-label">Email tài khoản:</label>
                    <div class="pp-input-wrap">
                      <span class="pp-input-icon">✉️</span>
                      <input type="email" id="loginEmail" class="pp-input" placeholder="tenban@email.com" required autocomplete="email">
                    </div>
                  </div>

                  <div class="pp-form-group">
                    <label class="pp-form-label">Mật khẩu:</label>
                    <div class="pp-input-wrap">
                      <span class="pp-input-icon">🔒</span>
                      <input type="password" id="loginPassword" class="pp-input" placeholder="Nhập mật khẩu..." required autocomplete="current-password">
                      <button type="button" class="pp-input-toggle-pwd" data-target="loginPassword">👁️</button>
                    </div>
                  </div>

                  <button type="submit" class="pp-btn-submit btn-blue" id="btnLoginSubmit">
                    <span>🚀 Đăng Nhập & Đồng Bộ</span>
                  </button>

                  <div style="margin-top: 12px; text-align: center;">
                    <button type="button" id="btnForgotPwd" style="background:none;border:none;color:#3b82f6;font-size:11px;font-weight:700;cursor:pointer;">
                      Quên mật khẩu?
                    </button>
                  </div>
                </form>
              </div>

              <!-- PANE 2: ĐĂNG KÝ -->
              <div class="pp-auth-pane" id="paneRegister">
                <form id="formRegister">
                  <div class="pp-form-group">
                    <label class="pp-form-label">Họ tên / Biệt danh:</label>
                    <div class="pp-input-wrap">
                      <span class="pp-input-icon">👤</span>
                      <input type="text" id="regName" class="pp-input" placeholder="Ví dụ: Minh Khang" required autocomplete="name">
                    </div>
                  </div>

                  <div class="pp-form-group">
                    <label class="pp-form-label">Email đăng ký:</label>
                    <div class="pp-input-wrap">
                      <span class="pp-input-icon">✉️</span>
                      <input type="email" id="regEmail" class="pp-input" placeholder="tenban@email.com" required autocomplete="email">
                    </div>
                  </div>

                  <div class="pp-form-group">
                    <label class="pp-form-label">Mật khẩu (tối thiểu 6 ký tự):</label>
                    <div class="pp-input-wrap">
                      <span class="pp-input-icon">🔒</span>
                      <input type="password" id="regPassword" class="pp-input" placeholder="Tạo mật khẩu..." required minlength="6" autocomplete="new-password">
                      <button type="button" class="pp-input-toggle-pwd" data-target="regPassword">👁️</button>
                    </div>
                  </div>

                  <button type="submit" class="pp-btn-submit" id="btnRegSubmit">
                    <span>✨ Tạo Tài Khoản Miễn Phí</span>
                  </button>
                </form>
              </div>

              <!-- PANE 3: PROFILE (Khi đã đăng nhập) -->
              <div class="pp-auth-pane" id="paneProfile">
                <div class="pp-profile-card">
                  <div class="pp-profile-avatar-big" id="profileAvatarBig">👤</div>
                  <h4 class="pp-profile-name" id="profileDisplayName">Người dùng</h4>
                  <div class="pp-profile-email" id="profileEmail">user@example.com</div>

                  <!-- Tiến độ tổng quan -->
                  <div class="pp-stats-grid">
                    <div class="pp-stat-box">
                      <span class="pp-stat-val" id="statMasteredCount">0</span>
                      <span class="pp-stat-lbl">Thẻ Đã Thuộc</span>
                    </div>
                    <div class="pp-stat-box">
                      <span class="pp-stat-val" id="statStrokeCount">0</span>
                      <span class="pp-stat-lbl">Chữ Đã Viết</span>
                    </div>
                    <div class="pp-stat-box">
                      <span class="pp-stat-val" id="statHighScore">0</span>
                      <span class="pp-stat-lbl">Kỷ Lục Điểm</span>
                    </div>
                  </div>

                  <!-- Trạng thái đồng bộ -->
                  <div class="pp-sync-status-row">
                    <span>🟢 Trạng thái Cloud:</span>
                    <span id="lblCloudSyncText">Đã đồng bộ</span>
                  </div>

                  <!-- Các nút thao tác -->
                  <div class="pp-profile-actions">
                    <a href="admin.html" class="pp-btn-submit" id="btnGoToAdmin" style="display:none;background:linear-gradient(135deg, #f59e0b, #d97706);box-shadow:0 8px 18px rgba(245, 158, 11, 0.35);text-decoration:none;color:#ffffff;">
                      <span>👑 BẢNG QUẢN TRỊ ADMIN</span>
                    </a>
                    <button type="button" class="pp-btn-submit btn-emerald" id="btnSyncNowManual">
                      <span>🔄 Đồng Bộ Ngay Lập Tức</span>
                    </button>
                    <button type="button" class="pp-btn-secondary" id="btnResetMyProgress" style="background:#fff1f2;border:1px solid #fecdd3;color:#e11d48;font-size:12px;padding:8px 12px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;width:100%;">
                      <span>🧹 Đặt Lại Tiến Độ Về 0</span>
                    </button>
                    <button type="button" class="pp-btn-secondary pp-btn-danger" id="btnLogout">
                      <span>🚪 Đăng Xuất Tài Khoản</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      `;

      const div = document.createElement('div');
      div.innerHTML = modalHtml;
      document.body.appendChild(div.firstElementChild);

      this.backdrop = document.getElementById('ppAuthBackdrop');
      this.dialog = document.getElementById('ppAuthDialog');
    }

    bindEvents() {
      // Đóng modal khi bấm nút X hoặc bấm ra ngoài backdrop
      const closeBtn = document.getElementById('ppAuthCloseBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());

      if (this.backdrop) {
        this.backdrop.addEventListener('click', (e) => {
          if (e.target === this.backdrop) this.closeModal();
        });
      }

      // Phím ESC để đóng
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.backdrop && this.backdrop.classList.contains('active')) {
          this.closeModal();
        }
      });

      // Tab switcher
      const tabBtns = document.querySelectorAll('.pp-auth-tab');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTab = btn.getAttribute('data-tab');
          this.switchTab(targetTab);
        });
      });

      // Show / Hide Password toggle
      document.querySelectorAll('.pp-input-toggle-pwd').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-target');
          const input = document.getElementById(targetId);
          if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
            btn.textContent = input.type === 'password' ? '👁️' : '🙈';
          }
        });
      });

      // Submit Login
      const formLogin = document.getElementById('formLogin');
      if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
          e.preventDefault();
          await this.handleLogin();
        });
      }

      // Submit Register
      const formRegister = document.getElementById('formRegister');
      if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
          e.preventDefault();
          await this.handleRegister();
        });
      }

      // Forgot Password
      const btnForgotPwd = document.getElementById('btnForgotPwd');
      if (btnForgotPwd) {
        btnForgotPwd.addEventListener('click', async () => {
          await this.handleForgotPassword();
        });
      }

      // Manual Sync Now
      const btnSyncNow = document.getElementById('btnSyncNowManual');
      if (btnSyncNow) {
        btnSyncNow.addEventListener('click', async () => {
          btnSyncNow.disabled = true;
          btnSyncNow.innerHTML = '<span>⏳ Đang đồng bộ...</span>';
          if (window.PinyinAuth) {
            const ok = await window.PinyinAuth.syncBidirectional();
            if (ok) {
              this.showAlert('✅ Đồng bộ dữ liệu 2 chiều thành công!', 'success');
            } else {
              this.showAlert('❌ Không thể đồng bộ. Vui lòng kiểm tra kết nối mạng.', 'error');
            }
          }
          btnSyncNow.disabled = false;
          btnSyncNow.innerHTML = '<span>🔄 Đồng Bộ Ngay Lập Tức</span>';
          this.updateProfileStats();
        });
      }

      // Reset my progress
      const btnResetProg = document.getElementById('btnResetMyProgress');
      if (btnResetProg) {
        btnResetProg.addEventListener('click', async () => {
          if (!confirm('⚠️ Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học (từ đã thuộc, chữ đã viết, kỷ lục điểm) của tài khoản này về 0 không? Thao tác này sẽ làm sạch cả trên Cloud và trên máy!')) {
            return;
          }
          btnResetProg.disabled = true;
          btnResetProg.innerHTML = '<span>⏳ Đang đặt lại...</span>';
          if (window.PinyinAuth) {
            const ok = await window.PinyinAuth.resetUserProgress();
            if (ok) {
              this.showAlert('✅ Đã đặt lại toàn bộ tiến độ về 0 thành công!', 'success');
              this.updateProfileStats();
            } else {
              this.showAlert('❌ Không thể đặt lại tiến độ. Vui lòng thử lại.', 'error');
            }
          }
          btnResetProg.disabled = false;
          btnResetProg.innerHTML = '<span>🧹 Đặt Lại Tiến Độ Về 0</span>';
        });
      }

      // Logout
      const btnLogout = document.getElementById('btnLogout');
      if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
          if (window.PinyinAuth) {
            await window.PinyinAuth.signOut();
            this.switchTab('login');
            this.showAlert('Đã đăng xuất thành công.', 'info');
          }
        });
      }
    }

    openModal(tab = 'login') {
      if (!this.backdrop) return;
      this.clearAlert();

      if (window.PinyinAuth && window.PinyinAuth.isLoggedIn()) {
        this.switchTab('profile');
      } else {
        this.switchTab(tab);
      }

      this.backdrop.classList.add('active');
    }

    closeModal() {
      if (this.backdrop) {
        this.backdrop.classList.remove('active');
      }
    }

    switchTab(tabName) {
      this.currentTab = tabName;
      this.clearAlert();

      const tabsWrap = document.getElementById('ppAuthTabs');
      const titleEl = document.getElementById('ppModalTitle');
      const subEl = document.getElementById('ppModalSub');

      if (tabName === 'profile') {
        // Khi đã đăng nhập: ẨN HOÀN TOÀN thanh tab đăng nhập/đăng ký
        if (tabsWrap) tabsWrap.style.display = 'none';
        if (titleEl) titleEl.textContent = 'HỒ SƠ HỌC VIÊN';
        if (subEl) subEl.textContent = 'Tiến độ học tập & Đồng bộ đám mây';
      } else {
        // Khi chưa đăng nhập: Hiển thị tab Đăng Nhập / Đăng Ký
        if (tabsWrap) tabsWrap.style.display = 'flex';
        if (titleEl) titleEl.textContent = 'PINYIN POP CLOUD';
        if (subEl) subEl.textContent = 'Đồng bộ tiến độ học tập giữa Máy tính & Điện thoại';
      }

      // Xóa triệt để các phần tử cấu hình cũ nếu còn lưu trong cache trình duyệt
      const oldCfgTab = document.querySelector('[data-tab="config"]');
      if (oldCfgTab) oldCfgTab.remove();
      const oldCfgPane = document.getElementById('paneConfig');
      if (oldCfgPane) oldCfgPane.remove();

      // Cập nhật tab buttons
      const tabBtns = document.querySelectorAll('.pp-auth-tab');
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
      });

      // Ẩn tất cả panes
      const panes = ['paneLogin', 'paneRegister', 'paneProfile'];
      panes.forEach(p => {
        const el = document.getElementById(p);
        if (el) el.classList.remove('active');
      });

      // Hiển thị pane tương ứng
      const targetPane = {
        'login': 'paneLogin',
        'register': 'paneRegister',
        'profile': 'paneProfile'
      }[tabName] || 'paneLogin';

      const targetEl = document.getElementById(targetPane);
      if (targetEl) targetEl.classList.add('active');

      if (tabName === 'profile') {
        this.updateProfileStats();
      }
    }

    showAlert(msg, type = 'info') {
      const alertEl = document.getElementById('ppAuthAlert');
      if (!alertEl) return;
      alertEl.className = `pp-auth-alert ${type}`;
      alertEl.innerHTML = msg;
    }

    clearAlert() {
      const alertEl = document.getElementById('ppAuthAlert');
      if (!alertEl) return;
      alertEl.className = 'pp-auth-alert';
      alertEl.innerHTML = '';
    }

    async handleLogin() {
      const email = document.getElementById('loginEmail')?.value;
      const pwd = document.getElementById('loginPassword')?.value;
      const btn = document.getElementById('btnLoginSubmit');

      if (!email || !pwd) {
        this.showAlert('Vui lòng nhập đầy đủ Email và Mật khẩu.', 'error');
        return;
      }

      if (!window.PinyinAuth || !window.PinyinAuth.isConfigured()) {
        this.showAlert('⚠️ Chưa cấu hình kết nối Supabase trong supabase-config.js.', 'error');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span>⏳ Đang đăng nhập...</span>';

      const { data, error } = await window.PinyinAuth.signIn(email, pwd);

      btn.disabled = false;
      btn.innerHTML = '<span>🚀 Đăng Nhập & Đồng Bộ</span>';

      if (error) {
        let msg = error.message;
        if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
          msg = 'Email chưa được kích hoạt. <br>👉 <strong>Cách sửa ngay trong 5 giây:</strong> Vào Supabase ➔ <em>Authentication</em> ➔ <em>Users</em> ➔ Nhấp dấu <strong>[...]</strong> bên cạnh email này ➔ chọn <strong>"Confirm user"</strong>.';
        } else if (msg.includes('Invalid login credentials')) {
          msg = 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
        }
        this.showAlert(`❌ Đăng nhập thất bại: ${msg}`, 'error');
      } else {
        this.showAlert('🎉 Đăng nhập thành công! Đang đồng bộ tiến độ...', 'success');
        setTimeout(() => {
          this.closeModal();
        }, 1200);
      }
    }

    async handleRegister() {
      const name = document.getElementById('regName')?.value;
      const email = document.getElementById('regEmail')?.value;
      const pwd = document.getElementById('regPassword')?.value;
      const btn = document.getElementById('btnRegSubmit');

      if (!email || !pwd) {
        this.showAlert('Vui lòng nhập đầy đủ thông tin.', 'error');
        return;
      }

      if (!window.PinyinAuth || !window.PinyinAuth.isConfigured()) {
        this.showAlert('⚠️ Chưa cấu hình kết nối Supabase trong supabase-config.js.', 'error');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span>⏳ Đang tạo tài khoản...</span>';

      const { data, error } = await window.PinyinAuth.signUp(email, pwd, name);

      btn.disabled = false;
      btn.innerHTML = '<span>✨ Tạo Tài Khoản Miễn Phí</span>';

      if (error) {
        let msg = error.message;
        if (msg.includes('User already registered')) {
          msg = 'Email này đã được đăng ký trước đó. Bạn hãy chuyển sang tab Đăng Nhập.';
        }
        this.showAlert(`❌ Đăng ký thất bại: ${msg}`, 'error');
      } else if (data && data.user && !data.session) {
        // Dự án đang bật chế độ bắt buộc Confirm Email
        this.showAlert('🎉 Tạo tài khoản thành công! <br>⚠️ Dự án đang bật bắt buộc xác thực email: Hãy vào Supabase ➔ <em>Authentication</em> ➔ <em>Users</em> ➔ Nhấp <strong>[...]</strong> ➔ chọn <strong>"Confirm user"</strong> để kích hoạt tài khoản ngay!', 'info');
      } else {
        this.showAlert('🎉 Đăng ký thành công! Tiến độ hiện tại đã được sao lưu lên Cloud.', 'success');
        setTimeout(() => {
          this.closeModal();
        }, 1500);
      }
    }

    async handleForgotPassword() {
      const email = document.getElementById('loginEmail')?.value;
      if (!email) {
        this.showAlert('Vui lòng nhập email vào ô trên rồi bấm Quên mật khẩu.', 'error');
        return;
      }

      const { error } = await window.PinyinAuth.resetPassword(email);
      if (error) {
        this.showAlert(`Không thể gửi email đặt lại: ${error.message}`, 'error');
      } else {
        this.showAlert('✉️ Đã gửi link đặt lại mật khẩu về hòm thư của bạn!', 'success');
      }
    }

    updateState() {
      if (!this.chipBtn) return;
      const isLogged = window.PinyinAuth && window.PinyinAuth.isLoggedIn();
      const isSyncing = window.PinyinAuth && window.PinyinAuth.isSyncing;
      const isConfigured = window.PinyinAuth && window.PinyinAuth.isConfigured();
      const isAdmin = window.PinyinAuth && window.PinyinAuth.isAdmin();

      if (isLogged) {
        const name = window.PinyinAuth.getUserDisplayName();
        const initial = name ? name.charAt(0).toUpperCase() : 'U';
        const adminTag = isAdmin ? ' 👑' : '';

        this.chipBtn.className = 'pp-auth-chip-btn logged-in' + (isAdmin ? ' is-admin' : '');
        this.chipBtn.innerHTML = `
          <div class="pp-auth-chip-avatar">${initial}</div>
          <span class="pp-auth-chip-text">${name}${adminTag}</span>
          <span class="pp-auth-status-dot ${isSyncing ? 'syncing' : 'synced'}" title="${isSyncing ? 'Đang đồng bộ...' : 'Đã đồng bộ Cloud'}"></span>
        `;
      } else {
        this.chipBtn.className = 'pp-auth-chip-btn';
        this.chipBtn.innerHTML = `
          <span>☁️</span>
          <span class="pp-auth-chip-text">Đăng Nhập</span>
          <span class="pp-auth-status-dot ${isConfigured ? 'guest' : ''}" title="Khách (Bấm để đăng nhập và đồng bộ)"></span>
        `;
      }
    }

    updateProfileStats() {
      if (!window.PinyinAuth) return;
      const user = window.PinyinAuth.getUser();
      if (!user) return;

      const nameEl = document.getElementById('profileDisplayName');
      const emailEl = document.getElementById('profileEmail');
      const avatarEl = document.getElementById('profileAvatarBig');
      const btnAdmin = document.getElementById('btnGoToAdmin');

      const displayName = window.PinyinAuth.getUserDisplayName();
      const isAdmin = window.PinyinAuth.isAdmin();

      if (nameEl) nameEl.innerHTML = displayName + (isAdmin ? ' <span style="font-size:12px;background:#fef3c7;color:#d97706;padding:2px 8px;border-radius:999px;font-weight:800;border:1px solid #fde68a;">👑 ADMIN</span>' : '');
      if (emailEl) emailEl.textContent = user.email || '';
      if (avatarEl) avatarEl.textContent = displayName ? displayName.charAt(0).toUpperCase() : '👤';
      if (btnAdmin) btnAdmin.style.display = isAdmin ? 'flex' : 'none';

      // Đọc thống kê
      const getSetCount = (key) => {
        try {
          const val = JSON.parse(localStorage.getItem(key) || '[]');
          return Array.isArray(val) ? val.length : 0;
        } catch (e) {
          return 0;
        }
      };

      const masteredCount = getSetCount('pinyin_pop_mastered');
      const strokeCount = parseInt(localStorage.getItem('hs_completed_chars') || '0', 10);
      const hsPop = parseInt(localStorage.getItem('pinyin_pop_highscore') || '0', 10);
      const hsTone = parseInt(localStorage.getItem('tone_master_score') || '0', 10);
      const maxScore = Math.max(hsPop, hsTone);

      const mEl = document.getElementById('statMasteredCount');
      const sEl = document.getElementById('statStrokeCount');
      const hEl = document.getElementById('statHighScore');

      if (mEl) mEl.textContent = masteredCount.toLocaleString();
      if (sEl) sEl.textContent = strokeCount.toLocaleString();
      if (hEl) hEl.textContent = maxScore.toLocaleString();

      const lastSyncEl = document.getElementById('lblCloudSyncText');
      if (lastSyncEl) {
        const last = window.PinyinAuth.lastSyncTime;
        lastSyncEl.textContent = last ? `Đã đồng bộ (${last.toLocaleTimeString()})` : 'Sẵn sàng đồng bộ';
      }
    }
  }

  // Khởi tạo Controller
  window.PinyinAuthModal = new AuthModalController();

})();
