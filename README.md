# 🌟 PINYIN POP! // 快乐拼音 - Vui Học Tiếng Trung 5000 Từ HSK

Trò chơi luyện gõ Pinyin tiếng Trung phong cách kẹo ngọt vui nhộn, sống động! Các bong bóng từ vựng tiếng Trung rơi nhẹ nhàng từ bầu trời cầu vồng. Gõ chính xác phiên âm Pinyin để pháo sao bắn nổ từ vựng, tích điểm combo và bảo vệ 100 Tim năng lượng!

<p align="center">
  <img src="assets/logo.png" alt="Pinyin Pop Logo" width="220" style="border-radius: 32px; box-shadow: 0 10px 30px rgba(255,75,130,0.3);">
</p>

---

## ⚡ Tính Năng Nổi Bật / Key Features

- **Giao Diện Candy Pop Vui Tươi & Sống Động**:
  - Tông màu kẹo ngọt rực rỡ, mây bồng bềnh lơ lửng, bong bóng cầu vồng và các vì sao lấp lánh.
  - Các thẻ bài từ vựng thiết kế dạng viên kẹo tròn trịa, hiệu ứng pháo giấy confetti lung linh khi bắn trúng!
- **5.000 Từ Vựng Tiếng Trung Chuẩn HSK 1 - 6 (Đầy đủ Chú thích Tiếng Việt & Tiếng Anh)**:
  - Bộ dữ liệu từ vựng tích hợp sẵn trong `words.js`.
  - Hỗ trợ bộ lọc: Toàn bộ HSK (5.000 từ), HSK 1 (150 từ), HSK 2 (150 từ), HSK 3 (300 từ), HSK 4 (600 từ), HSK 5 (1.300 từ), HSK 6 (2.500 từ).
  - Tùy chọn hiển thị chú thích nghĩa: **🇻🇳 Tiếng Việt**, **🇻🇳🇬🇧 Song ngữ**, hoặc **🇬🇧 Tiếng Anh**.
- **Thang Điểm Theo Cấp Độ HSK (HSK Tier Scoring)**:
  - Càng từ vựng HSK cấp cao càng nhận được nhiều điểm thưởng:
    - **HSK 1**: 100 điểm
    - **HSK 2**: 250 điểm
    - **HSK 3**: 500 điểm
    - **HSK 4**: 1.000 điểm
    - **HSK 5**: 2.000 điểm
    - **HSK 6**: 4.000 điểm
  - Kết hợp hệ số nhân Chuỗi Combo (x1, x2, x3, x4, x5 SIÊU TỐC) mang lại điểm số bùng nổ!
- **Nút Bật / Ẩn Pinyin Nổi Bật (Chế Độ Luyện Trí Nhớ Chữ Hán)**:
  - Nút chuyển đổi Pinyin nổi bật trên thanh điều khiển HUD:
    - **👁️ PINYIN: HIỆN**: Hiển thị đầy đủ phiên âm Pinyin.
    - **🙈 PINYIN: ẨN (THỬ THÁCH)**: Ẩn/làm mờ Pinyin để tự nhớ mặt chữ Hán.
    - Phím tắt nhanh: **F2** hoặc **Alt + P**.
- **Âm Thanh Game Vui Nhộn & Giọng Đọc Bản Ngữ (TTS)**:
  - Tự động phát âm chuẩn giọng Bắc Kinh (`zh-CN`) mỗi khi bắn hạ từ vựng.
  - Hiệu ứng âm thanh sinh động, vui tươi kèm nhạc nền chiptune bắt tai.
- **Hệ Thống Thẻ Ghi Nhớ Flashcard Thông Minh (`flashcard.html`)**:
  - **Thẻ 3D Flip Card tương tác mượt mà**: Lật thẻ để xem Chữ Hán, Pinyin chuẩn thanh điệu, Nghĩa tiếng Việt & tiếng Anh.
  - **Phân bài học theo Deck (25 từ/bài)**: Dễ dàng chia nhỏ 5.000 từ vựng thành các bài học nhỏ để ghi nhớ nhẹ nhàng không áp lực.
  - **Cơ chế Active Recall (Ghi nhớ chủ động)**: Đánh dấu `❌ Chưa thuộc` và `✅ Đã thuộc` được lưu trữ tự động vào `localStorage` kèm thanh tiến độ.
  - **3 Chế độ học linh hoạt**:
    - 🗂️ **Học Flashcard**: Lật thẻ tự do, xáo trộn (Shuffle), tự động lật (Slideshow).
    - 🎯 **Trắc nghiệm (Quiz)**: Luyện tập 4 đáp án thử thách phản xạ.
    - 📜 **Từ điển tổng hợp (Dictionary Grid)**: Tra cứu nhanh toàn bộ từ kèm phát âm chuẩn Bắc Kinh.
  - **Phát âm giọng bản ngữ (TTS)**: Tự động phát âm hoặc nhấp vào loa 🔊 bất kỳ lúc nào.
- **Cơ Chế 100 Tim Năng Lượng Trong Game**:
  - Người chơi khởi đầu với 100 Tim năng lượng. Giữ tim càng lâu, combo càng bùng nổ!

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

