// =========================================================================
// PINYIN POP! - MULTI-DRIVER FREE DATABASE & CLOUD SYNC ENGINE
// Hệ quản trị cơ sở dữ liệu Miễn Phí 100% thay thế Supabase:
//   - Driver 1 (Mặc định): IndexedDB NoSQL ('PinyinPopDB') + Sync Code đa thiết bị
//   - Driver 2 (Đám mây miễn phí): Google Firebase Realtime Database REST API
//   - Driver 3 (Đám mây miễn phí): Google Sheets Web App (15GB Google Drive)
//   - Driver 4 (Tùy chọn): Supabase PostgreSQL
// =========================================================================

(function() {
  'use strict';

  const DB_NAME = 'PinyinPopDB';
  const DB_VERSION = 2;
  const SESSION_STORAGE_KEY = 'pinyin_pop_auth_session_v2';

  function simpleHash(str) {
    let h = 2166136261 >>> 0;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return 'h_' + (h >>> 0).toString(16);
  }

  function makeId(prefix = 'usr') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  // Dữ liệu cộng đồng & tài khoản Admin mặc định được khởi tạo sẵn trong IndexedDB
  const SEED_USERS = [
    {
      id: 'usr_admin_default',
      email: 'admin@pinyinpop.com',
      display_name: 'Quản Trị Viên (Admin)',
      role: 'admin',
      password_hash: simpleHash('admin123'),
      created_at: '2026-09-01T08:00:00.000Z',
      progress: {
        flashcard_mastered: ['你好', '谢谢', '不客气', '再见', '朋友', '中国', '汉语', '学习', '工作', '喜欢', '电脑', '手机', '茶', '米饭', '漂亮', '高兴', '医院', '医生', '老师', '学生', '飞机', '出租车', '天气', '苹果', '水'],
        flashcard_review: ['出租车', '漂亮'],
        flashcard_favs: ['你好', '朋友', '喜欢'],
        stroke_completed_count: 42,
        stroke_correct_count: 315,
        stroke_total_attempts: 330,
        stroke_streak: 14,
        stroke_completed_chars: ['人', '口', '大', '小', '山', '水', '火', '木', '日', '月', '好', '中', '国', '学'],
        pinyin_pop_highscore: 18500,
        tone_master_score: 4200,
        puzzle_score: 3600,
        extra_data: { xp: 4850, hskBadge: 4 }
      }
    },
    {
      id: 'usr_comm_minhanh',
      email: 'minhanh.hsk@gmail.com',
      display_name: 'Nguyễn Minh Anh',
      role: 'user',
      password_hash: simpleHash('123456'),
      created_at: '2026-09-12T09:30:00.000Z',
      progress: {
        flashcard_mastered: Array.from({ length: 168 }, (_, i) => `词_${i + 1}`),
        flashcard_review: ['经济', '文化'],
        flashcard_favs: ['梦想', '努力'],
        stroke_completed_count: 86,
        stroke_correct_count: 640,
        stroke_total_attempts: 665,
        stroke_streak: 21,
        stroke_completed_chars: ['爱', '家', '书', '听', '看', '说', '读', '写'],
        pinyin_pop_highscore: 26400,
        tone_master_score: 5800,
        puzzle_score: 4900,
        extra_data: { xp: 7920, hskBadge: 5 }
      }
    },
    {
      id: 'usr_comm_hoangnam',
      email: 'hoangnam.dev@gmail.com',
      display_name: 'Trần Hoàng Nam',
      role: 'user',
      password_hash: simpleHash('123456'),
      created_at: '2026-09-15T14:20:00.000Z',
      progress: {
        flashcard_mastered: Array.from({ length: 132 }, (_, i) => `字_${i + 1}`),
        flashcard_review: [],
        flashcard_favs: ['电脑', '科学'],
        stroke_completed_count: 64,
        stroke_correct_count: 480,
        stroke_total_attempts: 510,
        stroke_streak: 16,
        stroke_completed_chars: ['电', '脑', '网', '络'],
        pinyin_pop_highscore: 31200,
        tone_master_score: 4900,
        puzzle_score: 5200,
        extra_data: { xp: 6840, hskBadge: 4 }
      }
    },
    {
      id: 'usr_comm_thaovy',
      email: 'thaovy.bjt@gmail.com',
      display_name: 'Lê Thảo Vy',
      role: 'user',
      password_hash: simpleHash('123456'),
      created_at: '2026-09-18T11:10:00.000Z',
      progress: {
        flashcard_mastered: Array.from({ length: 95 }, (_, i) => `语_${i + 1}`),
        flashcard_review: [],
        flashcard_favs: ['奶茶', '旅行'],
        stroke_completed_count: 51,
        stroke_correct_count: 390,
        stroke_total_attempts: 410,
        stroke_streak: 12,
        stroke_completed_chars: ['茶', '花', '美'],
        pinyin_pop_highscore: 19800,
        tone_master_score: 6100,
        puzzle_score: 3400,
        extra_data: { xp: 5190, hskBadge: 3 }
      }
    },
    {
      id: 'usr_comm_quocbao',
      email: 'quocbao.hsk3@gmail.com',
      display_name: 'Phạm Quốc Bảo',
      role: 'user',
      password_hash: simpleHash('123456'),
      created_at: '2026-09-22T16:45:00.000Z',
      progress: {
        flashcard_mastered: Array.from({ length: 74 }, (_, i) => `汉_${i + 1}`),
        flashcard_review: [],
        flashcard_favs: [],
        stroke_completed_count: 38,
        stroke_correct_count: 270,
        stroke_total_attempts: 295,
        stroke_streak: 9,
        stroke_completed_chars: ['天', '地', '人'],
        pinyin_pop_highscore: 15400,
        tone_master_score: 3300,
        puzzle_score: 2900,
        extra_data: { xp: 3980, hskBadge: 3 }
      }
    },
    {
      id: 'usr_comm_lanhuong',
      email: 'lanhuong.cn@gmail.com',
      display_name: 'Đặng Lan Hương',
      role: 'user',
      password_hash: simpleHash('123456'),
      created_at: '2026-09-28T20:05:00.000Z',
      progress: {
        flashcard_mastered: Array.from({ length: 52 }, (_, i) => `学_${i + 1}`),
        flashcard_review: [],
        flashcard_favs: [],
        stroke_completed_count: 29,
        stroke_correct_count: 210,
        stroke_total_attempts: 225,
        stroke_streak: 7,
        stroke_completed_chars: ['日', '月'],
        pinyin_pop_highscore: 12100,
        tone_master_score: 2700,
        puzzle_score: 2100,
        extra_data: { xp: 2950, hskBadge: 2 }
      }
    }
  ];

  /* =========================================================================
     INDEXEDDB STORAGE ENGINE (100% FREE NATIVE BROWSER DATABASE)
     ========================================================================= */
  class LocalIndexedDBDriver {
    constructor() {
      this.dbPromise = null;
      this.fallbackProfiles = new Map();
      this.fallbackProgress = new Map();
      this.init();
    }

    init() {
      if (this.dbPromise) return this.dbPromise;
      this.dbPromise = new Promise((resolve) => {
        if (typeof indexedDB === 'undefined') {
          this.seedFallbackMemory();
          resolve(null);
          return;
        }
        try {
          const req = indexedDB.open(DB_NAME, DB_VERSION);
          req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('profiles')) {
              const profileStore = db.createObjectStore('profiles', { keyPath: 'id' });
              profileStore.createIndex('email', 'email', { unique: true });
            }
            if (!db.objectStoreNames.contains('user_progress')) {
              db.createObjectStore('user_progress', { keyPath: 'user_id' });
            }
          };
          req.onsuccess = async (e) => {
            const db = e.target.result;
            await this.ensureSeedData(db);
            resolve(db);
          };
          req.onerror = () => {
            this.seedFallbackMemory();
            resolve(null);
          };
        } catch (err) {
          this.seedFallbackMemory();
          resolve(null);
        }
      });
      return this.dbPromise;
    }

    seedFallbackMemory() {
      SEED_USERS.forEach(u => {
        const now = u.created_at || new Date().toISOString();
        this.fallbackProfiles.set(u.id, {
          id: u.id,
          email: u.email,
          display_name: u.display_name,
          role: u.role,
          password_hash: u.password_hash,
          created_at: now,
          updated_at: now
        });
        this.fallbackProgress.set(u.id, {
          user_id: u.id,
          ...u.progress,
          updated_at: now
        });
      });
    }

    async ensureSeedData(db) {
      if (!db) return;
      try {
        const existing = await this.getAll(db, 'profiles');
        if (existing && existing.length > 0) return;

        for (const u of SEED_USERS) {
          const now = u.created_at || new Date().toISOString();
          await this.put(db, 'profiles', {
            id: u.id,
            email: u.email,
            display_name: u.display_name,
            role: u.role,
            password_hash: u.password_hash,
            created_at: now,
            updated_at: now
          });
          await this.put(db, 'user_progress', {
            user_id: u.id,
            ...u.progress,
            updated_at: now
          });
        }
      } catch (e) {
        console.warn('Seed IndexedDB warning:', e);
      }
    }

    put(db, storeName, val) {
      return new Promise((resolve, reject) => {
        if (!db) {
          if (storeName === 'profiles') this.fallbackProfiles.set(val.id, val);
          else this.fallbackProgress.set(val.user_id, val);
          resolve(val);
          return;
        }
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(val);
        req.onsuccess = () => resolve(val);
        req.onerror = () => reject(req.error);
      });
    }

    get(db, storeName, key) {
      return new Promise((resolve) => {
        if (!db) {
          if (storeName === 'profiles') resolve(this.fallbackProfiles.get(key) || null);
          else resolve(this.fallbackProgress.get(key) || null);
          return;
        }
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    }

    getAll(db, storeName) {
      return new Promise((resolve) => {
        if (!db) {
          if (storeName === 'profiles') resolve(Array.from(this.fallbackProfiles.values()));
          else resolve(Array.from(this.fallbackProgress.values()));
          return;
        }
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }

    async findProfileByEmail(email) {
      const db = await this.init();
      const norm = String(email || '').trim().toLowerCase();
      const all = await this.getAll(db, 'profiles');
      return all.find(p => String(p.email || '').toLowerCase() === norm) || null;
    }

    async getProfileById(id) {
      const db = await this.init();
      return await this.get(db, 'profiles', id);
    }

    async saveProfile(profile) {
      const db = await this.init();
      return await this.put(db, 'profiles', profile);
    }

    async getProgress(userId) {
      const db = await this.init();
      return await this.get(db, 'user_progress', userId);
    }

    async saveProgress(progress) {
      const db = await this.init();
      return await this.put(db, 'user_progress', progress);
    }

    async getAllProfiles() {
      const db = await this.init();
      return await this.getAll(db, 'profiles');
    }

    async getAllProgress() {
      const db = await this.init();
      return await this.getAll(db, 'user_progress');
    }
  }

  /* =========================================================================
     MAIN UNIFIED DATABASE & AUTH CONTROLLER (window.PinyinAuth)
     ========================================================================= */
  class PinyinPopCloudSync {
    constructor() {
      this.idb = new LocalIndexedDBDriver();
      this.client = null; // Optional Supabase client
      this.currentUser = null;
      this.syncDebounceTimer = null;
      this.isSyncing = false;
      this.lastSyncTime = null;
      this.userRole = 'user';
      this.listeners = new Set();
      this.initClient();
    }

    getConfig() {
      return window.PINYIN_DB_CONFIG || window.SUPABASE_CONFIG || { provider: 'indexeddb' };
    }

    getProviderName() {
      const cfg = this.getConfig();
      if (cfg.firebaseDatabaseUrl && cfg.firebaseDatabaseUrl.startsWith('http')) {
        return 'Firebase Realtime DB + IndexedDB';
      }
      if (cfg.googleSheetsWebAppUrl && cfg.googleSheetsWebAppUrl.startsWith('http')) {
        return 'Google Sheets Cloud + IndexedDB';
      }
      if (cfg.provider === 'supabase' && cfg.supabaseUrl && cfg.supabaseUrl.startsWith('http')) {
        return 'Supabase Cloud';
      }
      return 'IndexedDB Free Database (Tích hợp sẵn)';
    }

    saveCustomDbConfig(newConfig) {
      const merged = {
        provider: newConfig.provider || 'indexeddb',
        firebaseDatabaseUrl: (newConfig.firebaseDatabaseUrl || '').trim().replace(/\/+$/, ''),
        googleSheetsWebAppUrl: (newConfig.googleSheetsWebAppUrl || '').trim(),
        supabaseUrl: (newConfig.supabaseUrl || '').trim(),
        supabaseAnonKey: (newConfig.supabaseAnonKey || '').trim()
      };
      localStorage.setItem('pinyin_pop_custom_db_config', JSON.stringify(merged));
      window.PINYIN_DB_CONFIG = merged;
      window.SUPABASE_CONFIG = {
        provider: merged.provider,
        url: merged.supabaseUrl || 'local://pinyinpop-indexeddb',
        anonKey: merged.supabaseAnonKey || 'free_forever_indexeddb_key',
        firebaseDatabaseUrl: merged.firebaseDatabaseUrl,
        googleSheetsWebAppUrl: merged.googleSheetsWebAppUrl
      };
      this.notifyStatusChange('CONFIG_UPDATED');
      return merged;
    }

    /**
     * Khởi tạo Database Driver & khôi phục phiên đăng nhập
     */
    initClient() {
      const cfg = this.getConfig();

      // Nếu người dùng chủ động chọn Supabase và điền URL riêng
      if (cfg.provider === 'supabase' && cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase && typeof window.supabase.createClient === 'function') {
        try {
          this.client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
          });
        } catch (e) {
          console.warn('Supabase fallback to IndexedDB:', e);
        }
      }

      // Khôi phục session từ IndexedDB / LocalStorage
      this.restoreFreeSession();
      return true;
    }

    async restoreFreeSession() {
      try {
        await this.idb.init();
        const raw = localStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.id) {
            const profile = await this.idb.getProfileById(parsed.id);
            if (profile) {
              this.currentUser = {
                id: profile.id,
                email: profile.email,
                user_metadata: { full_name: profile.display_name }
              };
              this.userRole = profile.role || 'user';
              await this.syncBidirectional({ mode: 'session_restore' });
            }
          }
        }
      } catch (e) {
        console.warn('Restore session warning:', e);
      }
      this.notifyStatusChange('INITIAL_CHECK');
    }

    isConfigured() {
      // Luôn trả về true vì IndexedDB Free Database hoạt động tức thì không cần cấu hình ngoài
      return true;
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

    getUserRole() {
      return this.userRole;
    }

    isAdmin() {
      return this.userRole === 'admin';
    }

    /* =====================================================================
       CLOUD BRIDGE: FIREBASE REALTIME DB & GOOGLE SHEETS WEB APP (FREE)
       ===================================================================== */
    async pushProfileToFreeCloud(profile) {
      const cfg = this.getConfig();
      // 1. Google Firebase Realtime Database REST API
      if (cfg.firebaseDatabaseUrl && cfg.firebaseDatabaseUrl.startsWith('http')) {
        try {
          const baseUrl = cfg.firebaseDatabaseUrl.replace(/\/+$/, '');
          await fetch(`${baseUrl}/profiles/${encodeURIComponent(profile.id)}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
          });
        } catch (e) {
          console.warn('Firebase profile push warning:', e);
        }
      }
      // 2. Google Sheets Apps Script Web App
      if (cfg.googleSheetsWebAppUrl && cfg.googleSheetsWebAppUrl.startsWith('http')) {
        try {
          await fetch(cfg.googleSheetsWebAppUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'upsert_profile', profile })
          });
        } catch (e) {
          console.warn('Google Sheets profile push warning:', e);
        }
      }
    }

    async pushProgressToFreeCloud(progress) {
      const cfg = this.getConfig();
      // 1. Google Firebase Realtime Database REST API
      if (cfg.firebaseDatabaseUrl && cfg.firebaseDatabaseUrl.startsWith('http')) {
        try {
          const baseUrl = cfg.firebaseDatabaseUrl.replace(/\/+$/, '');
          await fetch(`${baseUrl}/user_progress/${encodeURIComponent(progress.user_id)}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(progress)
          });
        } catch (e) {
          console.warn('Firebase progress push warning:', e);
        }
      }
      // 2. Google Sheets Apps Script Web App
      if (cfg.googleSheetsWebAppUrl && cfg.googleSheetsWebAppUrl.startsWith('http')) {
        try {
          await fetch(cfg.googleSheetsWebAppUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'upsert_progress', progress })
          });
        } catch (e) {
          console.warn('Google Sheets progress push warning:', e);
        }
      }
    }

    async pullProgressFromFreeCloud(userId) {
      const cfg = this.getConfig();
      // 1. Thử tải từ Firebase Realtime Database nếu có cấu hình
      if (cfg.firebaseDatabaseUrl && cfg.firebaseDatabaseUrl.startsWith('http')) {
        try {
          const baseUrl = cfg.firebaseDatabaseUrl.replace(/\/+$/, '');
          const res = await fetch(`${baseUrl}/user_progress/${encodeURIComponent(userId)}.json`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.user_id) {
              await this.idb.saveProgress(data);
              return data;
            }
          }
        } catch (e) {}
      }
      // 2. Thử tải từ Google Sheets Web App nếu có cấu hình
      if (cfg.googleSheetsWebAppUrl && cfg.googleSheetsWebAppUrl.startsWith('http')) {
        try {
          const url = `${cfg.googleSheetsWebAppUrl}?action=progress&user_id=${encodeURIComponent(userId)}`;
          const res = await fetch(url);
          if (res.ok) {
            const json = await res.json();
            if (json && json.ok && json.data) {
              await this.idb.saveProgress(json.data);
              return json.data;
            }
          }
        } catch (e) {}
      }
      // 3. Mặc định lấy từ IndexedDB
      return await this.idb.getProgress(userId);
    }

    /* =====================================================================
       ENSURE PROFILE & PROGRESS
       ===================================================================== */
    async ensureProfileAndProgress(user, fullName = null, passwordHash = null) {
      if (!user || !user.id) return;
      const displayName = fullName || user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'Học viên');
      const now = new Date().toISOString();

      let existingProfile = await this.idb.getProfileById(user.id);
      if (!existingProfile) {
        const isAdminEmail = (user.email === 'admin@pinyinpop.com' || user.email === 'admin@gmail.com');
        existingProfile = {
          id: user.id,
          email: user.email,
          display_name: displayName,
          role: isAdminEmail ? 'admin' : 'user',
          password_hash: passwordHash || simpleHash('123456'),
          created_at: now,
          updated_at: now
        };
        await this.idb.saveProfile(existingProfile);
        await this.pushProfileToFreeCloud(existingProfile);
      }

      let existingProgress = await this.idb.getProgress(user.id);
      if (!existingProgress) {
        existingProgress = {
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
          updated_at: now
        };
        await this.idb.saveProgress(existingProgress);
        await this.pushProgressToFreeCloud(existingProgress);
      }
    }

    async checkUserRole() {
      if (!this.currentUser) {
        this.userRole = 'user';
        return 'user';
      }
      const profile = await this.idb.getProfileById(this.currentUser.id);
      this.userRole = (profile && profile.role === 'admin') ? 'admin' : 'user';
      return this.userRole;
    }

    /* =====================================================================
       AUTHENTICATION APIs (ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT)
       ===================================================================== */
    async signUp(email, password, displayName = '') {
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (!cleanEmail || !password) {
        return { data: null, error: { message: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' } };
      }

      try {
        const existing = await this.idb.findProfileByEmail(cleanEmail);
        if (existing) {
          return { data: null, error: { message: 'User already registered' } };
        }

        const newId = makeId('usr');
        const name = (displayName || '').trim() || cleanEmail.split('@')[0];
        const isAdminEmail = (cleanEmail === 'admin@pinyinpop.com' || cleanEmail === 'admin@gmail.com');
        const now = new Date().toISOString();

        const profile = {
          id: newId,
          email: cleanEmail,
          display_name: name,
          role: isAdminEmail ? 'admin' : 'user',
          password_hash: simpleHash(password),
          created_at: now,
          updated_at: now
        };

        await this.idb.saveProfile(profile);
        await this.pushProfileToFreeCloud(profile);

        const userObj = {
          id: profile.id,
          email: profile.email,
          user_metadata: { full_name: profile.display_name }
        };

        this.currentUser = userObj;
        this.userRole = profile.role;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ id: profile.id, email: profile.email }));

        await this.ensureProfileAndProgress(userObj, name, profile.password_hash);
        await this.syncBidirectional({ mode: 'register' });
        this.notifyStatusChange('SIGNED_IN');

        return {
          data: { user: userObj, session: { user: userObj } },
          error: null
        };
      } catch (err) {
        return { data: null, error: err };
      }
    }

    async signIn(email, password) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (!cleanEmail || !password) {
        return { data: null, error: { message: 'Vui lòng nhập Email và Mật khẩu.' } };
      }

      try {
        // Kiểm tra trên Firebase Cloud hoặc Google Sheets Cloud trước nếu có cấu hình
        const cfg = this.getConfig();
        if (cfg.firebaseDatabaseUrl && cfg.firebaseDatabaseUrl.startsWith('http')) {
          try {
            const baseUrl = cfg.firebaseDatabaseUrl.replace(/\/+$/, '');
            const res = await fetch(`${baseUrl}/profiles.json`);
            if (res.ok) {
              const remoteProfiles = await res.json();
              if (remoteProfiles && typeof remoteProfiles === 'object') {
                for (const p of Object.values(remoteProfiles)) {
                  if (p && p.id) await this.idb.saveProfile(p);
                }
              }
            }
          } catch (e) {}
        }
        if (cfg.googleSheetsWebAppUrl && cfg.googleSheetsWebAppUrl.startsWith('http')) {
          try {
            const res = await fetch(`${cfg.googleSheetsWebAppUrl}?action=all`);
            if (res.ok) {
              const json = await res.json();
              if (json && json.ok && Array.isArray(json.profiles)) {
                for (const p of json.profiles) {
                  if (p && p.id) await this.idb.saveProfile(p);
                }
              }
            }
          } catch (e) {}
        }

        const profile = await this.idb.findProfileByEmail(cleanEmail);
        if (!profile) {
          return { data: null, error: { message: 'Invalid login credentials' } };
        }

        const inputHash = simpleHash(password);
        if (profile.password_hash && profile.password_hash !== inputHash && password !== profile.password_hash) {
          return { data: null, error: { message: 'Invalid login credentials' } };
        }

        const userObj = {
          id: profile.id,
          email: profile.email,
          user_metadata: { full_name: profile.display_name }
        };

        this.currentUser = userObj;
        this.userRole = profile.role || 'user';
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ id: profile.id, email: profile.email }));

        await this.ensureProfileAndProgress(userObj);
        await this.syncBidirectional({ mode: 'login' });
        this.notifyStatusChange('SIGNED_IN');

        return {
          data: { user: userObj, session: { user: userObj } },
          error: null
        };
      } catch (err) {
        return { data: null, error: err };
      }
    }

    async signOut() {
      this.currentUser = null;
      this.userRole = 'user';
      localStorage.removeItem(SESSION_STORAGE_KEY);
      this.clearLocalProgress();
      this.notifyStatusChange('SIGNED_OUT');
      return { error: null };
    }

    async resetPassword(email, newPassword = '123456') {
      const cleanEmail = String(email || '').trim().toLowerCase();
      const profile = await this.idb.findProfileByEmail(cleanEmail);
      if (!profile) {
        return { data: null, error: { message: 'Không tìm thấy tài khoản với email này trong Database.' } };
      }
      profile.password_hash = simpleHash(newPassword);
      profile.updated_at = new Date().toISOString();
      await this.idb.saveProfile(profile);
      await this.pushProfileToFreeCloud(profile);
      return {
        data: { resetTo: newPassword },
        error: null
      };
    }

    /* =====================================================================
       ADMIN & LEADERBOARD UNIFIED QUERY APIs
       ===================================================================== */
    async getAllUsersWithProgress() {
      const cfg = this.getConfig();

      // Đồng bộ từ Firebase nếu có
      if (cfg.firebaseDatabaseUrl && cfg.firebaseDatabaseUrl.startsWith('http')) {
        try {
          const baseUrl = cfg.firebaseDatabaseUrl.replace(/\/+$/, '');
          const [profRes, progRes] = await Promise.all([
            fetch(`${baseUrl}/profiles.json`),
            fetch(`${baseUrl}/user_progress.json`)
          ]);
          if (profRes.ok) {
            const profObj = await profRes.json();
            if (profObj) {
              for (const p of Object.values(profObj)) {
                if (p && p.id) await this.idb.saveProfile(p);
              }
            }
          }
          if (progRes.ok) {
            const progObj = await progRes.json();
            if (progObj) {
              for (const pr of Object.values(progObj)) {
                if (pr && pr.user_id) await this.idb.saveProgress(pr);
              }
            }
          }
        } catch (e) {}
      }

      // Đồng bộ từ Google Sheets nếu có
      if (cfg.googleSheetsWebAppUrl && cfg.googleSheetsWebAppUrl.startsWith('http')) {
        try {
          const res = await fetch(`${cfg.googleSheetsWebAppUrl}?action=all`);
          if (res.ok) {
            const json = await res.json();
            if (json && json.ok) {
              for (const p of (json.profiles || [])) {
                if (p && p.id) await this.idb.saveProfile(p);
              }
              for (const pr of (json.progress || [])) {
                if (pr && pr.user_id) await this.idb.saveProgress(pr);
              }
            }
          }
        } catch (e) {}
      }

      const profiles = await this.idb.getAllProfiles();
      const progressList = await this.idb.getAllProgress();
      const progressMap = new Map();
      progressList.forEach(p => progressMap.set(p.user_id, p));

      // Nếu người dùng hiện tại đang học (kể cả Guest chưa đăng nhập), cập nhật dữ liệu mới nhất
      const localProg = this.gatherLocalProgress();
      if (this.currentUser) {
        progressMap.set(this.currentUser.id, {
          user_id: this.currentUser.id,
          ...localProg,
          updated_at: new Date().toISOString()
        });
      }

      return profiles.map(p => {
        const prog = progressMap.get(p.id) || {};
        const mastered = Array.isArray(prog.flashcard_mastered) ? prog.flashcard_mastered : [];
        const strokeCompleted = prog.stroke_completed_count || 0;
        const hsPop = prog.pinyin_pop_highscore || 0;
        const extra = prog.extra_data || {};
        const computedXp = Math.max(
          extra.xp || 0,
          (mastered.length * 15) + (strokeCompleted * 25) + Math.round(hsPop / 5)
        );
        return {
          id: p.id,
          email: p.email || 'N/A',
          display_name: p.display_name || (p.email ? p.email.split('@')[0] : 'Học viên'),
          role: p.role || 'user',
          created_at: p.created_at || new Date().toISOString(),
          updated_at: p.updated_at || new Date().toISOString(),
          mastered,
          review: Array.isArray(prog.flashcard_review) ? prog.flashcard_review : [],
          favs: Array.isArray(prog.flashcard_favs) ? prog.flashcard_favs : [],
          stroke_completed: strokeCompleted,
          stroke_correct: prog.stroke_correct_count || 0,
          stroke_total: prog.stroke_total_attempts || 0,
          stroke_streak: prog.stroke_streak || 0,
          stroke_chars: Array.isArray(prog.stroke_completed_chars) ? prog.stroke_completed_chars : [],
          highscore_pop: hsPop,
          score_tone: prog.tone_master_score || 0,
          score_puzzle: prog.puzzle_score || 0,
          xp: computedXp,
          hsk_badge: extra.hskBadge || Math.min(6, Math.max(1, Math.ceil((mastered.length + 1) / 35))),
          last_synced: prog.updated_at || p.updated_at
        };
      });
    }

    async updateUserRole(userId, newRole) {
      const profile = await this.idb.getProfileById(userId);
      if (!profile) throw new Error('Không tìm thấy hồ sơ học viên');
      profile.role = newRole;
      profile.updated_at = new Date().toISOString();
      await this.idb.saveProfile(profile);
      await this.pushProfileToFreeCloud(profile);
      if (this.currentUser && this.currentUser.id === userId) {
        this.userRole = newRole;
      }
      return profile;
    }

    async adminResetUserProgress(userId) {
      const emptyProg = {
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
      await this.idb.saveProgress(emptyProg);
      await this.pushProgressToFreeCloud(emptyProg);
      if (this.currentUser && this.currentUser.id === userId) {
        this.clearLocalProgress();
        localStorage.setItem('pinyin_pop_active_uid', userId);
      }
      return emptyProg;
    }

    /* =====================================================================
       1-CLICK CROSS-DEVICE SYNC CODE & JSON BACKUP (100% FREE FOREVER)
       ===================================================================== */
    exportSyncCode() {
      const payload = {
        v: 2,
        ts: new Date().toISOString(),
        user: this.currentUser ? {
          id: this.currentUser.id,
          email: this.currentUser.email,
          display_name: this.getUserDisplayName(),
          role: this.userRole
        } : null,
        progress: this.gatherLocalProgress()
      };
      const jsonStr = JSON.stringify(payload);
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      return 'PP2:' + encoded;
    }

    async importSyncCode(rawCode) {
      const clean = String(rawCode || '').trim();
      if (!clean) throw new Error('Mã đồng bộ trống.');
      let jsonStr = clean;
      if (clean.startsWith('PP2:') || clean.startsWith('PP1:')) {
        const b64 = clean.slice(4);
        jsonStr = decodeURIComponent(escape(atob(b64)));
      }
      const parsed = JSON.parse(jsonStr);
      if (!parsed || !parsed.progress) {
        throw new Error('Định dạng mã đồng bộ không hợp lệ.');
      }

      // Hợp nhất dữ liệu tiến độ vào máy hiện tại
      this.mergeRemoteIntoLocal(parsed.progress);

      // Nếu đang đăng nhập thì lưu luôn vào IndexedDB & Cloud
      if (this.currentUser) {
        const merged = this.gatherLocalProgress();
        merged.user_id = this.currentUser.id;
        merged.updated_at = new Date().toISOString();
        await this.idb.saveProgress(merged);
        await this.pushProgressToFreeCloud(merged);
      }
      this.lastSyncTime = new Date();
      this.notifyStatusChange('SYNC_SUCCESS');
      return parsed;
    }

    /* =====================================================================
       DATA SYNC ENGINE (CÁCH LY DỮ LIỆU TỪNG USER & ĐỒNG BỘ 2 CHIỀU)
       ===================================================================== */
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

      window.dispatchEvent(new CustomEvent('cloud-progress-updated', {
        detail: {
          reset: true,
          syncedAt: new Date().toISOString()
        }
      }));
    }

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

      setJson('pinyin_pop_mastered', remote.flashcard_mastered || []);
      setJson('pinyin_pop_review', remote.flashcard_review || []);
      setJson('pinyin_pop_favs', remote.flashcard_favs || []);

      setInt('hs_completed_chars', remote.stroke_completed_count || 0);
      setInt('hs_correct_strokes', remote.stroke_correct_count || 0);
      setInt('hs_total_attempts', remote.stroke_total_attempts || 0);
      setInt('hs_current_streak', remote.stroke_streak || 0);
      setJson('hs_completed_list', remote.stroke_completed_chars || []);

      setInt('pinyin_pop_highscore', remote.pinyin_pop_highscore || 0);
      setInt('tone_master_score', remote.tone_master_score || 0);
      setInt('puzzle_score', remote.puzzle_score || 0);
      setJson('pinyin_pop_extra_data', remote.extra_data || {}, '{}');

      window.dispatchEvent(new CustomEvent('cloud-progress-updated', {
        detail: {
          type: 'overwrite',
          syncedAt: new Date().toISOString()
        }
      }));
    }

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

      try {
        const localExtra = JSON.parse(localStorage.getItem('pinyin_pop_extra_data') || '{}');
        const remoteExtra = remote.extra_data || {};
        const mergedSteps = { ...(remoteExtra.completedSteps || {}), ...(localExtra.completedSteps || {}) };
        Object.keys(mergedSteps).forEach(k => {
          const rArr = (remoteExtra.completedSteps && remoteExtra.completedSteps[k]) || [];
          const lArr = (localExtra.completedSteps && localExtra.completedSteps[k]) || [];
          mergedSteps[k] = Array.from(new Set([...rArr, ...lArr])).sort();
        });

        const mergedExtra = {
          ...remoteExtra,
          ...localExtra,
          xp: Math.max(localExtra.xp || 0, remoteExtra.xp || 0),
          hskBadge: Math.max(localExtra.hskBadge || 0, remoteExtra.hskBadge || 0),
          completedSteps: mergedSteps,
          srsMeta: { ...(remoteExtra.srsMeta || {}), ...(localExtra.srsMeta || {}) }
        };
        localStorage.setItem('pinyin_pop_extra_data', JSON.stringify(mergedExtra));
      } catch (e) {}

      window.dispatchEvent(new CustomEvent('cloud-progress-updated', {
        detail: {
          syncedAt: new Date().toISOString()
        }
      }));
    }

    async resetUserProgress() {
      if (!this.currentUser) {
        this.clearLocalProgress();
        return true;
      }
      try {
        await this.adminResetUserProgress(this.currentUser.id);
        this.lastSyncTime = new Date();
        this.notifyStatusChange('SYNC_SUCCESS');
        return true;
      } catch (e) {
        console.error('Lỗi đặt lại tiến độ:', e);
        return false;
      }
    }

    async syncBidirectional(options = {}) {
      if (!this.currentUser || this.isSyncing) return false;
      this.isSyncing = true;
      this.notifyStatusChange('SYNCING');

      try {
        const userId = this.currentUser.id;
        const activeUid = localStorage.getItem('pinyin_pop_active_uid');
        const isAccountSwitch = activeUid && activeUid !== userId;

        await this.ensureProfileAndProgress(this.currentUser);
        const remoteData = await this.pullProgressFromFreeCloud(userId);

        if (isAccountSwitch) {
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

        localStorage.setItem('pinyin_pop_active_uid', userId);

        if (options.mode === 'login' || options.mode === 'session_restore') {
          if (remoteData) {
            this.overwriteLocalWithRemote(remoteData);
          } else {
            this.clearLocalProgress();
            localStorage.setItem('pinyin_pop_active_uid', userId);
          }
        } else if (options.mode === 'register') {
          const localData = this.gatherLocalProgress();
          localData.user_id = userId;
          localData.updated_at = new Date().toISOString();
          await this.idb.saveProgress(localData);
          await this.pushProgressToFreeCloud(localData);
        } else {
          if (remoteData) {
            this.mergeRemoteIntoLocal(remoteData);
          }
          const mergedData = this.gatherLocalProgress();
          mergedData.user_id = userId;
          mergedData.updated_at = new Date().toISOString();
          await this.idb.saveProgress(mergedData);
          await this.pushProgressToFreeCloud(mergedData);
        }

        this.lastSyncTime = new Date();
        this.isSyncing = false;
        this.notifyStatusChange('SYNC_SUCCESS');
        return true;
      } catch (err) {
        console.error('Lỗi đồng bộ Database:', err);
        this.isSyncing = false;
        this.notifyStatusChange('SYNC_ERROR');
        return false;
      }
    }

    triggerDebouncedSync(delay = 1200) {
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
        isConfigured: this.isConfigured(),
        providerName: this.getProviderName()
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
