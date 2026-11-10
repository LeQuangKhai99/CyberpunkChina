// =========================================================================
// PINYIN POP! - CẤU HÌNH HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU MIỄN PHÍ ĐA NỀN TẢNG
// Hỗ trợ 4 chế độ lưu trữ (Tự động hoạt động 100% Miễn phí không cần thẻ tín dụng):
//   1. 'googlesheets'  : Google Sheets Cloud DB qua Google Apps Script (15GB Google Drive Miễn phí)
//   2. 'indexeddb'     : Cơ sở dữ liệu IndexedDB NoSQL chuẩn trình duyệt + Mã Đồng Bộ Chuyển Thiết Bị
//   3. 'firebase'      : Google Firebase Realtime Database (Gói Spark Miễn phí vĩnh viễn)
//   4. 'supabase'      : Supabase PostgreSQL (Tùy chọn nếu có project riêng)
// =========================================================================

(function() {
  const DEFAULT_GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxYvHey5JEMdJ903z3xHN2rWgAGWrt8dgOvqI7BO4zVjbAL55k0wACGgt9XvKWoFE9e5w/exec';

  const savedCustomCfg = (function() {
    try {
      return JSON.parse(localStorage.getItem('pinyin_pop_custom_db_config') || '{}');
    } catch (e) {
      return {};
    }
  })();

  window.PINYIN_DB_CONFIG = {
    // Chế độ mặc định: 'googlesheets' kết hợp 'indexeddb' (Đồng bộ kép: Cực nhanh trên máy + Lưu trữ vĩnh viễn trên Google Sheets)
    provider: savedCustomCfg.provider || 'googlesheets',

    // [TÙY CHỌN 1 - ĐÁM MÂY MIỄN PHÍ GOOGLE FIREBASE REALTIME DB]
    firebaseDatabaseUrl: savedCustomCfg.firebaseDatabaseUrl || '',

    // [TÙY CHỌN 2 - ĐÁM MÂY MIỄN PHÍ GOOGLE SHEETS (15GB GOOGLE DRIVE)]
    googleSheetsWebAppUrl: savedCustomCfg.googleSheetsWebAppUrl || DEFAULT_GOOGLE_SHEETS_URL,

    // [TÙY CHỌN 3 - SUPABASE (Đã tắt mặc định vì Supabase giới hạn gói miễn phí)]
    supabaseUrl: savedCustomCfg.supabaseUrl || '',
    supabaseAnonKey: savedCustomCfg.supabaseAnonKey || ''
  };

  // Giữ tương thích ngược với các module cũ kiểm tra window.SUPABASE_CONFIG
  window.SUPABASE_CONFIG = {
    provider: window.PINYIN_DB_CONFIG.provider,
    url: window.PINYIN_DB_CONFIG.supabaseUrl || 'local://pinyinpop-indexeddb',
    anonKey: window.PINYIN_DB_CONFIG.supabaseAnonKey || 'free_forever_indexeddb_key',
    firebaseDatabaseUrl: window.PINYIN_DB_CONFIG.firebaseDatabaseUrl,
    googleSheetsWebAppUrl: window.PINYIN_DB_CONFIG.googleSheetsWebAppUrl
  };
})();
