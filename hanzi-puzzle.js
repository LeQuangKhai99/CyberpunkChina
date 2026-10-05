/**
 * PINYIN POP! 🧩 - HANZI RADICAL & COMPOUND PUZZLE ENGINE
 * Interactive Drag & Drop / Click Assembly for Chinese Characters & HSK Compound Words
 */

// Comprehensive Database of Radical / Component Decompositions & Etymology
const RADICAL_DECOMPOSITIONS = [
  { hanzi: '休', components: ['亻', '木'], pinyin: 'xiū', level: 1, meaning: 'nghỉ ngơi', etymology: '💡 Chiết tự: Người (亻) tựa lưng vào bóng Cây (木) để nghỉ ngơi sau giờ làm việc vất vả.' },
  { hanzi: '明', components: ['日', '月'], pinyin: 'míng', level: 1, meaning: 'sáng sủa, thông minh', etymology: '💡 Chiết tự: Mặt trời (日) là nguồn sáng ban ngày, Mặt trăng (月) là nguồn sáng ban đêm. Cả hai kết hợp tạo nên nguồn sáng rực rỡ và thông suốt.' },
  { hanzi: '好', components: ['女', '子'], pinyin: 'hǎo', level: 1, meaning: 'tốt, đẹp, hay', etymology: '💡 Chiết tự: Người mẹ / phụ nữ (女) bồng bế đứa con thơ (子) trên tay là hình ảnh đẹp đẽ, hạnh phúc và tốt lành nhất của nhân loại.' },
  { hanzi: '看', components: ['手', '目'], pinyin: 'kàn', level: 1, meaning: 'nhìn, trông, xem', etymology: '💡 Chiết tự: Bàn tay (手) đặt ngang trên mắt (目) che bớt ánh nắng để phóng tầm mắt nhìn ra xa.' },
  { hanzi: '尖', components: ['小', '大'], pinyin: 'jiān', level: 2, meaning: 'nhọn, mũi nhọn', etymology: '💡 Chiết tự: Phần trên thì nhỏ (小), phần dưới thì to (大) ➔ tạo nên hình chóp mũi nhọn.' },
  { hanzi: '男', components: ['田', '力'], pinyin: 'nán', level: 2, meaning: 'nam giới, con trai', etymology: '💡 Chiết tự: Người dùng sức lực (力) cày cấy, gánh vác việc đồng ruộng (田) chính là người đàn ông trụ cột.' },
  { hanzi: '家', components: ['宀', '豕'], pinyin: 'jiā', level: 1, meaning: 'nhà, gia đình', etymology: '💡 Chiết tự: Dưới mái nhà (宀) có nuôi chú lợn (豕) tượng trưng cho cuộc sống định cư no ấm, sung túc.' },
  { hanzi: '问', components: ['门', '口'], pinyin: 'wèn', level: 1, meaning: 'hỏi', etymology: '💡 Chiết tự: Đứng trước cổng nhà (门) mở miệng (口) cất tiếng chào hỏi thăm dò tin tức.' },
  { hanzi: '闻', components: ['门', '耳'], pinyin: 'wén', level: 3, meaning: 'nghe thấy, ngửi', etymology: '💡 Chiết tự: Ghé sát tai (耳) vào khe cửa (门) để lắng nghe âm thanh từ bên ngoài.' },
  { hanzi: '森', components: ['木', '木', '木'], pinyin: 'sēn', level: 3, meaning: 'rừng rậm, sum suê', etymology: '💡 Chiết tự: Ba cây (木) đứng cạnh nhau biểu thị vô số loài cây mọc um tùm tạo nên cánh rừng già.' },
  { hanzi: '品', components: ['口', '口', '口'], pinyin: 'pǐn', level: 3, meaning: 'phẩm chất, thưởng thức', etymology: '💡 Chiết tự: Ba cái miệng (口) cùng ăn thử và đồng thanh khen ngợi phẩm chất hảo hạng của món ăn.' },
  { hanzi: '众', components: ['人', '人', '人'], pinyin: 'zhòng', level: 3, meaning: 'quần chúng, số đông', etymology: '💡 Chiết tự: Ba người (人) cùng tụ họp lại tượng trưng cho đám đông dân chúng.' },
  { hanzi: '晶', components: ['日', '日', '日'], pinyin: 'jīng', level: 4, meaning: 'pha lê, lấp lánh', etymology: '💡 Chiết tự: Ba mặt trời (日) cùng tỏa ánh hào quang sáng chói lọi, trong suốt như pha lê.' },
  { hanzi: '炎', components: ['火', '火'], pinyin: 'yán', level: 4, meaning: 'nóng rực, viêm', etymology: '💡 Chiết tự: Hai ngọn lửa (火) bốc cháy chồng lên nhau tạo nên sức nóng rừng rực.' },
  { hanzi: '灭', components: ['一', '火'], pinyin: 'miè', level: 4, meaning: 'dập tắt, tiêu diệt', etymology: '💡 Chiết tự: Phủ một thanh chắn (一) trùm lên ngọn lửa (火) để dập tắt đám cháy.' },
  { hanzi: '卡', components: ['上', '下'], pinyin: 'kǎ', level: 2, meaning: 'thẻ, kẹt', etymology: '💡 Chiết tự: Ở vị trí lưng chừng giữa trên (上) và dưới (下), không lên được không xuống được ➔ bị kẹt cứng.' },
  { hanzi: '歪', components: ['不', '正'], pinyin: 'wāi', level: 4, meaning: 'nghiêng, lệch, xiên', etymology: '💡 Chiết tự: Không (不) đứng thẳng thắn ngay chính (正) ➔ xiên vẹo, méo mó.' },
  { hanzi: '泪', components: ['氵', '目'], pinyin: 'lèi', level: 3, meaning: 'nước mắt, lệ', etymology: '💡 Chiết tự: Dòng nước (氵 - bộ thủy) tuôn rơi từ khóe mắt (目 - bộ mục) chính là giọt nước mắt.' },
  { hanzi: '信', components: ['亻', '言'], pinyin: 'xìn', level: 2, meaning: 'tin tưởng, thư từ', etymology: '💡 Chiết tự: Lời nói (言) của con người (亻) phải ngay thẳng thì mới tạo dựng được lòng tin (chữ tín).' },
  { hanzi: '话', components: ['讠', '舌'], pinyin: 'huà', level: 1, meaning: 'lời nói, trò chuyện', etymology: '💡 Chiết tự: Lời nói (讠) được uốn nắn và phát ra nhờ chiếc lưỡi (舌).' },
  { hanzi: '谢', components: ['讠', '身', '寸'], pinyin: 'xiè', level: 1, meaning: 'cảm ơn, tạ', etymology: '💡 Chiết tự: Lời nói (讠) cùng cái cúi mình (身 - thân, 寸 - thốn) thể hiện sự cảm kích chân thành.' },
  { hanzi: '妈', components: ['女', '马'], pinyin: 'mā', level: 1, meaning: 'mẹ, má', etymology: '💡 Chiết tự: Chữ hình thanh: Bộ nữ (女) lấy nghĩa người mẹ, mượn âm đọc của chữ Mã (马 - mǎ) thành mā.' },
  { hanzi: '爸', components: ['父', '巴'], pinyin: 'bà', level: 1, meaning: 'cha, bố', etymology: '💡 Chiết tự: Chữ hình thanh: Bộ phụ (父) chỉ người cha, mượn âm đọc của chữ Ba (巴 - bā) thành bà.' },
  { hanzi: '姐', components: ['女', '且'], pinyin: 'jiě', level: 1, meaning: 'chị gái', etymology: '💡 Chiết tự: Người con gái (女) lớn tuổi trong nhà được kính trọng như tấm bia tổ tiên (且).' },
  { hanzi: '妹', components: ['女', '未'], pinyin: 'mèi', level: 1, meaning: 'em gái', etymology: '💡 Chiết tự: Người con gái (女) còn nhỏ tuổi, chưa (未) đến tuổi trưởng thành là người em gái.' },
  { hanzi: '吃', components: ['口', '乞'], pinyin: 'chī', level: 1, meaning: 'ăn', etymology: '💡 Chiết tự: Miệng (口) mở ra đón nhận đồ ăn thức uống khi đi xin (乞) để no bụng.' },
  { hanzi: '晴', components: ['日', '青'], pinyin: 'qíng', level: 2, meaning: 'trời nắng ráo, quang đãng', etymology: '💡 Chiết tự: Khi vầng mặt trời (日) chiếu rọi trên nền trời trong xanh (青).' },
  { hanzi: '情', components: ['忄', '青'], pinyin: 'qíng', level: 3, meaning: 'tình cảm, cảm xúc', etymology: '💡 Chiết tự: Trái tim (忄) luôn xanh tươi, thanh khiết (青) chất chứa tình cảm con người.' },
  { hanzi: '清', components: ['氵', '青'], pinyin: 'qīng', level: 3, meaning: 'trong sạch, thanh khiết', etymology: '💡 Chiết tự: Dòng nước (氵) trong vắt nhìn thấy màu xanh biếc (青).' },
  { hanzi: '请', components: ['讠', '青'], pinyin: 'qǐng', level: 1, meaning: 'mời, xin', etymology: '💡 Chiết tự: Lời nói (讠) nhã nhặn, thanh nhã (青) dùng để mời mọc khách quý.' },
  { hanzi: '打', components: ['扌', '丁'], pinyin: 'dǎ', level: 1, meaning: 'đánh, gõ, chơi', etymology: '💡 Chiết tự: Dùng bàn tay (扌) đóng hoặc gõ một lực mạnh vào chiếc đinh (丁).' },
  { hanzi: '拉', components: ['扌', '立'], pinyin: 'lā', level: 3, meaning: 'kéo, lôi', etymology: '💡 Chiết tự: Bàn tay (扌) dùng sức kéo đồ vật đứng (立) dậy.' },
  { hanzi: '树', components: ['木', '又', '寸'], pinyin: 'shù', level: 3, meaning: 'cây cối', etymology: '💡 Chiết tự: Cây (木) được bàn tay (又, 寸) gieo trồng và vun đắp thành cây xanh tỏa bóng mát.' },
  { hanzi: '校', components: ['木', '交'], pinyin: 'xiào', level: 1, meaning: 'trường học', etymology: '💡 Chiết tự: Ngôi trường xây bằng gỗ (木) là nơi thầy trò gặp gỡ và giao lưu (交) tri thức.' },
  { hanzi: '河', components: ['氵', '可'], pinyin: 'hé', level: 2, meaning: 'con sông', etymology: '💡 Chiết tự: Dòng nước (氵) uốn lượn có thể (可) lưu thông thuyền bè tạo nên dòng sông.' },
  { hanzi: '海', components: ['氵', '每'], pinyin: 'hǎi', level: 3, meaning: 'biển cả', etymology: '💡 Chiết tự: Nước (氵) từ mỗi (每) con sông trên thế giới đều đổ về đại dương bao la.' },
  { hanzi: '玩', components: ['王', '元'], pinyin: 'wán', level: 2, meaning: 'chơi đùa', etymology: '💡 Chiết tự: Bàn tay nâng niu viên ngọc quý (王) đùa nghịch vui vẻ bắt đầu (元).' },
  { hanzi: '现', components: ['王', '见'], pinyin: 'xiàn', level: 2, meaning: 'hiện tại, xuất hiện', etymology: '💡 Chiết tự: Viên ngọc quý (王) được nhìn thấy (见) phát sáng ➔ hiện diện rõ ràng trước mắt.' },
  { hanzi: '饭', components: ['饣', '反'], pinyin: 'fàn', level: 1, meaning: 'cơm, bữa ăn', etymology: '💡 Chiết tự: Thức ăn (饣 - bộ thực) được nấu chín qua nhiều lần đảo lật (反) ➔ hạt cơm thơm lành.' },
  { hanzi: '饱', components: ['饣', '包'], pinyin: 'bǎo', level: 3, meaning: 'no nê', etymology: '💡 Chiết tự: Đồ ăn (饣) nạp vào làm bụng căng tròn như chiếc túi (包) ➔ no nê.' },
  { hanzi: '饿', components: ['饣', '我'], pinyin: 'è', level: 3, meaning: 'đói', etymology: '💡 Chiết tự: Bản thân tôi (我) đang rất cồn cào thiếu thốn thức ăn (饣) ➔ đói lả.' },
  { hanzi: '雷', components: ['雨', '田'], pinyin: 'léi', level: 4, meaning: 'sấm sét', etymology: '💡 Chiết tự: Cơn mưa (雨) dội xuống cánh đồng (田) kèm theo tiếng nổ vang dội như sấm truyền.' },
  { hanzi: '雪', components: ['雨', '彐'], pinyin: 'xuě', level: 2, meaning: 'tuyết', etymology: '💡 Chiết tự: Mưa (雨) đông kết thành những bông tuyết trắng muốt có thể dùng tay (彐) gom lại.' },
  { hanzi: '笔', components: ['⺮', '毛'], pinyin: 'bǐ', level: 3, meaning: 'bút', etymology: '💡 Chiết tự: Cây bút lông truyền thống có cán làm bằng tre trúc (⺮) và đầu gắn lông thú (毛).' },
  { hanzi: '笑', components: ['⺮', '夭'], pinyin: 'xiào', level: 2, meaning: 'cười', etymology: '💡 Chiết tự: Ngọn trúc (⺮) đung đưa uốn lượn (夭) trong gió thoảng như điệu cười giòn giã.' }
];

// Comprehensive Standard Radical & Component Name Dictionary (Gốc rễ Bộ thủ Hán tự)
const RADICAL_NAMES_MAP = {
  '亻': { short: 'Bộ Nhân đứng', full: 'Bộ Nhân đứng (người)' },
  '人': { short: 'Bộ Nhân', full: 'Bộ Nhân (người)' },
  '木': { short: 'Bộ Mộc', full: 'Bộ Mộc (cây cối)' },
  '日': { short: 'Bộ Nhật', full: 'Bộ Nhật (mặt trời)' },
  '月': { short: 'Bộ Nguyệt', full: 'Bộ Nguyệt (mặt trăng)' },
  '女': { short: 'Bộ Nữ', full: 'Bộ Nữ (người nữ)' },
  '子': { short: 'Bộ Tử', full: 'Bộ Tử (con cái)' },
  '手': { short: 'Bộ Thủ', full: 'Bộ Thủ (bàn tay)' },
  '扌': { short: 'Bộ Đề thủ', full: 'Bộ Đề thủ (bàn tay)' },
  '目': { short: 'Bộ Mục', full: 'Bộ Mục (con mắt)' },
  '小': { short: 'Bộ Tiểu', full: 'Bộ Tiểu (nhỏ bé)' },
  '大': { short: 'Bộ Đại', full: 'Bộ Đại (to lớn)' },
  '田': { short: 'Bộ Điền', full: 'Bộ Điền (ruộng đất)' },
  '力': { short: 'Bộ Lực', full: 'Bộ Lực (sức mạnh)' },
  '宀': { short: 'Bộ Miên', full: 'Bộ Miên (mái nhà)' },
  '豕': { short: 'Bộ Thỉ', full: 'Bộ Thỉ (con heo/lợn)' },
  '门': { short: 'Bộ Môn', full: 'Bộ Môn (cánh cổng)' },
  '口': { short: 'Bộ Khẩu', full: 'Bộ Khẩu (cái miệng)' },
  '耳': { short: 'Bộ Nhĩ', full: 'Bộ Nhĩ (tai nghe)' },
  '火': { short: 'Bộ Hỏa', full: 'Bộ Hỏa (ngọn lửa)' },
  '灬': { short: 'Bộ Hỏa dưới', full: 'Bộ Hỏa 4 chấm (lửa)' },
  '一': { short: 'Bộ Nhất', full: 'Bộ Nhất (số một)' },
  '上': { short: 'Chữ Thượng', full: 'Chữ Thượng (phía trên)' },
  '下': { short: 'Chữ Hạ', full: 'Chữ Hạ (phía dưới)' },
  '不': { short: 'Chữ Bất', full: 'Chữ Bất (không phải)' },
  '正': { short: 'Chữ Chính', full: 'Chữ Chính (ngay ngắn)' },
  '氵': { short: 'Bộ Thủy', full: 'Bộ Ba chấm thủy (nước)' },
  '水': { short: 'Bộ Thủy', full: 'Bộ Thủy (nước)' },
  '言': { short: 'Bộ Ngôn', full: 'Bộ Ngôn (lời nói)' },
  '讠': { short: 'Bộ Ngôn', full: 'Bộ Ngôn (lời nói)' },
  '舌': { short: 'Bộ Thiệt', full: 'Bộ Thiệt (chiếc lưỡi)' },
  '身': { short: 'Bộ Thân', full: 'Bộ Thân (thân thể)' },
  '寸': { short: 'Bộ Thốn', full: 'Bộ Thốn (tấc tay)' },
  '马': { short: 'Bộ Mã', full: 'Bộ Mã (con ngựa)' },
  '父': { short: 'Bộ Phụ', full: 'Bộ Phụ (người cha)' },
  '巴': { short: 'Chữ Ba', full: 'Chữ Ba (mượn âm bà)' },
  '且': { short: 'Chữ Thả', full: 'Chữ Thả (tấm bia tổ)' },
  '未': { short: 'Chữ Vị', full: 'Chữ Vị (chưa tới)' },
  '乞': { short: 'Chữ Khất', full: 'Chữ Khất (cầu xin)' },
  '青': { short: 'Bộ Thanh', full: 'Bộ Thanh (màu xanh)' },
  '忄': { short: 'Bộ Tâm đứng', full: 'Bộ Tâm đứng (trái tim)' },
  '心': { short: 'Bộ Tâm', full: 'Bộ Tâm (trái tim)' },
  '丁': { short: 'Bộ Đinh', full: 'Bộ Đinh (cái đinh)' },
  '立': { short: 'Bộ Lập', full: 'Bộ Lập (đứng thẳng)' },
  '又': { short: 'Bộ Hựu', full: 'Bộ Hựu (bàn tay phải)' },
  '交': { short: 'Chữ Giao', full: 'Chữ Giao (giao lưu)' },
  '可': { short: 'Chữ Khả', full: 'Chữ Khả (có thể)' },
  '每': { short: 'Chữ Mỗi', full: 'Chữ Mỗi (mỗi một)' },
  '王': { short: 'Bộ Vương', full: 'Bộ Vương / Ngọc (ngọc quý)' },
  '玉': { short: 'Bộ Ngọc', full: 'Bộ Ngọc (viên ngọc)' },
  '元': { short: 'Chữ Nguyên', full: 'Chữ Nguyên (bắt đầu)' },
  '见': { short: 'Bộ Kiến', full: 'Bộ Kiến (trông thấy)' },
  '饣': { short: 'Bộ Thực', full: 'Bộ Thực (thức ăn)' },
  '食': { short: 'Bộ Thực', full: 'Bộ Thực (ăn uống)' },
  '反': { short: 'Chữ Phản', full: 'Chữ Phản (lật lại)' },
  '包': { short: 'Bộ Bao', full: 'Bộ Bao (bao bọc, túi)' },
  '我': { short: 'Chữ Ngã', full: 'Chữ Ngã (bản thân tôi)' },
  '雨': { short: 'Bộ Vũ', full: 'Bộ Vũ (cơn mưa)' },
  '彐': { short: 'Bộ Ký', full: 'Bộ Ký (bàn tay gom)' },
  '⺮': { short: 'Bộ Trúc', full: 'Bộ Trúc (cây tre)' },
  '竹': { short: 'Bộ Trúc', full: 'Bộ Trúc (cây tre)' },
  '毛': { short: 'Bộ Mao', full: 'Bộ Mao (lông thú)' },
  '夭': { short: 'Chữ Yêu', full: 'Chữ Yêu (uốn lượn)' },
  '辶': { short: 'Bộ Quai xước', full: 'Bộ Quai xước (bước đi)' },
  '艹': { short: 'Bộ Thảo', full: 'Bộ Thảo đầu (cỏ cây)' },
  '犭': { short: 'Bộ Khuyển', full: 'Bộ Khuyển (chó, thú vật)' },
  '犬': { short: 'Bộ Khuyển', full: 'Bộ Khuyển (chó săn)' },
  '阝': { short: 'Bộ Phụ/Ấp', full: 'Bộ Phụ / Ấp (gò đất)' },
  '纟': { short: 'Bộ Mịch', full: 'Bộ Mịch (sợi tơ chỉ)' },
  '糸': { short: 'Bộ Mịch', full: 'Bộ Mịch (dây tơ)' },
  '钅': { short: 'Bộ Kim', full: 'Bộ Kim (kim loại, vàng)' },
  '金': { short: 'Bộ Kim', full: 'Bộ Kim (kim khí, vàng)' },
  '土': { short: 'Bộ Thổ', full: 'Bộ Thổ (đất đai)' },
  '石': { short: 'Bộ Thạch', full: 'Bộ Thạch (hòn đá)' },
  '禾': { short: 'Bộ Hòa', full: 'Bộ Hòa (cây lúa)' },
  '虫': { short: 'Bộ Trùng', full: 'Bộ Trùng (sâu bọ)' },
  '鸟': { short: 'Bộ Điểu', full: 'Bộ Điểu (loài chim)' },
  '鱼': { short: 'Bộ Ngư', full: 'Bộ Ngư (con cá)' },
  '足': { short: 'Bộ Túc', full: 'Bộ Túc (bàn chân)' },
  '⻊': { short: 'Bộ Túc', full: 'Bộ Túc (bàn chân)' },
  '页': { short: 'Bộ Hiệt', full: 'Bộ Hiệt (cái đầu, trang)' },
  '贝': { short: 'Bộ Bối', full: 'Bộ Bối (vỏ sò, tiền)' },
  '车': { short: 'Bộ Xa', full: 'Bộ Xa (xe cộ)' },
  '舟': { short: 'Bộ Chu', full: 'Bộ Chu (thuyền bè)' },
  '斤': { short: 'Bộ Cân', full: 'Bộ Cân (cái rìu đốn gỗ)' },
  '弓': { short: 'Bộ Cung', full: 'Bộ Cung (cây cung)' },
  '刀': { short: 'Bộ Đao', full: 'Bộ Đao (con dao)' },
  '刂': { short: 'Bộ Đao đứng', full: 'Bộ Đao đứng (con dao)' },
  '十': { short: 'Bộ Thập', full: 'Bộ Thập (số 10)' },
  '广': { short: 'Bộ Quảng', full: 'Bộ Quảng (mái nhà rộng)' },
  '厂': { short: 'Bộ Hán', full: 'Bộ Hán (vách núi đá)' },
  '尸': { short: 'Bộ Thi', full: 'Bộ Thi (thân xác)' },
  '夕': { short: 'Bộ Tịch', full: 'Bộ Tịch (hoàng hôn)' },
  '文': { short: 'Bộ Văn', full: 'Bộ Văn (văn chương, chữ)' },
  '方': { short: 'Bộ Phương', full: 'Bộ Phương (phương hướng)' },
  '欠': { short: 'Bộ Khiếm', full: 'Bộ Khiếm (khuyết thiếu)' },
  '止': { short: 'Bộ Chỉ', full: 'Bộ Chỉ (dừng lại)' },
  '白': { short: 'Bộ Bạch', full: 'Bộ Bạch (màu trắng)' },
  '穴': { short: 'Bộ Huyệt', full: 'Bộ Huyệt (hang động)' },
  '米': { short: 'Bộ Mễ', full: 'Bộ Mễ (hạt gạo)' },
  '羊': { short: 'Bộ Dương', full: 'Bộ Dương (con dê/cừu)' },
  '⺶': { short: 'Bộ Dương', full: 'Bộ Dương (con dê)' },
  '衣': { short: 'Bộ Y', full: 'Bộ Y (áo quần)' },
  '衤': { short: 'Bộ Y', full: 'Bộ Y (áo quần)' },
  '示': { short: 'Bộ Thị', full: 'Bộ Thị (thần linh cúng tế)' },
  '礻': { short: 'Bộ Thị', full: 'Bộ Thị (thần linh)' },
  '走': { short: 'Bộ Tẩu', full: 'Bộ Tẩu (chạy)' },
  '里': { short: 'Bộ Lý', full: 'Bộ Lý (dặm làng xóm)' },
  '风': { short: 'Bộ Phong', full: 'Bộ Phong (ngọn gió)' },
  '飞': { short: 'Bộ Phi', full: 'Bộ Phi (bay lượn)' },
  '高': { short: 'Bộ Cao', full: 'Bộ Cao (chiều cao)' },
  '黑': { short: 'Bộ Hắc', full: 'Bộ Hắc (màu đen)' }
};

function getRadicalInfo(char) {
  if (RADICAL_NAMES_MAP[char]) {
    return RADICAL_NAMES_MAP[char];
  }
  return {
    short: `Bộ ${char}`,
    full: `Bộ thủ ${char}`
  };
}

class HanziPuzzleGame {
  constructor() {
    this.mode = 'radicals'; // 'radicals' or 'compounds'
    this.hskLevel = 'all';
    this.rawWords = window.CHINESE_WORDS_5000 || [];

    // Game State
    this.score = 0;
    this.streak = 0;
    this.solvedCount = 0;
    this.autoVoice = true;

    // Current Question State
    this.currentQuestion = null;
    this.expectedPieces = []; // Correct piece array
    this.slottedPieces = [];   // Pieces currently placed in slots
    this.trayPieces = [];      // Available pieces in tray

    // DOM Elements
    this.targetMeaning = document.getElementById('pzTargetMeaning');
    this.targetPinyin = document.getElementById('pzTargetPinyin');
    this.targetHsk = document.getElementById('pzTargetHsk');
    this.targetModeTag = document.getElementById('pzTargetModeTag');
    this.slotsContainer = document.getElementById('pzSlotsContainer');
    this.piecesGrid = document.getElementById('pzPiecesGrid');
    this.scoreDisplay = document.getElementById('pzScoreDisplay');
    this.streakDisplay = document.getElementById('pzStreakDisplay');
    this.solvedDisplay = document.getElementById('pzSolvedDisplay');
    this.successModal = document.getElementById('pzSuccessModal');
    this.hskSelect = document.getElementById('pzHskSelect');

    // Synthesizer Audio
    this.audioCtx = null;
    this.chineseVoice = null;
    this.initAudioAndVoice();

    // Canvas Background
    this.bgCanvas = document.getElementById('puzzleBgCanvas');
    this.bgCtx = this.bgCanvas ? this.bgCanvas.getContext('2d') : null;
  }

  init() {
    this.setupBackgroundCanvas();
    this.setupEventListeners();
    this.loadNewQuestion();
  }

  /* ========================================================================
     AUDIO & SPEECH
     ======================================================================== */
  initAudioAndVoice() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    } catch (e) {}

    if ('speechSynthesis' in window) {
      const findVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        this.chineseVoice = voices.find(v => v.lang === 'zh-CN' || v.lang.includes('zh')) || null;
      };
      findVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = findVoice;
      }
    }
  }

  ensureAudio() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, vol = 0.25) {
    if (!this.audioCtx) return;
    try {
      this.ensureAudio();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  playSnapSound() {
    this.playTone(520, 'triangle', 0.1, 0.2);
  }

  playSuccessSound() {
    this.playTone(440, 'sine', 0.1, 0.25);
    setTimeout(() => this.playTone(554.37, 'sine', 0.1, 0.25), 100);
    setTimeout(() => this.playTone(659.25, 'sine', 0.25, 0.3), 200);
  }

  playErrorSound() {
    this.playTone(220, 'sawtooth', 0.18, 0.18);
  }

  speakChinese(text) {
    if (!('speechSynthesis' in window) || !text || !this.autoVoice) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.85;
      if (this.chineseVoice) u.voice = this.chineseVoice;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ========================================================================
     QUESTION GENERATION
     ======================================================================== */
  loadNewQuestion() {
    if (this.successModal) this.successModal.style.display = 'none';

    if (this.mode === 'radicals') {
      this.generateRadicalQuestion();
    } else {
      this.generateCompoundQuestion();
    }

    this.renderGameBoard();
  }

  generateRadicalQuestion() {
    let pool = RADICAL_DECOMPOSITIONS;
    if (this.hskLevel !== 'all') {
      const lvl = parseInt(this.hskLevel, 10);
      const filtered = pool.filter(q => q.level === lvl);
      if (filtered.length > 0) pool = filtered;
    }

    // Pick random question
    const q = pool[Math.floor(Math.random() * pool.length)];
    this.currentQuestion = q;
    this.expectedPieces = [...q.components];

    // Pick 2-3 distractor components from other characters to challenge the player
    const allComponents = [];
    RADICAL_DECOMPOSITIONS.forEach(item => {
      item.components.forEach(c => {
        if (!allComponents.includes(c) && !q.components.includes(c)) {
          allComponents.push(c);
        }
      });
    });

    const distractors = allComponents.sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [...q.components, ...distractors].sort(() => 0.5 - Math.random());

    this.trayPieces = combined.map((char, idx) => {
      const rad = getRadicalInfo(char);
      return {
        id: `p_${idx}_${char}`,
        char,
        tag: rad.short,
        fullName: rad.full
      };
    });
    this.slottedPieces = new Array(this.expectedPieces.length).fill(null);
  }

  generateCompoundQuestion() {
    let pool = this.rawWords.filter(w => w.hanzi && w.hanzi.length >= 2 && w.hanzi.length <= 4);
    if (this.hskLevel !== 'all') {
      const lvl = parseInt(this.hskLevel, 10);
      pool = pool.filter(w => w.level === lvl);
    }
    if (pool.length === 0) pool = this.rawWords.filter(w => w.hanzi && w.hanzi.length >= 2);

    const w = pool[Math.floor(Math.random() * pool.length)];
    const chars = Array.from(w.hanzi);
    this.expectedPieces = chars;

    // Pick 2 random distractor characters from other words
    const otherChars = [];
    for (let i = 0; i < 20; i++) {
      const rw = pool[Math.floor(Math.random() * pool.length)];
      Array.from(rw.hanzi).forEach(c => {
        if (!chars.includes(c) && !otherChars.includes(c)) otherChars.push(c);
      });
    }
    const distractors = otherChars.slice(0, 2);
    const combined = [...chars, ...distractors].sort(() => 0.5 - Math.random());

    this.currentQuestion = {
      hanzi: w.hanzi,
      pinyin: w.pinyin || w.clean,
      level: w.level,
      meaning: w.meaning_vn || w.meaning || '',
      etymology: `💡 Từ ghép HSK ${w.level}: "${w.hanzi}" được tạo thành từ các chữ: ${chars.join(' + ')} mang nghĩa: "${w.meaning_vn || w.meaning}".`
    };

    this.trayPieces = combined.map((char, idx) => ({
      id: `p_${idx}_${char}`,
      char,
      tag: `Chữ ${char}`,
      fullName: `Chữ Hán: ${char}`
    }));
    this.slottedPieces = new Array(this.expectedPieces.length).fill(null);
  }

  /* ========================================================================
     GAME BOARD RENDERING & INTERACTION
     ======================================================================== */
  renderGameBoard() {
    const q = this.currentQuestion;
    this.targetMeaning.textContent = q.meaning;
    this.targetPinyin.textContent = q.pinyin;
    this.targetHsk.textContent = `HSK ${q.level}`;
    this.targetModeTag.textContent = this.mode === 'radicals' ? '🧩 CHIẾT TỰ HÌNH TƯỢNG' : '🔗 GHÉP TỪ HSK';

    // Render Drop Target Slots
    this.slotsContainer.innerHTML = '';
    for (let i = 0; i < this.expectedPieces.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'pz-slot';
      slot.dataset.slotIndex = i;

      const idxHint = document.createElement('span');
      idxHint.className = 'slot-index-hint';
      idxHint.textContent = `Vị trí ${i + 1}`;
      slot.appendChild(idxHint);

      // If slot already has piece
      const piece = this.slottedPieces[i];
      if (piece) {
        slot.classList.add('filled');
        const pieceEl = this.createPieceElement(piece, true, i);
        slot.appendChild(pieceEl);
      }

      // Drag and Drop Listeners for Slot
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-over');
      });

      slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
      });

      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const pieceId = e.dataTransfer.getData('text/plain');
        this.placePieceInSlot(pieceId, i);
      });

      this.slotsContainer.appendChild(slot);
    }

    // Render Draggable Pieces Tray
    this.piecesGrid.innerHTML = '';
    this.trayPieces.forEach(piece => {
      // Only render if not currently in a slot
      const isInSlot = this.slottedPieces.some(p => p && p.id === piece.id);
      if (!isInSlot) {
        const pieceEl = this.createPieceElement(piece, false);
        this.piecesGrid.appendChild(pieceEl);
      }
    });

    // Check Assembly Completion
    this.checkAssembly();
  }

  createPieceElement(piece, isPlaced, slotIdx = -1) {
    const el = document.createElement('div');
    el.className = `pz-piece ${isPlaced ? 'placed' : ''}`;
    el.draggable = !isPlaced;
    el.dataset.pieceId = piece.id;

    el.innerHTML = `
      <span class="piece-char">${piece.char}</span>
      <span class="piece-tag" title="${piece.fullName || piece.tag}">${piece.tag}</span>
    `;

    if (!isPlaced) {
      // Drag events
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', piece.id);
        this.playSnapSound();
      });

      // Click to auto-place in the first open slot
      el.addEventListener('click', () => {
        const emptyIdx = this.slottedPieces.indexOf(null);
        if (emptyIdx !== -1) {
          this.placePieceInSlot(piece.id, emptyIdx);
        }
      });
    } else {
      // Clicking a placed piece removes it back to the tray!
      el.addEventListener('click', () => {
        this.slottedPieces[slotIdx] = null;
        this.playSnapSound();
        this.renderGameBoard();
      });
    }

    return el;
  }

  placePieceInSlot(pieceId, slotIndex) {
    const piece = this.trayPieces.find(p => p.id === pieceId);
    if (!piece) return;

    // If piece was already in another slot, clear that slot
    const prevIdx = this.slottedPieces.findIndex(p => p && p.id === pieceId);
    if (prevIdx !== -1) {
      this.slottedPieces[prevIdx] = null;
    }

    this.slottedPieces[slotIndex] = piece;
    this.playSnapSound();
    this.renderGameBoard();
  }

  resetSlots() {
    this.slottedPieces = new Array(this.expectedPieces.length).fill(null);
    this.playSnapSound();
    this.renderGameBoard();
  }

  /* ========================================================================
     ASSEMBLY VALIDATION & SUCCESS SHOWCASE
     ======================================================================== */
  checkAssembly() {
    // Check if all slots are filled
    const allFilled = this.slottedPieces.every(p => p !== null);
    if (!allFilled) return;

    const assembled = this.slottedPieces.map(p => p.char).join('');
    const expected = this.expectedPieces.join('');

    if (assembled === expected) {
      // SUCCESS!
      this.handleSuccess();
    } else {
      // WRONG ASSEMBLY
      this.playErrorSound();
      // Visual feedback: shake slots
      this.slotsContainer.classList.add('screen-shake');
      setTimeout(() => this.slotsContainer.classList.remove('screen-shake'), 400);
    }
  }

  handleSuccess() {
    this.streak++;
    this.solvedCount++;
    const pts = 100 + (this.streak * 20);
    this.score += pts;

    this.scoreDisplay.textContent = this.score;
    this.streakDisplay.textContent = this.streak;
    this.solvedDisplay.textContent = this.solvedCount;

    this.playSuccessSound();
    this.speakChinese(this.currentQuestion.hanzi);

    // Populate Success Modal Popup (Center of Screen)
    document.getElementById('pzSuccessPts').textContent = pts;
    document.getElementById('pzSuccessHanzi').textContent = this.currentQuestion.hanzi;
    document.getElementById('pzSuccessPinyin').textContent = this.currentQuestion.pinyin;
    document.getElementById('pzSuccessMeaning').textContent = this.currentQuestion.meaning;
    document.getElementById('pzSuccessExplanation').textContent = this.currentQuestion.etymology;

    // Populate Formula Breakdown Box
    const formulaItems = document.getElementById('pzSuccessFormulaItems');
    if (formulaItems) {
      formulaItems.innerHTML = '';
      if (this.mode === 'radicals') {
        const chipsHtml = this.currentQuestion.components.map(c => {
          const info = getRadicalInfo(c);
          return `<div class="formula-chip"><span class="f-char">${c}</span><span class="f-name">${info.full}</span></div>`;
        }).join('<span class="formula-plus">+</span>');

        formulaItems.innerHTML = `${chipsHtml} <span class="formula-equal">➔</span> <div class="formula-chip formula-result"><span class="f-char">${this.currentQuestion.hanzi}</span><span class="f-name">${this.currentQuestion.meaning}</span></div>`;
      } else {
        const chars = Array.from(this.currentQuestion.hanzi);
        const chipsHtml = chars.map(c => {
          const info = getRadicalInfo(c);
          return `<div class="formula-chip"><span class="f-char">${c}</span><span class="f-name">${info.short || `Chữ ${c}`}</span></div>`;
        }).join('<span class="formula-plus">+</span>');

        formulaItems.innerHTML = `${chipsHtml} <span class="formula-equal">➔</span> <div class="formula-chip formula-result"><span class="f-char">${this.currentQuestion.hanzi}</span><span class="f-name">${this.currentQuestion.meaning}</span></div>`;
      }
    }

    if (this.successModal) {
      this.successModal.style.display = 'flex';
    }
  }

  giveHint() {
    // Find the first unfilled slot or incorrect slot
    const firstEmpty = this.slottedPieces.indexOf(null);
    if (firstEmpty !== -1) {
      const correctChar = this.expectedPieces[firstEmpty];
      const matchingPiece = Array.from(this.piecesGrid.children).find(el => {
        return el.querySelector('.piece-char').textContent === correctChar;
      });

      if (matchingPiece) {
        matchingPiece.style.transform = 'scale(1.2)';
        matchingPiece.style.borderColor = '#10b981';
        matchingPiece.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6)';
        this.playTone(600, 'sine', 0.2, 0.25);
        setTimeout(() => {
          matchingPiece.style.transform = '';
          matchingPiece.style.borderColor = '';
          matchingPiece.style.boxShadow = '';
        }, 1200);
      }
    }
  }

  /* ========================================================================
     EVENT LISTENERS & CONTROLS
     ======================================================================== */
  setupEventListeners() {
    // Mode Switchers
    const btnRadicals = document.getElementById('modeRadicalsBtn');
    const btnCompounds = document.getElementById('modeCompoundsBtn');

    btnRadicals.addEventListener('click', () => {
      if (this.mode === 'radicals') return;
      this.mode = 'radicals';
      btnRadicals.classList.add('active');
      btnCompounds.classList.remove('active');
      this.streak = 0;
      this.streakDisplay.textContent = '0';
      this.loadNewQuestion();
    });

    btnCompounds.addEventListener('click', () => {
      if (this.mode === 'compounds') return;
      this.mode = 'compounds';
      btnCompounds.classList.add('active');
      btnRadicals.classList.remove('active');
      this.streak = 0;
      this.streakDisplay.textContent = '0';
      this.loadNewQuestion();
    });

    // Level Filter
    this.hskSelect.addEventListener('change', () => {
      this.hskLevel = this.hskSelect.value;
      this.loadNewQuestion();
    });

    // Reset Slots Button
    document.getElementById('pzResetSlotsBtn').addEventListener('click', () => this.resetSlots());

    // Next Question Button on Success Modal
    const nextBtn = document.getElementById('pzNextQuestionBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.loadNewQuestion());
    }

    // Close button on Success Modal
    const closeSuccessBtn = document.getElementById('pzCloseSuccessBtn');
    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener('click', () => this.loadNewQuestion());
    }

    // Modal background click to advance
    if (this.successModal) {
      this.successModal.addEventListener('click', (e) => {
        if (e.target === this.successModal) {
          this.loadNewQuestion();
        }
      });
    }

    // Replay Voice button inside Success Modal
    const successVoiceBtn = document.getElementById('pzSuccessVoiceBtn');
    if (successVoiceBtn) {
      successVoiceBtn.addEventListener('click', () => {
        if (this.currentQuestion) this.speakChinese(this.currentQuestion.hanzi);
      });
    }

    // Global Keydown Handler: Enter / Space to advance when Success Modal is open
    window.addEventListener('keydown', (e) => {
      if (this.successModal && this.successModal.style.display === 'flex') {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          this.loadNewQuestion();
        }
      }
    });

    // Tool Actions
    document.getElementById('pzHintBtn').addEventListener('click', () => this.giveHint());
    document.getElementById('pzSkipBtn').addEventListener('click', () => {
      this.streak = 0;
      this.streakDisplay.textContent = '0';
      this.loadNewQuestion();
    });

    // Speaker on target
    document.getElementById('pzTargetSpeakBtn').addEventListener('click', () => {
      if (this.currentQuestion) this.speakChinese(this.currentQuestion.hanzi);
    });

    // Voice Auto-toggle
    const voiceBtn = document.getElementById('pzVoiceToggle');
    voiceBtn.addEventListener('click', () => {
      this.autoVoice = !this.autoVoice;
      voiceBtn.classList.toggle('active', this.autoVoice);
      voiceBtn.querySelector('.btn-txt').textContent = this.autoVoice ? 'GIỌNG ĐỌC: BẬT' : 'GIỌNG ĐỌC: TẮT';
    });

    // Help Modal
    const helpModal = document.getElementById('pzHelpModal');
    document.getElementById('pzHelpBtn').addEventListener('click', () => {
      helpModal.style.display = 'flex';
    });
    document.getElementById('pzCloseHelpBtn').addEventListener('click', () => {
      helpModal.style.display = 'none';
    });
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) helpModal.style.display = 'none';
    });
  }

  /* ========================================================================
     BACKGROUND CANVAS
     ======================================================================== */
  setupBackgroundCanvas() {
    if (!this.bgCanvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.bgCanvas.width = w;
    this.bgCanvas.height = h;

    const colors = ['rgba(255, 182, 193, 0.4)', 'rgba(186, 230, 253, 0.4)', 'rgba(254, 240, 138, 0.4)', 'rgba(233, 213, 255, 0.4)'];
    this.bgParticles = [];
    for (let i = 0; i < 30; i++) {
      this.bgParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 8 + Math.random() * 18,
        speed: 14 + Math.random() * 26,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      this.drawBackground();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  drawBackground() {
    const ctx = this.bgCtx;
    const w = this.bgCanvas.width;
    const h = this.bgCanvas.height;

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#7dd3fc');
    skyGrad.addColorStop(0.4, '#bae6fd');
    skyGrad.addColorStop(0.8, '#fbcfe8');
    skyGrad.addColorStop(1, '#fef08a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < this.bgParticles.length; i++) {
      const p = this.bgParticles[i];
      p.y -= p.speed * 0.016;
      if (p.y < -30) {
        p.y = h + 20;
        p.x = Math.random() * w;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fill();
    }
  }
}

// Global Launch
window.addEventListener('DOMContentLoaded', () => {
  window.puzzleGame = new HanziPuzzleGame();
  window.puzzleGame.init();
});
