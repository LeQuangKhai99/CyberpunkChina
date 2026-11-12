/**
 * PINYIN POP! 🎵 - TONE MASTER & MANDARIN PHONETICS LAB ENGINE
 * Real-time Tone Ear Challenge, Audio Reflexes & 21 Initials / 36 Finals Lab
 */

// 21 Standard Initials (Thanh Mẫu) Database with Articulation details & pure call-names
const INITIALS_DATA = [
  {
    group: 'Âm Hai Môi (Labial)',
    desc: 'Hai môi khép lại rồi bật mở tạo luồng hơi',
    items: [
      { letter: 'b', vi: 'b (như "p" nhẹ, không bật hơi)', ipa: '[p]', aspirated: false, speak: '玻', tip: 'Hai môi khép chặt, không bật luồng khí mạnh.' },
      { letter: 'p', vi: 'p (Bật hơi rất mạnh)', ipa: '[pʰ]', aspirated: true, speak: '坡', tip: 'Khép môi, nén khí rồi bật hơi thật mạnh ra ngoài.' },
      { letter: 'm', vi: 'm (âm mũi, giống "m" tiếng Việt)', ipa: '[m]', aspirated: false, speak: '摸', tip: 'Hai môi khép lại, luồng hơi thoát ra từ khoang mũi.' }
    ]
  },
  {
    group: 'Âm Môi Răng (Labiodental)',
    desc: 'Răng trên chạm nhẹ môi dưới',
    items: [
      { letter: 'f', vi: 'ph (giống "ph" tiếng Việt)', ipa: '[f]', aspirated: false, speak: '佛', tip: 'Răng cửa hàm trên chạm nhẹ vào môi dưới, đẩy luồng hơi ma sát.' }
    ]
  },
  {
    group: 'Âm Đầu Lưỡi Giữa (Alveolar)',
    desc: 'Đầu lưỡi chạm vào lợi trên',
    items: [
      { letter: 'd', vi: 'đ (như "t" không bật hơi)', ipa: '[t]', aspirated: false, speak: '得', tip: 'Đầu lưỡi áp sát vào chân răng trên rồi hạ xuống, không bật hơi.' },
      { letter: 't', vi: 'th (Bật hơi mạnh, như "th")', ipa: '[tʰ]', aspirated: true, speak: '特', tip: 'Đầu lưỡi áp sát chân răng trên rồi bật luồng hơi mạnh ra.' },
      { letter: 'n', vi: 'n (giống "n" tiếng Việt)', ipa: '[n]', aspirated: false, speak: '讷', tip: 'Đầu lưỡi chạm lợi trên, hơi thoát qua khoang mũi.' },
      { letter: 'l', vi: 'l (giống "l" tiếng Việt)', ipa: '[l]', aspirated: false, speak: '勒', tip: 'Đầu lưỡi chạm lợi trên, luồng hơi thoát ra hai bên mép lưỡi.' }
    ]
  },
  {
    group: 'Âm Gốc Lưỡi (Velar)',
    desc: 'Gốc lưỡi nâng lên chạm ngạc mềm',
    items: [
      { letter: 'g', vi: 'c/k (như "c" không bật hơi)', ipa: '[k]', aspirated: false, speak: '哥', tip: 'Cuống lưỡi nâng lên chạm vòm họng mềm, mở ra dứt khoát không hơi.' },
      { letter: 'k', vi: 'kh (Bật hơi mạnh từ cổ họng)', ipa: '[kʰ]', aspirated: true, speak: '科', tip: 'Cuống lưỡi nén hơi rồi bật luồng khí mạnh mẽ ra ngoài.' },
      { letter: 'h', vi: 'h (hơi pha giữa "h" và "kh")', ipa: '[x]', aspirated: false, speak: '喝', tip: 'Khoảng cách giữa gốc lưỡi và vòm mềm hẹp lại, hơi ma sát nhẹ nhàng.' }
    ]
  },
  {
    group: 'Âm Mặt Lưỡi (Palatal)',
    desc: 'Mặt trước của lưỡi áp sát ngạc cứng',
    items: [
      { letter: 'j', vi: 'ch (nhẹ, môi mỉm cười)', ipa: '[tɕ]', aspirated: false, speak: '基', tip: 'Mặt lưỡi áp sát vòm miệng cứng, khóe miệng kéo sang hai bên.' },
      { letter: 'q', vi: 'ch (Bật hơi sắc bén)', ipa: '[tɕʰ]', aspirated: true, speak: '欺', tip: 'Vị trí giống chữ j nhưng bật luồng hơi cực kỳ sắc và mạnh.' },
      { letter: 'x', vi: 'x (xát nhẹ, mỉm cười)', ipa: '[ɕ]', aspirated: false, speak: '希', tip: 'Mặt lưỡi gần vòm miệng, luồng hơi thoát ra êm mượt.' }
    ]
  },
  {
    group: 'Âm Đầu Lưỡi Quặt / Cuốn Lưỡi (Retroflex)',
    desc: 'Đầu lưỡi cong lên chạm ngạc cứng',
    items: [
      { letter: 'zh', vi: 'tr (uốn lưỡi, không bật hơi)', ipa: '[ʈʂ]', aspirated: false, speak: '知', tip: 'Đầu lưỡi cong lên chạm vòm miệng cứng, phát âm chuẩn âm đầu zh.' },
      { letter: 'ch', vi: 'tr (Uốn lưỡi + Bật hơi mạnh)', ipa: '[ʈʂʰ]', aspirated: true, speak: '吃', tip: 'Vừa uốn cong lưỡi vừa khạc luồng hơi mạnh ra ngoài.' },
      { letter: 'sh', vi: 's (uốn lưỡi ma sát mạnh)', ipa: '[ʂ]', aspirated: false, speak: '诗', tip: 'Đầu lưỡi cong lên gần ngạc cứng, luồng hơi cọ xát thoát ra.' },
      { letter: 'r', vi: 'r (uốn lưỡi rung nhẹ giọng)', ipa: '[ʐ]', aspirated: false, speak: '日', tip: 'Đầu lưỡi cong lên, dây thanh âm rung nhẹ khi phát âm.' }
    ]
  },
  {
    group: 'Âm Đầu Lưỡi Trước (Dental Sibilant)',
    desc: 'Đầu lưỡi đặt sau răng cửa dưới hoặc chạm răng trên',
    items: [
      { letter: 'z', vi: 'd/z (thẳng lưỡi, không bật hơi)', ipa: '[ts]', aspirated: false, speak: '资', tip: 'Đầu lưỡi chạm mặt sau răng cửa trên rồi hạ xuống nhẹ nhàng.' },
      { letter: 'c', vi: 'x (Thẳng lưỡi + Bật hơi mạnh)', ipa: '[tsʰ]', aspirated: true, speak: '雌', tip: 'Đầu lưỡi nén chặt sau răng rồi bật luồng hơi xì mạnh ra.' },
      { letter: 's', vi: 's (xát thẳng lưỡi)', ipa: '[s]', aspirated: false, speak: '思', tip: 'Đầu lưỡi để gần răng cửa trên, luồng hơi xì êm ái.' }
    ]
  },
  {
    group: 'Phụ Âm Đặc Biệt (Semi-vowels)',
    desc: 'Đóng vai trò mở đầu âm tiết',
    items: [
      { letter: 'y', vi: 'd/i (nguyên âm mở)', ipa: '[j]', aspirated: false, speak: '衣', tip: 'Phát âm tương tự âm "i" kéo dài.' },
      { letter: 'w', vi: 'qu/u (môi tròn)', ipa: '[w]', aspirated: false, speak: '乌', tip: 'Môi tròn chúm lại, tương tự âm "u/o".' }
    ]
  }
];

// 36 Standard Finals (Vận Mẫu) Database with pure zero-initial Hanzi phonetic mapping (NO extraneous consonants)
const FINALS_DATA = [
  {
    group: 'Vận Mẫu Đơn (Simple Finals)',
    items: [
      { base: 'a', vi: 'a', tones: [{ text: 'ā', hanzi: '阿' }, { text: 'á', hanzi: '啊' }, { text: 'ǎ', hanzi: '啊' }, { text: 'à', hanzi: '啊' }] },
      { base: 'o', vi: 'ô / o', tones: [{ text: 'ō', hanzi: '噢' }, { text: 'ó', hanzi: '哦' }, { text: 'ǒ', hanzi: '哦' }, { text: 'ò', hanzi: '噢' }] },
      { base: 'e', vi: 'ưa / ơ', tones: [{ text: 'ē', hanzi: '婀' }, { text: 'é', hanzi: '鹅' }, { text: 'ě', hanzi: '恶' }, { text: 'è', hanzi: '饿' }] },
      { base: 'i', vi: 'i (hoặc ư)', tones: [{ text: 'ī', hanzi: '衣' }, { text: 'í', hanzi: '移' }, { text: 'ǐ', hanzi: '椅' }, { text: 'ì', hanzi: '意' }] },
      { base: 'u', vi: 'u', tones: [{ text: 'ū', hanzi: '乌' }, { text: 'ú', hanzi: '无' }, { text: 'ǔ', hanzi: '五' }, { text: 'ù', hanzi: '物' }] },
      { base: 'ü', vi: 'uy (tròn môi)', tones: [{ text: 'ǖ', hanzi: '迂' }, { text: 'ǘ', hanzi: '鱼' }, { text: 'ǚ', hanzi: '雨' }, { text: 'ǜ', hanzi: '玉' }] }
    ]
  },
  {
    group: 'Vận Mẫu Kép (Compound Finals)',
    items: [
      { base: 'ai', vi: 'ai', tones: [{ text: 'āi', hanzi: '哀' }, { text: 'ái', hanzi: '癌' }, { text: 'ǎi', hanzi: '矮' }, { text: 'ài', hanzi: '爱' }] },
      { base: 'ei', vi: 'ây', tones: [{ text: 'ēi', hanzi: '诶' }, { text: 'éi', hanzi: '诶' }, { text: 'ěi', hanzi: '诶' }, { text: 'èi', hanzi: '诶' }] },
      { base: 'ao', vi: 'ao', tones: [{ text: 'āo', hanzi: '凹' }, { text: 'áo', hanzi: '熬' }, { text: 'ǎo', hanzi: '袄' }, { text: 'ào', hanzi: '傲' }] },
      { base: 'ou', vi: 'âu', tones: [{ text: 'ōu', hanzi: '欧' }, { text: 'óu', hanzi: '欧' }, { text: 'ǒu', hanzi: '偶' }, { text: 'òu', hanzi: '沤' }] },
      { base: 'ia', vi: 'ia', tones: [{ text: 'iā', hanzi: '鸭' }, { text: 'iá', hanzi: '牙' }, { text: 'iǎ', hanzi: '哑' }, { text: 'ià', hanzi: '亚' }] },
      { base: 'ie', vi: 'iê', tones: [{ text: 'iē', hanzi: '椰' }, { text: 'ié', hanzi: '爷' }, { text: 'iě', hanzi: '也' }, { text: 'iè', hanzi: '夜' }] },
      { base: 'ua', vi: 'oa', tones: [{ text: 'uā', hanzi: '蛙' }, { text: 'uá', hanzi: '娃' }, { text: 'uǎ', hanzi: '瓦' }, { text: 'uà', hanzi: '袜' }] },
      { base: 'uo', vi: 'uô', tones: [{ text: 'uō', hanzi: '窝' }, { text: 'uó', hanzi: '窝' }, { text: 'uǒ', hanzi: '我' }, { text: 'uò', hanzi: '握' }] },
      { base: 'üe', vi: 'uyê', tones: [{ text: 'üē', hanzi: '约' }, { text: 'üé', hanzi: '约' }, { text: 'üě', hanzi: '约' }, { text: 'üè', hanzi: '月' }] },
      { base: 'iao', vi: 'ieo', tones: [{ text: 'iāo', hanzi: '腰' }, { text: 'iáo', hanzi: '摇' }, { text: 'iǎo', hanzi: '咬' }, { text: 'iào', hanzi: '要' }] },
      { base: 'iou (iu)', vi: 'yêu', tones: [{ text: 'iū', hanzi: '优' }, { text: 'iú', hanzi: '油' }, { text: 'iǔ', hanzi: '有' }, { text: 'iù', hanzi: '又' }] },
      { base: 'uai', vi: 'oai', tones: [{ text: 'uāi', hanzi: '歪' }, { text: 'uái', hanzi: '歪' }, { text: 'uǎi', hanzi: '歪' }, { text: 'uài', hanzi: '外' }] },
      { base: 'uei (ui)', vi: 'uây', tones: [{ text: 'uī', hanzi: '微' }, { text: 'uí', hanzi: '为' }, { text: 'uǐ', hanzi: '伟' }, { text: 'uì', hanzi: '位' }] }
    ]
  },
  {
    group: 'Vận Mẫu Mũi (Nasal Finals)',
    items: [
      { base: 'an', vi: 'an', tones: [{ text: 'ān', hanzi: '安' }, { text: 'án', hanzi: '安' }, { text: 'ǎn', hanzi: '俺' }, { text: 'àn', hanzi: '暗' }] },
      { base: 'en', vi: 'ơn/ân', tones: [{ text: 'ēn', hanzi: '恩' }, { text: 'én', hanzi: '恩' }, { text: 'ěn', hanzi: '恩' }, { text: 'èn', hanzi: '摁' }] },
      { base: 'in', vi: 'in', tones: [{ text: 'īn', hanzi: '音' }, { text: 'ín', hanzi: '银' }, { text: 'ǐn', hanzi: '引' }, { text: 'ìn', hanzi: '印' }] },
      { base: 'ün', vi: 'uyn', tones: [{ text: 'ǖn', hanzi: '晕' }, { text: 'ǘn', hanzi: '云' }, { text: 'ǚn', hanzi: '允' }, { text: 'ǜn', hanzi: '运' }] },
      { base: 'ian', vi: 'ien', tones: [{ text: 'iān', hanzi: '烟' }, { text: 'ián', hanzi: '言' }, { text: 'iǎn', hanzi: '眼' }, { text: 'iàn', hanzi: '燕' }] },
      { base: 'uan', vi: 'oan', tones: [{ text: 'uān', hanzi: '湾' }, { text: 'uán', hanzi: '完' }, { text: 'uǎn', hanzi: '晚' }, { text: 'uàn', hanzi: '万' }] },
      { base: 'üan', vi: 'uyên', tones: [{ text: 'üān', hanzi: '冤' }, { text: 'üán', hanzi: '元' }, { text: 'üǎn', hanzi: '远' }, { text: 'üàn', hanzi: '院' }] },
      { base: 'uen (un)', vi: 'uân', tones: [{ text: 'ūn', hanzi: '温' }, { text: 'ún', hanzi: '文' }, { text: 'ǔn', hanzi: '稳' }, { text: 'ùn', hanzi: '问' }] },
      { base: 'ang', vi: 'ang', tones: [{ text: 'āng', hanzi: '肮' }, { text: 'áng', hanzi: '昂' }, { text: 'ǎng', hanzi: '昂' }, { text: 'àng', hanzi: '盎' }] },
      { base: 'eng', vi: 'âng', tones: [{ text: 'ēng', hanzi: '鞥' }, { text: 'éng', hanzi: '鞥' }, { text: 'ěng', hanzi: '鞥' }, { text: 'èng', hanzi: '鞥' }] },
      { base: 'ing', vi: 'inh', tones: [{ text: 'īng', hanzi: '英' }, { text: 'íng', hanzi: '迎' }, { text: 'ǐng', hanzi: '影' }, { text: 'ìng', hanzi: '硬' }] },
      { base: 'ong', vi: 'ung', tones: [{ text: 'ōng', hanzi: '东', tip: 'dōng (东 - đông)' }, { text: 'óng', hanzi: '红', tip: 'hóng (红 - hồng/đỏ)' }, { text: 'ǒng', hanzi: '懂', tip: 'dǒng (懂 - hiểu)' }, { text: 'òng', hanzi: '动', tip: 'dòng (动 - cử động)' }] },
      { base: 'iang', vi: 'iang (hoặc ương)', tones: [{ text: 'iāng', hanzi: '香', tip: 'xiāng (香 - hương/thơm)' }, { text: 'iáng', hanzi: '详', tip: 'xiáng (详 - tường tận)' }, { text: 'iǎng', hanzi: '想', tip: 'xiǎng (想 - tưởng/nhớ)' }, { text: 'iàng', hanzi: '像', tip: 'xiàng (像 - giống/tượng)' }] },
      { base: 'uang', vi: 'oang', tones: [{ text: 'uāng', hanzi: '汪' }, { text: 'uáng', hanzi: '王' }, { text: 'uǎng', hanzi: '网' }, { text: 'uàng', hanzi: '望' }] },
      { base: 'ueng', vi: 'uâng (độc lập: weng)', tones: [{ text: 'uēng', hanzi: '翁', tip: 'wēng (翁 - ông lão / 嗡 tiếng vo ve)' }, { text: 'uéng', hanzi: '翁', tip: 'wéng (trong tiếng Trung ít dùng thanh 2)' }, { text: 'uěng', hanzi: '蓊', tip: 'wěng (蓊 - rậm rạp)' }, { text: 'uèng', hanzi: '瓮', tip: 'wèng (瓮 - hũ sành/vò sành)' }] },
      { base: 'iong', vi: 'i-ung', tones: [{ text: 'iōng', hanzi: '雍' }, { text: 'ióng', hanzi: '雍' }, { text: 'iǒng', hanzi: '勇' }, { text: 'iòng', hanzi: '用' }] }
    ]
  },
  {
    group: 'Vận Mẫu Cuốn Lưỡi (Retroflex Final)',
    items: [
      { base: 'er', vi: 'ơ-r (uốn lưỡi)', tones: [{ text: 'ēr', hanzi: '儿' }, { text: 'ér', hanzi: '儿' }, { text: 'ěr', hanzi: '耳' }, { text: 'èr', hanzi: '二' }] }
    ]
  }
];

// Curated Minimal Pairs (Đối lập thanh điệu phổ biến nhất)
const MINIMAL_PAIRS = [
  {
    options: [
      { hanzi: '买', pinyin: 'mǎi', tone: 3, meaning: 'mua' },
      { hanzi: '卖', pinyin: 'mài', tone: 4, meaning: 'bán' }
    ]
  },
  {
    options: [
      { hanzi: '十', pinyin: 'shí', tone: 2, meaning: 'số 10' },
      { hanzi: '是', pinyin: 'shì', tone: 4, meaning: 'là, phải' }
    ]
  },
  {
    options: [
      { hanzi: '汤', pinyin: 'tāng', tone: 1, meaning: 'canh, súp' },
      { hanzi: '糖', pinyin: 'táng', tone: 2, meaning: 'kẹo, đường' }
    ]
  },
  {
    options: [
      { hanzi: '练习', pinyin: 'liàn', tone: 4, meaning: 'luyện tập' },
      { hanzi: '脸', pinyin: 'liǎn', tone: 3, meaning: 'khuôn mặt' }
    ]
  },
  {
    options: [
      { hanzi: '问', pinyin: 'wèn', tone: 4, meaning: 'hỏi' },
      { hanzi: '闻', pinyin: 'wén', tone: 2, meaning: 'nghe / ngửi' }
    ]
  },
  {
    options: [
      { hanzi: '杯', pinyin: 'bēi', tone: 1, meaning: 'cái cốc/ly' },
      { hanzi: '被', pinyin: 'bèi', tone: 4, meaning: 'bị / cái chăn' }
    ]
  },
  {
    options: [
      { hanzi: '妈', pinyin: 'mā', tone: 1, meaning: 'người mẹ' },
      { hanzi: '麻', pinyin: 'má', tone: 2, meaning: 'cây gai / tê' },
      { hanzi: '马', pinyin: 'mǎ', tone: 3, meaning: 'con ngựa' },
      { hanzi: '骂', pinyin: 'mà', tone: 4, meaning: 'mắng chửi' }
    ]
  },
  {
    options: [
      { hanzi: '巴', pinyin: 'bā', tone: 1, meaning: 'mong ước' },
      { hanzi: '拔', pinyin: 'bá', tone: 2, meaning: 'nhổ lên' },
      { hanzi: '把', pinyin: 'bǎ', tone: 3, meaning: 'nắm lấy' },
      { hanzi: '爸', pinyin: 'bà', tone: 4, meaning: 'người cha' }
    ]
  },
  {
    options: [
      { hanzi: '温', pinyin: 'wēn', tone: 1, meaning: 'ấm áp' },
      { hanzi: '文', pinyin: 'wén', tone: 2, meaning: 'văn hóa' },
      { hanzi: '吻', pinyin: 'wěn', tone: 3, meaning: 'nụ hôn' },
      { hanzi: '问', pinyin: 'wèn', tone: 4, meaning: 'hỏi han' }
    ]
  },
  {
    options: [
      { hanzi: '衣', pinyin: 'yī', tone: 1, meaning: 'quần áo' },
      { hanzi: '移', pinyin: 'yí', tone: 2, meaning: 'di chuyển' },
      { hanzi: '椅', pinyin: 'yǐ', tone: 3, meaning: 'cái ghế' },
      { hanzi: '意', pinyin: 'yì', tone: 4, meaning: 'ý nghĩa' }
    ]
  },
  {
    options: [
      { hanzi: '搭', pinyin: 'dā', tone: 1, meaning: 'dựng lên, đi nhờ xe' },
      { hanzi: '答', pinyin: 'dá', tone: 2, meaning: 'trả lời' },
      { hanzi: '打', pinyin: 'dǎ', tone: 3, meaning: 'đánh, gõ' },
      { hanzi: '大', pinyin: 'dà', tone: 4, meaning: 'to lớn' }
    ]
  },
  {
    options: [
      { hanzi: '期', pinyin: 'qī', tone: 1, meaning: 'kỳ hạn' },
      { hanzi: '骑', pinyin: 'qí', tone: 2, meaning: 'cưỡi (xe/ngựa)' },
      { hanzi: '起', pinyin: 'qǐ', tone: 3, meaning: 'dậy, bắt đầu' },
      { hanzi: '气', pinyin: 'qì', tone: 4, meaning: 'không khí' }
    ]
  },
  {
    options: [
      { hanzi: '师', pinyin: 'shī', tone: 1, meaning: 'thầy giáo, sư phụ' },
      { hanzi: '十', pinyin: 'shí', tone: 2, meaning: 'số 10' },
      { hanzi: '史', pinyin: 'shǐ', tone: 3, meaning: 'lịch sử' },
      { hanzi: '是', pinyin: 'shì', tone: 4, meaning: 'là, phải' }
    ]
  },
  {
    options: [
      { hanzi: '包', pinyin: 'bāo', tone: 1, meaning: 'cái túi, bao' },
      { hanzi: '雹', pinyin: 'báo', tone: 2, meaning: 'mưa đá' },
      { hanzi: '饱', pinyin: 'bǎo', tone: 3, meaning: 'no bụng' },
      { hanzi: '报', pinyin: 'bào', tone: 4, meaning: 'báo cáo, tờ báo' }
    ]
  },
  {
    options: [
      { hanzi: '方', pinyin: 'fāng', tone: 1, meaning: 'hình vuông, hướng' },
      { hanzi: '房', pinyin: 'fáng', tone: 2, meaning: 'căn phòng, nhà' },
      { hanzi: '仿', pinyin: 'fǎng', tone: 3, meaning: 'mô phỏng, bắt chước' },
      { hanzi: '放', pinyin: 'fàng', tone: 4, meaning: 'buông, thả, đặt' }
    ]
  },
  {
    options: [
      { hanzi: '烟', pinyin: 'yān', tone: 1, meaning: 'khói, thuốc lá' },
      { hanzi: '言', pinyin: 'yán', tone: 2, meaning: 'lời nói, ngôn ngữ' },
      { hanzi: '眼', pinyin: 'yǎn', tone: 3, meaning: 'con mắt' },
      { hanzi: '燕', pinyin: 'yàn', tone: 4, meaning: 'chim yến' }
    ]
  },
  {
    options: [
      { hanzi: '波', pinyin: 'bō', tone: 1, meaning: 'làn sóng' },
      { hanzi: '博', pinyin: 'bó', tone: 2, meaning: 'bác học, uyên bác' },
      { hanzi: '跛', pinyin: 'bǒ', tone: 3, meaning: 'khập khiễng, què' },
      { hanzi: '破', pinyin: 'pò', tone: 4, meaning: 'rách, vỡ' }
    ]
  },
  {
    options: [
      { hanzi: '机', pinyin: 'jī', tone: 1, meaning: 'máy móc, cơ hội' },
      { hanzi: '极', pinyin: 'jí', tone: 2, meaning: 'cực kỳ' },
      { hanzi: '几', pinyin: 'jǐ', tone: 3, meaning: 'mấy, vài' },
      { hanzi: '记', pinyin: 'jì', tone: 4, meaning: 'ghi nhớ, ký ức' }
    ]
  },
  {
    options: [
      { hanzi: '知', pinyin: 'zhī', tone: 1, meaning: 'biết, tri thức' },
      { hanzi: '直', pinyin: 'zhí', tone: 2, meaning: 'thẳng, trực tiếp' },
      { hanzi: '指', pinyin: 'zhǐ', tone: 3, meaning: 'ngón tay, chỉ dẫn' },
      { hanzi: '志', pinyin: 'zhì', tone: 4, meaning: 'chí hướng, ý chí' }
    ]
  },
  {
    options: [
      { hanzi: '通', pinyin: 'tōng', tone: 1, meaning: 'thông qua' },
      { hanzi: '同', pinyin: 'tóng', tone: 2, meaning: 'cùng nhau, đồng dạng' },
      { hanzi: '统', pinyin: 'tǒng', tone: 3, meaning: 'thống nhất, hệ thống' },
      { hanzi: '痛', pinyin: 'tòng', tone: 4, meaning: 'đau đớn' }
    ]
  },
  {
    options: [
      { hanzi: '关', pinyin: 'guān', tone: 1, meaning: 'đóng, quan hệ' },
      { hanzi: '管', pinyin: 'guǎn', tone: 3, meaning: 'quản lý, ống dẫn' },
      { hanzi: '惯', pinyin: 'guàn', tone: 4, meaning: 'thói quen' }
    ]
  },
  {
    options: [
      { hanzi: '新', pinyin: 'xīn', tone: 1, meaning: 'mới mẻ' },
      { hanzi: '寻', pinyin: 'xún', tone: 2, meaning: 'tìm kiếm' },
      { hanzi: '信', pinyin: 'xìn', tone: 4, meaning: 'bức thư, tin tưởng' }
    ]
  }
];

// Bộ từ vựng bổ sung chuyên biệt cho các âm đặc thù (như vận mẫu ueng độc lập viết là weng)
const PHONETIC_SUPPLEMENT_WORDS = [
  { id: 9801, hanzi: '富翁', pinyin: 'fù wēng', clean: 'fuweng', spaced: 'fu weng', num: 'fu4weng1', level: 5, meaning: 'rich person; millionaire; tycoon', meaning_vn: 'phú ông; triệu phú; người giàu có' },
  { id: 9802, hanzi: '老翁', pinyin: 'lǎo wēng', clean: 'laoweng', spaced: 'lao weng', num: 'lao3weng1', level: 4, meaning: 'old man; elderly gentleman', meaning_vn: 'ông lão; cụ già' },
  { id: 9803, hanzi: '嗡嗡', pinyin: 'wēng wēng', clean: 'wengweng', spaced: 'weng weng', num: 'weng1weng1', level: 3, meaning: 'buzz; hum (sound of bees, insects)', meaning_vn: 'tiếng vo ve (tiếng ong kêu, máy móc)' },
  { id: 9804, hanzi: '瓮', pinyin: 'wèng', clean: 'weng', spaced: 'weng', num: 'weng4', level: 5, meaning: 'earthen jar; urn; large pot', meaning_vn: 'cái vò sành; chum; hũ đựng nước' },
  { id: 9805, hanzi: '塞翁失马', pinyin: 'sài wēng shī mǎ', clean: 'saiwengshima', spaced: 'sai weng shi ma', num: 'sai4weng1shi1ma3', level: 6, meaning: 'the old man loses his horse (blessing in disguise)', meaning_vn: 'Tái ông thất mã (Họa may trong phúc, phúc trong họa)' },
  { id: 9806, hanzi: '渔翁', pinyin: 'yú wēng', clean: 'yuweng', spaced: 'yu weng', num: 'yu2weng1', level: 5, meaning: 'fisherman; old angler', meaning_vn: 'ngư ông; ông lão đánh cá' },
  { id: 9807, hanzi: '不倒翁', pinyin: 'bù dǎo wēng', clean: 'budaoweng', spaced: 'bu dao weng', num: 'bu4dao3weng1', level: 4, meaning: 'roly-poly toy; tumbler', meaning_vn: 'con lật đật' },
  { id: 9808, hanzi: '瓮城', pinyin: 'wèng chéng', clean: 'wengcheng', spaced: 'weng cheng', num: 'weng4cheng2', level: 6, meaning: 'barbican; crescent gate in city wall', meaning_vn: 'thành quách hình bán nguyệt bảo vệ cổng thành' }
];

// Dữ liệu thử thách luyện tai phân biệt Thanh Mẫu (Initials Drill)
const INITIALS_DRILL_DATA = [
  // --- 1. ÂM HAI MÔI (b, p, m) ---
  {
    groupKey: 'labial',
    groupName: 'Âm Hai Môi (b / p / m)',
    desc: 'Phân biệt b (không bật hơi), p (bật hơi cực mạnh) và m (âm mũi)',
    maskedDisplay: '[ ? ] + ā',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM HAI MÔI [b] / [p] / [m]:',
    options: [
      { hanzi: '八', pinyin: 'bā', phoneme: 'b', feature: 'Hai môi • Không bật hơi', badgeType: 'unasp', meaning: 'số 8', tip: 'bā: Hai môi khép nhẹ rồi mở, không phóng luồng khí mạnh (như "p" nhẹ tiếng Việt).' },
      { hanzi: '趴', pinyin: 'pā', phoneme: 'p', feature: 'Hai môi • Bật hơi mạnh', badgeType: 'asp', meaning: 'nằm sấp', tip: 'pā: Hai môi mím chặt nén khí, rồi bật luồng hơi cực mạnh ra ngoài.' },
      { hanzi: '妈', pinyin: 'mā', phoneme: 'm', feature: 'Hai môi • Âm mũi', badgeType: 'nasal', meaning: 'người mẹ', tip: 'mā: Hai môi khép lại, luồng hơi thoát ra từ khoang mũi, dây thanh rung.' }
    ]
  },
  {
    groupKey: 'labial',
    groupName: 'Âm Hai Môi (b / p / m)',
    desc: 'Phân biệt b, p, m với vần -i',
    maskedDisplay: '[ ? ] + ǐ',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM HAI MÔI [b] / [p] / [m]:',
    options: [
      { hanzi: '笔', pinyin: 'bǐ', phoneme: 'b', feature: 'Hai môi • Không bật hơi', badgeType: 'unasp', meaning: 'cái bút', tip: 'bǐ: Đầu môi khép mở êm dịu, không có luồng hơi phụt mạnh.' },
      { hanzi: '匹', pinyin: 'pǐ', phoneme: 'p', feature: 'Hai môi • Bật hơi mạnh', badgeType: 'asp', meaning: 'cuộn vải, con ngựa', tip: 'pǐ: Nén khí trong vòm miệng rồi bật hơi nổ tung ra ngoài.' },
      { hanzi: '米', pinyin: 'mǐ', phoneme: 'm', feature: 'Hai môi • Âm mũi', badgeType: 'nasal', meaning: 'hạt gạo', tip: 'mǐ: Âm mũi m, rung dây thanh âm mượt mà.' }
    ]
  },
  {
    groupKey: 'labial',
    groupName: 'Âm Hai Môi (b / p / m)',
    desc: 'Phân biệt b, p, m với vần -ai',
    maskedDisplay: '[ ? ] + ái',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM HAI MÔI [b] / [p] / [m]:',
    options: [
      { hanzi: '白', pinyin: 'bái', phoneme: 'b', feature: 'Hai môi • Không bật hơi', badgeType: 'unasp', meaning: 'màu trắng', tip: 'bái: Âm b chặn khí nhẹ ở môi rồi buông, không bật hơi.' },
      { hanzi: '牌', pinyin: 'pái', phoneme: 'p', feature: 'Hai môi • Bật hơi mạnh', badgeType: 'asp', meaning: 'tấm biển, bài', tip: 'pái: Âm p khạc luồng khí mạnh làm rung tờ giấy trước miệng.' },
      { hanzi: '埋', pinyin: 'mái', phoneme: 'm', feature: 'Hai môi • Âm mũi', badgeType: 'nasal', meaning: 'chôn cất', tip: 'mái: Âm mũi thoát khí êm ái qua mũi.' }
    ]
  },
  {
    groupKey: 'labial',
    groupName: 'Âm Hai Môi (b / p / m)',
    desc: 'Phân biệt b, p, m với vần -ao',
    maskedDisplay: '[ ? ] + āo',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM HAI MÔI [b] / [p] / [m]:',
    options: [
      { hanzi: '包', pinyin: 'bāo', phoneme: 'b', feature: 'Hai môi • Không bật hơi', badgeType: 'unasp', meaning: 'cái túi, bao', tip: 'bāo: Môi khép nhẹ, âm phát tự nhiên không luồng gió.' },
      { hanzi: '抛', pinyin: 'pāo', phoneme: 'p', feature: 'Hai môi • Bật hơi mạnh', badgeType: 'asp', meaning: 'ném, quăng', tip: 'pāo: Môi khép nén hơi rồi phóng luồng khí dứt khoát.' },
      { hanzi: '猫', pinyin: 'māo', phoneme: 'm', feature: 'Hai môi • Âm mũi', badgeType: 'nasal', meaning: 'con mèo', tip: 'māo: Luồng khí chuyển qua khoang mũi tạo âm vang nhẹ.' }
    ]
  },
  {
    groupKey: 'labial',
    groupName: 'Âm Hai Môi (b / p / m)',
    desc: 'Phân biệt b, p, m với vần -ang',
    maskedDisplay: '[ ? ] + àng / áng',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM HAI MÔI [b] / [p] / [m]:',
    options: [
      { hanzi: '棒', pinyin: 'bàng', phoneme: 'b', feature: 'Hai môi • Không bật hơi', badgeType: 'unasp', meaning: 'tuyệt vời, cây gậy', tip: 'bàng: Thanh mẫu b không bật luồng khí.' },
      { hanzi: '胖', pinyin: 'pàng', phoneme: 'p', feature: 'Hai môi • Bật hơi mạnh', badgeType: 'asp', meaning: 'béo mập', tip: 'pàng: Bật hơi cực mạnh từ môi khi mở.' },
      { hanzi: '忙', pinyin: 'máng', phoneme: 'm', feature: 'Hai môi • Âm mũi', badgeType: 'nasal', meaning: 'bận rộn', tip: 'máng: Khí dẫn qua mũi, êm dịu.' }
    ]
  },

  // --- 2. ÂM MÔI RĂNG (f vs h / b / p) ---
  {
    groupKey: 'labiodental',
    groupName: 'Âm Môi Răng (f vs h / b / p)',
    desc: 'Phân biệt f (răng trên chạm môi dưới) với h (gốc lưỡi) hoặc p (hai môi)',
    maskedDisplay: '[ ? ] + ēi',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM MÔI RĂNG [f] VS [h] / [p]:',
    options: [
      { hanzi: '飞', pinyin: 'fēi', phoneme: 'f', feature: 'Môi Răng • Ma sát xát', badgeType: 'unasp', meaning: 'bay lượn', tip: 'fēi: Răng cửa trên cắn nhẹ môi dưới, luồng hơi ma sát thổi qua khe.' },
      { hanzi: '黑', pinyin: 'hēi', phoneme: 'h', feature: 'Gốc Lưỡi • Cổ họng', badgeType: 'unasp', meaning: 'màu đen', tip: 'hēi: Răng và môi mở tự nhiên, luồng hơi ma sát từ gốc lưỡi/họng.' },
      { hanzi: '胚', pinyin: 'pēi', phoneme: 'p', feature: 'Hai Môi • Bật hơi', badgeType: 'asp', meaning: 'phôi thai', tip: 'pēi: Hai môi mím lại rồi bật luồng hơi ra, không dùng răng.' }
    ]
  },
  {
    groupKey: 'labiodental',
    groupName: 'Âm Môi Răng (f vs h / b / p)',
    desc: 'Phân biệt f với b và h với vần -ang',
    maskedDisplay: '[ ? ] + āng',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM MÔI RĂNG [f] VS [b] / [h]:',
    options: [
      { hanzi: '方', pinyin: 'fāng', phoneme: 'f', feature: 'Môi Răng • Khe răng môi', badgeType: 'unasp', meaning: 'hình vuông, hướng', tip: 'fāng: Răng trên chạm môi dưới tạo tiếng xát gió.' },
      { hanzi: '帮', pinyin: 'bāng', phoneme: 'b', feature: 'Hai Môi • Khép mở nhẹ', badgeType: 'unasp', meaning: 'giúp đỡ', tip: 'bāng: Hai môi khép mở tự nhiên, răng không chạm môi.' },
      { hanzi: '夯', pinyin: 'hāng', phoneme: 'h', feature: 'Gốc Lưỡi • Luồng hơi họng', badgeType: 'unasp', meaning: 'nện đất, đầm', tip: 'hāng: Hơi thoát từ cổ họng và gốc lưỡi, môi mở tự do.' }
    ]
  },
  {
    groupKey: 'labiodental',
    groupName: 'Âm Môi Răng (f vs h / b / p)',
    desc: 'Phân biệt f với h và p với vần -u',
    maskedDisplay: '[ ? ] + ú / ǔ',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM MÔI RĂNG [f] VS [h] / [p]:',
    options: [
      { hanzi: '福', pinyin: 'fú', phoneme: 'f', feature: 'Môi Răng • Ma sát', badgeType: 'unasp', meaning: 'hạnh phúc, may mắn', tip: 'fú: Răng cửa chạm môi dưới rồi trượt mở.' },
      { hanzi: '狐', pinyin: 'hú', phoneme: 'h', feature: 'Gốc Lưỡi • Phát từ họng', badgeType: 'unasp', meaning: 'con cáo', tip: 'hú: Hơi từ cổ họng đẩy lên, khẩu hình tròn.' },
      { hanzi: '普', pinyin: 'pǔ', phoneme: 'p', feature: 'Hai Môi • Bật hơi mạnh', badgeType: 'asp', meaning: 'phổ biến, phổ thông', tip: 'pǔ: Mím chặt môi rồi bật luồng gió mạnh.' }
    ]
  },
  {
    groupKey: 'labiodental',
    groupName: 'Âm Môi Răng (f vs h / b / p)',
    desc: 'Phân biệt f với b và h với vần -en',
    maskedDisplay: '[ ? ] + ēn / ěn',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM MÔI RĂNG [f] VS [b] / [h]:',
    options: [
      { hanzi: '分', pinyin: 'fēn', phoneme: 'f', feature: 'Môi Răng • Khe răng môi', badgeType: 'unasp', meaning: 'phút, chia ra', tip: 'fēn: Răng trên tựa nhẹ viền môi dưới.' },
      { hanzi: '奔', pinyin: 'bēn', phoneme: 'b', feature: 'Hai Môi • Không bật hơi', badgeType: 'unasp', meaning: 'chạy nhanh', tip: 'bēn: Hai môi chạm nhau rồi mở nhanh.' },
      { hanzi: '很', pinyin: 'hěn', phoneme: 'h', feature: 'Gốc Lưỡi • Ma sát nhẹ', badgeType: 'unasp', meaning: 'rất, quá', tip: 'hěn: Hơi ma sát nhẹ từ cuống lưỡi.' }
    ]
  },

  // --- 3. ÂM ĐẦU LƯỠI GIỮA (d / t / n / l) ---
  {
    groupKey: 'alveolar',
    groupName: 'Âm Đầu Lưỡi Giữa (d / t / n / l)',
    desc: 'Phân biệt d (không bật hơi), t (bật hơi mạnh), n (âm mũi) và l (âm bên)',
    maskedDisplay: '[ ? ] + ā',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI [d] / [t] / [l]:',
    options: [
      { hanzi: '搭', pinyin: 'dā', phoneme: 'd', feature: 'Đầu Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'dựng lên, đi nhờ xe', tip: 'dā: Đầu lưỡi chạm chân răng trên rồi hạ xuống nhẹ nhàng (như "t" không bật hơi).' },
      { hanzi: '他', pinyin: 'tā', phoneme: 't', feature: 'Đầu Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'anh ấy, cậu ấy', tip: 'tā: Đầu lưỡi chạm lợi trên rồi bật phụt luồng khí cực mạnh (như "th" tiếng Việt nhưng mạnh hơn).' },
      { hanzi: '拉', pinyin: 'lā', phoneme: 'l', feature: 'Đầu Lưỡi • Luồng hơi hai bên', badgeType: 'unasp', meaning: 'kéo, lôi', tip: 'lā: Đầu lưỡi áp lợi trên, hơi thoát hai bên mép lưỡi êm mượt.' }
    ]
  },
  {
    groupKey: 'alveolar',
    groupName: 'Âm Đầu Lưỡi Giữa (d / t / n / l)',
    desc: 'Phân biệt d, t, l với vần -u',
    maskedDisplay: '[ ? ] + ū',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI [d] / [t] / [l]:',
    options: [
      { hanzi: '都', pinyin: 'dū', phoneme: 'd', feature: 'Đầu Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'đều, thủ đô', tip: 'dū: Chặn hơi nhẹ ở đầu lưỡi rồi buông, âm gọn gàng.' },
      { hanzi: '秃', pinyin: 'tū', phoneme: 't', feature: 'Đầu Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'hói, trọc', tip: 'tū: Bật luồng khí mạnh khi đầu lưỡi rời chân răng.' },
      { hanzi: '噜', pinyin: 'lū', phoneme: 'l', feature: 'Đầu Lưỡi • Âm bên', badgeType: 'unasp', meaning: 'tiếng vuốt, ngáy', tip: 'lū: Hơi lướt hai bên sườn lưỡi.' }
    ]
  },
  {
    groupKey: 'alveolar',
    groupName: 'Âm Đầu Lưỡi Giữa (d / t / n / l)',
    desc: 'Phân biệt d, t, l với vần -ing',
    maskedDisplay: '[ ? ] + ǐng',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI [d] / [t] / [l]:',
    options: [
      { hanzi: '顶', pinyin: 'dǐng', phoneme: 'd', feature: 'Đầu Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'đỉnh đầu, đội', tip: 'dǐng: Âm d không có luồng gió bật phụt ra.' },
      { hanzi: '挺', pinyin: 'tǐng', phoneme: 't', feature: 'Đầu Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'rất, vươn thẳng', tip: 'tǐng: Âm t khạc luồng khí dứt khoát.' },
      { hanzi: '领', pinyin: 'lǐng', phoneme: 'l', feature: 'Đầu Lưỡi • Âm bên', badgeType: 'unasp', meaning: 'cổ áo, dẫn dắt', tip: 'lǐng: Đầu lưỡi cong nhẹ chạm lợi trên.' }
    ]
  },
  {
    groupKey: 'alveolar',
    groupName: 'Âm Đầu Lưỡi Giữa (d / t / n / l)',
    desc: 'Phân biệt trọn bộ 4 âm: d / t / n / l với vần -an',
    maskedDisplay: '[ ? ] + àn',
    guide: 'LẮNG NGHE & PHÂN BIỆT BỘ 4 ĐẦU LƯỠI [d] / [t] / [n] / [l]:',
    options: [
      { hanzi: '蛋', pinyin: 'dàn', phoneme: 'd', feature: 'Đầu Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'quả trứng', tip: 'dàn: Âm tắc không bật hơi, gọn tiếng.' },
      { hanzi: '叹', pinyin: 'tàn', phoneme: 't', feature: 'Đầu Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'than thở', tip: 'tàn: Bật hơi cực mạnh từ đầu lưỡi.' },
      { hanzi: '难', pinyin: 'nàn', phoneme: 'n', feature: 'Đầu Lưỡi • Âm mũi', badgeType: 'nasal', meaning: 'hoạn nạn, tai nạn', tip: 'nàn: Hơi chạy qua mũi, âm vang đặc trưng n.' },
      { hanzi: '烂', pinyin: 'làn', phoneme: 'l', feature: 'Đầu Lưỡi • Âm bên', badgeType: 'unasp', meaning: 'nát, tồi tệ', tip: 'làn: Hơi thoát hai bên mép lưỡi, không qua mũi.' }
    ]
  },

  // --- 4. ÂM GỐC LƯỠI (g / k / h) ---
  {
    groupKey: 'velar',
    groupName: 'Âm Gốc Lưỡi (g / k / h)',
    desc: 'Phân biệt g (không bật hơi), k (bật hơi cuống họng) và h (xát nhẹ)',
    maskedDisplay: '[ ? ] + ē',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM GỐC LƯỠI [g] / [k] / [h]:',
    options: [
      { hanzi: '哥', pinyin: 'gē', phoneme: 'g', feature: 'Gốc Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'anh trai', tip: 'gē: Cuống lưỡi chạm vòm mềm rồi nhả nhẹ, không có luồng hơi (như "c/k" tiếng Việt).' },
      { hanzi: '棵', pinyin: 'kē', phoneme: 'k', feature: 'Gốc Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'lượng từ cây', tip: 'kē: Cuống lưỡi nén hơi rồi bật luồng khí cực mạnh từ đáy họng.' },
      { hanzi: '喝', pinyin: 'hē', phoneme: 'h', feature: 'Gốc Lưỡi • Ma sát êm', badgeType: 'unasp', meaning: 'uống nước', tip: 'hē: Cuống lưỡi gần vòm mềm, luồng hơi ma sát lướt qua nhẹ nhàng.' }
    ]
  },
  {
    groupKey: 'velar',
    groupName: 'Âm Gốc Lưỡi (g / k / h)',
    desc: 'Phân biệt g, k, h với vần -an',
    maskedDisplay: '[ ? ] + àn',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM GỐC LƯỠI [g] / [k] / [h]:',
    options: [
      { hanzi: '干', pinyin: 'gàn', phoneme: 'g', feature: 'Gốc Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'làm việc, khô', tip: 'gàn: Âm g gọn gàng, dứt khoát không luồng khí.' },
      { hanzi: '看', pinyin: 'kàn', phoneme: 'k', feature: 'Gốc Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'nhìn, xem', tip: 'kàn: Âm k đẩy luồng gió mạnh từ cổ họng.' },
      { hanzi: '汗', pinyin: 'hàn', phoneme: 'h', feature: 'Gốc Lưỡi • Hơi xát', badgeType: 'unasp', meaning: 'mồ hôi', tip: 'hàn: Âm h xát nhẹ trong khoang họng.' }
    ]
  },
  {
    groupKey: 'velar',
    groupName: 'Âm Gốc Lưỡi (g / k / h)',
    desc: 'Phân biệt g, k, h với vần -ou',
    maskedDisplay: '[ ? ] + ǒu',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM GỐC LƯỠI [g] / [k] / [h]:',
    options: [
      { hanzi: '狗', pinyin: 'gǒu', phoneme: 'g', feature: 'Gốc Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'con chó', tip: 'gǒu: Gốc lưỡi bật nhẹ nhàng không có gió mạnh.' },
      { hanzi: '口', pinyin: 'kǒu', phoneme: 'k', feature: 'Gốc Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'cái miệng', tip: 'kǒu: Bật luồng khí nổ từ cuống lưỡi.' },
      { hanzi: '吼', pinyin: 'hǒu', phoneme: 'h', feature: 'Gốc Lưỡi • Hơi xát', badgeType: 'unasp', meaning: 'gầm rống', tip: 'hǒu: Hơi ma sát liên tục không ngắt.' }
    ]
  },
  {
    groupKey: 'velar',
    groupName: 'Âm Gốc Lưỡi (g / k / h)',
    desc: 'Phân biệt g, k, h với vần -ai',
    maskedDisplay: '[ ? ] + ài',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM GỐC LƯỠI [g] / [k] / [h]:',
    options: [
      { hanzi: '盖', pinyin: 'gài', phoneme: 'g', feature: 'Gốc Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'cái nắp, đậy', tip: 'gài: Âm g trong trẻo dứt khoát.' },
      { hanzi: '慨', pinyin: 'kài', phoneme: 'k', feature: 'Gốc Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'khảng khái', tip: 'kài: Luồng hơi mạnh thoát ra ngoài.' },
      { hanzi: '害', pinyin: 'hài', phoneme: 'h', feature: 'Gốc Lưỡi • Hơi xát', badgeType: 'unasp', meaning: 'làm hại, sợ', tip: 'hài: Âm cọ xát nhẹ qua cổ họng.' }
    ]
  },

  // --- 5. ÂM MẶT LƯỠI (j / q / x) ---
  {
    groupKey: 'palatal',
    groupName: 'Âm Mặt Lưỡi (j / q / x)',
    desc: 'Khóe miệng kéo sang 2 bên mỉm cười: j (không bật hơi), q (bật hơi sắc), x (xát mượt)',
    maskedDisplay: '[ ? ] + ī',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM MẶT LƯỠI [j] / [q] / [x]:',
    options: [
      { hanzi: '鸡', pinyin: 'jī', phoneme: 'j', feature: 'Mặt Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'con gà', tip: 'jī: Mặt lưỡi áp vòm cứng, khóe miệng kéo rộng như cười, bật nhẹ không gió (tương tự "ch" nhẹ).' },
      { hanzi: '七', pinyin: 'qī', phoneme: 'q', feature: 'Mặt Lưỡi • Bật hơi sắc bén', badgeType: 'asp', meaning: 'số 7', tip: 'qī: Khẩu hình như j nhưng bật luồng hơi cực kỳ sắc và mạnh qua kẽ lưỡi.' },
      { hanzi: '西', pinyin: 'xī', phoneme: 'x', feature: 'Mặt Lưỡi • Xát mượt mà', badgeType: 'unasp', meaning: 'phía tây', tip: 'xī: Mặt lưỡi để sát vòm miệng, luồng hơi ma sát thổi ra êm mượt.' }
    ]
  },
  {
    groupKey: 'palatal',
    groupName: 'Âm Mặt Lưỡi (j / q / x)',
    desc: 'Phân biệt j, q, x với vần -iao',
    maskedDisplay: '[ ? ] + iāo',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM MẶT LƯỠI [j] / [q] / [x]:',
    options: [
      { hanzi: '焦', pinyin: 'jiāo', phoneme: 'j', feature: 'Mặt Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'cháy sém, sốt ruột', tip: 'jiāo: Tắc xát nhẹ, không có luồng khí mạnh.' },
      { hanzi: '敲', pinyin: 'qiāo', phoneme: 'q', feature: 'Mặt Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'gõ cửa', tip: 'qiāo: Bật hơi nổ sắc bén qua mặt lưỡi.' },
      { hanzi: '销', pinyin: 'xiāo', phoneme: 'x', feature: 'Mặt Lưỡi • Xát êm ái', badgeType: 'unasp', meaning: 'tiêu thụ, hủy bỏ', tip: 'xiāo: Hơi lướt êm qua khe hẹp mặt lưỡi.' }
    ]
  },
  {
    groupKey: 'palatal',
    groupName: 'Âm Mặt Lưỡi (j / q / x)',
    desc: 'Phân biệt j, q, x với vần -u (thực chất là ü tròn môi)',
    maskedDisplay: '[ ? ] + ù',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM MẶT LƯỠI [j] / [q] / [x]:',
    options: [
      { hanzi: '巨', pinyin: 'jù', phoneme: 'j', feature: 'Mặt Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'to lớn, khổng lồ', tip: 'jù: Âm j kết hợp với vận mẫu ü tròn môi, không bật hơi.' },
      { hanzi: '去', pinyin: 'qù', phoneme: 'q', feature: 'Mặt Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'đi tới, biến mất', tip: 'qù: Giữ môi tròn chúm và bật phụt luồng khí mạnh.' },
      { hanzi: '序', pinyin: 'xù', phoneme: 'x', feature: 'Mặt Lưỡi • Xát êm ái', badgeType: 'unasp', meaning: 'thứ tự, lời tựa', tip: 'xù: Luồng khí xát qua mặt lưỡi êm nhẹ, môi tròn.' }
    ]
  },
  {
    groupKey: 'palatal',
    groupName: 'Âm Mặt Lưỡi (j / q / x)',
    desc: 'Phân biệt j, q, x với vần -ian',
    maskedDisplay: '[ ? ] + iàn',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM MẶT LƯỠI [j] / [q] / [x]:',
    options: [
      { hanzi: '剑', pinyin: 'jiàn', phoneme: 'j', feature: 'Mặt Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'thanh kiếm', tip: 'jiàn: Âm j dứt khoát không phụt khí.' },
      { hanzi: '欠', pinyin: 'qiàn', phoneme: 'q', feature: 'Mặt Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'thiếu nợ, ngáp', tip: 'qiàn: Phóng luồng khí sắc bén ra ngoài.' },
      { hanzi: '线', pinyin: 'xiàn', phoneme: 'x', feature: 'Mặt Lưỡi • Xát mượt mà', badgeType: 'unasp', meaning: 'sợi dây, đường nét', tip: 'xiàn: Âm xát nhẹ nhàng, miệng hơi cười.' }
    ]
  },

  // --- 6. ÂM UỐN LƯỠI (zh / ch / sh / r) ---
  {
    groupKey: 'retroflex',
    groupName: 'Âm Uốn Lưỡi (zh / ch / sh / r)',
    desc: 'Đầu lưỡi cong uốn lên chạm ngạc cứng: zh (không bật hơi), ch (bật hơi), sh (xát gió), r (rung thanh)',
    maskedDisplay: '[ ? ] + ū',
    guide: 'LẮNG NGHE & PHÂN BIỆT BỘ ÂM UỐN LƯỠI [zh] / [ch] / [sh] / [r]:',
    options: [
      { hanzi: '猪', pinyin: 'zhū', phoneme: 'zh', feature: 'Uốn Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'con lợn/heo', tip: 'zhū: Đầu lưỡi cong lên ngạc cứng rồi nhả nhẹ, không có luồng hơi mạnh (tương tự "tr" miền Nam).' },
      { hanzi: '出', pinyin: 'chū', phoneme: 'ch', feature: 'Uốn Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'đi ra ngoài', tip: 'chū: Đầu lưỡi vừa uốn cong vừa tống luồng khí cực mạnh và sắc ra ngoài.' },
      { hanzi: '书', pinyin: 'shū', phoneme: 'sh', feature: 'Uốn Lưỡi • Ma sát xát', badgeType: 'unasp', meaning: 'quyển sách', tip: 'shū: Đầu lưỡi cong giữ khoảng cách với ngạc cứng, hơi xát qua khe vòm miệng.' },
      { hanzi: '如', pinyin: 'rú', phoneme: 'r', feature: 'Uốn Lưỡi • Rung thanh âm', badgeType: 'unasp', meaning: 'như là, nếu như', tip: 'rú: Khẩu hình cong lưỡi giống sh nhưng dây thanh âm rung nhẹ.' }
    ]
  },
  {
    groupKey: 'retroflex',
    groupName: 'Âm Uốn Lưỡi (zh / ch / sh / r)',
    desc: 'Phân biệt zh, ch, sh với vần -ang',
    maskedDisplay: '[ ? ] + āng',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM UỐN LƯỠI [zh] / [ch] / [sh]:',
    options: [
      { hanzi: '张', pinyin: 'zhāng', phoneme: 'zh', feature: 'Uốn Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'họ Trương, mở ra', tip: 'zhāng: Đầu lưỡi uốn cong, phát âm dứt khoát không hơi.' },
      { hanzi: '昌', pinyin: 'chāng', phoneme: 'ch', feature: 'Uốn Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'phồn vinh, hưng thịnh', tip: 'chāng: Uốn cong lưỡi kết hợp đẩy luồng gió mạnh.' },
      { hanzi: '商', pinyin: 'shāng', phoneme: 'sh', feature: 'Uốn Lưỡi • Ma sát xát', badgeType: 'unasp', meaning: 'thương mại, bàn bạc', tip: 'shāng: Luồng hơi cọ xát êm ái qua vòm uốn lưỡi.' }
    ]
  },
  {
    groupKey: 'retroflex',
    groupName: 'Âm Uốn Lưỡi (zh / ch / sh / r)',
    desc: 'Phân biệt trọn bộ 4 âm zh, ch, sh, r với vần -u (thanh 4)',
    maskedDisplay: '[ ? ] + ù',
    guide: 'LẮNG NGHE & PHÂN BIỆT BỘ 4 UỐN LƯỠI [zh] / [ch] / [sh] / [r]:',
    options: [
      { hanzi: '住', pinyin: 'zhù', phoneme: 'zh', feature: 'Uốn Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'sinh sống, ở', tip: 'zhù: Uốn cong lưỡi chạm vòm, nhả êm.' },
      { hanzi: '处', pinyin: 'chù', phoneme: 'ch', feature: 'Uốn Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'nơi chốn, địa điểm', tip: 'chù: Uốn lưỡi và khạc hơi dứt khoát.' },
      { hanzi: '树', pinyin: 'shù', phoneme: 'sh', feature: 'Uốn Lưỡi • Ma sát xát', badgeType: 'unasp', meaning: 'cái cây', tip: 'shù: Hơi xát mạnh qua khe cong của lưỡi.' },
      { hanzi: '入', pinyin: 'rù', phoneme: 'r', feature: 'Uốn Lưỡi • Dây thanh rung', badgeType: 'unasp', meaning: 'bước vào, nhập', tip: 'rù: Lưỡi cong lên ngạc, cổ họng rung trầm.' }
    ]
  },

  // --- 7. ÂM ĐẦU LƯỠI TRƯỚC (z / c / s) ---
  {
    groupKey: 'dental_sibilant',
    groupName: 'Âm Đầu Lưỡi Trước (z / c / s)',
    desc: 'Lưỡi để thẳng, chạm mặt sau răng cửa trên: z (không bật hơi), c (bật hơi xì mạnh), s (xát êm)',
    maskedDisplay: '[ ? ] + ā',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI TRƯỚC [z] / [c] / [s]:',
    options: [
      { hanzi: '扎', pinyin: 'zā', phoneme: 'z', feature: 'Thẳng Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'buộc, cắm', tip: 'zā: Đầu lưỡi thẳng chạm sau răng cửa trên rồi mở, không bật hơi (như "d/z" nhẹ).' },
      { hanzi: '擦', pinyin: 'cā', phoneme: 'c', feature: 'Thẳng Lưỡi • Bật hơi xì mạnh', badgeType: 'asp', meaning: 'lau chùi', tip: 'cā: Đầu lưỡi nén chặt sau răng rồi bật luồng hơi xì cực mạnh ra qua kẽ răng.' },
      { hanzi: '撒', pinyin: 'sā', phoneme: 's', feature: 'Thẳng Lưỡi • Xát êm qua kẽ răng', badgeType: 'unasp', meaning: 'buông tay, rắc', tip: 'sā: Đầu lưỡi gần chân răng dưới, luồng hơi xát xì nhẹ nhàng qua kẽ răng.' }
    ]
  },
  {
    groupKey: 'dental_sibilant',
    groupName: 'Âm Đầu Lưỡi Trước (z / c / s)',
    desc: 'Phân biệt z, c, s với vần -ao',
    maskedDisplay: '[ ? ] + ǎo',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI TRƯỚC [z] / [c] / [s]:',
    options: [
      { hanzi: '早', pinyin: 'zǎo', phoneme: 'z', feature: 'Thẳng Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'buổi sáng, sớm', tip: 'zǎo: Lưỡi thẳng, ngắt hơi êm ái.' },
      { hanzi: '草', pinyin: 'cǎo', phoneme: 'c', feature: 'Thẳng Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'bãi cỏ, ngọn cỏ', tip: 'cǎo: Xì luồng gió mạnh từ kẽ răng hàm.' },
      { hanzi: '扫', pinyin: 'sǎo', phoneme: 's', feature: 'Thẳng Lưỡi • Xát êm', badgeType: 'unasp', meaning: 'quét dọn', tip: 'sǎo: Hơi thoát nhẹ qua khe răng cửa.' }
    ]
  },
  {
    groupKey: 'dental_sibilant',
    groupName: 'Âm Đầu Lưỡi Trước (z / c / s)',
    desc: 'Phân biệt z, c, s với vần -i (đặc biệt đọc là "ư")',
    maskedDisplay: '[ ? ] + ì',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI TRƯỚC [z] / [c] / [s]:',
    options: [
      { hanzi: '字', pinyin: 'zì', phoneme: 'z', feature: 'Thẳng Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'chữ viết', tip: 'zì: Đọc như "tư" ngắn gọn, lưỡi thẳng dẹt.' },
      { hanzi: '次', pinyin: 'cì', phoneme: 'c', feature: 'Thẳng Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'lần, lượt', tip: 'cì: Bật luồng hơi xì mạnh kèm âm "ư".' },
      { hanzi: '四', pinyin: 'sì', phoneme: 's', feature: 'Thẳng Lưỡi • Xát êm', badgeType: 'unasp', meaning: 'số 4', tip: 'sì: Tiếng xì gió êm mượt qua răng.' }
    ]
  },
  {
    groupKey: 'dental_sibilant',
    groupName: 'Âm Đầu Lưỡi Trước (z / c / s)',
    desc: 'Phân biệt z, c, s với vần -ai',
    maskedDisplay: '[ ? ] + ài',
    guide: 'LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI TRƯỚC [z] / [c] / [s]:',
    options: [
      { hanzi: '在', pinyin: 'zài', phoneme: 'z', feature: 'Thẳng Lưỡi • Không bật hơi', badgeType: 'unasp', meaning: 'ở tại, đang', tip: 'zài: Âm z không có gió bật.' },
      { hanzi: '菜', pinyin: 'cài', phoneme: 'c', feature: 'Thẳng Lưỡi • Bật hơi mạnh', badgeType: 'asp', meaning: 'rau củ, món ăn', tip: 'cài: Bật luồng hơi xì mạnh như phanh xe.' },
      { hanzi: '赛', pinyin: 'sài', phoneme: 's', feature: 'Thẳng Lưỡi • Xát êm', badgeType: 'unasp', meaning: 'cuộc thi, đua', tip: 'sài: Gió xát qua kẽ răng mượt mà.' }
    ]
  },

  // --- 8. ĐỐI LẬP UỐN LƯỠI (zh/ch/sh) VS THẲNG LƯỠI (z/c/s) ---
  {
    groupKey: 'contrast_zh_z',
    groupName: 'Uốn Lưỡi vs Thẳng Lưỡi (zh vs z)',
    desc: 'So sánh zh (uốn cong lưỡi) với z (thẳng lưỡi)',
    maskedDisplay: '[ ? ] + ū',
    guide: 'LẮNG NGHE & PHÂN BIỆT UỐN LƯỠI [zh] VS THẲNG LƯỠI [z]:',
    options: [
      { hanzi: '猪', pinyin: 'zhū', phoneme: 'zh', feature: 'Uốn Cong Lưỡi', badgeType: 'unasp', meaning: 'con lợn/heo', tip: 'zhū: Đầu lưỡi uốn cong lên chạm ngạc cứng, âm trầm sâu.' },
      { hanzi: '租', pinyin: 'zū', phoneme: 'z', feature: 'Thẳng Dẹt Lưỡi', badgeType: 'unasp', meaning: 'thuê nhà, mướn', tip: 'zū: Đầu lưỡi thẳng chạm chân răng trên, âm nông và dẹt.' }
    ]
  },
  {
    groupKey: 'contrast_zh_z',
    groupName: 'Uốn Lưỡi vs Thẳng Lưỡi (ch vs c)',
    desc: 'So sánh ch (uốn cong bật hơi) với c (thẳng lưỡi bật hơi xì)',
    maskedDisplay: '[ ? ] + ū',
    guide: 'LẮNG NGHE & PHÂN BIỆT UỐN LƯỠI [ch] VS THẲNG LƯỠI [c]:',
    options: [
      { hanzi: '出', pinyin: 'chū', phoneme: 'ch', feature: 'Uốn Lưỡi + Bật hơi', badgeType: 'asp', meaning: 'đi ra ngoài', tip: 'chū: Lưỡi cong lên vòm miệng rồi bật hơi nổ trầm.' },
      { hanzi: '粗', pinyin: 'cū', phoneme: 'c', feature: 'Thẳng Lưỡi + Xì mạnh', badgeType: 'asp', meaning: 'thô ráp, to bè', tip: 'cū: Lưỡi thẳng nén răng rồi xì luồng gió sắc bén.' }
    ]
  },
  {
    groupKey: 'contrast_zh_z',
    groupName: 'Uốn Lưỡi vs Thẳng Lưỡi (sh vs s)',
    desc: 'So sánh sh (uốn cong xát) với s (thẳng lưỡi xì)',
    maskedDisplay: '[ ? ] + ī',
    guide: 'LẮNG NGHE & PHÂN BIỆT UỐN LƯỠI [sh] VS THẲNG LƯỠI [s]:',
    options: [
      { hanzi: '诗', pinyin: 'shī', phoneme: 'sh', feature: 'Uốn Lưỡi • Âm vòm sâu', badgeType: 'unasp', meaning: 'bài thơ', tip: 'shī: Lưỡi uốn cong, nghe trầm đục (như "s" uốn lưỡi).' },
      { hanzi: '丝', pinyin: 'sī', phoneme: 's', feature: 'Thẳng Lưỡi • Âm răng dẹt', badgeType: 'unasp', meaning: 'sợi tơ lụa', tip: 'sī: Lưỡi thẳng dẹt sát kẽ răng, tiếng xì thanh mảnh.' }
    ]
  },
  {
    groupKey: 'contrast_zh_z',
    groupName: 'Uốn Lưỡi vs Thẳng Lưỡi (sh vs s)',
    desc: 'So sánh shì (là, phải) với sì (số 4) - Cực kỳ kinh điển!',
    maskedDisplay: '[ ? ] + ì',
    guide: 'LẮNG NGHE & PHÂN BIỆT "shì" (UỐN LƯỠI) VS "sì" (THẲNG LƯỠI):',
    options: [
      { hanzi: '是', pinyin: 'shì', phoneme: 'sh', feature: 'Uốn Lưỡi Cong', badgeType: 'unasp', meaning: 'là, phải', tip: 'shì: Đầu lưỡi cong lên ngạc, luồng hơi ma sát trầm ấm.' },
      { hanzi: '四', pinyin: 'sì', phoneme: 's', feature: 'Thẳng Lưỡi Răng', badgeType: 'unasp', meaning: 'số 4', tip: 'sì: Đầu lưỡi thẳng áp mặt trong răng cửa, xì gió sắc sảo.' }
    ]
  },
  {
    groupKey: 'contrast_zh_z',
    groupName: 'Uốn Lưỡi vs Thẳng Lưỡi (zh vs z)',
    desc: 'So sánh zhì (trí tuệ) với zì (chữ viết)',
    maskedDisplay: '[ ? ] + ì',
    guide: 'LẮNG NGHE & PHÂN BIỆT [zhì] VS [zì]:',
    options: [
      { hanzi: '智', pinyin: 'zhì', phoneme: 'zh', feature: 'Uốn Lưỡi Cong', badgeType: 'unasp', meaning: 'trí tuệ, thông minh', tip: 'zhì: Lưỡi cong lên vòm cứng, âm thanh đầy đặn.' },
      { hanzi: '字', pinyin: 'zì', phoneme: 'z', feature: 'Thẳng Lưỡi Răng', badgeType: 'unasp', meaning: 'con chữ, chữ Hán', tip: 'zì: Lưỡi để thẳng sau răng, âm dẹt gọn gàng.' }
    ]
  },
  {
    groupKey: 'contrast_zh_z',
    groupName: 'Uốn Lưỡi vs Thẳng Lưỡi (sh vs s)',
    desc: 'So sánh shān (núi) với sān (số 3)',
    maskedDisplay: '[ ? ] + ān',
    guide: 'LẮNG NGHE & PHÂN BIỆT [shān] (NÚI) VS [sān] (SỐ 3):',
    options: [
      { hanzi: '山', pinyin: 'shān', phoneme: 'sh', feature: 'Uốn Cong Lưỡi', badgeType: 'unasp', meaning: 'ngọn núi', tip: 'shān: Lưỡi uốn cong, khoang miệng tròn sâu.' },
      { hanzi: '三', pinyin: 'sān', phoneme: 's', feature: 'Thẳng Dẹt Lưỡi', badgeType: 'unasp', meaning: 'số 3', tip: 'sān: Lưỡi thẳng áp sát răng, luồng hơi xì mỏng.' }
    ]
  },

  // --- 9. CẶP BẬT HƠI VS KHÔNG BẬT HƠI (Aspirated vs Unaspirated) ---
  {
    groupKey: 'aspirated_pairs',
    groupName: 'Bật Hơi vs Không Bật Hơi (b vs p)',
    desc: 'So sánh b (không bật hơi) với p (bật hơi cực mạnh)',
    maskedDisplay: '[ ? ] + āo',
    guide: 'LẮNG NGHE & PHÂN BIỆT BẬT HƠI [b] VS [p]:',
    options: [
      { hanzi: '包', pinyin: 'bāo', phoneme: 'b', feature: 'Không Bật Hơi', badgeType: 'unasp', meaning: 'cái túi, bao gói', tip: 'bāo: Môi mở tự nhiên, không đẩy luồng khí mạnh.' },
      { hanzi: '抛', pinyin: 'pāo', phoneme: 'p', feature: 'Bật Hơi Rất Mạnh', badgeType: 'asp', meaning: 'ném, vứt bỏ', tip: 'pāo: Nén khí chặt rồi bật tung luồng hơi cực mạnh.' }
    ]
  },
  {
    groupKey: 'aspirated_pairs',
    groupName: 'Bật Hơi vs Không Bật Hơi (d vs t)',
    desc: 'So sánh d (không bật hơi) với t (bật hơi mạnh)',
    maskedDisplay: '[ ? ] + ào',
    guide: 'LẮNG NGHE & PHÂN BIỆT BẬT HƠI [d] VS [t]:',
    options: [
      { hanzi: '到', pinyin: 'dào', phoneme: 'd', feature: 'Không Bật Hơi', badgeType: 'unasp', meaning: 'đến nơi', tip: 'dào: Đầu lưỡi hạ xuống êm đềm, không có gió.' },
      { hanzi: '套', pinyin: 'tào', phoneme: 't', feature: 'Bật Hơi Rất Mạnh', badgeType: 'asp', meaning: 'bộ, bao bọc', tip: 'tào: Bật luồng hơi phụt mạnh như "th".' }
    ]
  },
  {
    groupKey: 'aspirated_pairs',
    groupName: 'Bật Hơi vs Không Bật Hơi (g vs k)',
    desc: 'So sánh g (không bật hơi) với k (bật hơi từ cuống họng)',
    maskedDisplay: '[ ? ] + āo',
    guide: 'LẮNG NGHE & PHÂN BIỆT BẬT HƠI [g] VS [k]:',
    options: [
      { hanzi: '高', pinyin: 'gāo', phoneme: 'g', feature: 'Không Bật Hơi', badgeType: 'unasp', meaning: 'cao lớn', tip: 'gāo: Cuống họng mở dứt khoát không có gió phụt.' },
      { hanzi: '烤', pinyin: 'kǎo', phoneme: 'k', feature: 'Bật Hơi Cuống Họng', badgeType: 'asp', meaning: 'nướng chín', tip: 'kǎo: Khạc luồng khí dũng mãnh từ cuống họng.' }
    ]
  },
  {
    groupKey: 'aspirated_pairs',
    groupName: 'Bật Hơi vs Không Bật Hơi (j vs q)',
    desc: 'So sánh j (không bật hơi) với q (bật hơi sắc sảo)',
    maskedDisplay: '[ ? ] + ī',
    guide: 'LẮNG NGHE & PHÂN BIỆT BẬT HƠI [j] VS [q]:',
    options: [
      { hanzi: '鸡', pinyin: 'jī', phoneme: 'j', feature: 'Không Bật Hơi', badgeType: 'unasp', meaning: 'con gà', tip: 'jī: Mặt lưỡi mở êm, không có luồng gió xì mạnh.' },
      { hanzi: '七', pinyin: 'qī', phoneme: 'q', feature: 'Bật Hơi Sắc Bén', badgeType: 'asp', meaning: 'số 7', tip: 'qī: Bật luồng khí nổ sắc bén và dứt khoát.' }
    ]
  },
  {
    groupKey: 'aspirated_pairs',
    groupName: 'Bật Hơi vs Không Bật Hơi (zh vs ch)',
    desc: 'So sánh zh (uốn lưỡi không bật) với ch (uốn lưỡi bật hơi)',
    maskedDisplay: '[ ? ] + ǎng',
    guide: 'LẮNG NGHE & PHÂN BIỆT BẬT HƠI [zh] VS [ch]:',
    options: [
      { hanzi: '掌', pinyin: 'zhǎng', phoneme: 'zh', feature: 'Uốn Lưỡi Không Hơi', badgeType: 'unasp', meaning: 'lòng bàn tay', tip: 'zhǎng: Uốn lưỡi chạm ngạc rồi mở êm.' },
      { hanzi: '场', pinyin: 'chǎng', phoneme: 'ch', feature: 'Uốn Lưỡi Bật Hơi', badgeType: 'asp', meaning: 'quảng trường, sân', tip: 'chǎng: Vừa uốn lưỡi vừa phóng luồng hơi cực mạnh.' }
    ]
  },
  {
    groupKey: 'aspirated_pairs',
    groupName: 'Bật Hơi vs Không Bật Hơi (z vs c)',
    desc: 'So sánh z (thẳng lưỡi không bật) với c (thẳng lưỡi xì mạnh)',
    maskedDisplay: '[ ? ] + ào',
    guide: 'LẮNG NGHE & PHÂN BIỆT BẬT HƠI [z] VS [c]:',
    options: [
      { hanzi: '造', pinyin: 'zào', phoneme: 'z', feature: 'Không Bật Hơi', badgeType: 'unasp', meaning: 'chế tạo', tip: 'zào: Lưỡi chạm răng mở nhẹ nhàng.' },
      { hanzi: '操', pinyin: 'cāo', phoneme: 'c', feature: 'Xì Hơi Rất Mạnh', badgeType: 'asp', meaning: 'tập luyện, thao tác', tip: 'cāo: Bật luồng hơi xì cực mạnh qua kẽ răng.' }
    ]
  },
{
    "id": "init_labial_extra_1",
    "groupKey": "labial",
    "groupName": "Âm Hai Môi (b / p / m)",
    "desc": "Phân biệt b, p, m với vần -en",
    "maskedDisplay": "[ ? ] + ēn / èn",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM HAI MÔI [b] / [p] / [m]:",
    "options": [
      {
        "hanzi": "奔",
        "pinyin": "bēn",
        "phoneme": "b",
        "feature": "Hai môi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "chạy nhanh",
        "tip": "bēn: Môi mở tự nhiên không luồng khí."
      },
      {
        "hanzi": "喷",
        "pinyin": "pēn",
        "phoneme": "p",
        "feature": "Hai môi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "phun xịt",
        "tip": "pēn: Nén khí rồi bật luồng hơi cực mạnh."
      },
      {
        "hanzi": "闷",
        "pinyin": "mèn",
        "phoneme": "m",
        "feature": "Hai môi • Âm mũi",
        "badgeType": "nasal",
        "meaning": "ngột ngạt, buồn tẻ",
        "tip": "mèn: Luồng hơi dẫn qua khoang mũi."
      }
    ]
  },
  {
    "id": "init_labial_extra_2",
    "groupKey": "labial",
    "groupName": "Âm Hai Môi (b / p / m)",
    "desc": "Phân biệt b, p, m với vần -o",
    "maskedDisplay": "[ ? ] + ō",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM HAI MÔI [b] / [p] / [m]:",
    "options": [
      {
        "hanzi": "波",
        "pinyin": "bō",
        "phoneme": "b",
        "feature": "Hai môi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "làn sóng",
        "tip": "bō: Hai môi mở nhẹ tròn, không bật gió."
      },
      {
        "hanzi": "坡",
        "pinyin": "pō",
        "phoneme": "p",
        "feature": "Hai môi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "con dốc, triền dốc",
        "tip": "pō: Bật luồng gió mạnh từ môi."
      },
      {
        "hanzi": "摸",
        "pinyin": "mō",
        "phoneme": "m",
        "feature": "Hai môi • Âm mũi",
        "badgeType": "nasal",
        "meaning": "sờ mó, mò mẫm",
        "tip": "mō: Hơi thoát nhẹ qua khoang mũi."
      }
    ]
  },
  {
    "id": "init_labial_extra_3",
    "groupKey": "labial",
    "groupName": "Âm Hai Môi (b / p / m)",
    "desc": "Phân biệt b, p, m với vần -u",
    "maskedDisplay": "[ ? ] + ù",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM HAI MÔI [b] / [p] / [m]:",
    "options": [
      {
        "hanzi": "布",
        "pinyin": "bù",
        "phoneme": "b",
        "feature": "Hai môi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "vải vóc",
        "tip": "bù: Môi khép mở dứt khoát không có gió."
      },
      {
        "hanzi": "瀑",
        "pinyin": "pù",
        "phoneme": "p",
        "feature": "Hai môi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "thác nước",
        "tip": "pù: Môi nén chặt bật luồng hơi mạnh."
      },
      {
        "hanzi": "木",
        "pinyin": "mù",
        "phoneme": "m",
        "feature": "Hai môi • Âm mũi",
        "badgeType": "nasal",
        "meaning": "gỗ cây, mộc",
        "tip": "mù: Âm mũi m thoát qua mũi êm ái."
      }
    ]
  },
  {
    "id": "init_labial_extra_4",
    "groupKey": "labial",
    "groupName": "Âm Hai Môi (b / p / m)",
    "desc": "Phân biệt b, p, m với vần -ei",
    "maskedDisplay": "[ ? ] + èi",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM HAI MÔI [b] / [p] / [m]:",
    "options": [
      {
        "hanzi": "被",
        "pinyin": "bèi",
        "phoneme": "b",
        "feature": "Hai môi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "bị, cái chăn",
        "tip": "bèi: Khép mở môi nhẹ nhàng."
      },
      {
        "hanzi": "配",
        "pinyin": "pèi",
        "phoneme": "p",
        "feature": "Hai môi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "phối hợp, xứng đáng",
        "tip": "pèi: Bật luồng hơi phụt mạnh."
      },
      {
        "hanzi": "妹",
        "pinyin": "mèi",
        "phoneme": "m",
        "feature": "Hai môi • Âm mũi",
        "badgeType": "nasal",
        "meaning": "em gái",
        "tip": "mèi: Khí qua khoang mũi, giọng rung."
      }
    ]
  },
  {
    "id": "init_labial_extra_5",
    "groupKey": "labial",
    "groupName": "Âm Hai Môi (b / p / m)",
    "desc": "Phân biệt b, p, m với vần -ian",
    "maskedDisplay": "[ ? ] + iān / ián",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM HAI MÔI [b] / [p] / [m]:",
    "options": [
      {
        "hanzi": "边",
        "pinyin": "biān",
        "phoneme": "b",
        "feature": "Hai môi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "bên cạnh, rìa",
        "tip": "biān: Môi mở êm, miệng hơi dẹt."
      },
      {
        "hanzi": "篇",
        "pinyin": "piān",
        "phoneme": "p",
        "feature": "Hai môi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "thiên, bài viết",
        "tip": "piān: Bật luồng hơi sắc nét từ môi."
      },
      {
        "hanzi": "棉",
        "pinyin": "mián",
        "phoneme": "m",
        "feature": "Hai môi • Âm mũi",
        "badgeType": "nasal",
        "meaning": "bông gòn",
        "tip": "mián: Thoát hơi nhẹ nhàng qua mũi."
      }
    ]
  },
  {
    "id": "init_labiodental_extra_1",
    "groupKey": "labiodental",
    "groupName": "Âm Môi Răng (f vs h / b / p)",
    "desc": "Phân biệt f với h và b với vần -a",
    "maskedDisplay": "[ ? ] + ā",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM MÔI RĂNG [f] VS [h] / [b]:",
    "options": [
      {
        "hanzi": "发",
        "pinyin": "fā",
        "phoneme": "f",
        "feature": "Môi Răng • Khe xát gió",
        "badgeType": "unasp",
        "meaning": "phát ra, gửi",
        "tip": "fā: Răng trên chạm viền môi dưới xát gió nhẹ."
      },
      {
        "hanzi": "哈",
        "pinyin": "hā",
        "phoneme": "h",
        "feature": "Gốc Lưỡi • Khí từ họng",
        "badgeType": "unasp",
        "meaning": "ha ha, cười",
        "tip": "hā: Khí đẩy trực tiếp từ cổ họng."
      },
      {
        "hanzi": "八",
        "pinyin": "bā",
        "phoneme": "b",
        "feature": "Hai Môi • Mở nhẹ",
        "badgeType": "unasp",
        "meaning": "số 8",
        "tip": "bā: Môi khép mở, không cọ răng."
      }
    ]
  },
  {
    "id": "init_labiodental_extra_2",
    "groupKey": "labiodental",
    "groupName": "Âm Môi Răng (f vs h / b / p)",
    "desc": "Phân biệt f với h và b với vần -u (thanh 4)",
    "maskedDisplay": "[ ? ] + ù",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM MÔI RĂNG [f] VS [h] / [b]:",
    "options": [
      {
        "hanzi": "复",
        "pinyin": "fù",
        "phoneme": "f",
        "feature": "Môi Răng • Khe xát",
        "badgeType": "unasp",
        "meaning": "lặp lại, phức tạp",
        "tip": "fù: Răng trên cắn nhẹ môi dưới."
      },
      {
        "hanzi": "户",
        "pinyin": "hù",
        "phoneme": "h",
        "feature": "Gốc Lưỡi • Đáy họng",
        "badgeType": "unasp",
        "meaning": "hộ gia đình, cửa",
        "tip": "hù: Luồng khí từ cuống họng."
      },
      {
        "hanzi": "不",
        "pinyin": "bù",
        "phoneme": "b",
        "feature": "Hai Môi • Khép mở êm",
        "badgeType": "unasp",
        "meaning": "không phải",
        "tip": "bù: Hai môi khép mở tự nhiên."
      }
    ]
  },
  {
    "id": "init_labiodental_extra_3",
    "groupKey": "labiodental",
    "groupName": "Âm Môi Răng (f vs h / b / p)",
    "desc": "Phân biệt f với h và b với vần -an",
    "maskedDisplay": "[ ? ] + ǎn",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM MÔI RĂNG [f] VS [h] / [b]:",
    "options": [
      {
        "hanzi": "反",
        "pinyin": "fǎn",
        "phoneme": "f",
        "feature": "Môi Răng • Khe xát",
        "badgeType": "unasp",
        "meaning": "phản lại, đối lập",
        "tip": "fǎn: Răng chạm môi xát gió."
      },
      {
        "hanzi": "喊",
        "pinyin": "hǎn",
        "phoneme": "h",
        "feature": "Gốc Lưỡi • Khí họng",
        "badgeType": "unasp",
        "meaning": "kêu la, gọi to",
        "tip": "hǎn: Hơi từ cổ họng thoát ra."
      },
      {
        "hanzi": "板",
        "pinyin": "bǎn",
        "phoneme": "b",
        "feature": "Hai Môi • Chặn hơi",
        "badgeType": "unasp",
        "meaning": "tấm ván, bảng",
        "tip": "bǎn: Hai môi mím rồi mở nhẹ."
      }
    ]
  },
  {
    "id": "init_labiodental_extra_4",
    "groupKey": "labiodental",
    "groupName": "Âm Môi Răng (f vs h / b / p)",
    "desc": "Phân biệt f với b và p với vần -eng",
    "maskedDisplay": "[ ? ] + ēng",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM MÔI RĂNG [f] VS [b] / [p]:",
    "options": [
      {
        "hanzi": "风",
        "pinyin": "fēng",
        "phoneme": "f",
        "feature": "Môi Răng • Khe xát",
        "badgeType": "unasp",
        "meaning": "cơn gió",
        "tip": "fēng: Răng trên chạm viền môi dưới."
      },
      {
        "hanzi": "崩",
        "pinyin": "bēng",
        "phoneme": "b",
        "feature": "Hai Môi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "sụp đổ",
        "tip": "bēng: Hai môi mở nhẹ không gió."
      },
      {
        "hanzi": "烹",
        "pinyin": "pēng",
        "phoneme": "p",
        "feature": "Hai Môi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "nấu nướng",
        "tip": "pēng: Bật luồng hơi cực mạnh từ môi."
      }
    ]
  },
  {
    "id": "init_alveolar_extra_1",
    "groupKey": "alveolar",
    "groupName": "Âm Đầu Lưỡi Giữa (d / t / n / l)",
    "desc": "Phân biệt bộ 4 âm d / t / n / l với vần -i",
    "maskedDisplay": "[ ? ] + ǐ",
    "guide": "LẮNG NGHE & PHÂN BIỆT BỘ 4 ĐẦU LƯỠI [d] / [t] / [n] / [l]:",
    "options": [
      {
        "hanzi": "底",
        "pinyin": "dǐ",
        "phoneme": "d",
        "feature": "Đầu Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "đáy sâu, chân",
        "tip": "dǐ: Đầu lưỡi hạ nhẹ, không gió."
      },
      {
        "hanzi": "体",
        "pinyin": "tǐ",
        "phoneme": "t",
        "feature": "Đầu Lưỡi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "thể xác, cơ thể",
        "tip": "tǐ: Bật luồng gió mạnh từ đầu lưỡi."
      },
      {
        "hanzi": "你",
        "pinyin": "nǐ",
        "phoneme": "n",
        "feature": "Đầu Lưỡi • Âm mũi",
        "badgeType": "nasal",
        "meaning": "bạn, anh/chị",
        "tip": "nǐ: Hơi qua khoang mũi rung ngân."
      },
      {
        "hanzi": "里",
        "pinyin": "lǐ",
        "phoneme": "l",
        "feature": "Đầu Lưỡi • Âm bên",
        "badgeType": "unasp",
        "meaning": "bên trong, dặm",
        "tip": "lǐ: Hơi trượt qua hai mép sườn lưỡi."
      }
    ]
  },
  {
    "id": "init_alveolar_extra_2",
    "groupKey": "alveolar",
    "groupName": "Âm Đầu Lưỡi Giữa (d / t / n / l)",
    "desc": "Phân biệt d, t, l với vần -ao",
    "maskedDisplay": "[ ? ] + ào",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI [d] / [t] / [l]:",
    "options": [
      {
        "hanzi": "到",
        "pinyin": "dào",
        "phoneme": "d",
        "feature": "Đầu Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "đến nơi",
        "tip": "dào: Đầu lưỡi chặn nhẹ rồi buông."
      },
      {
        "hanzi": "套",
        "pinyin": "tào",
        "phoneme": "t",
        "feature": "Đầu Lưỡi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "áo khoác, bộ",
        "tip": "tào: Bật luồng hơi phụt mạnh."
      },
      {
        "hanzi": "闹",
        "pinyin": "nào",
        "phoneme": "n",
        "feature": "Đầu Lưỡi • Âm mũi",
        "badgeType": "nasal",
        "meaning": "náo nhiệt, quấy",
        "tip": "nào: Thoát khí qua mũi."
      }
    ]
  },
  {
    "id": "init_alveolar_extra_3",
    "groupKey": "alveolar",
    "groupName": "Âm Đầu Lưỡi Giữa (d / t / n / l)",
    "desc": "Phân biệt d, t, l với vần -ong",
    "maskedDisplay": "[ ? ] + ōng / óng",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI [d] / [t] / [l]:",
    "options": [
      {
        "hanzi": "东",
        "pinyin": "dōng",
        "phoneme": "d",
        "feature": "Đầu Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "phía đông",
        "tip": "dōng: Dứt khoát không có luồng khí."
      },
      {
        "hanzi": "通",
        "pinyin": "tōng",
        "phoneme": "t",
        "feature": "Đầu Lưỡi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "thông suốt",
        "tip": "tōng: Đẩy hơi mạnh từ chân răng."
      },
      {
        "hanzi": "龙",
        "pinyin": "lóng",
        "phoneme": "l",
        "feature": "Đầu Lưỡi • Âm bên",
        "badgeType": "unasp",
        "meaning": "con rồng",
        "tip": "lóng: Khí thoát hai bên sườn lưỡi."
      }
    ]
  },
  {
    "id": "init_alveolar_extra_4",
    "groupKey": "alveolar",
    "groupName": "Âm Đầu Lưỡi Giữa (d / t / n / l)",
    "desc": "Phân biệt d, t, l với vần -ian",
    "maskedDisplay": "[ ? ] + iǎn",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI [d] / [t] / [l]:",
    "options": [
      {
        "hanzi": "点",
        "pinyin": "diǎn",
        "phoneme": "d",
        "feature": "Đầu Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "chấm, điểm, giờ",
        "tip": "diǎn: Âm d gọn gàng dứt khoát."
      },
      {
        "hanzi": "舔",
        "pinyin": "tiǎn",
        "phoneme": "t",
        "feature": "Đầu Lưỡi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "liếm",
        "tip": "tiǎn: Khạc luồng khí sắc nét."
      },
      {
        "hanzi": "脸",
        "pinyin": "liǎn",
        "phoneme": "l",
        "feature": "Đầu Lưỡi • Âm bên",
        "badgeType": "unasp",
        "meaning": "khuôn mặt",
        "tip": "liǎn: Hơi thoát êm hai mép lưỡi."
      }
    ]
  },
  {
    "id": "init_velar_extra_1",
    "groupKey": "velar",
    "groupName": "Âm Gốc Lưỡi (g / k / h)",
    "desc": "Phân biệt g, k, h với vần -uan",
    "maskedDisplay": "[ ? ] + uān",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM GỐC LƯỠI [g] / [k] / [h]:",
    "options": [
      {
        "hanzi": "关",
        "pinyin": "guān",
        "phoneme": "g",
        "feature": "Gốc Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "đóng cửa, quan hệ",
        "tip": "guān: Cuống lưỡi bật nhẹ không gió."
      },
      {
        "hanzi": "宽",
        "pinyin": "kuān",
        "phoneme": "k",
        "feature": "Gốc Lưỡi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "rộng rãi",
        "tip": "kuān: Cuống lưỡi nén hơi rồi bật tung luồng khí."
      },
      {
        "hanzi": "欢",
        "pinyin": "huān",
        "phoneme": "h",
        "feature": "Gốc Lưỡi • Xát nhẹ",
        "badgeType": "unasp",
        "meaning": "hoan hỉ, vui vẻ",
        "tip": "huān: Luồng hơi cọ xát êm ái qua họng."
      }
    ]
  },
  {
    "id": "init_velar_extra_2",
    "groupKey": "velar",
    "groupName": "Âm Gốc Lưỡi (g / k / h)",
    "desc": "Phân biệt g, k, h với vần -ong",
    "maskedDisplay": "[ ? ] + ōng",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM GỐC LƯỠI [g] / [k] / [h]:",
    "options": [
      {
        "hanzi": "工",
        "pinyin": "gōng",
        "phoneme": "g",
        "feature": "Gốc Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "công việc, thợ",
        "tip": "gōng: Âm g gọn gàng trong vòm miệng."
      },
      {
        "hanzi": "空",
        "pinyin": "kōng",
        "phoneme": "k",
        "feature": "Gốc Lưỡi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "không gian, trống rỗng",
        "tip": "kōng: Bật luồng gió mạnh từ cổ họng."
      },
      {
        "hanzi": "轰",
        "pinyin": "hōng",
        "phoneme": "h",
        "feature": "Gốc Lưỡi • Xát nhẹ",
        "badgeType": "unasp",
        "meaning": "tiếng ầm ầm",
        "tip": "hōng: Tiếng gió xát qua cuống họng."
      }
    ]
  },
  {
    "id": "init_velar_extra_3",
    "groupKey": "velar",
    "groupName": "Âm Gốc Lưỡi (g / k / h)",
    "desc": "Phân biệt g, k, h với vần -uang",
    "maskedDisplay": "[ ? ] + uāng / uàng",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM GỐC LƯỠI [g] / [k] / [h]:",
    "options": [
      {
        "hanzi": "光",
        "pinyin": "guāng",
        "phoneme": "g",
        "feature": "Gốc Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "ánh sáng, hết sạch",
        "tip": "guāng: Cuống lưỡi mở nhẹ nhàng."
      },
      {
        "hanzi": "矿",
        "pinyin": "kuàng",
        "phoneme": "k",
        "feature": "Gốc Lưỡi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "quặng mỏ",
        "tip": "kuàng: Bật luồng khí nổ từ cuống lưỡi."
      },
      {
        "hanzi": "黄",
        "pinyin": "huáng",
        "phoneme": "h",
        "feature": "Gốc Lưỡi • Xát nhẹ",
        "badgeType": "unasp",
        "meaning": "màu vàng, họ Hoàng",
        "tip": "huáng: Hơi ma sát êm qua cổ họng."
      }
    ]
  },
  {
    "id": "init_palatal_extra_1",
    "groupKey": "palatal",
    "groupName": "Âm Mặt Lưỡi (j / q / x)",
    "desc": "Phân biệt j, q, x với vần -in",
    "maskedDisplay": "[ ? ] + ìn",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM MẶT LƯỠI [j] / [q] / [x]:",
    "options": [
      {
        "hanzi": "进",
        "pinyin": "jìn",
        "phoneme": "j",
        "feature": "Mặt Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "tiến vào, bước vào",
        "tip": "jìn: Mặt lưỡi mở êm ái không gió."
      },
      {
        "hanzi": "沁",
        "pinyin": "qìn",
        "phoneme": "q",
        "feature": "Mặt Lưỡi • Bật hơi sắc",
        "badgeType": "asp",
        "meaning": "thấm thía, mát rượi",
        "tip": "qìn: Bật luồng hơi sắc nhọn qua kẽ lưỡi."
      },
      {
        "hanzi": "信",
        "pinyin": "xìn",
        "phoneme": "x",
        "feature": "Mặt Lưỡi • Xát êm",
        "badgeType": "unasp",
        "meaning": "bức thư, tin tưởng",
        "tip": "xìn: Luồng hơi cọ xát nhẹ qua mặt lưỡi."
      }
    ]
  },
  {
    "id": "init_palatal_extra_2",
    "groupKey": "palatal",
    "groupName": "Âm Mặt Lưỡi (j / q / x)",
    "desc": "Phân biệt j, q, x với vần -ia",
    "maskedDisplay": "[ ? ] + iā",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM MẶT LƯỠI [j] / [q] / [x]:",
    "options": [
      {
        "hanzi": "家",
        "pinyin": "jiā",
        "phoneme": "j",
        "feature": "Mặt Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "gia đình, nhà",
        "tip": "jiā: Âm j nhẹ nhàng, khóe miệng cười."
      },
      {
        "hanzi": "掐",
        "pinyin": "qiā",
        "phoneme": "q",
        "feature": "Mặt Lưỡi • Bật hơi sắc",
        "badgeType": "asp",
        "meaning": "bấm, ngắt",
        "tip": "qiā: Bật luồng khí nổ sắc sảo."
      },
      {
        "hanzi": "虾",
        "pinyin": "xiā",
        "phoneme": "x",
        "feature": "Mặt Lưỡi • Xát mượt",
        "badgeType": "unasp",
        "meaning": "con tôm",
        "tip": "xiā: Hơi lướt êm qua vòm miệng cứng."
      }
    ]
  },
  {
    "id": "init_palatal_extra_3",
    "groupKey": "palatal",
    "groupName": "Âm Mặt Lưỡi (j / q / x)",
    "desc": "Phân biệt j, q, x với vần -iang",
    "maskedDisplay": "[ ? ] + iāng",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM MẶT LƯỠI [j] / [q] / [x]:",
    "options": [
      {
        "hanzi": "江",
        "pinyin": "jiāng",
        "phoneme": "j",
        "feature": "Mặt Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "con sông",
        "tip": "jiāng: Khí không phụt mạnh."
      },
      {
        "hanzi": "枪",
        "pinyin": "qiāng",
        "phoneme": "q",
        "feature": "Mặt Lưỡi • Bật hơi sắc",
        "badgeType": "asp",
        "meaning": "khẩu súng",
        "tip": "qiāng: Luồng khí cực mạnh từ mặt lưỡi."
      },
      {
        "hanzi": "香",
        "pinyin": "xiāng",
        "phoneme": "x",
        "feature": "Mặt Lưỡi • Xát mượt",
        "badgeType": "unasp",
        "meaning": "hương thơm",
        "tip": "xiāng: Âm xát êm dịu."
      }
    ]
  },
  {
    "id": "init_palatal_extra_4",
    "groupKey": "palatal",
    "groupName": "Âm Mặt Lưỡi (j / q / x)",
    "desc": "Phân biệt j, q, x với vần -iu",
    "maskedDisplay": "[ ? ] + iǔ / iú / iū",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM MẶT LƯỠI [j] / [q] / [x]:",
    "options": [
      {
        "hanzi": "酒",
        "pinyin": "jiǔ",
        "phoneme": "j",
        "feature": "Mặt Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "rượu",
        "tip": "jiǔ: Mở nhẹ nhàng, âm trong sáng."
      },
      {
        "hanzi": "球",
        "pinyin": "qiú",
        "phoneme": "q",
        "feature": "Mặt Lưỡi • Bật hơi sắc",
        "badgeType": "asp",
        "meaning": "quả bóng, hình cầu",
        "tip": "qiú: Bật phụt luồng khí sắc bén."
      },
      {
        "hanzi": "休",
        "pinyin": "xiū",
        "phoneme": "x",
        "feature": "Mặt Lưỡi • Xát êm",
        "badgeType": "unasp",
        "meaning": "nghỉ ngơi",
        "tip": "xiū: Khí lướt mượt qua khoang miệng."
      }
    ]
  },
  {
    "id": "init_retroflex_extra_1",
    "groupKey": "retroflex",
    "groupName": "Âm Uốn Lưỡi (zh / ch / sh / r)",
    "desc": "Phân biệt zh, ch, sh, r với vần -en",
    "maskedDisplay": "[ ? ] + ēn / én",
    "guide": "LẮNG NGHE & PHÂN BIỆT BỘ 4 UỐN LƯỠI [zh] / [ch] / [sh] / [r]:",
    "options": [
      {
        "hanzi": "真",
        "pinyin": "zhēn",
        "phoneme": "zh",
        "feature": "Uốn Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "chân thật",
        "tip": "zhēn: Đầu lưỡi cong chạm ngạc rồi mở êm."
      },
      {
        "hanzi": "嗔",
        "pinyin": "chēn",
        "phoneme": "ch",
        "feature": "Uốn Lưỡi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "hờn giận, trách",
        "tip": "chēn: Uốn lưỡi và khạc hơi dứt khoát."
      },
      {
        "hanzi": "身",
        "pinyin": "shēn",
        "phoneme": "sh",
        "feature": "Uốn Lưỡi • Ma sát xát",
        "badgeType": "unasp",
        "meaning": "thân thể",
        "tip": "shēn: Luồng hơi cọ xát qua vòm lưỡi uốn."
      },
      {
        "hanzi": "人",
        "pinyin": "rén",
        "phoneme": "r",
        "feature": "Uốn Lưỡi • Dây thanh rung",
        "badgeType": "unasp",
        "meaning": "con người",
        "tip": "rén: Lưỡi cong lên ngạc, cổ họng rung trầm."
      }
    ]
  },
  {
    "id": "init_retroflex_extra_2",
    "groupKey": "retroflex",
    "groupName": "Âm Uốn Lưỡi (zh / ch / sh / r)",
    "desc": "Phân biệt zh, ch, sh, r với vần -ou",
    "maskedDisplay": "[ ? ] + ōu / óu",
    "guide": "LẮNG NGHE & PHÂN BIỆT BỘ 4 UỐN LƯỠI [zh] / [ch] / [sh] / [r]:",
    "options": [
      {
        "hanzi": "舟",
        "pinyin": "zhōu",
        "phoneme": "zh",
        "feature": "Uốn Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "con thuyền",
        "tip": "zhōu: Âm vòm uốn trầm gọn."
      },
      {
        "hanzi": "抽",
        "pinyin": "chōu",
        "phoneme": "ch",
        "feature": "Uốn Lưỡi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "rút ra, hút thuốc",
        "tip": "chōu: Bật luồng hơi mạnh từ vòm uốn."
      },
      {
        "hanzi": "收",
        "pinyin": "shōu",
        "phoneme": "sh",
        "feature": "Uốn Lưỡi • Ma sát xát",
        "badgeType": "unasp",
        "meaning": "thu nhận",
        "tip": "shōu: Hơi xát gió qua vòm lưỡi."
      },
      {
        "hanzi": "柔",
        "pinyin": "róu",
        "phoneme": "r",
        "feature": "Uốn Lưỡi • Dây thanh rung",
        "badgeType": "unasp",
        "meaning": "mềm mại, dịu dàng",
        "tip": "róu: Dây thanh âm rung đều, lưỡi cong."
      }
    ]
  },
  {
    "id": "init_retroflex_extra_3",
    "groupKey": "retroflex",
    "groupName": "Âm Uốn Lưỡi (zh / ch / sh / r)",
    "desc": "Phân biệt zh, ch, sh, r với vần -ao",
    "maskedDisplay": "[ ? ] + ào / āo",
    "guide": "LẮNG NGHE & PHÂN BIỆT BỘ 4 UỐN LƯỠI [zh] / [ch] / [sh] / [r]:",
    "options": [
      {
        "hanzi": "照",
        "pinyin": "zhào",
        "phoneme": "zh",
        "feature": "Uốn Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "chiếu sáng, chụp ảnh",
        "tip": "zhào: Đầu lưỡi cong không luồng gió phụt."
      },
      {
        "hanzi": "超",
        "pinyin": "chāo",
        "phoneme": "ch",
        "feature": "Uốn Lưỡi • Bật hơi mạnh",
        "badgeType": "asp",
        "meaning": "siêu việt, vượt qua",
        "tip": "chāo: Phóng luồng khí mạnh khi hạ lưỡi."
      },
      {
        "hanzi": "少",
        "pinyin": "shào",
        "phoneme": "sh",
        "feature": "Uốn Lưỡi • Ma sát xát",
        "badgeType": "unasp",
        "meaning": "ít, thiếu niên",
        "tip": "shào: Gió cọ xát qua ngạc uốn."
      },
      {
        "hanzi": "绕",
        "pinyin": "rào",
        "phoneme": "r",
        "feature": "Uốn Lưỡi • Dây thanh rung",
        "badgeType": "unasp",
        "meaning": "quấn quanh, đi vòng",
        "tip": "rào: Cổ họng rung êm ái."
      }
    ]
  },
  {
    "id": "init_dental_extra_1",
    "groupKey": "dental_sibilant",
    "groupName": "Âm Đầu Lưỡi Trước (z / c / s)",
    "desc": "Phân biệt z, c, s với vần -ong",
    "maskedDisplay": "[ ? ] + ōng",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI TRƯỚC [z] / [c] / [s]:",
    "options": [
      {
        "hanzi": "宗",
        "pinyin": "zōng",
        "phoneme": "z",
        "feature": "Thẳng Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "tông tộc, tổ tiên",
        "tip": "zōng: Đầu lưỡi chạm răng mở nhẹ."
      },
      {
        "hanzi": "聪",
        "pinyin": "cōng",
        "phoneme": "c",
        "feature": "Thẳng Lưỡi • Bật hơi xì mạnh",
        "badgeType": "asp",
        "meaning": "thông minh",
        "tip": "cōng: Xì luồng hơi cực mạnh qua kẽ răng."
      },
      {
        "hanzi": "松",
        "pinyin": "sōng",
        "phoneme": "s",
        "feature": "Thẳng Lưỡi • Xát êm ái",
        "badgeType": "unasp",
        "meaning": "cây thông, lỏng lẻo",
        "tip": "sōng: Gió xát nhẹ nhàng qua khe răng."
      }
    ]
  },
  {
    "id": "init_dental_extra_2",
    "groupKey": "dental_sibilant",
    "groupName": "Âm Đầu Lưỡi Trước (z / c / s)",
    "desc": "Phân biệt z, c, s với vần -ou",
    "maskedDisplay": "[ ? ] + ǒu",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI TRƯỚC [z] / [c] / [s]:",
    "options": [
      {
        "hanzi": "走",
        "pinyin": "zǒu",
        "phoneme": "z",
        "feature": "Thẳng Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "đi bộ, rời đi",
        "tip": "zǒu: Âm z thẳng lưỡi không gió."
      },
      {
        "hanzi": "凑",
        "pinyin": "còu",
        "phoneme": "c",
        "feature": "Thẳng Lưỡi • Bật hơi xì mạnh",
        "badgeType": "asp",
        "meaning": "gom góp, chắp vá",
        "tip": "còu: Phóng luồng khí xì mạnh qua răng."
      },
      {
        "hanzi": "叟",
        "pinyin": "sǒu",
        "phoneme": "s",
        "feature": "Thẳng Lưỡi • Xát êm ái",
        "badgeType": "unasp",
        "meaning": "ông già, cụ già",
        "tip": "sǒu: Hơi xát êm mượt qua răng."
      }
    ]
  },
  {
    "id": "init_dental_extra_3",
    "groupKey": "dental_sibilant",
    "groupName": "Âm Đầu Lưỡi Trước (z / c / s)",
    "desc": "Phân biệt z, c, s với vần -un",
    "maskedDisplay": "[ ? ] + ūn",
    "guide": "LẮNG NGHE & PHÂN BIỆT ÂM ĐẦU LƯỠI TRƯỚC [z] / [c] / [s]:",
    "options": [
      {
        "hanzi": "尊",
        "pinyin": "zūn",
        "phoneme": "z",
        "feature": "Thẳng Lưỡi • Không bật hơi",
        "badgeType": "unasp",
        "meaning": "tôn trọng, quý báu",
        "tip": "zūn: Lưỡi dẹt sau răng, buông êm."
      },
      {
        "hanzi": "村",
        "pinyin": "cūn",
        "phoneme": "c",
        "feature": "Thẳng Lưỡi • Bật hơi xì mạnh",
        "badgeType": "asp",
        "meaning": "ngôi làng, thôn xóm",
        "tip": "cūn: Bật luồng hơi xì sắc nét."
      },
      {
        "hanzi": "孙",
        "pinyin": "sūn",
        "phoneme": "s",
        "feature": "Thẳng Lưỡi • Xát êm ái",
        "badgeType": "unasp",
        "meaning": "cháu nội/ngoại",
        "tip": "sūn: Khí xì êm qua kẽ răng."
      }
    ]
  },
  {
    "id": "init_contrast_extra_1",
    "groupKey": "contrast_zh_z",
    "groupName": "Uốn Lưỡi vs Thẳng Lưỡi (ch vs c)",
    "desc": "So sánh cháng (dài) với cáng (cất giấu)",
    "maskedDisplay": "[ ? ] + áng",
    "guide": "LẮNG NGHE & PHÂN BIỆT UỐN LƯỠI [ch] VS THẲNG LƯỠI [c]:",
    "options": [
      {
        "hanzi": "长",
        "pinyin": "cháng",
        "phoneme": "ch",
        "feature": "Uốn Lưỡi + Bật hơi",
        "badgeType": "asp",
        "meaning": "dài, phát triển",
        "tip": "cháng: Đầu lưỡi uốn cong lên ngạc rồi bật hơi nổ."
      },
      {
        "hanzi": "藏",
        "pinyin": "cáng",
        "phoneme": "c",
        "feature": "Thẳng Lưỡi + Xì mạnh",
        "badgeType": "asp",
        "meaning": "cất giấu",
        "tip": "cáng: Đầu lưỡi để thẳng sau răng rồi xì luồng gió mạnh."
      }
    ]
  },
  {
    "id": "init_contrast_extra_2",
    "groupKey": "contrast_zh_z",
    "groupName": "Uốn Lưỡi vs Thẳng Lưỡi (ch vs c)",
    "desc": "So sánh chūn (mùa xuân) với cūn (thôn xóm)",
    "maskedDisplay": "[ ? ] + ūn",
    "guide": "LẮNG NGHE & PHÂN BIỆT UỐN LƯỠI [ch] VS THẲNG LƯỠI [c]:",
    "options": [
      {
        "hanzi": "春",
        "pinyin": "chūn",
        "phoneme": "ch",
        "feature": "Uốn Cong Lưỡi",
        "badgeType": "asp",
        "meaning": "mùa xuân",
        "tip": "chūn: Lưỡi cong lên vòm ngạc cứng, âm vòm sâu."
      },
      {
        "hanzi": "村",
        "pinyin": "cūn",
        "phoneme": "c",
        "feature": "Thẳng Dẹt Lưỡi",
        "badgeType": "asp",
        "meaning": "thôn làng",
        "tip": "cūn: Lưỡi thẳng áp sát kẽ răng, tiếng xì sắc nhọn."
      }
    ]
  },
  {
    "id": "init_contrast_extra_3",
    "groupKey": "contrast_zh_z",
    "groupName": "Uốn Lưỡi vs Thẳng Lưỡi (sh vs s)",
    "desc": "So sánh shuǐ (nước) với suǐ (tủy xương)",
    "maskedDisplay": "[ ? ] + uǐ",
    "guide": "LẮNG NGHE & PHÂN BIỆT UỐN LƯỠI [sh] VS THẲNG LƯỠI [s]:",
    "options": [
      {
        "hanzi": "水",
        "pinyin": "shuǐ",
        "phoneme": "sh",
        "feature": "Uốn Cong Lưỡi",
        "badgeType": "unasp",
        "meaning": "nước",
        "tip": "shuǐ: Đầu lưỡi cong lên ngạc, âm nghe tròn và đầy."
      },
      {
        "hanzi": "髓",
        "pinyin": "suǐ",
        "phoneme": "s",
        "feature": "Thẳng Dẹt Lưỡi",
        "badgeType": "unasp",
        "meaning": "tủy xương",
        "tip": "suǐ: Đầu lưỡi dẹt chạm chân răng, tiếng xì thanh mảnh."
      }
    ]
  },
  {
    "id": "init_contrast_extra_4",
    "groupKey": "contrast_zh_z",
    "groupName": "Uốn Lưỡi vs Thẳng Lưỡi (sh vs s)",
    "desc": "So sánh shuì (ngủ) với suì (tuổi)",
    "maskedDisplay": "[ ? ] + uì",
    "guide": "LẮNG NGHE & PHÂN BIỆT UỐN LƯỠI [sh] VS THẲNG LƯỠI [s]:",
    "options": [
      {
        "hanzi": "睡",
        "pinyin": "shuì",
        "phoneme": "sh",
        "feature": "Uốn Cong Lưỡi",
        "badgeType": "unasp",
        "meaning": "ngủ",
        "tip": "shuì: Đầu lưỡi cong lên vòm miệng."
      },
      {
        "hanzi": "岁",
        "pinyin": "suì",
        "phoneme": "s",
        "feature": "Thẳng Dẹt Lưỡi",
        "badgeType": "unasp",
        "meaning": "tuổi tác",
        "tip": "suì: Đầu lưỡi để thẳng sau răng cửa."
      }
    ]
  },
  {
    "id": "init_contrast_extra_5",
    "groupKey": "contrast_zh_z",
    "groupName": "Uốn Lưỡi vs Thẳng Lưỡi (zh vs z)",
    "desc": "So sánh zhòng (nặng) với zòng (tung hoành)",
    "maskedDisplay": "[ ? ] + òng",
    "guide": "LẮNG NGHE & PHÂN BIỆT UỐN LƯỠI [zh] VS THẲNG LƯỠI [z]:",
    "options": [
      {
        "hanzi": "重",
        "pinyin": "zhòng",
        "phoneme": "zh",
        "feature": "Uốn Cong Lưỡi",
        "badgeType": "unasp",
        "meaning": "nặng nề, quan trọng",
        "tip": "zhòng: Lưỡi cong lên chạm ngạc cứng."
      },
      {
        "hanzi": "纵",
        "pinyin": "zòng",
        "phoneme": "z",
        "feature": "Thẳng Dẹt Lưỡi",
        "badgeType": "unasp",
        "meaning": "thả lỏng, dọc",
        "tip": "zòng: Lưỡi dẹt thẳng chạm răng cửa."
      }
    ]
  },
  {
    "id": "init_aspirated_extra_1",
    "groupKey": "aspirated_pairs",
    "groupName": "Bật Hơi vs Không Bật Hơi (b vs p)",
    "desc": "So sánh bǐ (bút) với pǐ (cuộn vải/ngựa)",
    "maskedDisplay": "[ ? ] + ǐ",
    "guide": "LẮNG NGHE & PHÂN BIỆT BẬT HƠI [b] VS [p]:",
    "options": [
      {
        "hanzi": "笔",
        "pinyin": "bǐ",
        "phoneme": "b",
        "feature": "Không Bật Hơi",
        "badgeType": "unasp",
        "meaning": "cái bút",
        "tip": "bǐ: Hai môi mở tự nhiên, không luồng khí."
      },
      {
        "hanzi": "匹",
        "pinyin": "pǐ",
        "phoneme": "p",
        "feature": "Bật Hơi Rất Mạnh",
        "badgeType": "asp",
        "meaning": "cuộn vải, con ngựa",
        "tip": "pǐ: Nén hơi rồi bật luồng khí cực mạnh."
      }
    ]
  },
  {
    "id": "init_aspirated_extra_2",
    "groupKey": "aspirated_pairs",
    "groupName": "Bật Hơi vs Không Bật Hơi (d vs t)",
    "desc": "So sánh dǐng (đỉnh đầu) với tǐng (rất/thẳng)",
    "maskedDisplay": "[ ? ] + ǐng",
    "guide": "LẮNG NGHE & PHÂN BIỆT BẬT HƠI [d] VS [t]:",
    "options": [
      {
        "hanzi": "顶",
        "pinyin": "dǐng",
        "phoneme": "d",
        "feature": "Không Bật Hơi",
        "badgeType": "unasp",
        "meaning": "đỉnh đầu, đội",
        "tip": "dǐng: Đầu lưỡi hạ nhẹ, âm êm."
      },
      {
        "hanzi": "挺",
        "pinyin": "tǐng",
        "phoneme": "t",
        "feature": "Bật Hơi Rất Mạnh",
        "badgeType": "asp",
        "meaning": "rất, vươn thẳng",
        "tip": "tǐng: Bật luồng khí nổ từ chân răng."
      }
    ]
  },
  {
    "id": "init_aspirated_extra_3",
    "groupKey": "aspirated_pairs",
    "groupName": "Bật Hơi vs Không Bật Hơi (g vs k)",
    "desc": "So sánh gù (cố sự) với kù (cái quần)",
    "maskedDisplay": "[ ? ] + ù",
    "guide": "LẮNG NGHE & PHÂN BIỆT BẬT HƠI [g] VS [k]:",
    "options": [
      {
        "hanzi": "故",
        "pinyin": "gù",
        "phoneme": "g",
        "feature": "Không Bật Hơi",
        "badgeType": "unasp",
        "meaning": "cố ý, cố sự",
        "tip": "gù: Cuống họng mở dứt khoát không có gió."
      },
      {
        "hanzi": "裤",
        "pinyin": "kù",
        "phoneme": "k",
        "feature": "Bật Hơi Cuống Họng",
        "badgeType": "asp",
        "meaning": "cái quần",
        "tip": "kù: Bật luồng khí mạnh từ cuống họng."
      }
    ]
  },
  {
    "id": "init_aspirated_extra_4",
    "groupKey": "aspirated_pairs",
    "groupName": "Bật Hơi vs Không Bật Hơi (zh vs ch)",
    "desc": "So sánh zhǎn (mở rộng) với chǎn (sản xuất)",
    "maskedDisplay": "[ ? ] + ǎn",
    "guide": "LẮNG NGHE & PHÂN BIỆT BẬT HƠI [zh] VS [ch]:",
    "options": [
      {
        "hanzi": "展",
        "pinyin": "zhǎn",
        "phoneme": "zh",
        "feature": "Uốn Lưỡi Không Hơi",
        "badgeType": "unasp",
        "meaning": "triển lãm, mở ra",
        "tip": "zhǎn: Lưỡi cong lên ngạc nhả êm."
      },
      {
        "hanzi": "产",
        "pinyin": "chǎn",
        "phoneme": "ch",
        "feature": "Uốn Lưỡi Bật Hơi",
        "badgeType": "asp",
        "meaning": "sản xuất, sinh sản",
        "tip": "chǎn: Vừa uốn lưỡi vừa phóng luồng hơi cực mạnh."
      }
    ]
  }
];

// Dữ liệu thử thách luyện tai phân biệt Vận Mẫu (Finals Drill)
const FINALS_DRILL_DATA = [
  // --- 1. MŨI TRƯỚC (-n) VS MŨI SAU (-ng) ---
  {
    groupKey: 'nasal_an_ang',
    groupName: 'Mũi Trước (-n) vs Mũi Sau (-ng)',
    desc: 'Phân biệt âm đuôi -n (chạm đầu lưỡi) và -ng (nâng cuống lưỡi)',
    maskedDisplay: 'b + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-an] VS [-ang]:',
    options: [
      { hanzi: '班', pinyin: 'bān', phoneme: 'an', feature: 'Mũi Trước (-n)', badgeType: 'nasal', meaning: 'lớp học, ca làm', tip: 'bān (-an): Kết thúc bằng cách nâng đầu lưỡi chạm lợi trên, âm ngắn gọn ở phía trước vòm miệng.' },
      { hanzi: '帮', pinyin: 'bāng', phoneme: 'ang', feature: 'Mũi Sau (-ng)', badgeType: 'nasal', meaning: 'giúp đỡ', tip: 'bāng (-ang): Kết thúc bằng cách nâng cuống lưỡi chạm vòm mềm, miệng mở rộng, âm ngân vang ở họng.' }
    ]
  },
  {
    groupKey: 'nasal_an_ang',
    groupName: 'Mũi Trước (-n) vs Mũi Sau (-ng)',
    desc: 'Phân biệt fàn (-an) với fàng (-ang)',
    maskedDisplay: 'f + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-an] VS [-ang]:',
    options: [
      { hanzi: '饭', pinyin: 'fàn', phoneme: 'an', feature: 'Mũi Trước (-n)', badgeType: 'nasal', meaning: 'cơm, bữa ăn', tip: 'fàn: Đầu lưỡi chặn lợi trên khi kết thúc âm an.' },
      { hanzi: '放', pinyin: 'fàng', phoneme: 'ang', feature: 'Mũi Sau (-ng)', badgeType: 'nasal', meaning: 'buông, thả, đặt', tip: 'fàng: Cuống lưỡi chạm ngạc mềm, âm vang khoang họng ang.' }
    ]
  },
  {
    groupKey: 'nasal_an_ang',
    groupName: 'Mũi Trước (-n) vs Mũi Sau (-ng)',
    desc: 'Phân biệt shēn (-en) với shēng (-eng)',
    maskedDisplay: 'sh + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-en] VS [-eng]:',
    options: [
      { hanzi: '身', pinyin: 'shēn', phoneme: 'en', feature: 'Mũi Trước (-n)', badgeType: 'nasal', meaning: 'thân thể, mình', tip: 'shēn (-en): Đọc gần như "ơn/ân", đầu lưỡi kết thúc ở chân răng cửa trên.' },
      { hanzi: '声', pinyin: 'shēng', phoneme: 'eng', feature: 'Mũi Sau (-ng)', badgeType: 'nasal', meaning: 'âm thanh, tiếng', tip: 'shēng (-eng): Gốc lưỡi nâng lên chạm ngạc mềm, âm vang trầm ở cuống họng.' }
    ]
  },
  {
    groupKey: 'nasal_an_ang',
    groupName: 'Mũi Trước (-n) vs Mũi Sau (-ng)',
    desc: 'Phân biệt bēn (-en) với bēng (-eng)',
    maskedDisplay: 'b + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-en] VS [-eng]:',
    options: [
      { hanzi: '奔', pinyin: 'bēn', phoneme: 'en', feature: 'Mũi Trước (-n)', badgeType: 'nasal', meaning: 'chạy nhanh', tip: 'bēn: Kết thúc nhẹ nhàng bằng đầu lưỡi chạm lợi.' },
      { hanzi: '崩', pinyin: 'bēng', phoneme: 'eng', feature: 'Mũi Sau (-ng)', badgeType: 'nasal', meaning: 'sụp đổ', tip: 'bēng: Ngân sâu ở vòm họng ngạc mềm.' }
    ]
  },
  {
    groupKey: 'nasal_an_ang',
    groupName: 'Mũi Trước (-n) vs Mũi Sau (-ng)',
    desc: 'Phân biệt xīn (-in) với xīng (-ing) - Rất dễ nhầm!',
    maskedDisplay: 'x + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-in] VS [-ing]:',
    options: [
      { hanzi: '心', pinyin: 'xīn', phoneme: 'in', feature: 'Mũi Trước (-n)', badgeType: 'nasal', meaning: 'trái tim, tấm lòng', tip: 'xīn (-in): Đầu lưỡi áp lợi răng trên, khoang miệng hẹp, âm ngắt gọn gàng.' },
      { hanzi: '星', pinyin: 'xīng', phoneme: 'ing', feature: 'Mũi Sau (-ng)', badgeType: 'nasal', meaning: 'ngôi sao', tip: 'xīng (-ing): Mặt cuống lưỡi nâng cao chạm vòm mềm, âm ngân vang kéo dài ở sau mũi.' }
    ]
  },
  {
    groupKey: 'nasal_an_ang',
    groupName: 'Mũi Trước (-n) vs Mũi Sau (-ng)',
    desc: 'Phân biệt jǐn (-in) với jǐng (-ing)',
    maskedDisplay: 'j + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-in] VS [-ing]:',
    options: [
      { hanzi: '紧', pinyin: 'jǐn', phoneme: 'in', feature: 'Mũi Trước (-n)', badgeType: 'nasal', meaning: 'chặt chẽ, khẩn trương', tip: 'jǐn: Âm n kết thúc ở răng cửa trên.' },
      { hanzi: '景', pinyin: 'jǐng', phoneme: 'ing', feature: 'Mũi Sau (-ng)', badgeType: 'nasal', meaning: 'phong cảnh, cảnh trí', tip: 'jǐng: Âm ng vang sâu ở khoang họng ngạc mềm.' }
    ]
  },
  {
    groupKey: 'nasal_an_ang',
    groupName: 'Mũi Trước (-n) vs Mũi Sau (-ng)',
    desc: 'Phân biệt jiǎn (-ian) với jiǎng (-iang)',
    maskedDisplay: 'j + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-ian] VS [-iang]:',
    options: [
      { hanzi: '简', pinyin: 'jiǎn', phoneme: 'ian', feature: 'Mũi Trước (-n)', badgeType: 'nasal', meaning: 'đơn giản', tip: 'jiǎn (-ian): Đọc lướt từ i sang an (nghe như "ien"), đầu lưỡi chạm chân răng.' },
      { hanzi: '讲', pinyin: 'jiǎng', phoneme: 'iang', feature: 'Mũi Sau (-ng)', badgeType: 'nasal', meaning: 'giảng giải, nói', tip: 'jiǎng (-iang): Đọc lướt từ i sang ang, mở rộng vòm miệng ngân vang.' }
    ]
  },
  {
    groupKey: 'nasal_an_ang',
    groupName: 'Mũi Trước (-n) vs Mũi Sau (-ng)',
    desc: 'Phân biệt chuān (-uan) với chuāng (-uang)',
    maskedDisplay: 'ch + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-uan] VS [-uang]:',
    options: [
      { hanzi: '川', pinyin: 'chuān', phoneme: 'uan', feature: 'Mũi Trước (-n)', badgeType: 'nasal', meaning: 'sông ngòi, Tứ Xuyên', tip: 'chuān (-uan): Kết thúc bằng đầu lưỡi chạm lợi trên.' },
      { hanzi: '窗', pinyin: 'chuāng', phoneme: 'uang', feature: 'Mũi Sau (-ng)', badgeType: 'nasal', meaning: 'cửa sổ', tip: 'chuāng (-uang): Kết thúc bằng cuống lưỡi chạm vòm họng mềm, vang rộng.' }
    ]
  },

  // --- 2. TRÒN MÔI (u vs ü) ---
  {
    groupKey: 'rounded_u_u_umlaut',
    groupName: 'Tròn Môi (u vs ü)',
    desc: 'Phân biệt u (môi tròn nhô ra) và ü (tròn môi nhưng lưỡi giữ ở vị trí phát âm chữ i)',
    maskedDisplay: 'l + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT TRÒN MÔI [u] VS [ü]:',
    options: [
      { hanzi: '路', pinyin: 'lù', phoneme: 'u', feature: 'Nguyên Âm u', badgeType: 'vowel', meaning: 'con đường', tip: 'lù (u): Môi tròn nhô ra phía trước, cuống lưỡi co rút về phía sau, âm trầm sâu.' },
      { hanzi: '绿', pinyin: 'lǜ', phoneme: 'ü', feature: 'Nguyên Âm ü (Tròn môi)', badgeType: 'vowel', meaning: 'màu xanh lá', tip: 'lǜ (ü): Giữ đầu lưỡi áp sát răng cửa dưới như phát âm "i", nhưng môi chúm tròn lại như huýt sáo.' }
    ]
  },
  {
    groupKey: 'rounded_u_u_umlaut',
    groupName: 'Tròn Môi (u vs ü)',
    desc: 'Phân biệt nǔ (u) với nǚ (ü)',
    maskedDisplay: 'n + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT TRÒN MÔI [u] VS [ü]:',
    options: [
      { hanzi: '努', pinyin: 'nǔ', phoneme: 'u', feature: 'Nguyên Âm u', badgeType: 'vowel', meaning: 'nỗ lực', tip: 'nǔ (u): Lưỡi lùi sâu, khẩu hình tròn bình thường.' },
      { hanzi: '女', pinyin: 'nǚ', phoneme: 'ü', feature: 'Nguyên Âm ü (Tròn môi)', badgeType: 'vowel', meaning: 'phụ nữ, con gái', tip: 'nǚ (ü): Lưỡi giữ ở vị trí phát âm "i" nhưng môi chúm lại tròn xoe.' }
    ]
  },
  {
    groupKey: 'rounded_u_u_umlaut',
    groupName: 'Tròn Môi (u vs ü)',
    desc: 'Phân biệt âm u trong shū với âm ü trong xū (x đi với u thực chất là ü!)',
    maskedDisplay: '[sh/x] + [u/ü]',
    guide: 'LẮNG NGHE & PHÂN BIỆT NGUYÊN ÂM [u] (shū) VS [ü] (xū):',
    options: [
      { hanzi: '书', pinyin: 'shū', phoneme: 'u', feature: 'Vận mẫu u', badgeType: 'vowel', meaning: 'quyển sách', tip: 'shū: Đi với thanh mẫu sh, vận mẫu là u (âm tròn nhô).' },
      { hanzi: '需', pinyin: 'xū', phoneme: 'ü', feature: 'Vận mẫu ü (Viết u)', badgeType: 'vowel', meaning: 'nhu cầu, cần', tip: 'xū: j, q, x khi đi với ü sẽ bỏ hai dấu chấm trên đầu viết thành u, nhưng đọc chuẩn là ü tròn môi!' }
    ]
  },
  {
    groupKey: 'rounded_u_u_umlaut',
    groupName: 'Tròn Môi (u vs ü)',
    desc: 'Phân biệt chū (vận mẫu u) với qū (vận mẫu ü)',
    maskedDisplay: '[ch/q] + [u/ü]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU [u] (chū) VS [ü] (qū):',
    options: [
      { hanzi: '出', pinyin: 'chū', phoneme: 'u', feature: 'Vận mẫu u', badgeType: 'vowel', meaning: 'đi ra ngoài', tip: 'chū: Vận mẫu u sâu trong vòm họng.' },
      { hanzi: '区', pinyin: 'qū', phoneme: 'ü', feature: 'Vận mẫu ü (Viết u)', badgeType: 'vowel', meaning: 'khu vực, quận', tip: 'qū: Vận mẫu là ü tròn môi mượt mà.' }
    ]
  },

  // --- 3. VẬN MẪU KÉP (ai vs ei, ao vs ou, ie vs üe, ui vs iu) ---
  {
    groupKey: 'compound_finals',
    groupName: 'Vận Mẫu Kép (ai vs ei)',
    desc: 'So sánh ai (mở rộng miệng rồi lướt về i) với ei (nghe như "ây")',
    maskedDisplay: 'b + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU KÉP [-ai] VS [-ei]:',
    options: [
      { hanzi: '白', pinyin: 'bái', phoneme: 'ai', feature: 'Vận Mẫu Kép ai', badgeType: 'vowel', meaning: 'màu trắng', tip: 'bái (ai): Mở rộng miệng phát âm a rồi nhanh chóng lướt nhẹ sang i.' },
      { hanzi: '杯', pinyin: 'bēi', phoneme: 'ei', feature: 'Vận Mẫu Kép ei', badgeType: 'vowel', meaning: 'cái cốc, ly', tip: 'bēi (ei): Miệng mở vừa phải như phát âm "e/ơ" rồi lướt về i (tương tự vần "ây" tiếng Việt).' }
    ]
  },
  {
    groupKey: 'compound_finals',
    groupName: 'Vận Mẫu Kép (ai vs ei)',
    desc: 'Phân biệt mǎi (ai) với měi (ei)',
    maskedDisplay: 'm + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU KÉP [-ai] VS [-ei]:',
    options: [
      { hanzi: '买', pinyin: 'mǎi', phoneme: 'ai', feature: 'Vận Mẫu Kép ai', badgeType: 'vowel', meaning: 'mua vào', tip: 'mǎi: Miệng mở rộng chữ a rồi khép dần về i.' },
      { hanzi: '美', pinyin: 'měi', phoneme: 'ei', feature: 'Vận Mẫu Kép ei', badgeType: 'vowel', meaning: 'xinh đẹp', tip: 'měi: Khẩu hình dẹt vừa, nghe như vần "mẩy".' }
    ]
  },
  {
    groupKey: 'compound_finals',
    groupName: 'Vận Mẫu Kép (ao vs ou)',
    desc: 'So sánh ao (mở rộng miệng lướt về o) với ou (nghe như "âu")',
    maskedDisplay: 'd + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU KÉP [-ao] VS [-ou]:',
    options: [
      { hanzi: '到', pinyin: 'dào', phoneme: 'ao', feature: 'Vận Mẫu Kép ao', badgeType: 'vowel', meaning: 'đến nơi', tip: 'dào (ao): Mở rộng miệng phát âm a rồi thu tròn môi về o/u.' },
      { hanzi: '豆', pinyin: 'dòu', phoneme: 'ou', feature: 'Vận Mẫu Kép ou', badgeType: 'vowel', meaning: 'hạt đậu', tip: 'dòu (ou): Khẩu hình tròn chúm từ đầu, phát âm o lướt sang u (nghe tương tự vần "âu" tiếng Việt).' }
    ]
  },
  {
    groupKey: 'compound_finals',
    groupName: 'Vận Mẫu Kép (ao vs ou)',
    desc: 'Phân biệt kǎo (ao) với kǒu (ou)',
    maskedDisplay: 'k + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU KÉP [-ao] VS [-ou]:',
    options: [
      { hanzi: '考', pinyin: 'kǎo', phoneme: 'ao', feature: 'Vận Mẫu Kép ao', badgeType: 'vowel', meaning: 'thi cử', tip: 'kǎo: Khẩu hình mở toang ra ban đầu.' },
      { hanzi: '口', pinyin: 'kǒu', phoneme: 'ou', feature: 'Vận Mẫu Kép ou', badgeType: 'vowel', meaning: 'cái miệng', tip: 'kǒu: Khẩu hình tròn chúm từ đầu, phát âm như "khẩu".' }
    ]
  },
  {
    groupKey: 'compound_finals',
    groupName: 'Vận Mẫu Kép (ie vs üe)',
    desc: 'So sánh ie (mép dẹt mỉm cười) với üe (tròn môi)',
    maskedDisplay: '[j/x] + [ie/üe]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU KÉP [ie] VS [üe]:',
    options: [
      { hanzi: '结', pinyin: 'jiē', phoneme: 'ie', feature: 'Vận Mẫu ie (Dẹt môi)', badgeType: 'vowel', meaning: 'kết nối, đơm hoa', tip: 'jiē (ie): Bắt đầu bằng âm i miệng kéo dẹt sang hai bên mỉm cười rồi lướt sang e (iê).' },
      { hanzi: '决', pinyin: 'jué', phoneme: 'üe', feature: 'Vận Mẫu üe (Tròn môi)', badgeType: 'vowel', meaning: 'quyết định', tip: 'jué (üe): Bắt đầu bằng âm ü môi chúm tròn xoe rồi lướt sang e (uyê).' }
    ]
  },
  {
    groupKey: 'compound_finals',
    groupName: 'Vận Mẫu Kép (ui vs iu)',
    desc: 'So sánh ui (thực chất là uei - nghe như "uây") với iu (thực chất là iou - nghe như "yêu")',
    maskedDisplay: 'd + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU KÉP [ui] VS [iu]:',
    options: [
      { hanzi: '对', pinyin: 'duì', phoneme: 'ui', feature: 'Vận Mẫu ui (uei)', badgeType: 'vowel', meaning: 'đúng, đối diện', tip: 'duì (ui = u-e-i): Bắt đầu từ môi tròn u rồi lướt qua ê đến i (nghe như "uây").' },
      { hanzi: '丢', pinyin: 'diū', phoneme: 'iu', feature: 'Vận Mẫu iu (i-ou)', badgeType: 'vowel', meaning: 'vứt bỏ, đánh mất', tip: 'diū (iu = i-o-u): Bắt đầu từ âm i rồi lướt qua o đến u (nghe như "tiu/yêu").' }
    ]
  },

  // --- 4. VẬN MẪU ĐƠN (o vs e, er) ---
  {
    groupKey: 'simple_o_e',
    groupName: 'Vận Mẫu Đơn (o vs e)',
    desc: 'So sánh o (tròn môi) với e (dẹt miệng, đọc như "ưa/ơ")',
    maskedDisplay: '[ ? ] + o / e',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU ĐƠN [o] VS [e]:',
    options: [
      { hanzi: '波', pinyin: 'bō', phoneme: 'o', feature: 'Vận Mẫu o (Tròn môi)', badgeType: 'vowel', meaning: 'làn sóng', tip: 'bō (o): Môi tròn, khẩu hình giữ nguyên vẹn độ tròn.' },
      { hanzi: '哥', pinyin: 'gē', phoneme: 'e', feature: 'Vận Mẫu e (Dẹt miệng)', badgeType: 'vowel', meaning: 'anh trai', tip: 'gē (e): Khóe miệng dẹt mở tự nhiên sang hai bên, lưỡi lùi về sau, đọc tương tự "cơ/cưa" tiếng Việt.' }
    ]
  },
  {
    groupKey: 'simple_o_e',
    groupName: 'Vận Mẫu Đơn (o vs e)',
    desc: 'Phân biệt mò (o) với mè (e)',
    maskedDisplay: 'm + [ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU ĐƠN [o] VS [e]:',
    options: [
      { hanzi: '墨', pinyin: 'mò', phoneme: 'o', feature: 'Vận Mẫu o (Tròn môi)', badgeType: 'vowel', meaning: 'mực viết', tip: 'mò: Giữ tròn môi khi kết thúc.' },
      { hanzi: '妹', pinyin: 'mèi', phoneme: 'ei', feature: 'Vận Mẫu e/ei', badgeType: 'vowel', meaning: 'em gái', tip: 'mèi: Khẩu hình dẹt mở nhẹ.' }
    ]
  },
  {
    groupKey: 'simple_o_e',
    groupName: 'Vận Mẫu Đơn (e vs er)',
    desc: 'So sánh è (e phẳng) với ér (er uốn lưỡi đặc biệt)',
    maskedDisplay: '[ ? ]',
    guide: 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU [e] VS [er] (UỐN LƯỠI):',
    options: [
      { hanzi: '饿', pinyin: 'è', phoneme: 'e', feature: 'Vận Mẫu e Phẳng', badgeType: 'vowel', meaning: 'đói bụng', tip: 'è (e): Lưỡi để tự nhiên không uốn cong, phát âm "ơ/ưa".' },
      { hanzi: '儿', pinyin: 'ér', phoneme: 'er', feature: 'Vận Mẫu er Uốn Lưỡi', badgeType: 'vowel', meaning: 'con cái, trẻ nhỏ', tip: 'ér (er): Vừa phát âm e vừa uốn cong đầu lưỡi lên ngạc cứng tạo âm cuốn lưỡi er đặc sắc Bắc Kinh.' }
    ]
  },
{
    "id": "fin_nasal_extra_1",
    "groupKey": "nasal_an_ang",
    "groupName": "Mũi Trước (-n) vs Mũi Sau (-ng)",
    "desc": "Phân biệt dān (-an) với dāng (-ang)",
    "maskedDisplay": "d + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-an] VS [-ang]:",
    "options": [
      {
        "hanzi": "单",
        "pinyin": "dān",
        "phoneme": "an",
        "feature": "Mũi Trước (-n)",
        "badgeType": "nasal",
        "meaning": "đơn độc, tờ đơn",
        "tip": "dān (-an): Đầu lưỡi chạm chân răng trên khi kết thúc."
      },
      {
        "hanzi": "当",
        "pinyin": "dāng",
        "phoneme": "ang",
        "feature": "Mũi Sau (-ng)",
        "badgeType": "nasal",
        "meaning": "làm, đảm đương",
        "tip": "dāng (-ang): Cuống lưỡi chạm ngạc mềm, âm ngân vang ở họng."
      }
    ]
  },
  {
    "id": "fin_nasal_extra_2",
    "groupKey": "nasal_an_ang",
    "groupName": "Mũi Trước (-n) vs Mũi Sau (-ng)",
    "desc": "Phân biệt tān (-an) với tāng (-ang)",
    "maskedDisplay": "t + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-an] VS [-ang]:",
    "options": [
      {
        "hanzi": "贪",
        "pinyin": "tān",
        "phoneme": "an",
        "feature": "Mũi Trước (-n)",
        "badgeType": "nasal",
        "meaning": "tham lam",
        "tip": "tān (-an): Âm kết thúc ở đầu lưỡi."
      },
      {
        "hanzi": "汤",
        "pinyin": "tāng",
        "phoneme": "ang",
        "feature": "Mũi Sau (-ng)",
        "badgeType": "nasal",
        "meaning": "canh, súp",
        "tip": "tāng (-ang): Âm ngân vang sâu ở cuống họng."
      }
    ]
  },
  {
    "id": "fin_nasal_extra_3",
    "groupKey": "nasal_an_ang",
    "groupName": "Mũi Trước (-n) vs Mũi Sau (-ng)",
    "desc": "Phân biệt lán (-an) với láng (-ang)",
    "maskedDisplay": "l + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-an] VS [-ang]:",
    "options": [
      {
        "hanzi": "蓝",
        "pinyin": "lán",
        "phoneme": "an",
        "feature": "Mũi Trước (-n)",
        "badgeType": "nasal",
        "meaning": "màu xanh lam",
        "tip": "lán: Đầu lưỡi chặn lợi răng trên."
      },
      {
        "hanzi": "狼",
        "pinyin": "láng",
        "phoneme": "ang",
        "feature": "Mũi Sau (-ng)",
        "badgeType": "nasal",
        "meaning": "con sói",
        "tip": "láng: Cuống lưỡi nâng lên vòm mềm."
      }
    ]
  },
  {
    "id": "fin_nasal_extra_4",
    "groupKey": "nasal_an_ang",
    "groupName": "Mũi Trước (-n) vs Mũi Sau (-ng)",
    "desc": "Phân biệt mén (-en) với méng (-eng)",
    "maskedDisplay": "m + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-en] VS [-eng]:",
    "options": [
      {
        "hanzi": "门",
        "pinyin": "mén",
        "phoneme": "en",
        "feature": "Mũi Trước (-n)",
        "badgeType": "nasal",
        "meaning": "cánh cửa",
        "tip": "mén (-en): Đọc như \"ơn/ân\", đầu lưỡi kết thúc ở chân răng."
      },
      {
        "hanzi": "蒙",
        "pinyin": "méng",
        "phoneme": "eng",
        "feature": "Mũi Sau (-ng)",
        "badgeType": "nasal",
        "meaning": "che phủ, mờ mịt",
        "tip": "méng (-eng): Cuống lưỡi chạm ngạc mềm, âm trầm họng."
      }
    ]
  },
  {
    "id": "fin_nasal_extra_5",
    "groupKey": "nasal_an_ang",
    "groupName": "Mũi Trước (-n) vs Mũi Sau (-ng)",
    "desc": "Phân biệt lǐn (-in) với lǐng (-ing)",
    "maskedDisplay": "l + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-in] VS [-ing]:",
    "options": [
      {
        "hanzi": "凛",
        "pinyin": "lǐn",
        "phoneme": "in",
        "feature": "Mũi Trước (-n)",
        "badgeType": "nasal",
        "meaning": "rét buốt",
        "tip": "lǐn: Ngắt gọn ở đầu lưỡi."
      },
      {
        "hanzi": "领",
        "pinyin": "lǐng",
        "phoneme": "ing",
        "feature": "Mũi Sau (-ng)",
        "badgeType": "nasal",
        "meaning": "cổ áo, dẫn dắt",
        "tip": "lǐng: Ngân dài ở cuống họng."
      }
    ]
  },
  {
    "id": "fin_nasal_extra_6",
    "groupKey": "nasal_an_ang",
    "groupName": "Mũi Trước (-n) vs Mũi Sau (-ng)",
    "desc": "Phân biệt qiān (-ian) với qiāng (-iang)",
    "maskedDisplay": "q + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-ian] VS [-iang]:",
    "options": [
      {
        "hanzi": "千",
        "pinyin": "qiān",
        "phoneme": "ian",
        "feature": "Mũi Trước (-n)",
        "badgeType": "nasal",
        "meaning": "một nghìn",
        "tip": "qiān (-ian): Âm nghe như \"iên\", lưỡi chạm chân răng."
      },
      {
        "hanzi": "枪",
        "pinyin": "qiāng",
        "phoneme": "iang",
        "feature": "Mũi Sau (-ng)",
        "badgeType": "nasal",
        "meaning": "khẩu súng",
        "tip": "qiāng (-iang): Miệng mở rộng chữ ang, ngân vang."
      }
    ]
  },
  {
    "id": "fin_nasal_extra_7",
    "groupKey": "nasal_an_ang",
    "groupName": "Mũi Trước (-n) vs Mũi Sau (-ng)",
    "desc": "Phân biệt kuān (-uan) với kuàng (-uang)",
    "maskedDisplay": "k + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU MŨI [-uan] VS [-uang]:",
    "options": [
      {
        "hanzi": "宽",
        "pinyin": "kuān",
        "phoneme": "uan",
        "feature": "Mũi Trước (-n)",
        "badgeType": "nasal",
        "meaning": "rộng rãi",
        "tip": "kuān (-uan): Đầu lưỡi kết thúc ở lợi trên."
      },
      {
        "hanzi": "矿",
        "pinyin": "kuàng",
        "phoneme": "uang",
        "feature": "Mũi Sau (-ng)",
        "badgeType": "nasal",
        "meaning": "mỏ quặng",
        "tip": "kuàng (-uang): Cuống lưỡi chạm vòm mềm, ngân vang."
      }
    ]
  },
  {
    "id": "fin_rounded_extra_1",
    "groupKey": "rounded_u_u_umlaut",
    "groupName": "Tròn Môi (u vs ü)",
    "desc": "Phân biệt lú (u) với lǘ (ü)",
    "maskedDisplay": "l + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT TRÒN MÔI [u] VS [ü]:",
    "options": [
      {
        "hanzi": "炉",
        "pinyin": "lú",
        "phoneme": "u",
        "feature": "Nguyên Âm u",
        "badgeType": "vowel",
        "meaning": "cái bếp lò",
        "tip": "lú (u): Môi tròn nhô ra trước, lưỡi co về sau."
      },
      {
        "hanzi": "驴",
        "pinyin": "lǘ",
        "phoneme": "ü",
        "feature": "Nguyên Âm ü (Tròn môi)",
        "badgeType": "vowel",
        "meaning": "con lừa",
        "tip": "lǘ (ü): Lưỡi giữ như phát âm \"i\", môi chúm tròn."
      }
    ]
  },
  {
    "id": "fin_rounded_extra_2",
    "groupKey": "rounded_u_u_umlaut",
    "groupName": "Tròn Môi (u vs ü)",
    "desc": "Phân biệt zú (u) với jú (ü)",
    "maskedDisplay": "[z/j] + [u/ü]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU [u] (zú) VS [ü] (jú):",
    "options": [
      {
        "hanzi": "足",
        "pinyin": "zú",
        "phoneme": "u",
        "feature": "Vận mẫu u",
        "badgeType": "vowel",
        "meaning": "bàn chân, đầy đủ",
        "tip": "zú: Vận mẫu u sâu trong vòm họng."
      },
      {
        "hanzi": "局",
        "pinyin": "jú",
        "phoneme": "ü",
        "feature": "Vận mẫu ü (Viết u)",
        "badgeType": "vowel",
        "meaning": "cục diện, ván cờ",
        "tip": "jú: j đi với ü viết thành u, đọc là ü tròn môi!"
      }
    ]
  },
  {
    "id": "fin_rounded_extra_3",
    "groupKey": "rounded_u_u_umlaut",
    "groupName": "Tròn Môi (u vs ü)",
    "desc": "Phân biệt cū (u) với qū (ü)",
    "maskedDisplay": "[c/q] + [u/ü]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU [u] (cū) VS [ü] (qū):",
    "options": [
      {
        "hanzi": "粗",
        "pinyin": "cū",
        "phoneme": "u",
        "feature": "Vận mẫu u",
        "badgeType": "vowel",
        "meaning": "thô ráp, to",
        "tip": "cū: Vận mẫu u tròn nhô bình thường."
      },
      {
        "hanzi": "区",
        "pinyin": "qū",
        "phoneme": "ü",
        "feature": "Vận mẫu ü (Viết u)",
        "badgeType": "vowel",
        "meaning": "khu vực",
        "tip": "qū: Vận mẫu ü tròn xoe ở mặt trước miệng."
      }
    ]
  },
  {
    "id": "fin_compound_extra_1",
    "groupKey": "compound_finals",
    "groupName": "Vận Mẫu Kép (ai vs ei)",
    "desc": "Phân biệt lái (ai) với léi (ei)",
    "maskedDisplay": "l + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU KÉP [-ai] VS [-ei]:",
    "options": [
      {
        "hanzi": "来",
        "pinyin": "lái",
        "phoneme": "ai",
        "feature": "Vận Mẫu Kép ai",
        "badgeType": "vowel",
        "meaning": "đến, tới",
        "tip": "lái: Miệng mở rộng a rồi lướt sang i."
      },
      {
        "hanzi": "雷",
        "pinyin": "léi",
        "phoneme": "ei",
        "feature": "Vận Mẫu Kép ei",
        "badgeType": "vowel",
        "meaning": "sấm sét",
        "tip": "léi: Khẩu hình dẹt vừa, nghe như vần \"lây\"."
      }
    ]
  },
  {
    "id": "fin_compound_extra_2",
    "groupKey": "compound_finals",
    "groupName": "Vận Mẫu Kép (ai vs ei)",
    "desc": "Phân biệt hǎi (ai) với hēi (ei)",
    "maskedDisplay": "h + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU KÉP [-ai] VS [-ei]:",
    "options": [
      {
        "hanzi": "海",
        "pinyin": "hǎi",
        "phoneme": "ai",
        "feature": "Vận Mẫu Kép ai",
        "badgeType": "vowel",
        "meaning": "biển cả",
        "tip": "hǎi: Miệng mở toang chữ a trước."
      },
      {
        "hanzi": "黑",
        "pinyin": "hēi",
        "phoneme": "ei",
        "feature": "Vận Mẫu Kép ei",
        "badgeType": "vowel",
        "meaning": "màu đen",
        "tip": "hēi: Khẩu hình hẹp dẹt, nghe như \"hây\"."
      }
    ]
  },
  {
    "id": "fin_compound_extra_3",
    "groupKey": "compound_finals",
    "groupName": "Vận Mẫu Kép (ao vs ou)",
    "desc": "Phân biệt gāo (ao) với gōu (ou)",
    "maskedDisplay": "g + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU KÉP [-ao] VS [-ou]:",
    "options": [
      {
        "hanzi": "高",
        "pinyin": "gāo",
        "phoneme": "ao",
        "feature": "Vận Mẫu Kép ao",
        "badgeType": "vowel",
        "meaning": "cao lớn",
        "tip": "gāo (ao): Miệng mở rộng chữ a rồi lướt về o."
      },
      {
        "hanzi": "钩",
        "pinyin": "gōu",
        "phoneme": "ou",
        "feature": "Vận Mẫu Kép ou",
        "badgeType": "vowel",
        "meaning": "cái móc",
        "tip": "gōu (ou): Môi tròn chúm từ đầu, nghe như vần \"gâu\"."
      }
    ]
  },
  {
    "id": "fin_compound_extra_4",
    "groupKey": "compound_finals",
    "groupName": "Vận Mẫu Kép (ie vs üe)",
    "desc": "Phân biệt xiē (ie) với xué (üe)",
    "maskedDisplay": "x + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU KÉP [ie] VS [üe]:",
    "options": [
      {
        "hanzi": "些",
        "pinyin": "xiē",
        "phoneme": "ie",
        "feature": "Vận Mẫu ie (Dẹt môi)",
        "badgeType": "vowel",
        "meaning": "một vài, một số",
        "tip": "xiē (ie): Bắt đầu bằng âm i miệng kéo dẹt sang hai bên."
      },
      {
        "hanzi": "学",
        "pinyin": "xué",
        "phoneme": "üe",
        "feature": "Vận Mẫu üe (Tròn môi)",
        "badgeType": "vowel",
        "meaning": "học tập",
        "tip": "xué (üe): Bắt đầu bằng âm ü môi chúm tròn xoe rồi lướt sang e."
      }
    ]
  },
  {
    "id": "fin_simple_extra_1",
    "groupKey": "simple_o_e",
    "groupName": "Vận Mẫu Đơn (o vs e)",
    "desc": "Phân biệt pō (o) với kē (e)",
    "maskedDisplay": "[ ? ] + o / e",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU ĐƠN [o] VS [e]:",
    "options": [
      {
        "hanzi": "坡",
        "pinyin": "pō",
        "phoneme": "o",
        "feature": "Vận Mẫu o (Tròn môi)",
        "badgeType": "vowel",
        "meaning": "con dốc",
        "tip": "pō (o): Môi tròn, khẩu hình giữ nguyên."
      },
      {
        "hanzi": "棵",
        "pinyin": "kē",
        "phoneme": "e",
        "feature": "Vận Mẫu e (Dẹt miệng)",
        "badgeType": "vowel",
        "meaning": "lượng từ cây",
        "tip": "kē (e): Khóe miệng dẹt mở tự nhiên, đọc như \"khơ/khưa\"."
      }
    ]
  },
  {
    "id": "fin_simple_extra_2",
    "groupKey": "simple_o_e",
    "groupName": "Vận Mẫu Đơn (o vs e)",
    "desc": "Phân biệt hé (e) với huó (uo)",
    "maskedDisplay": "h + [ ? ]",
    "guide": "LẮNG NGHE & PHÂN BIỆT VẬN MẪU [e] VS [uo]:",
    "options": [
      {
        "hanzi": "河",
        "pinyin": "hé",
        "phoneme": "e",
        "feature": "Vận Mẫu e Phẳng",
        "badgeType": "vowel",
        "meaning": "dòng sông",
        "tip": "hé (e): Khóe miệng dẹt sang hai bên."
      },
      {
        "hanzi": "活",
        "pinyin": "huó",
        "phoneme": "uo",
        "feature": "Vận Mẫu uo Tròn Môi",
        "badgeType": "vowel",
        "meaning": "sống, sinh hoạt",
        "tip": "huó (uo): Bắt đầu bằng âm u tròn chúm rồi sang o."
      }
    ]
  }
];

class ToneMasterGame {
  constructor() {
    this.rawWords = [...(window.CHINESE_WORDS_5000 || []), ...PHONETIC_SUPPLEMENT_WORDS];
    this.subMode = 'single_tone'; // 'single_tone', 'minimal_pairs', 'sandhi_quiz'
    this.hskLevel = 'all';
    this.playbackRate = 1.0;
    this.autoVoice = true;

    // Game stats
    this.score = 0;
    this.streak = 0;
    this.totalAnswered = 0;
    this.totalCorrect = 0;

    // Question State
    this.currentQuestion = null;
    this.isProcessingAnswer = false;

    // DOM Elements
    this.promptHanzi = document.getElementById('tmPromptHanzi');
    this.promptMeaning = document.getElementById('tmPromptMeaning');
    this.promptMaskedPinyin = document.getElementById('tmMaskedPinyin');
    this.promptGuide = document.getElementById('tmPromptGuide');
    this.scoreDisplay = document.getElementById('tmScoreDisplay');
    this.streakDisplay = document.getElementById('tmStreakDisplay');
    this.accuracyDisplay = document.getElementById('tmAccuracyDisplay');
    this.hskBadge = document.getElementById('tmHskBadge');
    this.questionBadge = document.getElementById('tmQuestionBadge');

    this.feedbackModal = document.getElementById('tmFeedbackModal');
    this.helpModal = document.getElementById('tmHelpModal');
    this.padsGrid = document.getElementById('tmTonePadsGrid');
    this.pairsGrid = document.getElementById('tmPairsGrid');
    this.soundBtn = document.getElementById('tmReplayBtn');

    // Phonetic Group Filter Elements
    this.phoneticGroup = 'all';
    this.phoneticGroupSelect = document.getElementById('tmPhoneticGroupSelect');
    this.phoneticGroupItem = document.getElementById('tmPhoneticGroupItem');
    this.hskGroupItem = document.getElementById('tmHskGroupItem');

    // Speech & Web Audio
    this.audioCtx = null;
    this.chineseVoice = null;
    this.initAudio();

    // Canvas Background
    this.bgCanvas = document.getElementById('toneBgCanvas');
    this.bgCtx = this.bgCanvas ? this.bgCanvas.getContext('2d') : null;
    // Phonetic Word Explorer State
    this.explorerType = 'initial'; // 'initial' | 'final'
    this.explorerCode = 'b';
    this.explorerBaseWords = [];
    this.explorerFilteredWords = [];
    this.explorerPage = 1;
    this.explorerPageSize = 40;
    this.explorerSearchTerm = '';
    this.explorerHskFilter = 'all';
    this.explorerToneFilter = 'all';
    this.explorerSampleHanzi = '玻';

    // Anti-Repetition & Dynamic Question Deck Engine
    this.deckByMode = {};
    this.recentQuestionHistory = [];
    this.maxRecentHistory = 35;
    this.dictPhoneticIndex = null;
    this.buildDynamicPhoneticIndexes();
  }

  init() {
    this.setupBackgroundCanvas();
    this.setupEventListeners();
    this.setupExplorerEventListeners();
    this.renderPhoneticsLab();

    // Check URL params from Learning Roadmap (?hsk=...&deck=...&mode=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hskParam = urlParams.get('hsk');
      const deckParam = urlParams.get('deck');
      const modeParam = urlParams.get('mode');

      if (hskParam !== null) {
        const normalizedHsk = hskParam === '0' ? '1' : hskParam;
        this.hskLevel = normalizedHsk;
        const hskSelect = document.getElementById('tmHskSelect');
        if (hskSelect && Array.from(hskSelect.options).some(o => o.value === normalizedHsk)) {
          hskSelect.value = normalizedHsk;
        }
      }
      this.lessonDeck = deckParam !== null ? parseInt(deckParam, 10) : null;

      if (modeParam && ['game', 'chart', 'rules', 'speaking'].includes(modeParam)) {
        setTimeout(() => this.switchMode(modeParam), 40);
      }

      const subModeParam = urlParams.get('submode');
      if (subModeParam && ['single_tone', 'minimal_pairs', 'sandhi_quiz', 'initials_drill', 'finals_drill'].includes(subModeParam)) {
        this.subMode = subModeParam;
        const subModeSelect = document.getElementById('tmSubModeSelect');
        if (subModeSelect) subModeSelect.value = subModeParam;
        this.updatePhoneticGroupDropdown();
      }
    } catch (e) {}

    this.loadNewQuestion();
    this.speakingEngine = new SpeakingPracticeEngine(this);

    // Kiểm tra URL params để mở trực tiếp Word Explorer nếu có ?initial=b hoặc ?final=ang
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const initialParam = urlParams.get('initial') || urlParams.get('init');
      const finalParam = urlParams.get('final');
      if (initialParam) {
        setTimeout(() => this.openPhoneticExplorer('initial', initialParam), 80);
      } else if (finalParam) {
        setTimeout(() => this.openPhoneticExplorer('final', finalParam), 80);
      }
    } catch (e) {}
  }

  /* ========================================================================
     AUDIO SYNTHESIS & VOICE
     ======================================================================== */
  initAudio() {
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

  speakChinese(text) {
    if (!('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = this.playbackRate;
      if (this.chineseVoice) u.voice = this.chineseVoice;

      if (this.soundBtn) {
        this.soundBtn.classList.add('speaking');
        u.onend = () => this.soundBtn.classList.remove('speaking');
        u.onerror = () => this.soundBtn.classList.remove('speaking');
      }

      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  playTonePitch(toneNumber) {
    if (!this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      switch (toneNumber) {
        case 1: // Flat 55 (High level)
          osc.frequency.setValueAtTime(360, now);
          break;
        case 2: // Rising 35
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.linearRampToValueAtTime(370, now + 0.3);
          break;
        case 3: // Dipping 214
          osc.frequency.setValueAtTime(250, now);
          osc.frequency.linearRampToValueAtTime(190, now + 0.14);
          osc.frequency.linearRampToValueAtTime(330, now + 0.35);
          break;
        case 4: // Falling 51
          osc.frequency.setValueAtTime(390, now);
          osc.frequency.linearRampToValueAtTime(180, now + 0.28);
          break;
        default:
          osc.frequency.setValueAtTime(300, now);
      }

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  playToneSoundEffect(type) {
    if (!this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {}
  }

  /* ========================================================================
     QUESTION GENERATION
     ======================================================================== */
  loadNewQuestion() {
    this.isProcessingAnswer = false;
    if (this.feedbackModal) this.feedbackModal.style.display = 'none';

    // Clear previous pad states
    document.querySelectorAll('.tm-tone-pad').forEach(p => {
      p.classList.remove('correct-glow', 'wrong-shake');
    });

    if (this.subMode === 'single_tone') {
      this.generateSingleToneQuestion();
    } else if (this.subMode === 'minimal_pairs') {
      this.generateMinimalPairQuestion();
    } else if (this.subMode === 'sandhi_quiz') {
      this.generateSandhiQuizQuestion();
    } else if (this.subMode === 'initials_drill') {
      this.generateInitialsQuestion();
    } else if (this.subMode === 'finals_drill') {
      this.generateFinalsQuestion();
    }
  }

  extractToneFromPinyin(pinyin) {
    if (!pinyin) return 1;
    // Check marks
    if (/[āēīōūǖ]/.test(pinyin)) return 1;
    if (/[áéíóúǘ]/.test(pinyin)) return 2;
    if (/[ǎěǐǒǔǚ]/.test(pinyin)) return 3;
    if (/[àèìòùǜ]/.test(pinyin)) return 4;
    return 1;
  }

  stripTone(pinyin) {
    if (!pinyin) return '';
    return pinyin
      .replace(/[āáǎà]/g, 'a')
      .replace(/[ēéěè]/g, 'e')
      .replace(/[īíǐì]/g, 'i')
      .replace(/[ōóǒò]/g, 'o')
      .replace(/[ūúǔù]/g, 'u')
      .replace(/[ǖǘǚǜ]/g, 'ü');
  }

  /* ========================================================================
     ANTI-REPETITION & DYNAMIC QUESTION ENGINE
     ======================================================================== */
  parsePinyinPhonetics(pinyinWithTone) {
    const bare = this.stripTone(pinyinWithTone).toLowerCase().trim();
    let initial = '';
    let final = bare;
    const twoChar = ['zh', 'ch', 'sh'];
    const oneChar = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'w', 'y'];
    for (const init of twoChar) {
      if (bare.startsWith(init)) {
        initial = init;
        final = bare.slice(init.length);
        return { initial, final, bare };
      }
    }
    for (const init of oneChar) {
      if (bare.startsWith(init)) {
        initial = init;
        final = bare.slice(init.length);
        return { initial, final, bare };
      }
    }
    return { initial: '', final: bare, bare };
  }

  getInitialArticInfo(phoneme) {
    const map = {
      b: { feature: 'Hai môi • Không bật hơi', badgeType: 'unasp', tip: 'Hai môi khép mở nhẹ nhàng, không bật luồng khí.' },
      p: { feature: 'Hai môi • Bật hơi mạnh', badgeType: 'asp', tip: 'Hai môi nén chặt rồi bật luồng hơi phụt mạnh.' },
      m: { feature: 'Hai môi • Âm mũi', badgeType: 'nasal', tip: 'Hai môi khép lại, luồng khí thoát nhẹ qua khoang mũi.' },
      f: { feature: 'Môi răng • Âm xát', badgeType: 'unasp', tip: 'Răng cửa trên chạm nhẹ mép môi dưới đẩy hơi.' },
      d: { feature: 'Đầu lưỡi • Không bật hơi', badgeType: 'unasp', tip: 'Đầu lưỡi chạm chân răng trên rồi nhả nhẹ.' },
      t: { feature: 'Đầu lưỡi • Bật hơi mạnh', badgeType: 'asp', tip: 'Đầu lưỡi chạm chân răng trên bật luồng khí cực mạnh.' },
      n: { feature: 'Đầu lưỡi • Âm mũi', badgeType: 'nasal', tip: 'Đầu lưỡi chạm lợi trên, âm ngân êm qua mũi.' },
      l: { feature: 'Đầu lưỡi • Âm bên', badgeType: 'unasp', tip: 'Đầu lưỡi chạm lợi trên, luồng hơi lách qua 2 bên mép lưỡi.' },
      g: { feature: 'Cuống lưỡi • Không bật hơi', badgeType: 'unasp', tip: 'Cuống lưỡi nâng chạm vòm ngạc mềm rồi nhả êm.' },
      k: { feature: 'Cuống lưỡi • Bật hơi mạnh', badgeType: 'asp', tip: 'Cuống lưỡi bật nổ luồng khí cực mạnh từ họng.' },
      h: { feature: 'Cuống lưỡi • Âm xát họng', badgeType: 'unasp', tip: 'Khí cọ xát nhẹ qua cuống họng như tiếng thở dài.' },
      j: { feature: 'Mặt lưỡi • Không bật hơi', badgeType: 'unasp', tip: 'Mặt lưỡi áp sát ngạc cứng, khóe miệng kéo dẹt sang hai bên.' },
      q: { feature: 'Mặt lưỡi • Bật hơi mạnh', badgeType: 'asp', tip: 'Mặt lưỡi áp ngạc cứng bật luồng hơi sắc lạnh qua khe lưỡi.' },
      x: { feature: 'Mặt lưỡi • Âm xát', badgeType: 'unasp', tip: 'Mặt lưỡi nâng gần ngạc cứng, khí xát êm ái qua khe hẹp.' },
      zh: { feature: 'Uốn cong lưỡi • Không bật hơi', badgeType: 'unasp', tip: 'Đầu lưỡi cong lên chạm ngạc cứng rồi nhả nhẹ.' },
      ch: { feature: 'Uốn cong lưỡi • Bật hơi mạnh', badgeType: 'asp', tip: 'Vừa uốn cong đầu lưỡi lên ngạc vừa phóng luồng hơi cực mạnh.' },
      sh: { feature: 'Uốn cong lưỡi • Âm xát', badgeType: 'unasp', tip: 'Đầu lưỡi cong lên gần ngạc cứng cho luồng khí xát qua.' },
      r: { feature: 'Uốn cong lưỡi • Dây thanh rung', badgeType: 'unasp', tip: 'Đầu lưỡi uốn cong, dây thanh âm rung nhẹ khi phát âm.' },
      z: { feature: 'Đầu lưỡi trước • Không bật hơi', badgeType: 'unasp', tip: 'Lưỡi thẳng dẹt chạm mặt trong răng cửa rồi nhả êm.' },
      c: { feature: 'Đầu lưỡi trước • Bật xì hơi mạnh', badgeType: 'asp', tip: 'Lưỡi thẳng dẹt nén chặt rồi bật luồng hơi xì cực mạnh qua kẽ răng.' },
      s: { feature: 'Đầu lưỡi trước • Âm xát xì', badgeType: 'unasp', tip: 'Lưỡi dẹt thẳng, khí cọ xát xì nhẹ nhàng qua kẽ răng.' }
    };
    return map[phoneme] || { feature: `Âm [${phoneme}]`, badgeType: 'unasp', tip: `Thanh mẫu [${phoneme}].` };
  }

  getFinalArticInfo(phoneme) {
    const map = {
      an: { feature: 'Mũi Trước (-n)', badgeType: 'nasal', tip: 'Đầu lưỡi chạm chân răng trên khi kết thúc.' },
      ang: { feature: 'Mũi Sau (-ng)', badgeType: 'nasal', tip: 'Cuống lưỡi nâng lên chạm ngạc mềm, âm ngân vang sâu ở họng.' },
      en: { feature: 'Mũi Trước (-n)', badgeType: 'nasal', tip: 'Đọc như "ơn/ân", ngắt dứt khoát ở đầu lưỡi.' },
      eng: { feature: 'Mũi Sau (-ng)', badgeType: 'nasal', tip: 'Cuống lưỡi chạm vòm mềm, âm ngân trầm sâu trong họng.' },
      in: { feature: 'Mũi Trước (-n)', badgeType: 'nasal', tip: 'Ngắt dứt khoát ở răng cửa trên.' },
      ing: { feature: 'Mũi Sau (-ng)', badgeType: 'nasal', tip: 'Âm ngân vang sâu trong khoang mũi và họng.' },
      ian: { feature: 'Mũi Trước (-n)', badgeType: 'nasal', tip: 'Lướt từ i sang an (nghe như "ien"), chạm chân răng.' },
      iang: { feature: 'Mũi Sau (-ng)', badgeType: 'nasal', tip: 'Lướt từ i sang ang, mở rộng vòm miệng ngân vang.' },
      uan: { feature: 'Mũi Trước (-n)', badgeType: 'nasal', tip: 'Tròn môi lướt sang an kết thúc ở đầu lưỡi.' },
      uang: { feature: 'Mũi Sau (-ng)', badgeType: 'nasal', tip: 'Tròn môi lướt sang ang ngân vang sâu ở họng.' },
      u: { feature: 'Nguyên âm u (Tròn nhô)', badgeType: 'vowel', tip: 'Môi tròn chúm nhô ra trước, lưỡi lùi về sau.' },
      ü: { feature: 'Nguyên âm ü (Tròn dẹt)', badgeType: 'vowel', tip: 'Môi tròn chúm, nhưng đầu lưỡi giữ nguyên vị trí âm "i".' },
      ai: { feature: 'Vận mẫu kép ai', badgeType: 'vowel', tip: 'Miệng mở toang chữ a rồi trượt nhanh về i.' },
      ei: { feature: 'Vận mẫu kép ei', badgeType: 'vowel', tip: 'Khẩu hình dẹt vừa, chuyển động nhanh từ e sang i.' },
      ao: { feature: 'Vận mẫu kép ao', badgeType: 'vowel', tip: 'Mở rộng chữ a rồi lướt về o tròn.' },
      ou: { feature: 'Vận mẫu kép ou', badgeType: 'vowel', tip: 'Môi tròn chúm từ đầu, nghe như vần "âu".' },
      ie: { feature: 'Vận mẫu kép ie', badgeType: 'vowel', tip: 'Khóe miệng dẹt kéo sang hai bên lướt sang e.' },
      üe: { feature: 'Vận mẫu kép üe', badgeType: 'vowel', tip: 'Môi chúm tròn xoe ü rồi mở sang e.' },
      o: { feature: 'Vận mẫu đơn o', badgeType: 'vowel', tip: 'Môi tròn, khẩu hình giữ nguyên.' },
      e: { feature: 'Vận mẫu đơn e', badgeType: 'vowel', tip: 'Khóe miệng mở dẹt tự nhiên, đọc như "ơ/ưa".' }
    };
    return map[phoneme] || { feature: `Vần [-${phoneme}]`, badgeType: 'vowel', tip: `Vận mẫu [-${phoneme}].` };
  }

  buildDynamicPhoneticIndexes() {
    const singleWords = (this.rawWords || []).filter(w => w.hanzi && w.hanzi.length === 1 && w.pinyin);
    const byInitialAndFinal = {};
    const byInitial = {};
    const byFinal = {};
    const byBarePinyin = {};

    singleWords.forEach(w => {
      const parsed = this.parsePinyinPhonetics(w.pinyin);
      const tone = this.extractToneFromPinyin(w.pinyin);
      const wordObj = {
        hanzi: w.hanzi,
        pinyin: w.pinyin,
        tone: tone,
        meaning: w.meaning_vn || w.meaning || '',
        level: w.level || 1,
        initial: parsed.initial,
        final: parsed.final,
        bare: parsed.bare
      };

      const comboKey = `${parsed.initial}:${parsed.final}`;
      if (!byInitialAndFinal[comboKey]) byInitialAndFinal[comboKey] = [];
      byInitialAndFinal[comboKey].push(wordObj);

      if (parsed.initial) {
        if (!byInitial[parsed.initial]) byInitial[parsed.initial] = [];
        byInitial[parsed.initial].push(wordObj);
      }

      if (parsed.final) {
        if (!byFinal[parsed.final]) byFinal[parsed.final] = [];
        byFinal[parsed.final].push(wordObj);
      }

      if (parsed.bare) {
        if (!byBarePinyin[parsed.bare]) byBarePinyin[parsed.bare] = [];
        if (!byBarePinyin[parsed.bare].some(x => x.tone === tone)) {
          byBarePinyin[parsed.bare].push(wordObj);
        }
      }
    });

    this.dictPhoneticIndex = {
      singleWords,
      byInitialAndFinal,
      byInitial,
      byFinal,
      byBarePinyin,
      toneMinimalPairs: Object.entries(byBarePinyin)
        .filter(([k, list]) => list.length >= 2)
        .map(([bare, options]) => ({
          id: `dyn_tone_${bare}`,
          options: options.sort((a, b) => a.tone - b.tone)
        }))
    };
  }

  shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  recordQuestionHistory(sig) {
    if (!sig) return;
    this.recentQuestionHistory.push(sig);
    if (this.recentQuestionHistory.length > this.maxRecentHistory) {
      this.recentQuestionHistory.shift();
    }
  }

  drawItemFromDeck(poolKey, pool, dynamicGenerator = null) {
    if (!pool || pool.length === 0) return null;

    // 35% chance to weave in a dynamically generated question if generator available
    if (dynamicGenerator && Math.random() < 0.35) {
      const dyn = dynamicGenerator();
      if (dyn) {
        const dynSig = dyn.id || (dyn.options ? dyn.options.map(o => o.hanzi).join('-') : dyn.hanzi);
        if (!this.recentQuestionHistory.includes(dynSig)) {
          this.recordQuestionHistory(dynSig);
          return dyn;
        }
      }
    }

    const effectiveHistoryLimit = Math.min(this.maxRecentHistory, Math.max(1, Math.floor(pool.length * 0.75)));
    const activeHistory = this.recentQuestionHistory.slice(-effectiveHistoryLimit);

    if (!this.deckByMode[poolKey] || this.deckByMode[poolKey].length === 0) {
      this.deckByMode[poolKey] = this.shuffleArray(pool);
    }

    let attempts = 0;
    let chosen = null;
    while (this.deckByMode[poolKey].length > 0 && attempts < pool.length) {
      const candidate = this.deckByMode[poolKey].pop();
      const sig = candidate.id || (candidate.options ? candidate.options.map(o => o.hanzi).join('-') : candidate.hanzi);
      if (!activeHistory.includes(sig) || this.deckByMode[poolKey].length === 0) {
        chosen = candidate;
        this.recordQuestionHistory(sig);
        break;
      } else {
        this.deckByMode[poolKey].unshift(candidate);
        attempts++;
      }
    }

    if (!chosen) {
      this.deckByMode[poolKey] = this.shuffleArray(pool);
      chosen = this.deckByMode[poolKey].pop();
      const sig = chosen.id || (chosen.options ? chosen.options.map(o => o.hanzi).join('-') : chosen.hanzi);
      this.recordQuestionHistory(sig);
    }
    return chosen;
  }

  generateDynamicTonePairGroup() {
    if (!this.dictPhoneticIndex || !this.dictPhoneticIndex.toneMinimalPairs.length) return null;
    const list = this.dictPhoneticIndex.toneMinimalPairs;
    return list[Math.floor(Math.random() * list.length)];
  }

  generateDynamicInitialsGroup(groupKey) {
    if (!this.dictPhoneticIndex) return null;
    const { byInitialAndFinal } = this.dictPhoneticIndex;

    let targetPhonemes = [];
    let groupName = 'Thanh Mẫu Tự Nhiên';
    let guide = 'LẮNG NGHE & PHÂN BIỆT THANH MẪU:';

    if (groupKey === 'labial') {
      targetPhonemes = ['b', 'p', 'm'];
      groupName = 'Âm Hai Môi (b / p / m)';
    } else if (groupKey === 'contrast_zh_z') {
      const sub = Math.random() < 0.5 ? ['zh', 'z'] : (Math.random() < 0.5 ? ['ch', 'c'] : ['sh', 's']);
      targetPhonemes = sub;
      groupName = `Âm Đầu Lưỡi Trước vs Uốn Lưỡi (${sub.join(' vs ')})`;
    } else if (groupKey === 'aspirated_pairs') {
      const pairs = [['b', 'p'], ['d', 't'], ['g', 'k'], ['j', 'q'], ['zh', 'ch'], ['z', 'c']];
      targetPhonemes = pairs[Math.floor(Math.random() * pairs.length)];
      groupName = `Bật Hơi vs Không Bật Hơi (${targetPhonemes.join(' vs ')})`;
    } else if (groupKey === 'palatal') {
      targetPhonemes = ['j', 'q', 'x'];
      groupName = 'Âm Mặt Lưỡi (j / q / x)';
    } else if (groupKey === 'alveolar') {
      targetPhonemes = ['d', 't', 'n', 'l'];
      groupName = 'Âm Đầu Lưỡi (d / t / n / l)';
    } else if (groupKey === 'velar') {
      targetPhonemes = ['g', 'k', 'h'];
      groupName = 'Âm Cuống Lưỡi (g / k / h)';
    } else if (groupKey === 'dental_sibilant') {
      targetPhonemes = ['z', 'c', 's'];
      groupName = 'Âm Đầu Lưỡi Trước (z / c / s)';
    } else if (groupKey === 'retroflex') {
      targetPhonemes = ['zh', 'ch', 'sh'];
      groupName = 'Âm Uốn Lưỡi (zh / ch / sh)';
    } else {
      const allPairs = [
        ['b', 'p'], ['d', 't'], ['g', 'k'], ['j', 'q'], ['zh', 'ch'], ['z', 'c'],
        ['zh', 'z'], ['ch', 'c'], ['sh', 's'], ['b', 'p', 'm'], ['j', 'q', 'x']
      ];
      targetPhonemes = allPairs[Math.floor(Math.random() * allPairs.length)];
      groupName = `Phân Biệt Thanh Mẫu (${targetPhonemes.join(' / ')})`;
    }

    const allFinals = Object.keys(this.dictPhoneticIndex.byFinal);
    const commonFinals = allFinals.filter(f => {
      const matchCount = targetPhonemes.filter(p => (byInitialAndFinal[`${p}:${f}`] || []).length > 0).length;
      return matchCount >= 2;
    });

    if (commonFinals.length === 0) return null;
    const final = commonFinals[Math.floor(Math.random() * commonFinals.length)];

    const options = [];
    for (const p of targetPhonemes) {
      const candidates = byInitialAndFinal[`${p}:${final}`];
      if (candidates && candidates.length > 0) {
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        const info = this.getInitialArticInfo(p);
        options.push({
          hanzi: chosen.hanzi,
          pinyin: chosen.pinyin,
          phoneme: p,
          feature: info.feature,
          badgeType: info.badgeType,
          meaning: chosen.meaning,
          tip: `${chosen.hanzi} (${chosen.pinyin}): ${info.tip}`
        });
      }
    }

    if (options.length < 2) return null;

    return {
      id: `dyn_init_${targetPhonemes.join('_')}_${final}`,
      groupKey: groupKey,
      groupName: groupName,
      desc: `Phân biệt ${options.map(o => o.phoneme).join(', ')} với vần -${final}`,
      maskedDisplay: `[ ? ] + ${final}`,
      guide: guide,
      options: options
    };
  }

  generateDynamicFinalsGroup(groupKey) {
    if (!this.dictPhoneticIndex) return null;
    const { byInitialAndFinal } = this.dictPhoneticIndex;

    let targetPairs = [];
    let groupName = 'Vận Mẫu Tự Nhiên';
    let guide = 'LẮNG NGHE & PHÂN BIỆT VẬN MẪU:';

    if (groupKey === 'nasal_an_ang') {
      const sub = Math.random() < 0.4 ? ['an', 'ang'] : (Math.random() < 0.5 ? ['en', 'eng'] : (Math.random() < 0.5 ? ['in', 'ing'] : ['ian', 'iang']));
      targetPairs = sub;
      groupName = `Mũi Trước (-n) vs Mũi Sau (-ng) (-${sub.join(' vs -')})`;
    } else if (groupKey === 'compound_finals') {
      const sub = Math.random() < 0.5 ? ['ai', 'ei'] : (Math.random() < 0.5 ? ['ao', 'ou'] : ['ie', 'üe']);
      targetPairs = sub;
      groupName = `Vận Mẫu Kép (-${sub.join(' vs -')})`;
    } else if (groupKey === 'rounded_u_u_umlaut') {
      targetPairs = ['u', 'ü'];
      groupName = 'Tròn Môi (u vs ü)';
    } else if (groupKey === 'simple_o_e') {
      targetPairs = ['o', 'e'];
      groupName = 'Vận Mẫu Đơn (o vs e)';
    } else {
      const allFinalPairs = [['an', 'ang'], ['en', 'eng'], ['in', 'ing'], ['ai', 'ei'], ['ao', 'ou'], ['ie', 'üe'], ['u', 'ü']];
      targetPairs = allFinalPairs[Math.floor(Math.random() * allFinalPairs.length)];
      groupName = `Phân Biệt Vận Mẫu (-${targetPairs.join(' vs -')})`;
    }

    const initials = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'];
    const matchingInitials = initials.filter(init => {
      const hasFirst = (byInitialAndFinal[`${init}:${targetPairs[0]}`] || []).length > 0;
      const hasSecond = (byInitialAndFinal[`${init}:${targetPairs[1]}`] || []).length > 0;
      return hasFirst && hasSecond;
    });

    if (matchingInitials.length === 0) return null;
    const init = matchingInitials[Math.floor(Math.random() * matchingInitials.length)];

    const options = [];
    for (const f of targetPairs) {
      const candidates = byInitialAndFinal[`${init}:${f}`];
      if (candidates && candidates.length > 0) {
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        const info = this.getFinalArticInfo(f);
        options.push({
          hanzi: chosen.hanzi,
          pinyin: chosen.pinyin,
          phoneme: f,
          feature: info.feature,
          badgeType: info.badgeType,
          meaning: chosen.meaning,
          tip: `${chosen.hanzi} (${chosen.pinyin}): ${info.tip}`
        });
      }
    }

    if (options.length < 2) return null;

    return {
      id: `dyn_fin_${init}_${targetPairs.join('_')}`,
      groupKey: groupKey,
      groupName: groupName,
      desc: `Phân biệt -${targetPairs.join(' với -')} với thanh mẫu ${init}`,
      maskedDisplay: `${init} + [ ? ]`,
      guide: guide,
      options: options
    };
  }

  generateSingleToneQuestion() {
    this.padsGrid.style.display = 'grid';
    this.pairsGrid.style.display = 'none';

    let pool = this.rawWords.filter(w => w.hanzi && w.hanzi.length === 1 && w.pinyin);
    if (this.hskLevel !== 'all') {
      const lvl = parseInt(this.hskLevel, 10);
      if (this.lessonDeck !== null && !isNaN(this.lessonDeck) && window.PinyinRoadmap) {
        const deckWords = window.PinyinRoadmap.getLessonWords(lvl, this.lessonDeck).filter(w => w.pinyin);
        if (deckWords.length > 0) {
          pool = deckWords;
        } else {
          const filtered = pool.filter(w => w.level === lvl);
          if (filtered.length > 0) pool = filtered;
        }
      } else {
        const filtered = pool.filter(w => w.level === lvl);
        if (filtered.length > 0) pool = filtered;
      }
    }
    if (pool.length === 0) pool = this.rawWords.filter(w => w.pinyin);

    const poolKey = `single_tone_${this.hskLevel}_${this.lessonDeck || 'all'}`;
    const word = this.drawItemFromDeck(poolKey, pool);
    const tone = this.extractToneFromPinyin(word.pinyin);
    const barePinyin = this.stripTone(word.pinyin);

    this.currentQuestion = {
      type: 'single_tone',
      hanzi: word.hanzi,
      pinyin: word.pinyin,
      clean: barePinyin,
      correctTone: tone,
      level: word.level,
      meaning: word.meaning_vn || word.meaning || '',
      analysis: `Từ "${word.hanzi}" (${word.pinyin}) mang <strong>Thanh ${tone}</strong>. ${this.getToneDescription(tone)}`
    };

    // UI Updates
    this.promptHanzi.textContent = word.hanzi;
    this.promptMeaning.textContent = word.meaning_vn || word.meaning;
    this.promptMaskedPinyin.textContent = `${barePinyin} + [?]`;
    this.promptGuide.textContent = 'HÃY LẮNG NGHE VÀ CHỌN THANH ĐIỆU CHÍNH XÁC:';
    this.hskBadge.textContent = `HSK ${word.level}`;
    this.questionBadge.textContent = 'PHÂN BIỆT 4 THANH ĐIỆU';

    if (this.autoVoice) {
      setTimeout(() => this.speakChinese(word.hanzi), 200);
    }
  }

  generateMinimalPairQuestion() {
    this.padsGrid.style.display = 'none';
    this.pairsGrid.style.display = 'grid';

    const pairGroup = this.drawItemFromDeck(
      'minimal_pairs',
      MINIMAL_PAIRS,
      () => this.generateDynamicTonePairGroup()
    );
    const targetWord = pairGroup.options[Math.floor(Math.random() * pairGroup.options.length)];
    const bareBase = this.stripTone(targetWord.pinyin);

    const optCount = pairGroup.options.length;
    this.pairsGrid.className = `tm-pairs-grid cols-${optCount > 2 ? (optCount > 3 ? '4' : '3') : '2'}`;

    this.currentQuestion = {
      type: 'minimal_pairs',
      hanzi: targetWord.hanzi,
      pinyin: targetWord.pinyin,
      correctTone: targetWord.tone,
      meaning: targetWord.meaning,
      options: pairGroup.options,
      analysis: `Bạn vừa nghe từ "<strong>${targetWord.hanzi}</strong>" (${targetWord.pinyin}) - <strong>Thanh ${targetWord.tone}</strong>, mang nghĩa là "${targetWord.meaning}".`
    };

    this.promptHanzi.textContent = '🎧 ?';
    this.promptMeaning.textContent = 'Lắng nghe âm thanh và chọn đúng từ:';
    // Mask the tone so player must listen, NOT just read the pinyin!
    this.promptMaskedPinyin.textContent = `${bareBase} + [?]`;
    this.promptGuide.textContent = 'CHỌN TỪ ĐÚNG VỚI ÂM THANH BẠN VỪA NGHE:';
    this.hskBadge.textContent = 'ĐỐI LẬP THANH';
    this.questionBadge.textContent = 'CẶP TỪ TƯƠNG PHẢN';

    // Render pairs choices
    this.pairsGrid.innerHTML = '';
    pairGroup.options.forEach((opt, idx) => {
      const card = document.createElement('div');
      card.className = 'pair-card-choice';
      card.innerHTML = `
        <span class="pair-hanzi">${opt.hanzi}</span>
        <span class="pair-pinyin">${opt.pinyin} (Thanh ${opt.tone})</span>
        <span class="pair-meaning">${opt.meaning}</span>
      `;
      card.addEventListener('click', () => {
        this.submitAnswer(opt.tone, opt.hanzi);
      });
      this.pairsGrid.appendChild(card);
    });

    if (this.autoVoice) {
      setTimeout(() => this.speakChinese(targetWord.hanzi), 200);
    }
  }

  generateSandhiQuizQuestion() {
    this.padsGrid.style.display = 'grid';
    this.pairsGrid.style.display = 'none';

    const sandhiPool = [
      { id: 'sd_nihao', hanzi: '你好', pinyin: 'nǐ hǎo ➔ ní hǎo', targetTone: 2, note: 'Từ "你" vốn là thanh 3, đứng trước thanh 3 "好" nên biến điệu thành thanh 2!' },
      { id: 'sd_keyi', hanzi: '可以', pinyin: 'kě yǐ ➔ ké yǐ', targetTone: 2, note: 'Từ "可" vốn là thanh 3, đứng trước "以" nên biến điệu đọc thành thanh 2!' },
      { id: 'sd_bushi', hanzi: '不是', pinyin: 'bù shì ➔ bú shì', targetTone: 2, note: 'Chữ "不" đứng trước thanh 4 "是" phải biến điệu đọc thành thanh 2 (bú)!' },
      { id: 'sd_buyao', hanzi: '不要', pinyin: 'bù yào ➔ bú yào', targetTone: 2, note: 'Chữ "不" đứng trước thanh 4 "要" phải đọc biến điệu thành thanh 2 (bú)!' },
      { id: 'sd_yiding', hanzi: '一定', pinyin: 'yī dìng ➔ yí dìng', targetTone: 2, note: 'Chữ "一" đứng trước thanh 4 "定" phải đọc thành thanh 2 (yí)!' },
      { id: 'sd_yiqi', hanzi: '一起', pinyin: 'yī qǐ ➔ yì qǐ', targetTone: 4, note: 'Chữ "一" đứng trước thanh 3 "起" phải đọc thành thanh 4 (yì)!' },
      { id: 'sd_yitian', hanzi: '一天', pinyin: 'yī tiān ➔ yì tiān', targetTone: 4, note: 'Chữ "一" đứng trước thanh 1 "天" phải đọc thành thanh 4 (yì)!' },
      { id: 'sd_budui', hanzi: '不对', pinyin: 'bù duì ➔ bú duì', targetTone: 2, note: 'Chữ "不" đứng trước thanh 4 "对" biến điệu thành thanh 2 (bú)!' },
      { id: 'sd_liaojie', hanzi: '了解', pinyin: 'liǎo jiě ➔ liáo jiě', targetTone: 2, note: 'Từ "了" mang thanh 3, đứng trước thanh 3 "解" biến điệu thành thanh 2 (liáo)!' },
      { id: 'sd_meihao', hanzi: '美好', pinyin: 'měi hǎo ➔ méi hǎo', targetTone: 2, note: 'Từ "美" mang thanh 3, đứng trước thanh 3 "好" biến điệu thành thanh 2 (méi)!' },
      { id: 'sd_yiban', hanzi: '一般', pinyin: 'yī bān ➔ yì bān', targetTone: 4, note: 'Chữ "一" đứng trước thanh 1 "般" biến điệu đọc thành thanh 4 (yì)!' },
      { id: 'sd_yiyang', hanzi: '一样', pinyin: 'yī yàng ➔ yí yàng', targetTone: 2, note: 'Chữ "一" đứng trước thanh 4 "样" biến điệu đọc thành thanh 2 (yí)!' }
    ];

    const q = this.drawItemFromDeck('sandhi_quiz', sandhiPool);
    this.currentQuestion = {
      type: 'sandhi_quiz',
      hanzi: q.hanzi,
      pinyin: q.pinyin,
      correctTone: q.targetTone,
      meaning: 'Quy tắc biến điệu',
      analysis: q.note
    };

    this.promptHanzi.textContent = q.hanzi;
    this.promptMeaning.textContent = 'Từ đầu tiên đọc theo thanh mấy?';
    this.promptMaskedPinyin.textContent = q.hanzi;
    this.promptGuide.textContent = 'QUY TẮC BIẾN ĐIỆU: CHỮ ĐẦU TIÊN PHÁT ÂM THANH MẤY?';
    this.hskBadge.textContent = 'BIẾN ĐIỆU';
    this.questionBadge.textContent = 'THỬ THÁCH BIẾN ĐIỆU';

    if (this.autoVoice) {
      setTimeout(() => this.speakChinese(q.hanzi), 200);
    }
  }

  /* ========================================================================
     PHONETIC DRILL GENERATION (INITIALS & FINALS DISCRIMINATION)
     ======================================================================== */
  updatePhoneticGroupDropdown() {
    if (!this.phoneticGroupItem || !this.phoneticGroupSelect) return;

    if (this.subMode === 'initials_drill') {
      this.phoneticGroupItem.style.display = 'flex';
      if (this.hskGroupItem) this.hskGroupItem.style.display = 'none';

      this.phoneticGroupSelect.innerHTML = `
        <option value="all">🎯 Tất cả 9 nhóm Thanh Mẫu</option>
        <option value="labial">👄 Âm Hai Môi (b / p / m)</option>
        <option value="labiodental">🦷 Âm Môi Răng (f vs h/b/p)</option>
        <option value="alveolar">👅 Âm Đầu Lưỡi Giữa (d / t / n / l)</option>
        <option value="velar">🗣️ Âm Gốc Lưỡi (g / k / h)</option>
        <option value="palatal">😁 Âm Mặt Lưỡi (j / q / x)</option>
        <option value="retroflex">🌀 Âm Uốn Lưỡi (zh / ch / sh / r)</option>
        <option value="dental_sibilant">⚡ Âm Đầu Lưỡi Trước (z / c / s)</option>
        <option value="contrast_zh_z">🔥 Uốn Lưỡi vs Thẳng Lưỡi (zh/ch/sh vs z/c/s)</option>
        <option value="aspirated_pairs">💨 Cặp Bật Hơi vs Không Bật Hơi</option>
      `;
      this.phoneticGroup = 'all';
    } else if (this.subMode === 'finals_drill') {
      this.phoneticGroupItem.style.display = 'flex';
      if (this.hskGroupItem) this.hskGroupItem.style.display = 'none';

      this.phoneticGroupSelect.innerHTML = `
        <option value="all">🎯 Tất cả nhóm Vận Mẫu</option>
        <option value="nasal_an_ang">👃 Mũi Trước (-n) vs Mũi Sau (-ng)</option>
        <option value="rounded_u_u_umlaut">⭕ Tròn Môi (u vs ü)</option>
        <option value="compound_finals">🔄 Vận Mẫu Kép (ai/ei, ao/ou, ie/üe...)</option>
        <option value="simple_o_e">🔤 Vận Mẫu Đơn (o vs e, er)</option>
      `;
      this.phoneticGroup = 'all';
    } else {
      this.phoneticGroupItem.style.display = 'none';
      if (this.hskGroupItem) this.hskGroupItem.style.display = 'flex';
    }
  }

  generateInitialsQuestion() {
    this.padsGrid.style.display = 'none';
    this.pairsGrid.style.display = 'grid';

    let pool = INITIALS_DRILL_DATA;
    const groupKey = this.phoneticGroup || 'all';
    if (groupKey !== 'all') {
      const filtered = pool.filter(item => item.groupKey === groupKey);
      if (filtered.length > 0) pool = filtered;
    }

    const group = this.drawItemFromDeck(
      `initials_${groupKey}`,
      pool,
      () => this.generateDynamicInitialsGroup(groupKey)
    );
    const targetWord = group.options[Math.floor(Math.random() * group.options.length)];

    this.currentQuestion = {
      type: 'initials_drill',
      groupKey: group.groupKey,
      groupName: group.groupName,
      desc: group.desc,
      hanzi: targetWord.hanzi,
      pinyin: targetWord.pinyin,
      targetPhoneme: targetWord.phoneme,
      feature: targetWord.feature,
      meaning: targetWord.meaning,
      options: group.options,
      correctWord: targetWord
    };

    this.promptHanzi.textContent = '🎧 ?';
    this.promptMeaning.textContent = `Nghĩa: "${targetWord.meaning}"`;
    this.promptMaskedPinyin.textContent = group.maskedDisplay || '[ ? ] + ...';
    this.promptGuide.textContent = group.guide || `PHÂN BIỆT THANH MẪU: ${group.groupName.toUpperCase()}`;
    this.hskBadge.textContent = 'THANH MẪU';
    this.questionBadge.textContent = group.groupName.toUpperCase();

    // Set grid columns
    this.pairsGrid.className = `tm-pairs-grid cols-${group.options.length}`;
    this.pairsGrid.innerHTML = '';

    group.options.forEach((opt, idx) => {
      const card = document.createElement('div');
      card.className = 'pair-card-choice phonetic-card-choice';
      card.dataset.index = (idx + 1).toString();

      // Highlight target initial in pinyin
      const highlightedPinyin = opt.pinyin.replace(
        new RegExp(`^${opt.phoneme}`, 'i'),
        `<span class="hl-phoneme">${opt.phoneme}</span>`
      );

      const badgeClass = opt.badgeType === 'asp' ? 'badge-asp' : (opt.badgeType === 'nasal' ? 'badge-nasal' : 'badge-unasp');

      card.innerHTML = `
        <span class="phonetic-card-kbd">[${idx + 1}]</span>
        <div class="phonetic-card-top">
          <span class="pair-hanzi">${opt.hanzi}</span>
          <span class="phonetic-target-badge ${badgeClass}">[ ${opt.phoneme} ]</span>
        </div>
        <span class="pair-pinyin">${highlightedPinyin}</span>
        <span class="phonetic-feature-pill">${opt.feature}</span>
        <span class="pair-meaning">${opt.meaning}</span>
      `;

      card.addEventListener('click', () => {
        this.submitPhoneticAnswer(card, opt, targetWord, group);
      });

      this.pairsGrid.appendChild(card);
    });

    if (this.autoVoice) {
      setTimeout(() => this.speakChinese(targetWord.hanzi), 200);
    }
  }

  generateFinalsQuestion() {
    this.padsGrid.style.display = 'none';
    this.pairsGrid.style.display = 'grid';

    let pool = FINALS_DRILL_DATA;
    const groupKey = this.phoneticGroup || 'all';
    if (groupKey !== 'all') {
      const filtered = pool.filter(item => item.groupKey === groupKey);
      if (filtered.length > 0) pool = filtered;
    }

    const group = this.drawItemFromDeck(
      `finals_${groupKey}`,
      pool,
      () => this.generateDynamicFinalsGroup(groupKey)
    );
    const targetWord = group.options[Math.floor(Math.random() * group.options.length)];

    this.currentQuestion = {
      type: 'finals_drill',
      groupKey: group.groupKey,
      groupName: group.groupName,
      desc: group.desc,
      hanzi: targetWord.hanzi,
      pinyin: targetWord.pinyin,
      targetPhoneme: targetWord.phoneme,
      feature: targetWord.feature,
      meaning: targetWord.meaning,
      options: group.options,
      correctWord: targetWord
    };

    this.promptHanzi.textContent = '🎧 ?';
    this.promptMeaning.textContent = `Nghĩa: "${targetWord.meaning}"`;
    this.promptMaskedPinyin.textContent = group.maskedDisplay || '... + [ ? ]';
    this.promptGuide.textContent = group.guide || `PHÂN BIỆT VẬN MẪU: ${group.groupName.toUpperCase()}`;
    this.hskBadge.textContent = 'VẬN MẪU';
    this.questionBadge.textContent = group.groupName.toUpperCase();

    // Set grid columns
    this.pairsGrid.className = `tm-pairs-grid cols-${group.options.length}`;
    this.pairsGrid.innerHTML = '';

    group.options.forEach((opt, idx) => {
      const card = document.createElement('div');
      card.className = 'pair-card-choice phonetic-card-choice';
      card.dataset.index = (idx + 1).toString();

      // Highlight target final in pinyin
      const highlightedPinyin = opt.pinyin.replace(
        new RegExp(`${opt.phoneme}$`, 'i'),
        `<span class="hl-phoneme">${opt.phoneme}</span>`
      );

      const badgeClass = opt.badgeType === 'nasal' ? 'badge-nasal' : 'badge-vowel';

      card.innerHTML = `
        <span class="phonetic-card-kbd">[${idx + 1}]</span>
        <div class="phonetic-card-top">
          <span class="pair-hanzi">${opt.hanzi}</span>
          <span class="phonetic-target-badge ${badgeClass}">[ ${opt.phoneme} ]</span>
        </div>
        <span class="pair-pinyin">${highlightedPinyin}</span>
        <span class="phonetic-feature-pill">${opt.feature}</span>
        <span class="pair-meaning">${opt.meaning}</span>
      `;

      card.addEventListener('click', () => {
        this.submitPhoneticAnswer(card, opt, targetWord, group);
      });

      this.pairsGrid.appendChild(card);
    });

    if (this.autoVoice) {
      setTimeout(() => this.speakChinese(targetWord.hanzi), 200);
    }
  }

  submitPhoneticAnswer(cardEl, selectedOpt, targetWord, group) {
    if (this.isProcessingAnswer || !this.currentQuestion) return;
    this.isProcessingAnswer = true;

    this.totalAnswered++;
    const isCorrect = (selectedOpt.hanzi === targetWord.hanzi);

    // Build rich feedback HTML
    const compareHtml = group.options.map(opt => `
      <div class="drill-compare-item">
        <span class="drill-compare-badge ${opt.badgeType === 'asp' ? 'badge-asp' : (opt.badgeType === 'nasal' ? 'badge-nasal' : 'badge-unasp')}">[ ${opt.phoneme} ]</span>
        <div>
          <strong>${opt.hanzi} (${opt.pinyin})</strong>: ${opt.tip}
        </div>
      </div>
    `).join('');

    const analysisHtml = `
      <div class="feedback-phonetic-drill">
        <div class="drill-target-highlight">
          <span class="drill-tag">🎯 ĐÁP ÁN ĐÚNG VỪA PHÁT:</span>
          <strong>${targetWord.hanzi}</strong> (pinyin: <strong>${targetWord.pinyin}</strong>) — [<strong>${targetWord.phoneme}</strong>]: ${targetWord.feature}.
        </div>
        <div class="drill-point">
          <strong>💡 Mẹo nhận diện:</strong> ${targetWord.tip}
        </div>
        <div class="drill-compare-list">
          <div class="drill-compare-title">⚖️ So sánh với các âm khác trong nhóm ${group.groupName}:</div>
          ${compareHtml}
        </div>
      </div>
    `;

    this.currentQuestion.analysis = analysisHtml;

    if (isCorrect) {
      this.totalCorrect++;
      this.streak++;
      const pts = 120 + (this.streak * 25);
      this.score += pts;

      this.playToneSoundEffect('correct');
      if (cardEl) cardEl.classList.add('correct-card');

      this.scoreDisplay.textContent = this.score;
      this.streakDisplay.textContent = this.streak;
      this.accuracyDisplay.textContent = `${Math.round((this.totalCorrect / this.totalAnswered) * 100)}%`;

      if (window.PinyinRoadmap) {
        window.PinyinRoadmap.recordActivity('tone', 1);
      }

      const curHigh = parseInt(localStorage.getItem('tone_master_score') || '0', 10);
      if (this.score > curHigh) {
        localStorage.setItem('tone_master_score', this.score.toString());
        if (window.PinyinAuth && typeof window.PinyinAuth.triggerDebouncedSync === 'function') {
          window.PinyinAuth.triggerDebouncedSync();
        }
      }

      this.showFeedbackModal(true, pts);
    } else {
      this.streak = 0;
      this.streakDisplay.textContent = '0';
      this.accuracyDisplay.textContent = `${Math.round((this.totalCorrect / this.totalAnswered) * 100)}%`;

      this.playToneSoundEffect('wrong');
      if (cardEl) cardEl.classList.add('wrong-card');

      // Highlight the correct card so player instantly learns
      this.pairsGrid.querySelectorAll('.pair-card-choice').forEach(c => {
        if (c.querySelector('.pair-hanzi')?.textContent === targetWord.hanzi) {
          c.classList.add('correct-card');
        }
      });

      this.showFeedbackModal(false, 0);
    }
  }

  getToneDescription(tone) {
    switch (tone) {
      case 1: return 'Thanh 1 (Âm Bình): Giữ cao độ 55, ngân dài bằng phẳng và vang đều.';
      case 2: return 'Thanh 2 (Dương Bình): Bắt đầu từ mức 3 lướt lên mức 5, tương tự dấu sắc tiếng Việt.';
      case 3: return 'Thanh 3 (Thượng Thanh): Hạ trầm xuống mức 1 rồi vút nhẹ lên mức 4, trầm bổng rõ rệt.';
      case 4: return 'Thanh 4 (Khứ Thanh): Rơi thẳng từ đỉnh cao 5 xuống đáy 1, cực kỳ dứt khoát mạnh mẽ.';
      default: return '';
    }
  }

  /* ========================================================================
     SUBMIT ANSWER & FEEDBACK MODAL
     ======================================================================== */
  submitAnswer(selectedTone, selectedHanzi = null) {
    if (this.isProcessingAnswer || !this.currentQuestion) return;
    this.isProcessingAnswer = true;

    this.totalAnswered++;
    const isCorrect = (selectedHanzi && this.currentQuestion.type === 'minimal_pairs')
      ? (selectedHanzi === this.currentQuestion.hanzi)
      : (selectedTone === this.currentQuestion.correctTone);

    const padEl = document.getElementById(`tonePad${selectedTone}`);

    if (isCorrect) {
      this.totalCorrect++;
      this.streak++;
      const pts = 100 + (this.streak * 20);
      this.score += pts;

      this.playToneSoundEffect('correct');
      if (padEl) padEl.classList.add('correct-glow');

      // Update telemetry
      this.scoreDisplay.textContent = this.score;
      this.streakDisplay.textContent = this.streak;
      this.accuracyDisplay.textContent = `${Math.round((this.totalCorrect / this.totalAnswered) * 100)}%`;

      if (window.PinyinRoadmap) {
        window.PinyinRoadmap.recordActivity('tone', 1);
      }

      const curHigh = parseInt(localStorage.getItem('tone_master_score') || '0', 10);
      if (this.score > curHigh) {
        localStorage.setItem('tone_master_score', this.score.toString());
        if (window.PinyinAuth && typeof window.PinyinAuth.triggerDebouncedSync === 'function') {
          window.PinyinAuth.triggerDebouncedSync();
        }
      }

      // Show Popup Modal
      this.showFeedbackModal(true, pts);
    } else {
      this.streak = 0;
      this.streakDisplay.textContent = '0';
      this.accuracyDisplay.textContent = `${Math.round((this.totalCorrect / this.totalAnswered) * 100)}%`;

      this.playToneSoundEffect('wrong');
      if (padEl) padEl.classList.add('wrong-shake');

      // Show Correct Feedback
      this.showFeedbackModal(false, 0);
    }
  }

  showFeedbackModal(isCorrect, pts) {
    const q = this.currentQuestion;
    const modal = this.feedbackModal;
    const icon = document.getElementById('tmFeedbackIcon');
    const title = document.getElementById('tmFeedbackTitle');
    const ptsEl = document.getElementById('tmFeedbackPts');

    if (isCorrect) {
      icon.textContent = '🎉';
      title.textContent = 'CHÍNH XÁC! TAI RẤT NHẠY';
      title.style.color = '#10b981';
      ptsEl.textContent = `+${pts} ĐIỂM ⭐`;
    } else {
      icon.textContent = '💡';
      if (q.type === 'initials_drill') {
        title.textContent = `CHƯA ĐÚNG! ĐÁP ÁN LÀ [${q.targetPhoneme}] (${q.hanzi})`;
      } else if (q.type === 'finals_drill') {
        title.textContent = `CHƯA ĐÚNG! ĐÁP ÁN LÀ [${q.targetPhoneme}] (${q.hanzi})`;
      } else if (q.type === 'minimal_pairs') {
        title.textContent = `CHƯA ĐÚNG! ĐÁP ÁN LÀ "${q.hanzi}" (${q.pinyin})`;
      } else {
        title.textContent = `CHƯA ĐÚNG! ĐÁP ÁN LÀ THANH ${q.correctTone}`;
      }
      title.style.color = '#ef4444';
      ptsEl.textContent = '+0 ĐIỂM';
    }

    document.getElementById('tmFeedbackHanzi').textContent = q.hanzi;
    document.getElementById('tmFeedbackPinyin').textContent = q.pinyin;
    document.getElementById('tmFeedbackMeaning').textContent = q.meaning;
    document.getElementById('tmFeedbackAnalysis').innerHTML = q.analysis;

    modal.style.display = 'flex';
  }

  /* ========================================================================
     PHONETICS LAB RENDERING (INITIALS & FINALS)
     ======================================================================== */
  renderPhoneticsLab() {
    this.renderInitials();
    this.renderFinals();
  }

  renderInitials() {
    const container = document.getElementById('initialsGroupsContainer');
    if (!container) return;
    container.innerHTML = '';

    INITIALS_DATA.forEach(group => {
      const card = document.createElement('div');
      card.className = 'phonetic-group-card';

      let tilesHtml = group.items.map(item => `
        <div class="phonetic-tile" data-letter="${item.letter}" data-speak="${item.speak}" title="Bấm vào để nghe phát âm chuẩn [${item.letter}]">
          <span class="tile-speaker-hint" title="Bấm vào ô để nghe">🔊</span>
          <span class="tile-letter">${item.letter}</span>
          <span class="tile-badge ${item.aspirated ? 'badge-aspirated' : 'badge-unaspirated'}">
            ${item.aspirated ? 'BẬT HƠI' : 'KHÔNG BẬT HƠI'}
          </span>
          <span class="tile-vi">${item.vi}</span>
          <button type="button" class="btn-tile-explore" data-letter="${item.letter}" title="Tra các từ vựng bắt đầu bằng [${item.letter}]">
            📖 Tra từ
          </button>
        </div>
      `).join('');

      card.innerHTML = `
        <div class="group-header">
          <span class="group-title">🏷️ ${group.group}</span>
          <span class="group-tip">${group.desc} (Nhấp vào ô để nghe phát âm • Bấm 📖 Tra từ để xem từ vựng)</span>
        </div>
        <div class="phonetic-tiles-row">
          ${tilesHtml}
        </div>
      `;

      // Click vào ô (chữ cái, badge, bất kỳ đâu trên tile TRỪ nút tra từ) -> Phát âm như cũ!
      card.querySelectorAll('.phonetic-tile').forEach(tile => {
        tile.addEventListener('click', (e) => {
          if (e.target.closest('.btn-tile-explore')) return;
          const speakChar = tile.dataset.speak;
          this.speakChinese(speakChar);
          if (window.PinyinRoadmap) {
            window.PinyinRoadmap.recordActivity('tone', 1);
          }
          tile.classList.add('tile-speaking');
          setTimeout(() => tile.classList.remove('tile-speaking'), 350);
        });
      });

      // Chỉ khi nhấn vào nút tra từ mới chuyển sang Word Explorer!
      card.querySelectorAll('.btn-tile-explore').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const letter = btn.dataset.letter;
          this.openPhoneticExplorer('initial', letter);
        });
      });

      container.appendChild(card);
    });
  }

  renderFinals() {
    const container = document.getElementById('finalsGroupsContainer');
    if (!container) return;
    container.innerHTML = '';

    FINALS_DATA.forEach(group => {
      const card = document.createElement('div');
      card.className = 'phonetic-group-card';

      let tilesHtml = group.items.map(item => {
        const toneBtns = item.tones.map((t, idx) => `
          <button type="button" class="tone-sub-btn" data-speak="${t.hanzi}" title="${t.tip || `Nghe Thanh ${idx + 1} (${t.text})`}">${t.text}</button>
        `).join('');

        const sampleHanzi = item.tones && item.tones[0] ? item.tones[0].hanzi : '';

        return `
          <div class="final-tile-card" data-base="${item.base}">
            <div class="final-card-header" data-speak="${sampleHanzi}" title="Bấm vào để nghe phát âm [${item.base}]">
              <span class="final-speaker-hint">🔊</span>
              <span class="final-base-letter">${item.base}</span>
              <span class="final-vi-approx">${item.vi}</span>
            </div>
            <div class="final-tones-row">
              ${toneBtns}
            </div>
            <button type="button" class="btn-final-explore" data-base="${item.base}" title="Tra các từ chứa vận mẫu [${item.base}]">
              📖 Tra từ [${item.base}]
            </button>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="group-header">
          <span class="group-title">🎵 ${group.group}</span>
          <span class="group-tip">Nhấp chữ cái hoặc thanh điệu để nghe phát âm • Bấm 📖 Tra từ để xem từ vựng</span>
        </div>
        <div class="phonetic-tiles-row">
          ${tilesHtml}
        </div>
      `;

      // Click sub-buttons to speak the authentic Hanzi vowel with exact tone!
      card.querySelectorAll('.tone-sub-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const speakHanzi = btn.dataset.speak;
          this.speakChinese(speakHanzi);
          btn.style.transform = 'scale(1.2)';
          btn.style.background = '#10b981';
          btn.style.color = '#ffffff';
          setTimeout(() => {
            btn.style.transform = '';
            btn.style.background = '';
            btn.style.color = '';
          }, 350);
        });
      });

      // Click vào header chữ cái vận mẫu -> Phát âm như cũ!
      card.querySelectorAll('.final-card-header').forEach(header => {
        header.addEventListener('click', (e) => {
          e.stopPropagation();
          const speakHanzi = header.dataset.speak;
          if (speakHanzi) {
            this.speakChinese(speakHanzi);
            const parentCard = header.closest('.final-tile-card');
            if (parentCard) {
              parentCard.classList.add('tile-speaking');
              setTimeout(() => parentCard.classList.remove('tile-speaking'), 350);
            }
          }
        });
      });

      // CHỈ KHI nhấn vào nút tra từ mới chuyển sang Word Explorer!
      card.querySelectorAll('.btn-final-explore').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const base = btn.dataset.base;
          this.openPhoneticExplorer('final', base);
        });
      });

      container.appendChild(card);
    });
  }

  switchMode(modeName) {
    const tabGame = document.getElementById('tabGameMode');
    const tabChart = document.getElementById('tabChartMode');
    const tabRules = document.getElementById('tabRulesMode');
    const tabSpeaking = document.getElementById('tabSpeakingMode');

    const viewGame = document.getElementById('viewGameSection');
    const viewChart = document.getElementById('viewChartSection');
    const viewRules = document.getElementById('viewRulesSection');
    const viewSpeaking = document.getElementById('viewSpeakingSection');
    const viewExplorer = document.getElementById('viewWordsExplorer');
    const speedControl = document.getElementById('tmSpeedControl');

    [tabGame, tabChart, tabRules, tabSpeaking].forEach(b => { if (b) b.classList.remove('active'); });
    [viewGame, viewChart, viewRules, viewSpeaking, viewExplorer].forEach(v => {
      if (v) {
        v.style.display = 'none';
        v.classList.remove('active');
      }
    });

    let activeTab = tabGame;
    let activeView = viewGame;

    if (modeName === 'chart') {
      activeTab = tabChart;
      activeView = viewChart;
    } else if (modeName === 'rules') {
      activeTab = tabRules;
      activeView = viewRules;
    } else if (modeName === 'speaking') {
      activeTab = tabSpeaking;
      activeView = viewSpeaking;
    } else if (modeName === 'explorer') {
      activeTab = tabChart; // Vẫn highlight tab Bảng Ngữ Âm để người dùng biết đang ở khu ngữ âm
      activeView = viewExplorer;
    }

    if (activeTab) activeTab.classList.add('active');
    if (activeView) {
      activeView.style.display = (modeName === 'explorer') ? 'block' : 'flex';
      activeView.classList.add('active');
    }

    if (speedControl) {
      speedControl.style.display = (modeName === 'game') ? 'flex' : 'none';
    }

    if (modeName === 'explorer') {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }

    if (modeName === 'speaking') {
      if (!this.speakingEngine) {
        try {
          this.speakingEngine = new SpeakingPracticeEngine(this);
        } catch (e) {
          console.error('Speaking engine init error:', e);
        }
      }
      if (this.speakingEngine) {
        this.speakingEngine.start();
      }
    }
  }

  /* ========================================================================
     PHONETIC WORD EXPLORER (TRA CỨU TỪ VỰNG THEO THANH MẪU & VẬN MẪU)
     ======================================================================== */
  openPhoneticExplorer(type, code) {
    this.explorerType = type; // 'initial' | 'final'
    this.explorerCode = code.trim();
    this.explorerPage = 1;
    this.explorerSearchTerm = '';
    this.explorerHskFilter = 'all';
    this.explorerToneFilter = 'all';

    // Cập nhật URLSearchParams
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'chart');
      if (type === 'initial') {
        url.searchParams.set('initial', this.explorerCode);
        url.searchParams.delete('final');
      } else {
        url.searchParams.set('final', this.explorerCode);
        url.searchParams.delete('initial');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}

    // Lấy thông tin ngữ âm tương ứng
    let groupName = '';
    let phoneticDesc = '';
    let sampleHanzi = '';

    if (type === 'initial') {
      let foundItem = null;
      for (const grp of INITIALS_DATA) {
        const item = grp.items.find(i => i.letter.toLowerCase() === this.explorerCode.toLowerCase());
        if (item) {
          foundItem = item;
          groupName = grp.group;
          phoneticDesc = `${item.vi} • ${item.tip || grp.desc}`;
          sampleHanzi = item.speak;
          break;
        }
      }
      if (!foundItem) {
        groupName = 'Thanh Mẫu Pinyin';
        phoneticDesc = `Phụ âm đầu [${this.explorerCode}]`;
        sampleHanzi = this.explorerCode;
      }
    } else {
      let foundItem = null;
      for (const grp of FINALS_DATA) {
        const item = grp.items.find(i => i.base.toLowerCase() === this.explorerCode.toLowerCase());
        if (item) {
          foundItem = item;
          groupName = grp.group;
          phoneticDesc = `Âm đọc: ${item.vi} • Bảng 4 thanh: ${item.tones.map(t => t.text).join(' ')}`;
          sampleHanzi = item.tones && item.tones[0] ? item.tones[0].hanzi : '';
          break;
        }
      }
      if (!foundItem) {
        groupName = 'Vận Mẫu Pinyin';
        phoneticDesc = `Phần vần [${this.explorerCode}]`;
        sampleHanzi = '';
      }
      // Ghi chú đặc biệt cho vận mẫu ueng độc lập
      if (this.explorerCode.toLowerCase() === 'ueng') {
        phoneticDesc = '💡 Quy tắc ngữ âm: Vận mẫu [ueng] không bao giờ đi với phụ âm đầu. Khi đứng độc lập luôn được viết trong Pinyin là "weng" (ví dụ: 富翁 fù wēng, 嗡嗡 wēng wēng, 瓮 wèng).';
        sampleHanzi = '翁';
      }
    }
    this.explorerSampleHanzi = sampleHanzi;

    // Cập nhật DOM Breadcrumbs
    const elType = document.getElementById('explorerBreadcrumbType');
    const elCurrent = document.getElementById('explorerBreadcrumbCurrent');
    if (elType) elType.textContent = (type === 'initial') ? 'Thanh Mẫu (Phụ âm đầu)' : 'Vận Mẫu (Phần vần)';
    if (elCurrent) elCurrent.textContent = `[ ${this.explorerCode} ]`;

    // Cập nhật Hero Card
    const elBadge = document.getElementById('explorerPhoneticBadge');
    const elTypeTag = document.getElementById('explorerTypeTag');
    const elGroupBadge = document.getElementById('explorerGroupBadge');
    const elTitle = document.getElementById('explorerTitle');
    const elDesc = document.getElementById('explorerDesc');
    const btnSpeakSample = document.getElementById('btnExplorerSpeakSample');

    if (elBadge) elBadge.textContent = this.explorerCode;
    if (elTypeTag) elTypeTag.textContent = (type === 'initial') ? '🔡 THANH MẪU (PHỤ ÂM ĐẦU)' : '🔤 VẬN MẪU (PHẦN VẦN)';
    if (elGroupBadge) elGroupBadge.textContent = groupName;
    if (elTitle) elTitle.textContent = (type === 'initial') ? `Từ Vựng Bắt Đầu Bằng Âm [ ${this.explorerCode} ]` : `Từ Vựng Chứa Vận Mẫu [ ${this.explorerCode} ]`;
    if (elDesc) elDesc.textContent = phoneticDesc;

    if (btnSpeakSample) {
      btnSpeakSample.querySelector('span').textContent = `Nghe Âm Mẫu [${this.explorerCode}]`;
    }

    // Reset Search & Filter UI
    const inputSearch = document.getElementById('inputExplorerSearch');
    const btnClearSearch = document.getElementById('btnClearExplorerSearch');
    const selectHsk = document.getElementById('selectExplorerHsk');
    const selectTone = document.getElementById('selectExplorerTone');

    if (inputSearch) inputSearch.value = '';
    if (btnClearSearch) btnClearSearch.style.display = 'none';
    if (selectHsk) selectHsk.value = 'all';
    if (selectTone) selectTone.value = 'all';

    // Render Quick Nav Pills (Dải chuyển nhanh giữa các âm)
    this.renderExplorerQuickNav();

    // Lọc danh sách từ gốc (ưu tiên this.rawWords chứa cả bộ bổ sung ngữ âm)
    const allWords = (this.rawWords && this.rawWords.length > 0) ? this.rawWords : [...(window.CHINESE_WORDS_5000 || []), ...PHONETIC_SUPPLEMENT_WORDS];
    this.explorerBaseWords = allWords.filter(w => {
      if (!w.spaced) return false;
      const syllables = w.spaced.split(' ');
      if (this.explorerType === 'initial') {
        return syllables.some(s => this.matchInitial(s, this.explorerCode));
      } else {
        return syllables.some(s => this.matchFinal(s, this.explorerCode));
      }
    });

    // Chuyển sang giao diện Explorer
    this.switchMode('explorer');

    // Chạy lọc và hiển thị danh sách từ
    this.filterExplorerWords();
    this.renderExplorerWordsList(false);
  }

  matchInitial(syl, targetInitial) {
    if (!syl) return false;
    syl = syl.toLowerCase().trim();
    const ti = targetInitial.toLowerCase().trim();
    const initials2 = ['zh', 'ch', 'sh'];

    if (initials2.includes(ti)) {
      return syl.startsWith(ti);
    }
    if (ti === 'z') return syl.startsWith('z') && !syl.startsWith('zh');
    if (ti === 'c') return syl.startsWith('c') && !syl.startsWith('ch');
    if (ti === 's') return syl.startsWith('s') && !syl.startsWith('sh');

    return syl.startsWith(ti);
  }

  matchFinal(syl, targetFinal) {
    if (!syl) return false;
    syl = syl.toLowerCase().trim();
    const tf = targetFinal.toLowerCase().trim();

    // Tách phụ âm đầu
    const initials2 = ['zh', 'ch', 'sh'];
    let initial = '';
    let final = syl;
    if (initials2.includes(syl.slice(0, 2))) {
      initial = syl.slice(0, 2);
      final = syl.slice(2);
    } else if (/^[bpmfdtnlgkhjqxrzcsyw]/.test(syl)) {
      initial = syl[0];
      final = syl.slice(1);
    }

    if (tf === 'iou (iu)' || tf === 'iu') {
      return final === 'iu' || final === 'iou' || (initial === 'y' && final === 'ou');
    }
    if (tf === 'uei (ui)' || tf === 'ui') {
      return final === 'ui' || final === 'uei' || (initial === 'w' && final === 'ei');
    }
    if (tf === 'uen (un)' || tf === 'un') {
      return (final === 'un' && !['j', 'q', 'x', 'y'].includes(initial)) || final === 'uen' || (initial === 'w' && final === 'en');
    }
    if (tf === 'ü' || tf === 'v') {
      return (['j', 'q', 'x', 'y'].includes(initial) && final === 'u') || final === 'ü' || final === 'v';
    }
    if (tf === 'üe') {
      return (['j', 'q', 'x', 'y'].includes(initial) && final === 'ue') || final === 'üe' || final === 've';
    }
    if (tf === 'üan') {
      return (['j', 'q', 'x', 'y'].includes(initial) && final === 'uan') || final === 'üan' || final === 'van';
    }
    if (tf === 'ün') {
      return (['j', 'q', 'x', 'y'].includes(initial) && final === 'un') || final === 'ün' || final === 'vn';
    }
    if (tf === 'uan') {
      return final === 'uan' && !['j', 'q', 'x', 'y'].includes(initial);
    }
    if (tf === 'u') {
      return final === 'u' && !['j', 'q', 'x', 'y'].includes(initial);
    }
    if (tf === 'iong') {
      return final === 'iong' || (initial === 'y' && final === 'ong');
    }
    if (tf === 'ueng') {
      return syl === 'weng' || final === 'ueng' || (initial === 'w' && final === 'eng');
    }
    if (tf === 'ong') {
      return final === 'ong' && initial !== 'y';
    }
    if (tf === 'eng') {
      return final === 'eng' && initial !== 'w';
    }
    return final === tf;
  }

  getMatchedSyllableTone(word, type, code) {
    if (!word || !word.spaced) return 1;
    const syls = word.spaced.split(' ');
    let matchedIdx = 0;
    if (type === 'initial') {
      matchedIdx = syls.findIndex(s => this.matchInitial(s, code));
    } else {
      matchedIdx = syls.findIndex(s => this.matchFinal(s, code));
    }
    if (matchedIdx < 0) matchedIdx = 0;

    // Lấy từ word.num (ví dụ "bei3jing1")
    if (word.num) {
      const numMatches = word.num.match(/[1-5]/g);
      if (numMatches && numMatches[matchedIdx]) {
        const t = parseInt(numMatches[matchedIdx], 10);
        return (t >= 1 && t <= 4) ? t : 1;
      }
    }
    // Fallback qua extractToneFromPinyin
    if (word.pinyin) {
      const pyParts = word.pinyin.split(' ');
      if (pyParts[matchedIdx]) return this.extractToneFromPinyin(pyParts[matchedIdx]);
      return this.extractToneFromPinyin(word.pinyin);
    }
    return 1;
  }

  renderExplorerQuickNav() {
    const container = document.getElementById('explorerQuickNavPills');
    const titleEl = document.getElementById('explorerQuickNavTitle');
    if (!container) return;
    container.innerHTML = '';

    if (this.explorerType === 'initial') {
      if (titleEl) titleEl.textContent = 'Chuyển nhanh sang Thanh Mẫu khác:';
      INITIALS_DATA.forEach(grp => {
        grp.items.forEach(item => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `quick-nav-pill ${item.letter.toLowerCase() === this.explorerCode.toLowerCase() ? 'active' : ''}`;
          btn.textContent = item.letter;
          btn.title = `${item.letter} - ${item.vi}`;
          btn.addEventListener('click', () => this.openPhoneticExplorer('initial', item.letter));
          container.appendChild(btn);
        });
      });
    } else {
      if (titleEl) titleEl.textContent = 'Chuyển nhanh sang Vận Mẫu khác:';
      FINALS_DATA.forEach(grp => {
        grp.items.forEach(item => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `quick-nav-pill ${item.base.toLowerCase() === this.explorerCode.toLowerCase() ? 'active' : ''}`;
          btn.textContent = item.base;
          btn.title = `${item.base} (${item.vi})`;
          btn.addEventListener('click', () => this.openPhoneticExplorer('final', item.base));
          container.appendChild(btn);
        });
      });
    }
  }

  filterExplorerWords() {
    let list = [...this.explorerBaseWords];

    // Lọc theo HSK
    if (this.explorerHskFilter !== 'all') {
      const targetLevel = parseInt(this.explorerHskFilter, 10);
      list = list.filter(w => w.level === targetLevel);
    }

    // Lọc theo thanh điệu của âm tiết khớp
    if (this.explorerToneFilter !== 'all') {
      const targetTone = parseInt(this.explorerToneFilter, 10);
      list = list.filter(w => this.getMatchedSyllableTone(w, this.explorerType, this.explorerCode) === targetTone);
    }

    // Lọc theo từ khóa tìm kiếm (Chữ Hán, Pinyin, Nghĩa Việt/Anh)
    if (this.explorerSearchTerm.trim()) {
      const term = this.explorerSearchTerm.trim().toLowerCase();
      list = list.filter(w => {
        return (w.hanzi && w.hanzi.toLowerCase().includes(term)) ||
               (w.pinyin && w.pinyin.toLowerCase().includes(term)) ||
               (w.clean && w.clean.toLowerCase().includes(term)) ||
               (w.meaning_vn && w.meaning_vn.toLowerCase().includes(term)) ||
               (w.meaning && w.meaning.toLowerCase().includes(term));
      });
    }

    // Sắp xếp: Ưu tiên các từ có âm tiết đầu tiên khớp trước, sau đó theo cấp HSK từ thấp đến cao
    list.sort((a, b) => {
      const aSyls = (a.spaced || '').split(' ');
      const bSyls = (b.spaced || '').split(' ');
      const aFirst = this.explorerType === 'initial' ? this.matchInitial(aSyls[0], this.explorerCode) : this.matchFinal(aSyls[0], this.explorerCode);
      const bFirst = this.explorerType === 'initial' ? this.matchInitial(bSyls[0], this.explorerCode) : this.matchFinal(bSyls[0], this.explorerCode);
      if (aFirst && !bFirst) return -1;
      if (!aFirst && bFirst) return 1;
      return (a.level || 1) - (b.level || 1);
    });

    this.explorerFilteredWords = list;

    // Cập nhật kết quả đếm
    const countBadge = document.getElementById('explorerResultsCountBadge');
    if (countBadge) {
      countBadge.textContent = `Tìm thấy ${list.length} từ vựng`;
    }
  }

  renderExplorerWordsList(isAppend = false) {
    const grid = document.getElementById('explorerWordsGrid');
    const paginationWrap = document.getElementById('explorerPaginationWrap');
    const emptyState = document.getElementById('explorerEmptyState');
    if (!grid) return;

    if (!isAppend) {
      grid.innerHTML = '';
      this.explorerPage = 1;
    }

    const start = (this.explorerPage - 1) * this.explorerPageSize;
    const end = start + this.explorerPageSize;
    const chunk = this.explorerFilteredWords.slice(start, end);

    if (this.explorerFilteredWords.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (paginationWrap) paginationWrap.style.display = 'none';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }

    chunk.forEach(word => {
      const card = document.createElement('div');
      card.className = 'explorer-word-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.title = `Nhấp để nghe phát âm: ${word.hanzi}`;

      const lvl = word.level || 1;
      const hskText = `HSK ${lvl}`;
      const vnMeaning = word.meaning_vn || word.meaning || '';

      card.innerHTML = `
        <div class="word-card-top">
          <span class="word-hsk-badge hsk-${lvl}">${hskText}</span>
          <button type="button" class="btn-card-audio" title="Nghe phát âm '${word.hanzi}'">
            🔊
          </button>
        </div>
        <div class="word-card-hanzi">${word.hanzi}</div>
        <div class="word-card-pinyin">${this.highlightPhoneticPinyin(word.pinyin || '', this.explorerType, this.explorerCode)}</div>
        <div class="word-card-meaning" title="${vnMeaning}">${vnMeaning}</div>
      `;

      // Click vào card hoặc nút loa để nghe phát âm
      const playCardVoice = (e) => {
        if (e) e.stopPropagation();
        this.speakChinese(word.hanzi);
        card.classList.add('playing');
        setTimeout(() => card.classList.remove('playing'), 700);
      };

      card.addEventListener('click', playCardVoice);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playCardVoice();
        }
      });

      const audioBtn = card.querySelector('.btn-card-audio');
      if (audioBtn) audioBtn.addEventListener('click', playCardVoice);

      grid.appendChild(card);
    });

    // Xử lý nút xem thêm
    if (paginationWrap) {
      if (end < this.explorerFilteredWords.length) {
        paginationWrap.style.display = 'flex';
      } else {
        paginationWrap.style.display = 'none';
      }
    }
  }

  highlightPhoneticPinyin(pinyin, type, code) {
    if (!pinyin || !code) return pinyin;
    // Highlight nhẹ nhàng âm được chọn trong chuỗi pinyin
    try {
      const cleanCode = code.toLowerCase().replace(/[^a-zü]/g, '');
      if (type === 'initial') {
        const regex = new RegExp(`(^|\\s)(${cleanCode})`, 'gi');
        return pinyin.replace(regex, '$1<span class="highlight-phonetic">$2</span>');
      } else {
        // Tách các từ và highlight phần vần
        return pinyin;
      }
    } catch (e) {
      return pinyin;
    }
  }

  setupExplorerEventListeners() {
    // Nút quay lại bảng ngữ âm
    const btnBack = document.getElementById('btnBackToChart');
    const bcBack = document.getElementById('bcToChart');
    if (btnBack) btnBack.addEventListener('click', () => this.switchMode('chart'));
    if (bcBack) bcBack.addEventListener('click', () => this.switchMode('chart'));

    // Nút phát âm mẫu trên Hero Card
    const btnHeroSpeak = document.getElementById('btnExplorerSpeakSample');
    if (btnHeroSpeak) {
      btnHeroSpeak.addEventListener('click', () => {
        if (this.explorerSampleHanzi) {
          this.speakChinese(this.explorerSampleHanzi);
        } else {
          this.speakChinese(this.explorerCode);
        }
      });
    }

    // Nút xem thêm (+40 từ)
    const btnLoadMore = document.getElementById('btnExplorerLoadMore');
    if (btnLoadMore) {
      btnLoadMore.addEventListener('click', () => {
        this.explorerPage++;
        this.renderExplorerWordsList(true);
      });
    }

    // Input tìm kiếm realtime
    const inputSearch = document.getElementById('inputExplorerSearch');
    const btnClear = document.getElementById('btnClearExplorerSearch');
    if (inputSearch) {
      let debounceTimer = null;
      inputSearch.addEventListener('input', (e) => {
        this.explorerSearchTerm = e.target.value;
        if (btnClear) btnClear.style.display = this.explorerSearchTerm ? 'block' : 'none';
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.filterExplorerWords();
          this.renderExplorerWordsList(false);
        }, 180);
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (inputSearch) inputSearch.value = '';
        this.explorerSearchTerm = '';
        btnClear.style.display = 'none';
        this.filterExplorerWords();
        this.renderExplorerWordsList(false);
      });
    }

    // Bộ lọc HSK
    const selectHsk = document.getElementById('selectExplorerHsk');
    if (selectHsk) {
      selectHsk.addEventListener('change', (e) => {
        this.explorerHskFilter = e.target.value;
        this.filterExplorerWords();
        this.renderExplorerWordsList(false);
      });
    }

    // Bộ lọc Thanh điệu
    const selectTone = document.getElementById('selectExplorerTone');
    if (selectTone) {
      selectTone.addEventListener('change', (e) => {
        this.explorerToneFilter = e.target.value;
        this.filterExplorerWords();
        this.renderExplorerWordsList(false);
      });
    }

    // Nút reset bộ lọc khi không tìm thấy kết quả
    const btnResetFilter = document.getElementById('btnResetExplorerFilter');
    if (btnResetFilter) {
      btnResetFilter.addEventListener('click', () => {
        if (inputSearch) inputSearch.value = '';
        if (btnClear) btnClear.style.display = 'none';
        if (selectHsk) selectHsk.value = 'all';
        if (selectTone) selectTone.value = 'all';
        this.explorerSearchTerm = '';
        this.explorerHskFilter = 'all';
        this.explorerToneFilter = 'all';
        this.filterExplorerWords();
        this.renderExplorerWordsList(false);
      });
    }
  }

  /* ========================================================================
     EVENT LISTENERS & CONTROLS
     ======================================================================== */
  setupEventListeners() {
    // Mode Switcher Buttons (Game vs Chart vs Rules vs Speaking Lab)
    const tabGame = document.getElementById('tabGameMode');
    const tabChart = document.getElementById('tabChartMode');
    const tabRules = document.getElementById('tabRulesMode');
    const tabSpeaking = document.getElementById('tabSpeakingMode');

    if (tabGame) tabGame.addEventListener('click', () => this.switchMode('game'));
    if (tabChart) tabChart.addEventListener('click', () => this.switchMode('chart'));
    if (tabRules) tabRules.addEventListener('click', () => this.switchMode('rules'));
    if (tabSpeaking) tabSpeaking.addEventListener('click', () => this.switchMode('speaking'));

    // Check initial tab from URL params or hash (e.g. #speaking, ?tab=speaking, ?mode=speaking)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hasInitialOrFinal = urlParams.has('initial') || urlParams.has('init') || urlParams.has('final');
      if (!hasInitialOrFinal) {
        const tabParam = urlParams.get('tab') || urlParams.get('mode') || window.location.hash.replace('#', '');
        if (tabParam === 'speaking') {
          setTimeout(() => this.switchMode('speaking'), 50);
        } else if (tabParam === 'chart' || tabParam === 'phonetics') {
          setTimeout(() => this.switchMode('chart'), 50);
        } else if (tabParam === 'rules' || tabParam === 'sandhi') {
          setTimeout(() => this.switchMode('rules'), 50);
        }
      }
    } catch (e) {}

    // Sub Tabs inside Chart Section (Initials vs Finals)
    const btnSubInitials = document.getElementById('btnSubInitials');
    const btnSubFinals = document.getElementById('btnSubFinals');
    const boxInitials = document.getElementById('boxInitials');
    const boxFinals = document.getElementById('boxFinals');

    btnSubInitials.addEventListener('click', () => {
      btnSubInitials.classList.add('active');
      btnSubFinals.classList.remove('active');
      boxInitials.style.display = 'flex';
      boxFinals.style.display = 'none';
    });

    btnSubFinals.addEventListener('click', () => {
      btnSubFinals.classList.add('active');
      btnSubInitials.classList.remove('active');
      boxFinals.style.display = 'flex';
      boxInitials.style.display = 'none';
    });

    // Sub-mode Select in Game Section
    const subModeSelect = document.getElementById('tmSubModeSelect');
    if (subModeSelect) {
      subModeSelect.addEventListener('change', () => {
        this.subMode = subModeSelect.value;
        this.streak = 0;
        this.streakDisplay.textContent = '0';
        this.updatePhoneticGroupDropdown();
        this.loadNewQuestion();
      });
    }

    // Phonetic Group Select (for Initials & Finals Drill)
    if (this.phoneticGroupSelect) {
      this.phoneticGroupSelect.addEventListener('change', () => {
        this.phoneticGroup = this.phoneticGroupSelect.value;
        this.streak = 0;
        this.streakDisplay.textContent = '0';
        this.loadNewQuestion();
      });
    }

    // Launch Challenge from Phonetics Lab Intro Cards
    const btnLaunchInitials = document.getElementById('btnLaunchInitialsDrill');
    if (btnLaunchInitials) {
      btnLaunchInitials.addEventListener('click', () => {
        this.switchMode('game');
        this.subMode = 'initials_drill';
        const select = document.getElementById('tmSubModeSelect');
        if (select) select.value = 'initials_drill';
        this.streak = 0;
        this.streakDisplay.textContent = '0';
        this.updatePhoneticGroupDropdown();
        this.loadNewQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const btnLaunchFinals = document.getElementById('btnLaunchFinalsDrill');
    if (btnLaunchFinals) {
      btnLaunchFinals.addEventListener('click', () => {
        this.switchMode('game');
        this.subMode = 'finals_drill';
        const select = document.getElementById('tmSubModeSelect');
        if (select) select.value = 'finals_drill';
        this.streak = 0;
        this.streakDisplay.textContent = '0';
        this.updatePhoneticGroupDropdown();
        this.loadNewQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // HSK Level Select
    const hskSelect = document.getElementById('tmHskSelect');
    hskSelect.addEventListener('change', () => {
      this.hskLevel = hskSelect.value;
      this.loadNewQuestion();
    });

    // Speed buttons
    const spNormal = document.getElementById('speedNormal');
    const spSlow = document.getElementById('speedSlow');
    spNormal.addEventListener('click', () => {
      this.playbackRate = 1.0;
      spNormal.classList.add('active');
      spSlow.classList.remove('active');
    });
    spSlow.addEventListener('click', () => {
      this.playbackRate = 0.75;
      spSlow.classList.add('active');
      spNormal.classList.remove('active');
    });

    // Tone Pad Clicks
    for (let i = 1; i <= 4; i++) {
      const pad = document.getElementById(`tonePad${i}`);
      if (pad) {
        pad.addEventListener('click', () => {
          this.playTonePitch(i);
          this.submitAnswer(i);
        });
      }
    }

    // Replay Sound Button
    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', () => {
        if (this.currentQuestion) this.speakChinese(this.currentQuestion.hanzi);
      });
    }

    // Voice Toggle
    const voiceBtn = document.getElementById('tmVoiceToggle');
    voiceBtn.addEventListener('click', () => {
      this.autoVoice = !this.autoVoice;
      voiceBtn.classList.toggle('active', this.autoVoice);
      voiceBtn.querySelector('.btn-txt').textContent = this.autoVoice ? 'GIỌNG ĐỌC: BẬT' : 'GIỌNG ĐỌC: TẮT';
    });

    // Skip Button
    document.getElementById('tmSkipBtn').addEventListener('click', () => {
      this.streak = 0;
      this.streakDisplay.textContent = '0';
      this.loadNewQuestion();
    });

    // Modal Next Question Buttons
    document.getElementById('tmNextQuestionBtn').addEventListener('click', () => this.loadNewQuestion());
    document.getElementById('tmCloseFeedbackBtn').addEventListener('click', () => this.loadNewQuestion());
    this.feedbackModal.addEventListener('click', (e) => {
      if (e.target === this.feedbackModal) this.loadNewQuestion();
    });

    // Replay voice button in feedback modal
    document.getElementById('tmFeedbackVoiceBtn').addEventListener('click', () => {
      if (this.currentQuestion) this.speakChinese(this.currentQuestion.hanzi);
    });

    // Help Modal
    const helpBtn = document.getElementById('tmHelpBtn');
    const closeHelp = document.getElementById('tmCloseHelpBtn');
    helpBtn.addEventListener('click', () => this.helpModal.style.display = 'flex');
    closeHelp.addEventListener('click', () => this.helpModal.style.display = 'none');
    this.helpModal.addEventListener('click', (e) => {
      if (e.target === this.helpModal) this.helpModal.style.display = 'none';
    });

    // Rule items audio buttons
    document.querySelectorAll('.rule-ex-item').forEach(item => {
      const btn = item.querySelector('.rule-listen-btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const speakText = item.dataset.speak;
          this.speakChinese(speakText);
        });
      }
    });

    // Keyboard Shortcuts (1, 2, 3, 4, R, Enter, Space)
    window.addEventListener('keydown', (e) => {
      // If Feedback Modal is open, Enter / Space / Escape advances
      if (this.feedbackModal && this.feedbackModal.style.display === 'flex') {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          this.loadNewQuestion();
          return;
        }
      }

      // If in Speaking Lab section
      if (viewSpeaking && viewSpeaking.style.display !== 'none' && this.speakingEngine) {
        if (e.key === ' ' && !e.repeat) {
          e.preventDefault();
          this.speakingEngine.toggleListening();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.speakingEngine.loadNewPrompt();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          this.speakingEngine.playSample();
        }
        return;
      }

      // If in game section
      if (viewGame && viewGame.style.display !== 'none') {
        if (this.padsGrid && this.padsGrid.style.display !== 'none') {
          if (e.key === '1') { this.playTonePitch(1); this.submitAnswer(1); }
          else if (e.key === '2') { this.playTonePitch(2); this.submitAnswer(2); }
          else if (e.key === '3') { this.playTonePitch(3); this.submitAnswer(3); }
          else if (e.key === '4') { this.playTonePitch(4); this.submitAnswer(4); }
          else if (e.key === 'r' || e.key === 'R' || e.key === ' ') {
            e.preventDefault();
            if (this.currentQuestion) this.speakChinese(this.currentQuestion.hanzi);
          }
        } else if (this.pairsGrid && this.pairsGrid.style.display !== 'none') {
          // Minimal Pairs, Initials Drill, or Finals Drill choices
          const cards = this.pairsGrid.querySelectorAll('.pair-card-choice');
          const num = parseInt(e.key, 10);
          if (!isNaN(num) && num >= 1 && num <= cards.length) {
            e.preventDefault();
            cards[num - 1].click();
          } else if (e.key === 'r' || e.key === 'R' || e.key === ' ') {
            e.preventDefault();
            if (this.currentQuestion) this.speakChinese(this.currentQuestion.hanzi);
          }
        }
      }
    });
  }

  /* ========================================================================
     BACKGROUND CANVAS ANIMATION (MUSICAL NOTES & BUBBLES)
     ======================================================================== */
  setupBackgroundCanvas() {
    if (!this.bgCanvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.bgCanvas.width = w;
    this.bgCanvas.height = h;

    const notes = ['♪', '♫', '♩', '♬', '✨'];
    this.notesParticles = [];
    for (let i = 0; i < 25; i++) {
      this.notesParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        char: notes[Math.floor(Math.random() * notes.length)],
        size: 14 + Math.random() * 20,
        speed: 12 + Math.random() * 24,
        color: `hsla(${240 + Math.random() * 90}, 80%, 70%, 0.45)`
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

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(0.5, '#fdf2f8');
    grad.addColorStop(1, '#fef3c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < this.notesParticles.length; i++) {
      const p = this.notesParticles[i];
      p.y -= p.speed * 0.016;
      if (p.y < -30) {
        p.y = h + 20;
        p.x = Math.random() * w;
      }

      ctx.font = `${p.size}px sans-serif`;
      ctx.fillStyle = p.color;
      ctx.fillText(p.char, p.x, p.y);
    }
  }
}

/* ========================================================================
   AI SPEAKING PRACTICE ENGINE (Speech Recognition & Tone Scoring)
   ======================================================================== */
const TONE_SPEAKING_SETS = [
  { hanzi: '妈', pinyin: 'mā', tone: 1, level: 1, meaning: 'người mẹ', note: 'Thanh 1: Ngang cao (55), giữ trường độ và cao độ đều đặn từ đầu đến cuối.' },
  { hanzi: '麻', pinyin: 'má', tone: 2, level: 1, meaning: 'cây gai / tê', note: 'Thanh 2: Đi lên (35), vuốt giọng từ cao độ trung bình vút lên đỉnh.' },
  { hanzi: '马', pinyin: 'mǎ', tone: 3, level: 1, meaning: 'con ngựa', note: 'Thanh 3: Trầm vút (214), hạ giọng thật trầm ở cuống họng rồi đưa nhẹ lên.' },
  { hanzi: '骂', pinyin: 'mà', tone: 4, level: 1, meaning: 'mắng chửi', note: 'Thanh 4: Rơi nhanh (51), nhấn giọng dứt khoát, mạnh mẽ từ đỉnh xuống đáy.' },
  { hanzi: '八', pinyin: 'bā', tone: 1, level: 1, meaning: 'số 8', note: 'Thanh 1: Hai môi khép mở nhẹ, âm lượng ngang bằng.' },
  { hanzi: '拔', pinyin: 'bá', tone: 2, level: 1, meaning: 'nhổ lên', note: 'Thanh 2: Vuốt âm thanh dứt khoát đi lên.' },
  { hanzi: '把', pinyin: 'bǎ', tone: 3, level: 1, meaning: 'nắm / cầm', note: 'Thanh 3: Nén hơi ở cuống họng, trầm rồi vút.' },
  { hanzi: '爸', pinyin: 'bà', tone: 4, level: 1, meaning: 'người cha', note: 'Thanh 4: Đánh giọng dứt khoát từ trên cao xuống.' },
  { hanzi: '汤', pinyin: 'tāng', tone: 1, level: 1, meaning: 'canh / súp', note: 'Thanh 1: Âm t bật hơi mạnh, thanh điệu ngân vang.' },
  { hanzi: '糖', pinyin: 'táng', tone: 2, level: 1, meaning: 'kẹo / đường', note: 'Thanh 2: Bật hơi mạnh, giọng đi lên thanh thoát.' },
  { hanzi: '躺', pinyin: 'tǎng', tone: 3, level: 1, meaning: 'nằm xuống', note: 'Thanh 3: Hạ giọng thật trầm ở giữa âm tiết.' },
  { hanzi: '烫', pinyin: 'tàng', tone: 4, level: 1, meaning: 'nóng bỏng', note: 'Thanh 4: Rơi dứt khoát từ đỉnh cao độ xuống.' },
  { hanzi: '温', pinyin: 'wēn', tone: 1, level: 1, meaning: 'ấm áp', note: 'Thanh 1: Môi tròn chúm lại, thanh cao bằng.' },
  { hanzi: '文', pinyin: 'wén', tone: 2, level: 1, meaning: 'văn hóa', note: 'Thanh 2: Vuốt cao độ từ trầm lên cao.' },
  { hanzi: '吻', pinyin: 'wěn', tone: 3, level: 1, meaning: 'nụ hôn', note: 'Thanh 3: Hạ thấp độ cao giọng nói rồi hất nhẹ.' },
  { hanzi: '问', pinyin: 'wèn', tone: 4, level: 1, meaning: 'hỏi han', note: 'Thanh 4: Dứt khoát mạnh mẽ.' },
  { hanzi: '诗', pinyin: 'shī', tone: 1, level: 1, meaning: 'bài thơ', note: 'Thanh 1: Uốn cong đầu lưỡi lên chạm vòm miệng, hơi ma sát êm.' },
  { hanzi: '十', pinyin: 'shí', tone: 2, level: 1, meaning: 'số 10', note: 'Thanh 2: Uốn cong lưỡi, giọng vuốt đi lên.' },
  { hanzi: '始', pinyin: 'shǐ', tone: 3, level: 1, meaning: 'bắt đầu', note: 'Thanh 3: Uốn lưỡi, giọng trầm xuống rồi hất lên.' },
  { hanzi: '是', pinyin: 'shì', tone: 4, level: 1, meaning: 'là / phải', note: 'Thanh 4: Uốn cong lưỡi, phát âm dứt khoát rơi xuống.' }
];

class SpeakingPracticeEngine {
  constructor(game) {
    this.game = game;
    this.recognition = null;
    this.isListening = false;
    this.currentPrompt = null;
    this.speakingMode = 'speaking_tones';
    this.speakingLevel = 'all';

    this.score = 0;
    this.streak = 0;
    this.totalAttempts = 0;
    this.correctAttempts = 0;

    // DOM Elements
    this.modeSelect = document.getElementById('speakingModeSelect');
    this.hskSelect = document.getElementById('speakingHskSelect');
    this.scoreDisplay = document.getElementById('speakingScoreDisplay');
    this.streakDisplay = document.getElementById('speakingStreakDisplay');
    this.accuracyDisplay = document.getElementById('speakingAccuracyDisplay');

    this.promptLevel = document.getElementById('speakingPromptLevel');
    this.promptCategory = document.getElementById('speakingPromptCategory');
    this.promptHanzi = document.getElementById('speakingPromptHanzi');
    this.promptPinyin = document.getElementById('speakingPromptPinyin');
    this.promptMeaning = document.getElementById('speakingPromptMeaning');
    this.playSampleBtn = document.getElementById('speakingPlaySampleBtn');

    this.micBtn = document.getElementById('speakingMicBtn');
    this.micTxt = document.getElementById('speakingMicTxt');
    this.rippleRings = document.getElementById('micRippleRings');
    this.waveform = document.getElementById('micWaveform');

    this.resultPanel = document.getElementById('speakingResultPanel');
    this.statusTag = document.getElementById('speakingStatusTag');
    this.scoreTag = document.getElementById('speakingScoreTag');
    this.youSaidHanzi = document.getElementById('speakingYouSaidHanzi');
    this.youSaidPinyin = document.getElementById('speakingYouSaidPinyin');
    this.targetHanzi = document.getElementById('speakingTargetHanzi');
    this.targetPinyin = document.getElementById('speakingTargetPinyin');
    this.feedbackTip = document.getElementById('speakingFeedbackTip');
    this.nextBtn = document.getElementById('speakingNextBtn');
    this.permNotice = document.getElementById('micPermissionNotice');

    this.initSpeechRecognition();
    this.setupListeners();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'zh-CN';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 3;

        this.recognition.onstart = () => {
          this.isListening = true;
          if (this.micBtn) this.micBtn.classList.add('listening');
          if (this.rippleRings) this.rippleRings.classList.add('active');
          if (this.waveform) this.waveform.classList.add('active');
          if (this.micTxt) this.micTxt.textContent = 'ĐANG NGHE...';
        };

        this.recognition.onresult = (event) => {
          const results = Array.from(event.results[0]).map(r => r.transcript.trim());
          this.evaluateSpokenText(results);
        };

        this.recognition.onerror = (e) => {
          this.isListening = false;
          this.resetMicState();
          if (e.error === 'not-allowed' && this.permNotice) {
            this.permNotice.style.display = 'block';
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.resetMicState();
        };
      } catch (err) {
        this.recognition = null;
      }
    }
  }

  resetMicState() {
    if (this.micBtn) this.micBtn.classList.remove('listening');
    if (this.rippleRings) this.rippleRings.classList.remove('active');
    if (this.waveform) this.waveform.classList.remove('active');
    if (this.micTxt) this.micTxt.textContent = 'BẤM ĐỂ NÓI';
  }

  setupListeners() {
    if (this.micBtn) {
      this.micBtn.addEventListener('click', () => this.toggleListening());
    }

    if (this.playSampleBtn) {
      this.playSampleBtn.addEventListener('click', () => this.playSample());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.loadNewPrompt());
    }

    if (this.modeSelect) {
      this.modeSelect.addEventListener('change', () => {
        this.speakingMode = this.modeSelect.value;
        this.loadNewPrompt();
      });
    }

    if (this.hskSelect) {
      this.hskSelect.addEventListener('change', () => {
        this.speakingLevel = this.hskSelect.value;
        this.loadNewPrompt();
      });
    }
  }

  start() {
    if (!this.currentPrompt) {
      this.loadNewPrompt();
    }
  }

  playSample() {
    if (this.currentPrompt && this.currentPrompt.hanzi) {
      this.game.speakChinese(this.currentPrompt.hanzi);
    }
  }

  toggleListening() {
    if (!this.recognition) {
      alert('Trình duyệt hiện tại chưa hỗ trợ Web Speech API nhận diện giọng nói tiếng Trung. Vui lòng mở trang trên Google Chrome hoặc Microsoft Edge để sử dụng micro!');
      return;
    }

    if (this.isListening) {
      try { this.recognition.stop(); } catch (e) {}
    } else {
      if (this.permNotice) this.permNotice.style.display = 'none';
      if (this.resultPanel) this.resultPanel.style.display = 'none';
      try {
        this.recognition.start();
      } catch (e) {
        try { this.recognition.stop(); setTimeout(() => this.recognition.start(), 150); } catch (err) {}
      }
    }
  }

  loadNewPrompt() {
    if (this.resultPanel) this.resultPanel.style.display = 'none';
    this.resetMicState();

    if (this.speakingMode === 'speaking_tones') {
      const item = TONE_SPEAKING_SETS[Math.floor(Math.random() * TONE_SPEAKING_SETS.length)];
      this.currentPrompt = item;
      if (this.promptCategory) this.promptCategory.textContent = `THANH ${item.tone}`;
      if (this.promptLevel) this.promptLevel.textContent = `THANH ĐIỆU`;
    } else if (this.speakingMode === 'speaking_pairs') {
      const pair = MINIMAL_PAIRS[Math.floor(Math.random() * MINIMAL_PAIRS.length)];
      const opt = pair.options[Math.floor(Math.random() * pair.options.length)];
      this.currentPrompt = {
        hanzi: opt.hanzi,
        pinyin: opt.pinyin,
        meaning: opt.meaning,
        tone: opt.tone,
        note: `Cặp từ phân biệt thanh ${opt.tone}. Nhấn mạnh cao độ chuẩn xác!`
      };
      if (this.promptCategory) this.promptCategory.textContent = 'CẶP TỪ ĐỐI LẬP';
      if (this.promptLevel) this.promptLevel.textContent = `THANH ${opt.tone}`;
    } else {
      let pool = this.game.rawWords.filter(w => w.hanzi && w.pinyin);
      if (this.speakingLevel !== 'all') {
        const lvl = parseInt(this.speakingLevel, 10);
        const filtered = pool.filter(w => w.level === lvl);
        if (filtered.length > 0) pool = filtered;
      }
      const word = pool[Math.floor(Math.random() * pool.length)];
      this.currentPrompt = {
        hanzi: word.hanzi,
        pinyin: word.pinyin,
        meaning: word.meaning_vn || word.meaning || '',
        note: 'Luyện nói từ vựng giao tiếp tự nhiên chuẩn ngữ điệu.'
      };
      if (this.promptCategory) this.promptCategory.textContent = 'HSK VOCAB';
      if (this.promptLevel) this.promptLevel.textContent = `HSK ${word.level || 1}`;
    }

    if (this.promptHanzi) this.promptHanzi.textContent = this.currentPrompt.hanzi;
    if (this.promptPinyin) this.promptPinyin.textContent = this.currentPrompt.pinyin;
    if (this.promptMeaning) this.promptMeaning.textContent = this.currentPrompt.meaning;
  }

  evaluateSpokenText(results) {
    if (!this.currentPrompt) return;
    this.totalAttempts++;

    const spokenRaw = results[0] || '';
    const cleanSpoken = spokenRaw.replace(/[\s\p{P}]/gu, '');
    const targetClean = this.currentPrompt.hanzi.replace(/[\s\p{P}]/gu, '');

    const isDirectMatch = results.some(r => {
      const clean = r.replace(/[\s\p{P}]/gu, '');
      return clean === targetClean || clean.includes(targetClean) || targetClean.includes(clean);
    });

    if (this.resultPanel) this.resultPanel.style.display = 'flex';
    if (this.youSaidHanzi) this.youSaidHanzi.textContent = spokenRaw || '—';
    if (this.targetHanzi) this.targetHanzi.textContent = this.currentPrompt.hanzi;
    if (this.targetPinyin) this.targetPinyin.textContent = this.currentPrompt.pinyin;

    if (isDirectMatch) {
      this.correctAttempts++;
      this.streak++;
      const earnedScore = 100 + (this.streak * 10);
      this.score += earnedScore;

      if (this.statusTag) {
        this.statusTag.className = 'result-status-tag tag-correct';
        this.statusTag.textContent = '🎉 CHÍNH XÁC 100%!';
      }
      if (this.scoreTag) this.scoreTag.textContent = `+${earnedScore} ĐIỂM`;
      if (this.feedbackTip) {
        this.feedbackTip.textContent = `Xuất sắc! Bạn đã phát âm chuẩn chỉnh chữ "${this.currentPrompt.hanzi}" (${this.currentPrompt.pinyin})!`;
      }
      this.game.playToneSound('correct');
    } else {
      this.streak = 0;
      if (this.statusTag) {
        this.statusTag.className = 'result-status-tag tag-warning';
        this.statusTag.textContent = '⚠️ CẦN LUYỆN THÊM';
      }
      if (this.scoreTag) this.scoreTag.textContent = '+0 ĐIỂM';
      if (this.feedbackTip) {
        this.feedbackTip.textContent = `Bạn vừa phát âm thành: "${spokenRaw}". ${this.currentPrompt.note || 'Hãy chú ý khẩu hình và độ cao của thanh điệu!'}`;
      }
      this.game.playToneSound('wrong');
    }

    this.updateStats();
  }

  updateStats() {
    if (this.scoreDisplay) this.scoreDisplay.textContent = this.score;
    if (this.streakDisplay) this.streakDisplay.textContent = this.streak;
    if (this.accuracyDisplay) {
      const acc = this.totalAttempts > 0 ? Math.round((this.correctAttempts / this.totalAttempts) * 100) : 100;
      this.accuracyDisplay.textContent = `${acc}%`;
    }
  }
}

// Global Launch
window.addEventListener('DOMContentLoaded', () => {
  window.toneGame = new ToneMasterGame();
  window.toneGame.init();
});
