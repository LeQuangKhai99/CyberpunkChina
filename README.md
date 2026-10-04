# 赛博拼音 // CYBERPUNK CHINA: PINYIN DEFENDER

An intense, retro-futuristic Cyberpunk Chinese typing arcade game. Chinese words fall from the cyber sky towards your city's defense perimeter. Type the exact Pinyin to lock-on and vaporize each target with laser cannons before they breach your 100 HP Core Shield!

![Cyberpunk China Pinyin Defender](preview.png)

---

## ⚡ Tính Năng Nổi Bật / Key Features

- **5.000 Từ Vựng Tiếng Trung Chuẩn HSK 1 - 6 (Đầy đủ Chú thích Tiếng Việt & Tiếng Anh)**:
  - Bộ dữ liệu từ vựng tích hợp sẵn trong `words.js`.
  - Hỗ trợ bộ lọc: Toàn bộ HSK (5.000 từ), HSK 1 (150 từ), HSK 2 (150 từ), HSK 3 (300 từ), HSK 4 (600 từ), HSK 5 (1.300 từ), HSK 6 (2.500 từ).
  - Tùy chọn hiển thị chú thích nghĩa: **🇻🇳 Tiếng Việt**, **🇻🇳🇬🇧 Song ngữ**, hoặc **🇬🇧 Tiếng Anh**.
- **Thang Điểm Theo Cấp Độ HSK (HSK Tier Scoring)**:
  - Càng từ vựng HSK cấp cao càng nhận được nhiều điểm thưởng vượt bậc:
    - **HSK 1**: 100 điểm
    - **HSK 2**: 250 điểm
    - **HSK 3**: 500 điểm
    - **HSK 4**: 1.000 điểm
    - **HSK 5**: 2.000 điểm
    - **HSK 6**: 4.000 điểm
  - Kết hợp hệ số nhân Chuỗi Combo (x1, x2, x3, x4, x5 OVERDRIVE) mang lại điểm số bùng nổ!
- **Thẻ HSK Đỏ Hiển Thị Đầy Đủ Sắc Nét**:
  - Huy hiệu HSK màu đỏ neon nằm gọn gàng bên trong thẻ bài rơi, không bị che khuất hay cắt xén bởi viền vát góc.
- **Nút Bật / Ẩn Pinyin Nổi Bật (Chế Độ Luyện Trí Nhớ Chữ Hán)**:
  - Nút chuyển đổi Pinyin nổi bật trên thanh điều khiển HUD với trạng thái trực quan:
    - **👁️ PINYIN: HIỆN**: Hiển thị đầy đủ phiên âm Pinyin để người học dễ nhận biết.
    - **🙈 PINYIN: ẨN (THỬ THÁCH)**: Ẩn/làm mờ Pinyin để người chơi tự nhớ mặt chữ Hán. Khi gõ đúng các ký tự Pinyin, hệ thống sẽ mở khóa và hiển thị phản hồi tức thì.
    - Hỗ trợ phím tắt nhanh: **F2** hoặc **Alt + P**.
- **Hệ Thống Âm Thanh Game 8-Bit Sống Động (Mặc định Bật - Default ON)**:
  - Tích hợp các file âm thanh retro 8-bit chuẩn game arcade (Laser, Explosion, Coin Chime, Level Up, Chiptune BGM) kết hợp bộ tổng hợp âm thanh Web Audio API đa tầng.
  - Tự động kích hoạt phát nhạc và hiệu ứng âm thanh ngay khi người dùng bấm khởi động trò chơi.
- **Phát Âm Giọng Đọc Bản Ngữ (TTS)**:
  - Tự động đọc chuẩn giọng Bắc Kinh (`zh-CN`) mỗi khi bắn hạ một từ vựng, hỗ trợ tối đa kỹ năng nghe và ghi nhớ phát âm.
- **Cơ Chế Phòng Thủ Khiên Năng Lượng 100 HP**:
  - Người chơi khởi đầu với 100 HP khiên. Mỗi từ chạm đáy sẽ gây sát thương -1 HP.
  - Hiệu ứng rung màn hình, cảnh báo đỏ nguy cấp khi HP < 25.

---

## 🚀 Khởi Động Trò Chơi / Quick Start

Không cần cài đặt công cụ phức tạp hay build bundle. Chỉ cần mở `index.html` trên bất kỳ trình duyệt hiện đại nào hoặc chạy qua máy chủ local:

```bash
# Sử dụng Python
python -m http.server 8080

# Hoặc sử dụng Node.js
npx serve .
```

Truy cập: [http://localhost:8080](http://localhost:8080)

---

## 🎮 Cách Chơi / How to Play

1. Nhấp nút **"KHỞI ĐỘNG PHÁO LASER & BẮT ĐẦU PHÒNG THỦ"** (âm thanh sẽ tự động bật).
2. Các từ vựng tiếng Trung kèm Pinyin và nghĩa tiếng Việt sẽ rơi dần từ trên xuống.
3. Gõ Pinyin của bất kỳ từ nào vào khung console bên dưới (gõ không dấu, ví dụ: `ni`, `hao`, `nihao`, `zhongwen`).
4. Khi gõ đủ chữ, pháo laser sẽ lập tức khai hỏa tiêu diệt từ mục tiêu, cộng điểm và phát âm tiếng Trung.
5. Muốn thử thách ghi nhớ chữ Hán? Nhấp nút **"PINYIN: HIỆN"** trên thanh công cụ để chuyển sang chế độ **ẨN PINYIN**!

---

## 📁 Cấu Trúc Dự Án / Project Structure

```
├── assets/
│   └── audio/                  # Các file âm thanh 8-bit (laser, explosion, coin, bgm...)
├── index.html                  # Giao diện HUD Cyberpunk, sky arena, turret & modals
├── style.css                   # Thiết kế Neon Cyberpunk, font chữ sắc nét, hiệu ứng CRT
├── words.js                    # Thư viện 5.000 từ vựng tiếng Trung HSK 1-6 chuẩn nghĩa TV
├── audio.js                    # Bộ phát âm thanh 8-bit, chiptune BGM sequencer & TTS
├── game.js                     # Logic phòng thủ, tính điểm HSK, ẩn hiện pinyin, vòng lặp game
├── preview.png                 # Ảnh chụp màn hình trò chơi
└── README.md                   # Tài liệu hướng dẫn
```

---

## 👨‍💻 Tác Giả & Bản Quyền / Author & Copyright

- **Tác giả / Author**: **Khai Le** (Le Quang Khai)
- **Bản quyền / Copyright**: © 2026 **Khai Le**. All Rights Reserved.
- **Giấy phép / License**: MIT License.

---

