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

class ToneMasterGame {
  constructor() {
    this.rawWords = window.CHINESE_WORDS_5000 || [];
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
  }

  init() {
    this.setupBackgroundCanvas();
    this.setupEventListeners();
    this.renderPhoneticsLab();
    this.loadNewQuestion();
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
        <div class="phonetic-tile" data-letter="${item.letter}" data-speak="${item.speak}">
          <span class="tile-letter">${item.letter}</span>
          <span class="tile-badge ${item.aspirated ? 'badge-aspirated' : 'badge-unaspirated'}">
            ${item.aspirated ? 'BẬT HƠI' : 'KHÔNG BẬT HƠI'}
          </span>
          <span class="tile-vi">${item.vi}</span>
          <span class="tile-speaker">🔊 Phát âm [${item.letter}]</span>
        </div>
      `).join('');

      card.innerHTML = `
        <div class="group-header">
          <span class="group-title">🏷️ ${group.group}</span>
          <span class="group-tip">${group.desc}</span>
        </div>
        <div class="phonetic-tiles-row">
          ${tilesHtml}
        </div>
      `;

      // Event listener for tiles: speak the authentic initial call-name!
      card.querySelectorAll('.phonetic-tile').forEach(tile => {
        tile.addEventListener('click', () => {
          const speakChar = tile.dataset.speak;
          this.speakChinese(speakChar);
          tile.style.transform = 'scale(1.15)';
          tile.style.borderColor = '#10b981';
          setTimeout(() => {
            tile.style.transform = '';
            tile.style.borderColor = '';
          }, 350);
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
          <button class="tone-sub-btn" data-speak="${t.hanzi}" title="${t.tip || `Nghe Thanh ${idx + 1} (${t.text})`}">${t.text}</button>
        `).join('');

        return `
          <div class="final-tile-card">
            <span class="final-base-letter">${item.base}</span>
            <span class="final-vi-approx">${item.vi}</span>
            <div class="final-tones-row">
              ${toneBtns}
            </div>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="group-header">
          <span class="group-title">🎵 ${group.group}</span>
          <span class="group-tip">Nhấp vào từng thanh điệu để luyện ngữ âm chuẩn</span>
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
          }, 400);
        });
      });

      container.appendChild(card);
    });
  }

  /* ========================================================================
     EVENT LISTENERS & CONTROLS
     ======================================================================== */
  setupEventListeners() {
    // Mode Switcher Buttons (Game vs Chart vs Rules)
    const tabGame = document.getElementById('tabGameMode');
    const tabChart = document.getElementById('tabChartMode');
    const tabRules = document.getElementById('tabRulesMode');

    const viewGame = document.getElementById('viewGameSection');
    const viewChart = document.getElementById('viewChartSection');
    const viewRules = document.getElementById('viewRulesSection');
    const speedControl = document.getElementById('tmSpeedControl');

    const switchView = (activeTab, activeView) => {
      [tabGame, tabChart, tabRules].forEach(b => b.classList.remove('active'));
      [viewGame, viewChart, viewRules].forEach(v => {
        v.style.display = 'none';
        v.classList.remove('active');
      });

      activeTab.classList.add('active');
      activeView.style.display = 'flex';
      activeView.classList.add('active');

      if (activeTab === tabGame) {
        speedControl.style.display = 'flex';
      }
    };

    tabGame.addEventListener('click', () => switchView(tabGame, viewGame));
    tabChart.addEventListener('click', () => switchView(tabChart, viewChart));
    tabRules.addEventListener('click', () => switchView(tabRules, viewRules));

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

      // If in game section and pads are visible
      if (viewGame.style.display !== 'none' && this.padsGrid.style.display !== 'none') {
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

// Global Launch
window.addEventListener('DOMContentLoaded', () => {
  window.toneGame = new ToneMasterGame();
  window.toneGame.init();
});
