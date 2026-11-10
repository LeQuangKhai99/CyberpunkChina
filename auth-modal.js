// =========================================================================
// PINYIN POP! - AUTH MODAL & FREE DATABASE / SYNC CONTROLLER
// Quản lý Modal Đăng Nhập, Đăng Ký, Mã Đồng Bộ Đa Thiết Bị & Database Miễn Phí
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

      window.addEventListener('cloud-sync-status', () => this.updateState());
      window.addEventListener('cloud-progress-updated', () => this.updateProfileStats());
    }

    mountAuthChip() {
      let mountContainer = document.getElementById('authChipMount');

      if (!mountContainer) {
        const possibleSelectors = [
          '#authChipMount',
          '.hud-right-actions',
          '.hs-header-actions',
          '.fc-header-actions',
          '.tm-header-actions',
          '.pz-header-actions',
          '.portal-navbar',
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
      this.chipBtn.title = 'Tài khoản & Đồng bộ Database Miễn Phí';

      if (mountContainer) {
        mountContainer.appendChild(this.chipBtn);
      } else {
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

    injectModalHtml() {
      if (document.getElementById('ppAuthBackdrop')) return;

      const modalHtml = `
        <div class="pp-auth-backdrop" id="ppAuthBackdrop">
          <div class="pp-auth-dialog" id="ppAuthDialog">
            <button type="button" class="pp-auth-close-btn" id="ppAuthCloseBtn" title="Đóng">✕</button>

            <!-- Header -->
            <div class="pp-auth-header">
              <div class="pp-auth-emblem">🗄️</div>
              <h3 class="pp-auth-title" id="ppModalTitle">PINYIN POP FREE DB</h3>
              <p class="pp-auth-subtitle" id="ppModalSub">Hệ thống lưu trữ Miễn Phí 100% (IndexedDB + Firebase / Google Sheets)</p>
            </div>

            <!-- Tab Switcher -->
            <div class="pp-auth-tabs" id="ppAuthTabs">
              <button type="button" class="pp-auth-tab active" data-tab="login">Đăng Nhập</button>
              <button type="button" class="pp-auth-tab" data-tab="register">Đăng Ký</button>
              <button type="button" class="pp-auth-tab" data-tab="dbbackup">📦 Sao Lưu / DB</button>
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

                  <div style="margin-top: 10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                    <button type="button" id="btnQuickFillAdmin" style="background:#fef3c7;border:1px solid #fde68a;color:#b45309;font-size:11px;font-weight:700;padding:4px 8px;border-radius:6px;cursor:pointer;">
                      👑 Điền nhanh Admin mẫu
                    </button>
                    <button type="button" id="btnForgotPwd" style="background:none;border:none;color:#3b82f6;font-size:11px;font-weight:700;cursor:pointer;">
                      Đặt lại mật khẩu?
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
                    <span>🟢 Engine lưu trữ:</span>
                    <span id="lblCloudSyncText" style="font-weight:800;color:#059669;">IndexedDB Free DB</span>
                  </div>

                  <!-- Các nút thao tác -->
                  <div class="pp-profile-actions">
                    <a href="admin.html" class="pp-btn-submit" id="btnGoToAdmin" style="display:none;background:linear-gradient(135deg, #f59e0b, #d97706);box-shadow:0 8px 18px rgba(245, 158, 11, 0.35);text-decoration:none;color:#ffffff;">
                      <span>👑 BẢNG QUẢN TRỊ ADMIN</span>
                    </a>
                    <button type="button" class="pp-btn-submit btn-emerald" id="btnSyncNowManual">
                      <span>🔄 Đồng Bộ Ngay Lập Tức</span>
                    </button>
                    <button type="button" class="pp-btn-secondary" id="btnOpenDbBackupFromProfile" style="background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8;font-size:12px;padding:8px 12px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;width:100%;font-weight:700;">
                      <span>📦 Mã Chuyển Thiết Bị & Cấu Hình Cloud Miễn Phí</span>
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

              <!-- PANE 4: MÃ ĐỒNG BỘ THIẾT BỊ & CẤU HÌNH DATABASE MIỄN PHÍ -->
              <div class="pp-auth-pane" id="paneDbBackup">
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin-bottom:12px;">
                  <div style="font-size:12px;font-weight:800;color:#0f172a;margin-bottom:4px;">📲 Chuyển Tiến Độ Giữa Máy Tính & Điện Thoại (100% Miễn Phí)</div>
                  <div style="font-size:11px;color:#475569;margin-bottom:8px;">Sao chép mã đồng bộ bên dưới và dán sang thiết bị khác để mang theo toàn bộ từ vựng, chữ viết và điểm số:</div>
                  <textarea id="txtSyncCodeBox" rows="3" style="width:100%;font-size:11px;font-family:monospace;padding:8px;border-radius:8px;border:1px solid #cbd5e1;resize:none;background:#fff;color:#0f172a;" placeholder="Bấm 'Tạo Mã Sao Lưu' hoặc dán mã từ máy khác vào đây..."></textarea>
                  <div style="display:flex;gap:8px;margin-top:8px;">
                    <button type="button" id="btnExportSyncCode" class="pp-btn-submit btn-blue" style="padding:8px 10px;font-size:12px;flex:1;">
                      <span>📋 Tạo & Copy Mã</span>
                    </button>
                    <button type="button" id="btnImportSyncCode" class="pp-btn-submit btn-emerald" style="padding:8px 10px;font-size:12px;flex:1;">
                      <span>📥 Nạp Mã Vào Máy</span>
                    </button>
                  </div>
                </div>

                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:12px;">
                  <div style="font-size:12px;font-weight:800;color:#166534;margin-bottom:6px;">☁️ Kết Nối Cloud Miễn Phí Vĩnh Viễn (Tùy chọn nâng cao)</div>
                  <div style="font-size:11px;color:#15803d;margin-bottom:8px;">Mặc định hệ thống đã tự lưu vào <strong>IndexedDB</strong> trên trình duyệt. Nếu muốn tự động đồng bộ qua mạng mà không dùng Supabase, bạn có thể dán URL <strong>Firebase Realtime DB</strong> hoặc <strong>Google Sheets Web App</strong> (xem file <code>google_sheets_backend.gs</code>):</div>
                  <div class="pp-form-group" style="margin-bottom:8px;">
                    <label class="pp-form-label" style="font-size:11px;">🔥 Firebase Realtime DB URL (Gói Spark Miễn phí):</label>
                    <input type="text" id="cfgFirebaseUrl" class="pp-input" style="padding:7px 10px;font-size:11px;" placeholder="https://ten-du-an-default-rtdb.firebaseio.com">
                  </div>
                  <div class="pp-form-group" style="margin-bottom:10px;">
                    <label class="pp-form-label" style="font-size:11px;">📊 Google Sheets Web App URL (15GB Google Drive Miễn phí):</label>
                    <input type="text" id="cfgGoogleSheetsUrl" class="pp-input" style="padding:7px 10px;font-size:11px;" placeholder="https://script.google.com/macros/s/.../exec">
                  </div>
                  <div style="display:flex;gap:8px;">
                    <button type="button" id="btnSaveFreeCloudCfg" class="pp-btn-submit" style="padding:8px 12px;font-size:12px;flex:1;">
                      <span>💾 Lưu Cấu Hình Database</span>
                    </button>
                    <button type="button" id="btnBackFromDbBackup" class="pp-btn-secondary" style="padding:8px 12px;font-size:12px;">
                      <span>Quay lại</span>
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
      const closeBtn = document.getElementById('ppAuthCloseBtn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());

      if (this.backdrop) {
        this.backdrop.addEventListener('click', (e) => {
          if (e.target === this.backdrop) this.closeModal();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.backdrop && this.backdrop.classList.contains('active')) {
          this.closeModal();
        }
      });

      const tabBtns = document.querySelectorAll('.pp-auth-tab');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTab = btn.getAttribute('data-tab');
          this.switchTab(targetTab);
        });
      });

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

      const btnQuickAdmin = document.getElementById('btnQuickFillAdmin');
      if (btnQuickAdmin) {
        btnQuickAdmin.addEventListener('click', () => {
          const em = document.getElementById('loginEmail');
          const pw = document.getElementById('loginPassword');
          if (em) em.value = 'admin@pinyinpop.com';
          if (pw) pw.value = 'admin123';
          this.showAlert('👑 Đã điền tài khoản Quản Trị Viên mẫu (admin@pinyinpop.com / admin123). Bấm Đăng Nhập để vào ngay!', 'info');
        });
      }

      const formLogin = document.getElementById('formLogin');
      if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
          e.preventDefault();
          await this.handleLogin();
        });
      }

      const formRegister = document.getElementById('formRegister');
      if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
          e.preventDefault();
          await this.handleRegister();
        });
      }

      const btnForgotPwd = document.getElementById('btnForgotPwd');
      if (btnForgotPwd) {
        btnForgotPwd.addEventListener('click', async () => {
          await this.handleForgotPassword();
        });
      }

      const btnSyncNow = document.getElementById('btnSyncNowManual');
      if (btnSyncNow) {
        btnSyncNow.addEventListener('click', async () => {
          btnSyncNow.disabled = true;
          btnSyncNow.innerHTML = '<span>⏳ Đang đồng bộ...</span>';
          if (window.PinyinAuth) {
            const ok = await window.PinyinAuth.syncBidirectional();
            if (ok) {
              this.showAlert('✅ Đồng bộ dữ liệu vào Free Database thành công!', 'success');
            } else {
              this.showAlert('❌ Không thể đồng bộ. Vui lòng thử lại.', 'error');
            }
          }
          btnSyncNow.disabled = false;
          btnSyncNow.innerHTML = '<span>🔄 Đồng Bộ Ngay Lập Tức</span>';
          this.updateProfileStats();
        });
      }

      const btnOpenDbBackup = document.getElementById('btnOpenDbBackupFromProfile');
      if (btnOpenDbBackup) {
        btnOpenDbBackup.addEventListener('click', () => {
          this.switchTab('dbbackup');
        });
      }

      const btnBackFromDbBackup = document.getElementById('btnBackFromDbBackup');
      if (btnBackFromDbBackup) {
        btnBackFromDbBackup.addEventListener('click', () => {
          if (window.PinyinAuth && window.PinyinAuth.isLoggedIn()) {
            this.switchTab('profile');
          } else {
            this.switchTab('login');
          }
        });
      }

      const btnExportSync = document.getElementById('btnExportSyncCode');
      if (btnExportSync) {
        btnExportSync.addEventListener('click', () => {
          if (!window.PinyinAuth) return;
          const code = window.PinyinAuth.exportSyncCode();
          const box = document.getElementById('txtSyncCodeBox');
          if (box) {
            box.value = code;
            box.select();
          }
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).catch(() => {});
          }
          this.showAlert('✅ Đã tạo & sao chép Mã Đồng Bộ! Bạn có thể gửi mã này sang Điện thoại/Máy tính khác để nạp.', 'success');
        });
      }

      const btnImportSync = document.getElementById('btnImportSyncCode');
      if (btnImportSync) {
        btnImportSync.addEventListener('click', async () => {
          const box = document.getElementById('txtSyncCodeBox');
          const raw = box ? box.value.trim() : '';
          if (!raw) {
            this.showAlert('⚠️ Vui lòng dán Mã Đồng Bộ (bắt đầu bằng PP2:...) vào ô bên trên trước.', 'error');
            return;
          }
          try {
            await window.PinyinAuth.importSyncCode(raw);
            this.showAlert('🎉 Khôi phục & hợp nhất tiến độ học tập thành công!', 'success');
            this.updateProfileStats();
          } catch (e) {
            this.showAlert('❌ Mã đồng bộ không hợp lệ: ' + e.message, 'error');
          }
        });
      }

      const btnSaveFreeCloudCfg = document.getElementById('btnSaveFreeCloudCfg');
      if (btnSaveFreeCloudCfg) {
        btnSaveFreeCloudCfg.addEventListener('click', async () => {
          const fbUrl = (document.getElementById('cfgFirebaseUrl')?.value || '').trim();
          const gsUrl = (document.getElementById('cfgGoogleSheetsUrl')?.value || '').trim();
          if (gsUrl && (gsUrl.includes('/edit') || gsUrl.includes('/home/projects/') || !gsUrl.includes('/macros/s/'))) {
            this.showAlert('⚠️ Link bạn dán đang là link trình sửa code (<code>/edit</code>). Hãy bấm nút <strong>Deploy (Triển khai) ➔ New deployment ➔ Web app</strong> ở góc phải trên cùng của Apps Script để lấy link có đuôi <code>.../exec</code> nhé!', 'error');
            return;
          }
          if (window.PinyinAuth) {
            window.PinyinAuth.saveCustomDbConfig({
              provider: fbUrl ? 'firebase' : (gsUrl ? 'googlesheets' : 'indexeddb'),
              firebaseDatabaseUrl: fbUrl,
              googleSheetsWebAppUrl: gsUrl
            });
            if (window.PinyinAuth.isLoggedIn()) {
              await window.PinyinAuth.syncBidirectional();
            }
            this.showAlert('✅ Đã lưu cấu hình Database Miễn Phí (' + window.PinyinAuth.getProviderName() + ')!', 'success');
            this.updateProfileStats();
          }
        });
      }

      const btnResetProg = document.getElementById('btnResetMyProgress');
      if (btnResetProg) {
        btnResetProg.addEventListener('click', async () => {
          if (!confirm('⚠️ Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học (từ đã thuộc, chữ đã viết, kỷ lục điểm) của tài khoản này về 0 không?')) {
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

      if (window.PinyinAuth && window.PinyinAuth.isLoggedIn() && tab !== 'dbbackup') {
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
        if (tabsWrap) tabsWrap.style.display = 'none';
        if (titleEl) titleEl.textContent = 'HỒ SƠ HỌC VIÊN';
        if (subEl) subEl.textContent = window.PinyinAuth ? window.PinyinAuth.getProviderName() : 'Tiến độ học tập & Đồng bộ';
      } else {
        if (tabsWrap) tabsWrap.style.display = 'flex';
        if (titleEl) titleEl.textContent = 'PINYIN POP FREE DB';
        if (subEl) subEl.textContent = 'Lưu trữ 100% Miễn phí (IndexedDB + Firebase / Google Sheets)';
      }

      const tabBtns = document.querySelectorAll('.pp-auth-tab');
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
      });

      const panes = ['paneLogin', 'paneRegister', 'paneProfile', 'paneDbBackup'];
      panes.forEach(p => {
        const el = document.getElementById(p);
        if (el) el.classList.remove('active');
      });

      const targetPane = {
        'login': 'paneLogin',
        'register': 'paneRegister',
        'profile': 'paneProfile',
        'dbbackup': 'paneDbBackup'
      }[tabName] || 'paneLogin';

      const targetEl = document.getElementById(targetPane);
      if (targetEl) targetEl.classList.add('active');

      if (tabName === 'profile') {
        this.updateProfileStats();
      } else if (tabName === 'dbbackup' && window.PinyinAuth) {
        const cfg = window.PinyinAuth.getConfig();
        const fbInput = document.getElementById('cfgFirebaseUrl');
        const gsInput = document.getElementById('cfgGoogleSheetsUrl');
        if (fbInput) fbInput.value = cfg.firebaseDatabaseUrl || '';
        if (gsInput) gsInput.value = cfg.googleSheetsWebAppUrl || '';
        const box = document.getElementById('txtSyncCodeBox');
        if (box && !box.value) {
          box.value = window.PinyinAuth.exportSyncCode();
        }
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

      btn.disabled = true;
      btn.innerHTML = '<span>⏳ Đang đăng nhập...</span>';

      const { error } = await window.PinyinAuth.signIn(email, pwd);

      btn.disabled = false;
      btn.innerHTML = '<span>🚀 Đăng Nhập & Đồng Bộ</span>';

      if (error) {
        let msg = error.message;
        if (msg.includes('Invalid login credentials')) {
          msg = 'Email hoặc mật khẩu không chính xác. (Gợi ý: Bạn có thể đăng ký tài khoản mới hoặc bấm nút "👑 Điền nhanh Admin mẫu")';
        }
        this.showAlert(`❌ Đăng nhập thất bại: ${msg}`, 'error');
      } else {
        this.showAlert('🎉 Đăng nhập thành công! Đã nạp tiến độ từ Free Database.', 'success');
        setTimeout(() => {
          this.closeModal();
        }, 1000);
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

      btn.disabled = true;
      btn.innerHTML = '<span>⏳ Đang tạo tài khoản...</span>';

      const { error } = await window.PinyinAuth.signUp(email, pwd, name);

      btn.disabled = false;
      btn.innerHTML = '<span>✨ Tạo Tài Khoản Miễn Phí</span>';

      if (error) {
        let msg = error.message;
        if (msg.includes('User already registered')) {
          msg = 'Email này đã được đăng ký trước đó. Bạn hãy chuyển sang tab Đăng Nhập.';
        }
        this.showAlert(`❌ Đăng ký thất bại: ${msg}`, 'error');
      } else {
        this.showAlert('🎉 Đăng ký thành công! Tiến độ đã được lưu vào Free Database.', 'success');
        setTimeout(() => {
          this.closeModal();
        }, 1200);
      }
    }

    async handleForgotPassword() {
      const email = document.getElementById('loginEmail')?.value;
      if (!email) {
        this.showAlert('Vui lòng nhập email vào ô trên rồi bấm Đặt lại mật khẩu.', 'error');
        return;
      }

      const { data, error } = await window.PinyinAuth.resetPassword(email, '123456');
      if (error) {
        this.showAlert(`❌ ${error.message}`, 'error');
      } else {
        this.showAlert(`✅ Mật khẩu của tài khoản <strong>${email}</strong> đã được đặt lại về mặc định: <code>${data.resetTo}</code>`, 'success');
      }
    }

    updateState() {
      if (!this.chipBtn) return;
      const isLogged = window.PinyinAuth && window.PinyinAuth.isLoggedIn();
      const isSyncing = window.PinyinAuth && window.PinyinAuth.isSyncing;
      const isAdmin = window.PinyinAuth && window.PinyinAuth.isAdmin();

      if (isLogged) {
        const name = window.PinyinAuth.getUserDisplayName();
        const initial = name ? name.charAt(0).toUpperCase() : 'U';
        const adminTag = isAdmin ? ' 👑' : '';

        this.chipBtn.className = 'pp-auth-chip-btn logged-in' + (isAdmin ? ' is-admin' : '');
        this.chipBtn.innerHTML = `
          <div class="pp-auth-chip-avatar">${initial}</div>
          <span class="pp-auth-chip-text">${name}${adminTag}</span>
          <span class="pp-auth-status-dot ${isSyncing ? 'syncing' : 'synced'}" title="${isSyncing ? 'Đang đồng bộ...' : 'Đã lưu vào Free Database'}"></span>
        `;
      } else {
        this.chipBtn.className = 'pp-auth-chip-btn';
        this.chipBtn.innerHTML = `
          <span>🗄️</span>
          <span class="pp-auth-chip-text">Đăng Nhập</span>
          <span class="pp-auth-status-dot guest" title="Khách (Bấm để đăng nhập / sao lưu miễn phí)"></span>
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
        const provider = window.PinyinAuth.getProviderName();
        const last = window.PinyinAuth.lastSyncTime;
        lastSyncEl.textContent = last ? `${provider} (${last.toLocaleTimeString()})` : provider;
      }
    }
  }

  window.PinyinAuthModal = new AuthModalController();

})();
