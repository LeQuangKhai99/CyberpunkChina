// =========================================================================
// PINYIN POP! - CẤU HÌNH KẾT NỐI SUPABASE CLOUD (ĐỒNG BỘ ĐA THIẾT BỊ)
// =========================================================================
// Hướng dẫn nhanh:
// 1. Tạo project miễn phí tại: https://supabase.com
// 2. Vào Project Settings -> API:
//    - Copy Project URL dán vào biến 'url' bên dưới
//    - Copy Project API Keys (anon / public) dán vào biến 'anonKey' bên dưới
// 3. Bạn cũng có thể dán trực tiếp trong giao diện "Đăng Nhập -> Cấu Hình Cloud" trên website!
// =========================================================================

window.SUPABASE_CONFIG = {
  // Thay thế URL dự án của bạn tại đây (ví dụ: 'https://xyzabcdefg.supabase.co')
  url: '',
  
  // Thay thế khóa anon/public key tại đây (chuỗi ký tự dài bắt đầu bằng 'eyJ...')
  anonKey: ''
};

// Ưu tiên đọc từ localStorage nếu người dùng cấu hình trực tiếp trên giao diện
(function() {
  try {
    const savedUrl = localStorage.getItem('pinyin_pop_sb_url');
    const savedKey = localStorage.getItem('pinyin_pop_sb_key');
    if (savedUrl && savedUrl.trim()) {
      window.SUPABASE_CONFIG.url = savedUrl.trim();
    }
    if (savedKey && savedKey.trim()) {
      window.SUPABASE_CONFIG.anonKey = savedKey.trim();
    }
  } catch (e) {
    console.warn('Không thể đọc cấu hình Supabase từ localStorage', e);
  }
})();
