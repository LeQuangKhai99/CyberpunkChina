/**
 * PINYIN POP! 🗺️ - LEARNING ROADMAP, 5-STEP MASTERY LOOP, DAILY QUESTS, SRS & PLACEMENT TEST
 * Connects all 5 modules (Flashcard, Hanzi Puzzle, Tone Master, Hanzi Stroke, Pinyin Pop Arcade)
 * into a unified, personalized Chinese learning curriculum synced with Supabase Cloud.
 */

(function() {
  'use strict';

  const WORDS_PER_UNIT = 25;

  // Curated topic titles for HSK 1-3 units & fallback generator for HSK 4-6
  const UNIT_TOPICS = {
    0: [
      '21 Thanh Mẫu & 36 Vận Mẫu Bắc Kinh',
      '4 Thanh Điệu & Bí Kíp Biến Điệu',
      '8 Nét Cơ Bản & 20 Bộ Thủ Cốt Lõi'
    ],
    1: [
      'Chào hỏi, Gia đình & Đồ vật cơ bản',
      'Ăn uống, Thời gian & Đi lại',
      'Mua sắm, Trường học & Bạn bè',
      'Thời tiết, Sở thích & Hoạt động',
      'Sức khỏe, Nghề nghiệp & Đời sống',
      'Phương hướng, Giao tiếp & Tổng kết HSK 1'
    ],
    2: [
      'Gặp gỡ, Trò chuyện & Cảm xúc',
      'Thể thao, Sức khỏe & Thói quen',
      'Nhà cửa, Phòng ốc & Đồ dùng',
      'Du lịch, Sân bay & Phương tiện',
      'Công việc, Học tập & Kỳ thi',
      'Thời gian, Lễ hội & Tổng kết HSK 2'
    ],
    3: [
      'Kế hoạch, Cuộc sống & Gia đình',
      'Mua sắm, Quần áo & Màu sắc',
      'Ẩm thực, Nhà hàng & Khẩu vị',
      'Môi trường, Thời tiết & Bốn mùa',
      'Giao tiếp công sở & Đồng nghiệp',
      'Sở thích, Âm nhạc & Nghệ thuật',
      'Du lịch khám phá & Địa lý',
      'Sức khỏe, Bệnh viện & Chăm sóc',
      'Tính cách, Cảm xúc & Mối quan hệ',
      'Văn hóa, Lịch sử & Truyền thống',
      'Khoa học, Công nghệ & Đời sống',
      'Thử thách Tổng hợp HSK 3'
    ]
  };

  const STAGES_CONFIG = [
    {
      hsk: 0,
      badge: '🌱 Chặng 0',
      title: 'Nhập Môn Pinyin & Nét Chữ',
      shortSub: 'Người mới bắt đầu',
      desc: 'Làm chủ 21 Thanh mẫu, 36 Vận mẫu, quy tắc biến điệu thanh 3, 8 nét cơ bản và 25 chữ Hán nền tảng đầu tiên.',
      totalWords: 25,
      totalUnits: 3
    },
    {
      hsk: 1,
      badge: '🌿 HSK 1',
      title: 'Giao Tiếp Sơ Cấp 1',
      shortSub: '150 Từ • 6 Bài học',
      desc: 'Hiểu và sử dụng các cụm từ, câu giao tiếp hàng ngày cực kỳ cơ bản (chào hỏi, giới thiệu bản thân, mua bán, hỏi giờ).',
      totalWords: 150,
      totalUnits: 6
    },
    {
      hsk: 2,
      badge: '🍀 HSK 2',
      title: 'Giao Tiếp Sơ Cấp 2',
      shortSub: '150 Từ • 6 Bài học',
      desc: 'Giao tiếp trực tiếp về các chủ đề quen thuộc hàng ngày: gia đình, sở thích, công việc, du lịch và thời tiết.',
      totalWords: 150,
      totalUnits: 6
    },
    {
      hsk: 3,
      badge: '⭐ HSK 3',
      title: 'Giao Tiếp Trung Cấp 1',
      shortSub: '300 Từ • 12 Bài học',
      desc: 'Đủ khả năng giao tiếp độc lập trong học tập, công việc và các chuyến du lịch tại Trung Quốc.',
      totalWords: 300,
      totalUnits: 12
    },
    {
      hsk: 4,
      badge: '🚀 HSK 4',
      title: 'Giao Tiếp Trung Cấp 2',
      shortSub: '600 Từ • 24 Bài học',
      desc: 'Thảo luận lưu loát đa dạng chủ đề xã hội, kinh tế, văn hóa và giao tiếp tự nhiên với người bản xứ.',
      totalWords: 600,
      totalUnits: 24
    },
    {
      hsk: 5,
      badge: '🔥 HSK 5',
      title: 'Hán Ngữ Cao Cấp 1',
      shortSub: '1.300 Từ • 52 Bài học',
      desc: 'Đọc hiểu báo chí, tạp chí tiếng Trung, xem phim truyền hình và thuyết trình hoàn chỉnh trước đám đông.',
      totalWords: 1300,
      totalUnits: 52
    },
    {
      hsk: 6,
      badge: '👑 HSK 6',
      title: 'Tinh Thông Hán Ngữ',
      shortSub: '2.500 Từ • 100 Bài học',
      desc: 'Làm chủ toàn diện 5.000 từ HSK, diễn đạt sắc bén bằng cả văn nói và văn viết tương đương người bản ngữ.',
      totalWords: 2500,
      totalUnits: 100
    }
  ];

  // Curated natural example sentences for core vocabulary + intelligent fallback
  const CURATED_SENTENCES = {
    '爱': { zh: '我爱我的家人。', py: 'Wǒ ài wǒ de jiārén.', vn: 'Tôi yêu gia đình của mình.' },
    '爸爸': { zh: '我爸爸是医生。', py: 'Wǒ bàba shì yīshēng.', vn: 'Bố tôi là bác sĩ.' },
    '妈妈': { zh: '妈妈做的菜很好吃。', py: 'Māma zuò de cài hěn hǎochī.', vn: 'Món ăn mẹ nấu rất ngon.' },
    '北京': { zh: '明天我去北京旅游。', py: 'Míngtiān wǒ qù Běijīng lǚyóu.', vn: 'Ngày mai tôi đi Bắc Kinh du lịch.' },
    '茶': { zh: '请喝一杯热茶。', py: 'Qǐng hē yì bēi rè chá.', vn: 'Mời uống một tách trà nóng.' },
    '吃': { zh: '你今天想吃什么？', py: 'Nǐ jīntiān xiǎng chī shénme?', vn: 'Hôm nay bạn muốn ăn gì?' },
    '学习': { zh: '我每天都努力学习汉语。', py: 'Wǒ měitiān dōu nǔlì xuéxí Hànyǔ.', vn: 'Mỗi ngày tôi đều chăm chỉ học tiếng Trung.' },
    '学': { zh: '学好汉语很有用。', py: 'Xué hǎo Hànyǔ hěn yǒuyòng.', vn: 'Học tốt tiếng Trung rất hữu ích.' },
    '好': { zh: '你好，很高兴认识你！', py: 'Nǐ hǎo, hěn gāoxìng rènshi nǐ!', vn: 'Xin chào, rất vui được làm quen với bạn!' },
    '朋友': { zh: '他是我的好朋友。', py: 'Tā shì wǒ de hǎo péngyou.', vn: 'Anh ấy là bạn tốt của tôi.' },
    '中国': { zh: '我想去中国看长城。', py: 'Wǒ xiǎng qù Zhōngguó kàn Chángchéng.', vn: 'Tôi muốn đến Trung Quốc ngắm Vạn Lý Trường Thành.' },
    '工作': { zh: '他在一家大公司工作。', py: 'Tā zài yì jiā dà gōngsī gōngzuò.', vn: 'Anh ấy làm việc tại một công ty lớn.' },
    '喜欢': { zh: '我非常喜欢听中国音乐。', py: 'Wǒ fēicháng xǐhuan tīng Zhōngguó yīnyuè.', vn: 'Tôi rất thích nghe nhạc Trung Quốc.' },
    '谢谢': { zh: '非常谢谢你的帮助！', py: 'Fēicháng xièxie nǐ de bāngzhù!', vn: 'Cảm ơn sự giúp đỡ của bạn rất nhiều!' },
    '老师': { zh: '王老师教我们写汉字。', py: 'Wáng lǎoshī jiāo wǒmen xiě Hànzì.', vn: 'Thầy Vương dạy chúng tôi viết chữ Hán.' },
    '学校': { zh: '我们学校有很多外国学生。', py: 'Wǒmen xuéxiào yǒu hěn duō wàiguó xuésheng.', vn: 'Trường chúng tôi có rất nhiều du học sinh.' },
    '时间': { zh: '请问你现在有时间吗？', py: 'Qǐngwèn nǐ xiànzài yǒu shíjiān ma?', vn: 'Xin hỏi bây giờ bạn có thời gian không?' },
    '天气': { zh: '今天的天气真好！', py: 'Jīntiān de tiānqì zhēn hǎo!', vn: 'Thời tiết hôm nay đẹp thật đấy!' }
  };

  class PinyinRoadmapManager {
    constructor() {
      this.state = this.loadState();
      this.ensureTodayQuests();
      this.setupCloudSyncListener();
    }

    getTodayStr() {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    loadState() {
      let extra = {};
      try {
        extra = JSON.parse(localStorage.getItem('pinyin_pop_extra_data') || '{}');
      } catch (e) {
        extra = {};
      }

      return {
        currentHsk: typeof extra.currentHsk === 'number' ? extra.currentHsk : 1,
        currentDeck: typeof extra.currentDeck === 'number' ? extra.currentDeck : 0,
        placementLevel: extra.placementLevel || null,
        xp: extra.xp || 0,
        studyStreak: extra.studyStreak || { count: 0, lastDate: null },
        completedSteps: extra.completedSteps || {}, // { "1_0": [1, 2], ... }
        stepProgress: extra.stepProgress || {},     // { "1_0_1": 6, ... }
        dailyQuests: extra.dailyQuests || null,
        srsMeta: extra.srsMeta || {}
      };
    }

    saveState() {
      try {
        let extra = {};
        try {
          extra = JSON.parse(localStorage.getItem('pinyin_pop_extra_data') || '{}');
        } catch (e) {}

        const updated = {
          ...extra,
          currentHsk: this.state.currentHsk,
          currentDeck: this.state.currentDeck,
          placementLevel: this.state.placementLevel,
          xp: this.state.xp,
          studyStreak: this.state.studyStreak,
          completedSteps: this.state.completedSteps,
          stepProgress: this.state.stepProgress,
          dailyQuests: this.state.dailyQuests,
          srsMeta: this.state.srsMeta
        };

        localStorage.setItem('pinyin_pop_extra_data', JSON.stringify(updated));
        if (window.PinyinAuth && typeof window.PinyinAuth.triggerDebouncedSync === 'function') {
          window.PinyinAuth.triggerDebouncedSync();
        }
      } catch (e) {}
    }

    ensureTodayQuests() {
      const today = this.getTodayStr();
      if (!this.state.dailyQuests || this.state.dailyQuests.date !== today) {
        this.state.dailyQuests = {
          date: today,
          flashcards: 0,
          strokes: 0,
          tonePuzzle: 0,
          arcadeKills: 0,
          rewarded: []
        };
        this.saveState();
      }
    }

    markStudyToday() {
      const today = this.getTodayStr();
      const streak = this.state.studyStreak || { count: 0, lastDate: null };
      if (streak.lastDate === today) return;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      if (streak.lastDate === yStr) {
        streak.count = (streak.count || 0) + 1;
      } else {
        streak.count = 1;
      }
      streak.lastDate = today;
      this.state.studyStreak = streak;
    }

    setupCloudSyncListener() {
      window.addEventListener('cloud-progress-updated', () => {
        this.state = this.loadState();
        this.ensureTodayQuests();
        if (document.getElementById('rmPortalHubMount')) {
          this.renderIndexHub();
        }
        if (document.getElementById('ppRoadmapLessonBar')) {
          this.updateLessonStepperBar();
        }
      });
    }

    /* =======================================================================
       VOCABULARY & EXAMPLE SENTENCE HELPERS
       ======================================================================= */
    getAllWords() {
      return window.CHINESE_WORDS_5000 || [];
    }

    getStageConfig(hsk) {
      return STAGES_CONFIG.find(s => s.hsk === hsk) || STAGES_CONFIG[1];
    }

    getUnitTopic(hsk, deckIdx) {
      if (UNIT_TOPICS[hsk] && UNIT_TOPICS[hsk][deckIdx]) {
        return UNIT_TOPICS[hsk][deckIdx];
      }
      const startWord = deckIdx * WORDS_PER_UNIT + 1;
      const endWord = (deckIdx + 1) * WORDS_PER_UNIT;
      const words = this.getLessonWords(hsk, deckIdx);
      const sample = words.slice(0, 3).map(w => w.hanzi).join(', ');
      return sample ? `Từ vựng trọng tâm (${sample}...)` : `Từ ${startWord} – ${endWord}`;
    }

    getLessonWords(hsk, deckIdx = 0) {
      const all = this.getAllWords();
      if (all.length === 0) return [];

      if (hsk === 0) {
        // Chặng 0: 25 chữ đơn cơ bản nhất cho người mới bắt đầu
        const singleChars = all.filter(w => w.level === 1 && w.hanzi && w.hanzi.length === 1);
        return singleChars.slice(0, 25);
      }

      const levelWords = all.filter(w => w.level === hsk);
      const start = deckIdx * WORDS_PER_UNIT;
      return levelWords.slice(start, start + WORDS_PER_UNIT);
    }

    getExampleSentence(word) {
      if (!word || !word.hanzi) {
        return { zh: '我每天学习汉语。', py: 'Wǒ měitiān xuéxí Hànyǔ.', vn: 'Tôi học tiếng Trung mỗi ngày.' };
      }
      if (CURATED_SENTENCES[word.hanzi]) {
        return CURATED_SENTENCES[word.hanzi];
      }
      const meaningVn = (word.meaning_vn || word.meaning || 'này').split(';')[0].trim();
      const py = word.pinyin || word.clean || '';
      return {
        zh: `常用词：“${word.hanzi}”在汉语里很重要。`,
        py: `Chángyòng cí: "${py}" zài Hànyǔ lǐ hěn zhòngyào.`,
        vn: `Từ thông dụng: "${word.hanzi}" (${meaningVn}) rất quan trọng trong tiếng Trung.`
      };
    }

    /* =======================================================================
       SRS (SPACED REPETITION) & PROGRESS METRICS
       ======================================================================= */
    getMasteredIds() {
      try {
        return new Set(JSON.parse(localStorage.getItem('pinyin_pop_mastered') || '[]'));
      } catch (e) {
        return new Set();
      }
    }

    getReviewIds() {
      try {
        return new Set(JSON.parse(localStorage.getItem('pinyin_pop_review') || '[]'));
      } catch (e) {
        return new Set();
      }
    }

    recordWordSrs(wordId, isEasy) {
      if (!wordId) return;
      const now = Date.now();
      const prev = this.state.srsMeta[wordId] || { box: 0, nextReview: now };
      const intervalsDays = [0, 1, 3, 7, 14, 30];
      if (isEasy) {
        const nextBox = Math.min(5, (prev.box || 0) + 1);
        const days = intervalsDays[nextBox] || 1;
        this.state.srsMeta[wordId] = {
          box: nextBox,
          nextReview: now + days * 86400000
        };
      } else {
        this.state.srsMeta[wordId] = {
          box: 0,
          nextReview: now + 3600000 // Review again in 1 hour / today
        };
      }
      this.saveState();
    }

    getDueSrsCount() {
      const reviewSet = this.getReviewIds();
      const now = Date.now();
      let dueCount = reviewSet.size;
      Object.keys(this.state.srsMeta || {}).forEach(idStr => {
        const id = parseInt(idStr, 10);
        if (!reviewSet.has(id) && this.state.srsMeta[idStr].nextReview <= now) {
          dueCount++;
        }
      });
      return dueCount;
    }

    getUnitCompletedSteps(hsk, deckIdx) {
      const key = `${hsk}_${deckIdx}`;
      return this.state.completedSteps[key] || [];
    }

    isStepDone(hsk, deckIdx, stepNum) {
      return this.getUnitCompletedSteps(hsk, deckIdx).includes(stepNum);
    }

    /* =======================================================================
       5-STEP DEFINITIONS & URL BUILDER
       ======================================================================= */
    getStepsForUnit(hsk, deckIdx) {
      if (hsk === 0) {
        return [
          {
            step: 1,
            icon: '🎙️',
            title: 'Bảng Thanh Mẫu & Vận Mẫu',
            desc: 'Nghe & luyện phát âm chuẩn 21 Thanh mẫu, 36 Vận mẫu Bắc Kinh.',
            goalCount: 5,
            unitLabel: 'lần luyện',
            url: `tone-master.html?hsk=0&deck=${deckIdx}&roadmap=1&step=1&mode=chart`
          },
          {
            step: 2,
            icon: '📈',
            title: 'Quy Tắc Biến Điệu & Phản Xạ Tai',
            desc: 'Nắm vững biến điệu thanh 3, chữ 不/一 và vượt qua 6 câu nghe.',
            goalCount: 6,
            unitLabel: 'câu đúng',
            url: `tone-master.html?hsk=0&deck=${deckIdx}&roadmap=1&step=2&mode=game`
          },
          {
            step: 3,
            icon: '🧩',
            title: 'Chiết Tự Bộ Thủ Cốt Lõi',
            desc: 'Ghép các bộ thủ tượng hình để hiểu gốc rễ cấu tạo chữ Hán.',
            goalCount: 5,
            unitLabel: 'chữ ghép đúng',
            url: `hanzi-puzzle.html?hsk=0&deck=${deckIdx}&roadmap=1&step=3&mode=radicals`
          },
          {
            step: 4,
            icon: '✍️',
            title: '8 Nét Cơ Bản & Bút Thuận',
            desc: 'Tập viết 5 chữ Hán nền tảng theo 7 quy tắc bút thuận vàng.',
            goalCount: 5,
            unitLabel: 'chữ hoàn thành',
            url: `hanzi-stroke.html?hsk=0&deck=${deckIdx}&roadmap=1&step=4`
          },
          {
            step: 5,
            icon: '🚀',
            title: 'Thử Thách Bắn Chữ Nhập Môn',
            desc: 'Bắn hạ 10 bóng từ cơ bản để hoàn thành khóa Nhập Môn!',
            goalCount: 10,
            unitLabel: 'bóng từ',
            url: `pinyin-pop.html?hsk=0&deck=${deckIdx}&roadmap=1&step=5`
          }
        ];
      }

      return [
        {
          step: 1,
          icon: '🗂️',
          title: 'Bước 1: Nạp Từ (Flashcard 3D)',
          desc: 'Lật thẻ 3D, nghe phát âm & đánh dấu thuộc tối thiểu 8 từ trong bài.',
          goalCount: 8,
          unitLabel: 'từ đã học',
          url: `flashcard.html?hsk=${hsk}&deck=${deckIdx}&roadmap=1&step=1`
        },
        {
          step: 2,
          icon: '🧩',
          title: 'Bước 2: Chiết Tự & Ghép Từ',
          desc: 'Ghép đúng 5 từ/bộ thủ thuộc bài học để nhớ sâu mặt chữ.',
          goalCount: 5,
          unitLabel: 'câu ghép đúng',
          url: `hanzi-puzzle.html?hsk=${hsk}&deck=${deckIdx}&roadmap=1&step=2`
        },
        {
          step: 3,
          icon: '🎵',
          title: 'Bước 3: Luyện Tai & Phát Âm',
          desc: 'Phân biệt đúng 6 thanh điệu hoặc luyện nói AI cho từ trong bài.',
          goalCount: 6,
          unitLabel: 'câu nghe đúng',
          url: `tone-master.html?hsk=${hsk}&deck=${deckIdx}&roadmap=1&step=3`
        },
        {
          step: 4,
          icon: '✍️',
          title: 'Bước 4: Tập Viết Bút Thuận',
          desc: 'Tự tay viết đúng thứ tự nét 4 chữ Hán trong bài trên ô Mễ Điền.',
          goalCount: 4,
          unitLabel: 'chữ viết xong',
          url: `hanzi-stroke.html?hsk=${hsk}&deck=${deckIdx}&roadmap=1&step=4`
        },
        {
          step: 5,
          icon: '🚀',
          title: 'Bước 5: Đấu Boss Phản Xạ',
          desc: 'Bắn nổ 12 bóng từ vựng của bài học để mở khóa Bài tiếp theo!',
          goalCount: 12,
          unitLabel: 'từ bắn trúng',
          url: `pinyin-pop.html?hsk=${hsk}&deck=${deckIdx}&roadmap=1&step=5`
        }
      ];
    }

    /* =======================================================================
       RECORD ACTIVITY FROM ANY OF THE 5 MODULES
       ======================================================================= */
    recordActivity(type, amount = 1, meta = {}) {
      this.ensureTodayQuests();
      this.markStudyToday();

      const q = this.state.dailyQuests;
      if (type === 'flashcard') {
        q.flashcards = (q.flashcards || 0) + amount;
        if (meta.wordId) this.recordWordSrs(meta.wordId, meta.isEasy !== false);
      } else if (type === 'stroke') {
        q.strokes = (q.strokes || 0) + amount;
      } else if (type === 'puzzle' || type === 'tone') {
        q.tonePuzzle = (q.tonePuzzle || 0) + amount;
      } else if (type === 'arcade') {
        q.arcadeKills = (q.arcadeKills || 0) + amount;
      }

      // Check daily quest rewards
      const questDefs = [
        { id: 'q_fc', field: 'flashcards', target: 10, xp: 50 },
        { id: 'q_st', field: 'strokes', target: 5, xp: 60 },
        { id: 'q_tp', field: 'tonePuzzle', target: 5, xp: 50 },
        { id: 'q_ar', field: 'arcadeKills', target: 15, xp: 80 }
      ];
      questDefs.forEach(qd => {
        if ((q[qd.field] || 0) >= qd.target && !q.rewarded.includes(qd.id)) {
          q.rewarded.push(qd.id);
          this.state.xp = (this.state.xp || 0) + qd.xp;
        }
      });

      // Also update active roadmap step progress if on a lesson page
      const urlParams = new URLSearchParams(window.location.search);
      const hskParam = urlParams.get('hsk');
      const deckParam = urlParams.get('deck');
      const stepParam = urlParams.get('step');

      const hsk = hskParam !== null && hskParam !== 'all' && hskParam !== 'fav' && hskParam !== 'learning'
        ? parseInt(hskParam, 10)
        : this.state.currentHsk;
      const deck = deckParam !== null ? parseInt(deckParam, 10) : this.state.currentDeck;
      const step = stepParam !== null ? parseInt(stepParam, 10) : this.inferStepFromPage();

      if (!isNaN(hsk) && !isNaN(deck) && step >= 1 && step <= 5) {
        const progKey = `${hsk}_${deck}_${step}`;
        const stepsConfig = this.getStepsForUnit(hsk, deck);
        const stepObj = stepsConfig.find(s => s.step === step);
        const goal = stepObj ? stepObj.goalCount : 5;

        const curProg = (this.state.stepProgress[progKey] || 0) + amount;
        this.state.stepProgress[progKey] = curProg;

        if (curProg >= goal && !this.isStepDone(hsk, deck, step)) {
          const unitKey = `${hsk}_${deck}`;
          const arr = this.state.completedSteps[unitKey] || [];
          if (!arr.includes(step)) {
            arr.push(step);
            arr.sort();
            this.state.completedSteps[unitKey] = arr;
            this.state.xp = (this.state.xp || 0) + 100;

            // If all 5 steps or step 5 completed, advance currentDeck if it matches
            if (step === 5 && hsk === this.state.currentHsk && deck === this.state.currentDeck) {
              const stageCfg = this.getStageConfig(hsk);
              if (deck + 1 < stageCfg.totalUnits) {
                this.state.currentDeck = deck + 1;
              } else if (hsk < 6) {
                this.state.currentHsk = hsk + 1;
                this.state.currentDeck = 0;
              }
            }
          }
        }
      }

      this.saveState();
      this.updateLessonStepperBar();
    }

    inferStepFromPage() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('flashcard')) return 1;
      if (path.includes('hanzi-puzzle')) return 2;
      if (path.includes('tone-master')) return 3;
      if (path.includes('hanzi-stroke')) return 4;
      if (path.includes('pinyin-pop')) return 5;
      return 0;
    }

    getUserRankTitle() {
      const xp = this.state.xp || 0;
      const mastered = this.getMasteredIds().size;
      const totalScore = xp + mastered * 15;
      if (totalScore >= 8000) return { icon: '🐉', title: 'Đại Sư Hán Ngữ (Master)' };
      if (totalScore >= 4000) return { icon: '👑', title: 'Học Giả HSK Cao Cấp' };
      if (totalScore >= 1800) return { icon: '🚀', title: 'Hiệp Sĩ Pinyin Trung Cấp' };
      if (totalScore >= 600) return { icon: '⭐', title: 'Chuyên Gia Nhập Môn' };
      return { icon: '🌱', title: 'Tân Binh Hán Ngữ' };
    }

    /* =======================================================================
       RENDER ROADMAP & DAILY HUB ON INDEX.HTML
       ======================================================================= */
    renderIndexHub() {
      const mount = document.getElementById('rmPortalHubMount');
      if (!mount) return;

      const hsk = this.state.currentHsk;
      const deck = this.state.currentDeck;
      const stageCfg = this.getStageConfig(hsk);
      const rank = this.getUserRankTitle();
      const masteredSet = this.getMasteredIds();
      const dueSrs = this.getDueSrsCount();
      const streakDays = (this.state.studyStreak && this.state.studyStreak.count) || 0;

      // Determine recommended next step in current unit
      const completedInUnit = this.getUnitCompletedSteps(hsk, deck);
      const unitSteps = this.getStepsForUnit(hsk, deck);
      const nextStepObj = unitSteps.find(s => !completedInUnit.includes(s.step)) || unitSteps[0];

      // Calculate stage mastery
      const allWords = this.getAllWords();
      const stageWords = hsk === 0
        ? this.getLessonWords(0, 0)
        : allWords.filter(w => w.level === hsk);
      const stageMasteredCount = stageWords.filter(w => masteredSet.has(w.id)).length;
      const stagePct = stageWords.length > 0
        ? Math.min(100, Math.round((stageMasteredCount / stageWords.length) * 100))
        : 0;

      // Daily quests data
      const q = this.state.dailyQuests || {};
      const questsList = [
        {
          icon: '🗂️',
          name: 'Nạp 10 từ vựng Flashcard',
          cur: Math.min(10, q.flashcards || 0),
          max: 10,
          xp: '+50 EXP',
          url: `flashcard.html?hsk=${hsk}&deck=${deck}&roadmap=1&step=1`
        },
        {
          icon: '✍️',
          name: 'Tập viết 5 chữ Hán bút thuận',
          cur: Math.min(5, q.strokes || 0),
          max: 5,
          xp: '+60 EXP',
          url: `hanzi-stroke.html?hsk=${hsk}&deck=${deck}&roadmap=1&step=4`
        },
        {
          icon: '🎵',
          name: 'Giải 5 câu Thanh điệu / Chiết tự',
          cur: Math.min(5, q.tonePuzzle || 0),
          max: 5,
          xp: '+50 EXP',
          url: `tone-master.html?hsk=${hsk}&deck=${deck}&roadmap=1&step=3`
        },
        {
          icon: '🚀',
          name: 'Bắn nổ 15 bóng từ Pinyin Pop',
          cur: Math.min(15, q.arcadeKills || 0),
          max: 15,
          xp: '+80 EXP',
          url: `pinyin-pop.html?hsk=${hsk}&deck=${deck}&roadmap=1&step=5`
        }
      ];

      // Lesson 25 words
      const unitWords = this.getLessonWords(hsk, deck);
      const unitTopic = this.getUnitTopic(hsk, deck);

      mount.innerHTML = `
        <div class="rm-hub-wrapper">
          <!-- 1. TOP LEARNER STATUS & QUICK ACTIONS BANNER -->
          <div class="rm-status-banner">
            <div class="rm-user-level-box">
              <div class="rm-rank-badge-icon">${rank.icon}</div>
              <div class="rm-user-meta">
                <span class="rm-user-rank-label">${rank.title} // LỘ TRÌNH CÁ NHÂN HÓA</span>
                <div class="rm-user-current-goal">
                  Đang học: ${stageCfg.badge} • Bài ${deck + 1}: ${unitTopic}
                </div>
                <div class="rm-telemetry-pills">
                  <span class="rm-pill rm-pill-streak" title="Chuỗi ngày học liên tiếp">
                    🔥 Chuỗi: <strong>${streakDays} ngày</strong>
                  </span>
                  <span class="rm-pill rm-pill-xp" title="Điểm kinh nghiệm tích lũy">
                    ⚡ <strong>${(this.state.xp || 0).toLocaleString('vi-VN')} EXP</strong>
                  </span>
                  <span class="rm-pill rm-pill-mastered" title="Tổng số từ vựng đã thuộc">
                    ✅ Đã thuộc: <strong>${masteredSet.size.toLocaleString('vi-VN')} / 5.000 từ</strong>
                  </span>
                  <a href="flashcard.html?hsk=learning&roadmap=srs" class="rm-pill rm-pill-srs" title="Ôn tập các từ đến hạn theo thuật toán Spaced Repetition">
                    🔔 Cần ôn SRS: <strong>${dueSrs} từ</strong>
                  </a>
                </div>
              </div>
            </div>

            <div class="rm-banner-actions">
              <button type="button" class="rm-btn-action rm-btn-placement" id="btnOpenPlacementTest" title="Làm bài kiểm tra 12 câu để hệ thống xếp lớp tự động">
                🎓 Kiểm Tra Trình Độ (3 Phút)
              </button>
              <a href="${nextStepObj.url}" class="rm-btn-action rm-btn-continue">
                ▶️ Học Tiếp Bài ${deck + 1} (${nextStepObj.icon} Bước ${nextStepObj.step}/5)
              </a>
            </div>
          </div>

          <!-- 2. DAILY QUESTS (MỤC TIÊU 15 PHÚT MỖI NGÀY) -->
          <div class="rm-quests-card">
            <div class="rm-card-header">
              <div class="rm-card-title">
                🎯 NHIỆM VỤ HÀNG NGÀY (15 PHÚT DUY TRÌ PHẢN XẠ)
              </div>
              <span class="rm-card-sub">Hoàn thành 4 bước nhỏ mỗi ngày để giữ lửa Streak & nhận thưởng EXP!</span>
            </div>
            <div class="rm-quests-grid">
              ${questsList.map(qt => {
                const isDone = qt.cur >= qt.max;
                const pct = Math.round((qt.cur / qt.max) * 100);
                return `
                  <div class="rm-quest-item ${isDone ? 'done' : ''}">
                    <div class="rm-quest-top">
                      <div class="rm-quest-info">
                        <div class="rm-quest-icon">${isDone ? '✅' : qt.icon}</div>
                        <div class="rm-quest-name">${qt.name}</div>
                      </div>
                      <span class="rm-quest-xp">${qt.xp}</span>
                    </div>
                    <div class="rm-quest-progress-row">
                      <div class="rm-quest-bar">
                        <div class="rm-quest-fill" style="width: ${pct}%;"></div>
                      </div>
                      <span class="rm-quest-count">${qt.cur}/${qt.max}</span>
                    </div>
                    <a href="${qt.url}" class="rm-quest-go-btn">
                      ${isDone ? '🌟 Đã hoàn thành • Luyện thêm' : '🚀 Thực hiện ngay ➔'}
                    </a>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 3. INTERACTIVE 7-STAGE ROADMAP (ZERO -> HSK 6) -->
          <div class="rm-main-roadmap-card">
            <div class="rm-card-header" style="margin-bottom: 0;">
              <div class="rm-card-title">
                🗺️ BẢN ĐỒ LỘ TRÌNH CHINH PHỤC TIẾNG TRUNG (ZERO ➔ HSK 6)
              </div>
              <span class="rm-card-sub">Chọn Chặng HSK và Bài học (25 từ/bài) để đi theo Vòng lặp 5 bước chuẩn quốc tế</span>
            </div>

            <!-- Stage Selector Tabs -->
            <div class="rm-stage-tabs" id="rmStageTabs">
              ${STAGES_CONFIG.map(st => `
                <button type="button" class="rm-stage-tab ${st.hsk === hsk ? 'active' : ''}" data-hsk="${st.hsk}">
                  <div class="rm-stage-tab-top">
                    <span>${st.badge}</span>
                    <span>${st.hsk === hsk ? '📍' : ''}</span>
                  </div>
                  <span class="rm-stage-tab-sub">${st.shortSub}</span>
                </button>
              `).join('')}
            </div>

            <!-- Stage Overview Banner -->
            <div class="rm-stage-overview">
              <div class="rm-stage-desc-col">
                <div class="rm-stage-headline">${stageCfg.badge} — ${stageCfg.title}</div>
                <div class="rm-stage-summary">${stageCfg.desc}</div>
              </div>
              <div class="rm-stage-progress-box">
                <div>
                  <div style="font-size: 10.5px; font-weight: 800; color: #64748b;">TIẾN ĐỘ TỪ VỰNG CHẶNG NÀY</div>
                  <div style="font-size: 12.5px; font-weight: 800; color: #1e293b;">Đã thuộc ${stageMasteredCount} / ${stageWords.length} từ</div>
                </div>
                <div class="rm-stage-pct">${stagePct}%</div>
              </div>
            </div>

            <!-- Units (Decks) Grid -->
            <div class="rm-units-scroll-wrap">
              <div class="rm-units-label-row">
                <span>📚 DANH SÁCH BÀI HỌC TRONG ${stageCfg.badge.toUpperCase()} (${stageCfg.totalUnits} BÀI • 25 TỪ/BÀI):</span>
                <span>Nhấp vào bài học bất kỳ để mở 5 bước luyện tập</span>
              </div>
              <div class="rm-units-grid" id="rmUnitsGrid">
                ${Array.from({ length: stageCfg.totalUnits }).map((_, idx) => {
                  const doneSteps = this.getUnitCompletedSteps(hsk, idx);
                  const isCurrent = idx === deck;
                  const isCompleted = doneSteps.length >= 5;
                  const topic = this.getUnitTopic(hsk, idx);
                  return `
                    <button type="button" class="rm-unit-node ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-deck="${idx}">
                      <div class="rm-unit-node-top">
                        <span>📖 Bài ${idx + 1}</span>
                        <span>${isCompleted ? '🌟 Đã xong' : `${doneSteps.length}/5 bước`}</span>
                      </div>
                      <div class="rm-unit-node-topic" title="${topic}">${topic}</div>
                      <div class="rm-unit-steps-dots">
                        ${[1, 2, 3, 4, 5].map(s => `<span class="rm-step-dot ${doneSteps.includes(s) ? 'done' : ''}"></span>`).join('')}
                      </div>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Active Unit 5-Step Mastery Loop -->
            <div class="rm-active-lesson-panel">
              <div class="rm-lesson-header">
                <div class="rm-lesson-title-group">
                  <span class="rm-lesson-tag">🔥 VÒNG LẶP 5 BƯỚC LÀM CHỦ BÀI HỌC ĐANG CHỌN</span>
                  <h3 class="rm-lesson-title">
                    ${stageCfg.badge} • Bài ${deck + 1}: ${unitTopic}
                  </h3>
                </div>
                <span style="font-size: 12px; font-weight: 700; color: #475569;">
                  Đã hoàn thành: <strong>${completedInUnit.length} / 5 bước</strong>
                </span>
              </div>

              <!-- 5 Steps Cards -->
              <div class="rm-steps-pipeline">
                ${unitSteps.map(st => {
                  const isDone = completedInUnit.includes(st.step);
                  const isRec = !isDone && st.step === nextStepObj.step;
                  const progKey = `${hsk}_${deck}_${st.step}`;
                  const curProg = Math.min(st.goalCount, this.state.stepProgress[progKey] || 0);
                  return `
                    <div class="rm-step-card ${isDone ? 'step-done' : ''} ${isRec ? 'step-recommended' : ''}">
                      <div class="rm-step-badge-row">
                        <span class="rm-step-num-pill">
                          ${isDone ? '✅ Hoàn thành' : (isRec ? '👉 Bước tiếp theo' : `Bước ${st.step}/5`)}
                        </span>
                        <span class="rm-step-status-icon">${st.icon}</span>
                      </div>
                      <div class="rm-step-main">
                        <div class="rm-step-title">${st.title}</div>
                        <div class="rm-step-desc">${st.desc}</div>
                        <div style="font-size: 11px; font-weight: 800; color: #475569; margin-top: 2px;">
                          Tiến độ: ${isDone ? st.goalCount : curProg}/${st.goalCount} ${st.unitLabel}
                        </div>
                      </div>
                      <a href="${st.url}" class="rm-step-btn">
                        ${isDone ? '🔄 Ôn lại bước này' : (isRec ? '🚀 Bắt đầu ngay ➔' : 'Vào luyện tập ➔')}
                      </a>
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- 25 Words Preview of Active Lesson -->
              <div class="rm-vocab-preview-box">
                <div class="rm-vocab-preview-header">
                  <span class="rm-vocab-preview-title">
                    📋 DANH SÁCH ${unitWords.length} TỪ VỰNG TRONG BÀI ${deck + 1} (Nhấp vào từ để nghe phát âm & xem câu ví dụ):
                  </span>
                </div>
                <div id="rmSelectedWordContext" style="display: none;"></div>
                <div class="rm-vocab-chips-wrap" id="rmVocabChipsWrap">
                  ${unitWords.map(w => {
                    const isM = masteredSet.has(w.id);
                    return `
                      <div class="rm-word-chip ${isM ? 'mastered' : ''}" data-word-id="${w.id}" title="Nhấp để nghe đọc và xem câu ví dụ">
                        <span class="rm-chip-hanzi">${w.hanzi}</span>
                        <span class="rm-chip-pinyin">${w.pinyin}</span>
                        <span class="rm-chip-meaning">${(w.meaning_vn || w.meaning || '').split(';')[0]}</span>
                        <span>🔊</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

          </div>
        </div>
      `;

      // Bind stage tab clicks
      mount.querySelectorAll('.rm-stage-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          const newHsk = parseInt(btn.dataset.hsk, 10);
          this.state.currentHsk = newHsk;
          this.state.currentDeck = 0;
          this.saveState();
          this.renderIndexHub();
        });
      });

      // Bind unit node clicks
      mount.querySelectorAll('.rm-unit-node').forEach(btn => {
        btn.addEventListener('click', () => {
          const newDeck = parseInt(btn.dataset.deck, 10);
          this.state.currentDeck = newDeck;
          this.saveState();
          this.renderIndexHub();
        });
      });

      // Bind word chip clicks (speak + show example sentence)
      mount.querySelectorAll('.rm-word-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const wid = parseInt(chip.dataset.wordId, 10);
          const word = unitWords.find(w => w.id === wid);
          if (!word) return;
          this.speakText(word.hanzi);
          const ex = this.getExampleSentence(word);
          const ctxBox = document.getElementById('rmSelectedWordContext');
          if (ctxBox) {
            ctxBox.style.display = 'block';
            ctxBox.innerHTML = `
              <div class="rm-context-sentence-box" style="margin-top: 0; margin-bottom: 6px;">
                <div class="rm-sentence-lines">
                  <div class="rm-sentence-zh">💬 Ví dụ với "${word.hanzi}" (${word.pinyin}): ${ex.zh}</div>
                  <div class="rm-sentence-py">${ex.py}</div>
                  <div class="rm-sentence-vn">🇻🇳 ${ex.vn}</div>
                </div>
                <button type="button" class="rm-sentence-speak-btn" id="btnSpeakPreviewSentence">
                  🔊 Nghe cả câu
                </button>
              </div>
            `;
            const btnSpk = document.getElementById('btnSpeakPreviewSentence');
            if (btnSpk) {
              btnSpk.addEventListener('click', () => this.speakText(ex.zh));
            }
          }
        });
      });

      // Bind Placement Test button
      const btnPlacement = document.getElementById('btnOpenPlacementTest');
      if (btnPlacement) {
        btnPlacement.addEventListener('click', () => this.openPlacementModal());
      }
    }

    speakText(text) {
      if (!('speechSynthesis' in window) || !text) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'zh-CN';
        u.rate = 0.85;
        const voices = window.speechSynthesis.getVoices();
        const zhVoice = voices.find(v => v.lang === 'zh-CN' || v.lang.includes('zh'));
        if (zhVoice) u.voice = zhVoice;
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }

    /* =======================================================================
       PLACEMENT TEST MODAL (BÀI KIỂM TRA XẾP LỚP ĐẦU VÀO)
       ======================================================================= */
    openPlacementModal() {
      let modal = document.getElementById('rmPlacementModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'rmPlacementModal';
        modal.className = 'rm-modal-overlay';
        document.body.appendChild(modal);
      }

      // Generate 12 progressive questions (2 from each HSK 1-6)
      const allWords = this.getAllWords();
      if (allWords.length < 50) return;

      const questions = [];
      for (let lvl = 1; lvl <= 6; lvl++) {
        const pool = allWords.filter(w => w.level === lvl && w.meaning_vn);
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const picked = shuffled.slice(0, 2);
        picked.forEach(correct => {
          const distractors = pool
            .filter(w => w.id !== correct.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          const options = [correct, ...distractors].sort(() => 0.5 - Math.random());
          questions.push({ level: lvl, correct, options });
        });
      }

      let qIdx = 0;
      const levelScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

      const renderQuestion = () => {
        if (qIdx >= questions.length) {
          renderResult();
          return;
        }
        const q = questions[qIdx];
        modal.innerHTML = `
          <div class="rm-modal-card">
            <button type="button" class="rm-modal-close" id="rmClosePtBtn">✕</button>
            <div style="display: flex; align-items: center; justify-content: space-between; padding-right: 36px;">
              <span class="rm-pill rm-pill-xp">🎓 KIỂM TRA XẾP LỚP HSK</span>
              <span style="font-size: 12px; font-weight: 800; color: #64748b;">Câu ${qIdx + 1} / ${questions.length} (Cấp HSK ${q.level})</span>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #475569;">
              Chọn Pinyin và nghĩa tiếng Việt đúng cho từ sau (hoặc bấm "Mới học từ đầu" nếu chưa biết):
            </div>
            <div class="rm-pt-question-hanzi">
              ${q.correct.hanzi}
              <button type="button" id="rmPtSpeakBtn" style="font-size: 18px; margin-left: 8px; border: none; background: #eff6ff; border-radius: 50%; width: 38px; height: 38px; cursor: pointer;" title="Nghe phát âm">🔊</button>
            </div>
            <div class="rm-pt-options">
              ${q.options.map(opt => `
                <button type="button" class="rm-pt-opt-btn" data-id="${opt.id}">
                  <div style="color: #db2777; font-size: 13px;">${opt.pinyin}</div>
                  <div style="color: #1e293b; font-size: 12.5px; margin-top: 2px;">${(opt.meaning_vn || opt.meaning || '').split(';')[0]}</div>
                </button>
              `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
              <button type="button" id="rmPtBeginnerBtn" style="background: none; border: none; color: #64748b; font-size: 12px; font-weight: 700; text-decoration: underline; cursor: pointer;">
                🌱 Tôi mới bắt đầu học từ con số 0 (Bỏ qua test)
              </button>
              <button type="button" id="rmPtSkipBtn" style="background: #f1f5f9; border: none; padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 800; color: #475569; cursor: pointer;">
                Chưa biết từ này ➔
              </button>
            </div>
          </div>
        `;

        this.speakText(q.correct.hanzi);

        modal.querySelector('#rmClosePtBtn').onclick = () => modal.classList.remove('open');
        modal.querySelector('#rmPtSpeakBtn').onclick = () => this.speakText(q.correct.hanzi);
        modal.querySelector('#rmPtBeginnerBtn').onclick = () => {
          this.applyPlacementResult(0);
          modal.classList.remove('open');
        };
        modal.querySelector('#rmPtSkipBtn').onclick = () => {
          qIdx++;
          renderQuestion();
        };
        modal.querySelectorAll('.rm-pt-opt-btn').forEach(btn => {
          btn.onclick = () => {
            const pickedId = parseInt(btn.dataset.id, 10);
            if (pickedId === q.correct.id) {
              levelScores[q.level]++;
            }
            qIdx++;
            renderQuestion();
          };
        });
      };

      const renderResult = () => {
        // Recommend highest level where user got at least 1-2 right, or next level up
        let recHsk = 0;
        const totalRight = Object.values(levelScores).reduce((a, b) => a + b, 0);
        if (totalRight <= 1) {
          recHsk = 0;
        } else if (totalRight <= 3) {
          recHsk = 1;
        } else if (totalRight <= 5) {
          recHsk = 2;
        } else if (totalRight <= 7) {
          recHsk = 3;
        } else if (totalRight <= 9) {
          recHsk = 4;
        } else if (totalRight <= 10) {
          recHsk = 5;
        } else {
          recHsk = 6;
        }

        const cfg = this.getStageConfig(recHsk);
        modal.innerHTML = `
          <div class="rm-modal-card" style="text-align: center;">
            <button type="button" class="rm-modal-close" id="rmClosePtBtn">✕</button>
            <div style="font-size: 48px;">🎉</div>
            <h3 style="font-family: var(--font-brand); font-size: 22px; font-weight: 800; color: #1e1b4b;">
              Kết Quả Đánh Giá Năng Lực: ${totalRight}/${questions.length} Câu Đúng
            </h3>
            <p style="font-size: 13.5px; color: #475569; font-weight: 600; line-height: 1.5;">
              Hệ thống đề xuất bạn bắt đầu lộ trình tại: <br>
              <strong style="font-size: 18px; color: #db2777;">${cfg.badge} — ${cfg.title}</strong>
            </p>
            <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 12px; font-size: 12.5px; color: #334155; font-weight: 600;">
              ${cfg.desc}
            </div>
            <button type="button" class="rm-btn-action rm-btn-continue" id="rmAcceptPtBtn" style="justify-content: center; width: 100%; padding: 14px; font-size: 14px;">
              🚀 Áp Dụng Lộ Trình ${cfg.badge} & Nhận +100 EXP
            </button>
          </div>
        `;

        modal.querySelector('#rmClosePtBtn').onclick = () => modal.classList.remove('open');
        modal.querySelector('#rmAcceptPtBtn').onclick = () => {
          this.applyPlacementResult(recHsk);
          modal.classList.remove('open');
        };
      };

      modal.classList.add('open');
      renderQuestion();
    }

    applyPlacementResult(recHsk) {
      this.state.placementLevel = recHsk;
      this.state.currentHsk = recHsk;
      this.state.currentDeck = 0;
      this.state.xp = (this.state.xp || 0) + 100;
      this.saveState();
      this.renderIndexHub();
    }

    /* =======================================================================
       CROSS-PAGE LESSON STEPPER BAR (ON ALL 5 SUB-PAGES)
       ======================================================================= */
    initSubPageIntegration() {
      const stepNum = this.inferStepFromPage();
      if (stepNum === 0) return; // Not a sub-page

      const urlParams = new URLSearchParams(window.location.search);
      const hskParam = urlParams.get('hsk');
      const deckParam = urlParams.get('deck');

      const hsk = (hskParam !== null && hskParam !== 'all' && hskParam !== 'fav' && hskParam !== 'learning')
        ? parseInt(hskParam, 10)
        : this.state.currentHsk;
      const deck = deckParam !== null ? parseInt(deckParam, 10) : this.state.currentDeck;

      this.activeSubPageContext = { hsk, deck, step: stepNum };

      // Mount the Stepper Bar at the top of the sub-page container
      const bar = document.createElement('div');
      bar.id = 'ppRoadmapLessonBar';
      bar.className = 'rm-lesson-stepper-bar';

      const targetContainer = document.querySelector('.fc-app-container, .pz-container, .tm-container, .hs-container, .game-wrapper');
      if (targetContainer) {
        // Insert right after header
        const header = targetContainer.querySelector('header');
        if (header && header.nextSibling) {
          targetContainer.insertBefore(bar, header.nextSibling);
        } else {
          targetContainer.prepend(bar);
        }
      }

      this.updateLessonStepperBar();
    }

    updateLessonStepperBar() {
      const bar = document.getElementById('ppRoadmapLessonBar');
      if (!bar || !this.activeSubPageContext) return;

      const { hsk, deck } = this.activeSubPageContext;
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step');
      const step = stepParam ? parseInt(stepParam, 10) : this.activeSubPageContext.step;

      const stageCfg = this.getStageConfig(hsk);
      const unitSteps = this.getStepsForUnit(hsk, deck);
      const currentStepObj = unitSteps.find(s => s.step === step) || unitSteps[0];
      const completedArr = this.getUnitCompletedSteps(hsk, deck);
      const progKey = `${hsk}_${deck}_${currentStepObj.step}`;
      const isStepDone = completedArr.includes(currentStepObj.step);
      const curProg = isStepDone
        ? currentStepObj.goalCount
        : Math.min(currentStepObj.goalCount, this.state.stepProgress[progKey] || 0);

      // Find next step or next unit
      const nextStepObj = unitSteps.find(s => s.step === currentStepObj.step + 1);
      let nextUrl = 'index.html';
      let nextLabel = '🏠 Về Bản Đồ Lộ Trình';
      if (nextStepObj) {
        nextUrl = nextStepObj.url;
        nextLabel = `🎉 Sang Bước ${nextStepObj.step}/5: ${nextStepObj.icon} ➔`;
      } else {
        // Finished Step 5! Link to next unit Step 1
        const nextDeck = deck + 1 < stageCfg.totalUnits ? deck + 1 : 0;
        const nextHsk = deck + 1 < stageCfg.totalUnits ? hsk : Math.min(6, hsk + 1);
        nextUrl = `flashcard.html?hsk=${nextHsk}&deck=${nextDeck}&roadmap=1&step=1`;
        nextLabel = `🏆 Xong Bài ${deck + 1}! Sang Bài ${nextDeck + 1} ➔`;
      }

      bar.innerHTML = `
        <div class="rm-stepper-left">
          <a href="index.html" class="rm-stepper-unit-badge" title="Quay về Bản đồ Lộ trình">
            🗺️ ${stageCfg.badge} • Bài ${deck + 1}
          </a>
          <span class="rm-stepper-goal-text">
            ${currentStepObj.icon} ${currentStepObj.title}:
            <strong style="color: ${isStepDone ? '#15803d' : '#db2777'};">
              ${curProg}/${currentStepObj.goalCount} ${currentStepObj.unitLabel} ${isStepDone ? '✅' : ''}
            </strong>
          </span>
        </div>

        <div class="rm-stepper-steps-nav">
          ${unitSteps.map(st => {
            const done = completedArr.includes(st.step);
            const act = st.step === currentStepObj.step;
            return `
              <a href="${st.url}" class="rm-step-pill-link ${act ? 'active' : ''} ${done ? 'done' : ''}" title="${st.title}">
                ${done ? '✅' : st.icon} B${st.step}
              </a>
            `;
          }).join('')}
          ${isStepDone ? `<a href="${nextUrl}" class="rm-stepper-next-cta">${nextLabel}</a>` : ''}
        </div>
      `;
    }
  }

  // Initialize singleton globally
  window.PinyinRoadmap = new PinyinRoadmapManager();

  window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('rmPortalHubMount')) {
      window.PinyinRoadmap.renderIndexHub();
    } else {
      window.PinyinRoadmap.initSubPageIntegration();
    }
  });

})();

