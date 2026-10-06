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
  }

  init() {
    this.setupBackgroundCanvas();
    this.setupEventListeners();
    this.setupExplorerEventListeners();
    this.renderPhoneticsLab();
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
    } else {
      this.generateSandhiQuizQuestion();
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

  generateSingleToneQuestion() {
    this.padsGrid.style.display = 'grid';
    this.pairsGrid.style.display = 'none';

    let pool = this.rawWords.filter(w => w.hanzi && w.hanzi.length === 1 && w.pinyin);
    if (this.hskLevel !== 'all') {
      const lvl = parseInt(this.hskLevel, 10);
      const filtered = pool.filter(w => w.level === lvl);
      if (filtered.length > 0) pool = filtered;
    }
    if (pool.length === 0) pool = this.rawWords.filter(w => w.pinyin);

    const word = pool[Math.floor(Math.random() * pool.length)];
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

    const pairGroup = MINIMAL_PAIRS[Math.floor(Math.random() * MINIMAL_PAIRS.length)];
    const targetWord = pairGroup.options[Math.floor(Math.random() * pairGroup.options.length)];
    const bareBase = this.stripTone(targetWord.pinyin);

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
      { hanzi: '你好', pinyin: 'nǐ hǎo ➔ ní hǎo', targetTone: 2, note: 'Từ "你" vốn là thanh 3, đứng trước thanh 3 "好" nên biến điệu thành thanh 2!' },
      { hanzi: '可以', pinyin: 'kě yǐ ➔ ké yǐ', targetTone: 2, note: 'Từ "可" vốn là thanh 3, đứng trước "以" nên biến điệu đọc thành thanh 2!' },
      { hanzi: '不是', pinyin: 'bù shì ➔ bú shì', targetTone: 2, note: 'Chữ "不" đứng trước thanh 4 "是" phải biến điệu đọc thành thanh 2 (bú)!' },
      { hanzi: '不要', pinyin: 'bù yào ➔ bú yào', targetTone: 2, note: 'Chữ "不" đứng trước thanh 4 "要" phải đọc biến điệu thành thanh 2 (bú)!' },
      { hanzi: '一定', pinyin: 'yī dìng ➔ yí dìng', targetTone: 2, note: 'Chữ "一" đứng trước thanh 4 "定" phải đọc thành thanh 2 (yí)!' },
      { hanzi: '一起', pinyin: 'yī qǐ ➔ yì qǐ', targetTone: 4, note: 'Chữ "一" đứng trước thanh 3 "起" phải đọc thành thanh 4 (yì)!' },
      { hanzi: '一天', pinyin: 'yī tiān ➔ yì tiān', targetTone: 4, note: 'Chữ "一" đứng trước thanh 1 "天" phải đọc thành thanh 4 (yì)!' }
    ];

    const q = sandhiPool[Math.floor(Math.random() * sandhiPool.length)];
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
      title.textContent = 'CHÍNH XÁC! TAI RẤT THÍNH';
      title.style.color = '#10b981';
      ptsEl.textContent = `+${pts} ĐIỂM ⭐`;
    } else {
      icon.textContent = '💡';
      title.textContent = `CHƯA ĐÚNG! ĐÁP ÁN LÀ THANH ${q.correctTone}`;
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
    subModeSelect.addEventListener('change', () => {
      this.subMode = subModeSelect.value;
      this.streak = 0;
      this.streakDisplay.textContent = '0';
      this.loadNewQuestion();
    });

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

      // If in game section and pads are visible
      if (viewGame && viewGame.style.display !== 'none' && this.padsGrid.style.display !== 'none') {
        if (e.key === '1') { this.playTonePitch(1); this.submitAnswer(1); }
        else if (e.key === '2') { this.playTonePitch(2); this.submitAnswer(2); }
        else if (e.key === '3') { this.playTonePitch(3); this.submitAnswer(3); }
        else if (e.key === '4') { this.playTonePitch(4); this.submitAnswer(4); }
        else if (e.key === 'r' || e.key === 'R' || e.key === ' ') {
          e.preventDefault();
          if (this.currentQuestion) this.speakChinese(this.currentQuestion.hanzi);
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
