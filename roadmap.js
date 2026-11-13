/**
 * PINYIN POP! 🗺️ - LEARNING ROADMAP, 5-STEP MASTERY LOOP, DAILY QUESTS, SRS & PLACEMENT TEST
 * Connects all 5 modules (Flashcard, Hanzi Puzzle, Tone Master, Hanzi Stroke, Pinyin Pop Arcade)
 * into a unified, personalized Chinese learning curriculum synced with Supabase Cloud.
 */

(function() {
  'use strict';

  const WORDS_PER_UNIT = 25;

  const ROLEPLAY_SCENARIOS = [
    {
      id: 'milktea',
      icon: '🧋',
      title: 'Gọi Trà Sữa & Đồ Ăn Bắc Kinh',
      level: 'HSK 1 - 2',
      npcName: 'Nhân viên Quán Trà (服务员)',
      turns: [
        {
          npcZh: '你好！欢迎光临，请问你想喝点儿什么？',
          npcPy: 'Nǐ hǎo! Huānyíng guānglín, qǐngwèn nǐ xiǎng hē diǎnr shénme?',
          npcVn: 'Xin chào! Chào mừng quý khách, xin hỏi bạn muốn uống gì ạ?',
          options: [
            { zh: '我想喝一杯珍珠奶茶。', py: 'Wǒ xiǎng hē yì bēi zhēnzhū nǎichá.', vn: 'Tôi muốn uống một ly trà sữa trân châu.', correct: true },
            { zh: '我是中国人。', py: 'Wǒ shì Zhōngguórén.', vn: 'Tôi là người Trung Quốc.', correct: false },
            { zh: '今天星期三。', py: 'Jīntiān xīngqīsān.', vn: 'Hôm nay là thứ Tư.', correct: false }
          ]
        },
        {
          npcZh: '好的！请问你要热的还是冰的？甜度怎么选？',
          npcPy: 'Hǎo de! Qǐngwèn nǐ yào rè de háishì bīng de? Tiándù zěnme xuǎn?',
          npcVn: 'Vâng ạ! Bạn muốn uống nóng hay đá? Mức đường chọn thế nào ạ?',
          options: [
            { zh: '我要少冰，半糖，谢谢。', py: 'Wǒ yào shǎo bīng, bàn táng, xièxie.', vn: 'Cho tôi ít đá, nửa đường, cảm ơn.', correct: true },
            { zh: '我不会写汉字。', py: 'Wǒ bú huì xiě Hànzì.', vn: 'Tôi không biết viết chữ Hán.', correct: false },
            { zh: '他在医院工作。', py: 'Tā zài yīyuàn gōngzuò.', vn: 'Anh ấy làm việc ở bệnh viện.', correct: false }
          ]
        },
        {
          npcZh: '一共二十块。请问您怎么付款？',
          npcPy: 'Yígòng èrshí kuài. Qǐngwèn nín zěnme fùkuǎn?',
          npcVn: 'Tổng cộng 20 tệ. Xin hỏi quý khách thanh toán bằng gì ạ?',
          options: [
            { zh: '我用微信支付，给你。', py: 'Wǒ yòng Wēixìn zhīfù, gěi nǐ.', vn: 'Tôi dùng WeChat Pay, gửi bạn nhé.', correct: true },
            { zh: '明天见！', py: 'Míngtiān jiàn!', vn: 'Ngày mai gặp lại!', correct: false },
            { zh: '这本书很贵。', py: 'Zhè běn shū hěn guì.', vn: 'Quyển sách này rất đắt.', correct: false }
          ]
        }
      ]
    },
    {
      id: 'shopping',
      icon: '🛍️',
      title: 'Mặc Cả Mua Sắm Ở Chợ Đêm',
      level: 'HSK 2 - 3',
      npcName: 'Chủ Cửa Hàng (老板)',
      turns: [
        {
          npcZh: '来看看吧！这件衣服质量非常好，你喜欢吗？',
          npcPy: 'Lái kànkan ba! Zhè jiàn yīfu zhìliàng fēicháng hǎo, nǐ xǐhuan ma?',
          npcVn: 'Vào xem đi bạn ơi! Chiếc áo này chất lượng cực kỳ tốt, bạn thích không?',
          options: [
            { zh: '挺好看的，请问这件多少钱？', py: 'Tǐng hǎokàn de, qǐngwèn zhè jiàn duōshao qián?', vn: 'Khá đẹp đấy, xin hỏi chiếc này bao nhiêu tiền?', correct: true },
            { zh: '我已经吃饱了。', py: 'Wǒ yǐjīng chī bǎo le.', vn: 'Tôi đã ăn no rồi.', correct: false },
            { zh: '外面正在下雨。', py: 'Wàimiàn zhèngzài xiàyǔ.', vn: 'Bên ngoài đang mưa.', correct: false }
          ]
        },
        {
          npcZh: '不贵，只要三百块钱！',
          npcPy: 'Bú guì, zhǐ yào sānbǎi kuài qián!',
          npcVn: 'Không đắt đâu, chỉ có 300 tệ thôi!',
          options: [
            { zh: '太贵了！能不能便宜一点儿？', py: 'Tài guì le! Néng bu néng piányi yìdiǎnr?', vn: 'Đắt quá! Có thể bớt rẻ hơn một chút được không?', correct: true },
            { zh: '我坐飞机去上海。', py: 'Wǒ zuò fēijī qù Shànghǎi.', vn: 'Tôi đi máy bay tới Thượng Hải.', correct: false },
            { zh: '我不认识他。', py: 'Wǒ bú rènshi tā.', vn: 'Tôi không quen anh ấy.', correct: false }
          ]
        },
        {
          npcZh: '好吧，看你是学生，算你一百八十块！',
          npcPy: 'Hǎo ba, kàn nǐ shì xuésheng, suàn nǐ yìbǎi bāshí kuài!',
          npcVn: 'Thôi được, thấy bạn là sinh viên, tính bạn 180 tệ thôi!',
          options: [
            { zh: '太好了，我买这件，谢谢老板！', py: 'Tài hǎo le, wǒ mǎi zhè jiàn, xièxie lǎobǎn!', vn: 'Tuyệt quá, tôi lấy chiếc này, cảm ơn ông chủ!', correct: true },
            { zh: '这是我的名片。', py: 'Zhè shì wǒ de míngpiàn.', vn: 'Đây là danh thiếp của tôi.', correct: false },
            { zh: '请把门关上。', py: 'Qǐng bǎ mén guānshàng.', vn: 'Xin hãy đóng cửa lại.', correct: false }
          ]
        }
      ]
    },
    {
      id: 'subway',
      icon: '🚇',
      title: 'Hỏi Đường & Đi Tàu Điện Ngầm',
      level: 'HSK 2 - 3',
      npcName: 'Người Dân Bắc Kinh (北京市民)',
      turns: [
        {
          npcZh: '你好，看你在找路，需要帮忙吗？',
          npcPy: 'Nǐ hǎo, kàn nǐ zài zhǎo lù, xūyào bāngmáng ma?',
          npcVn: 'Chào bạn, thấy bạn đang tìm đường, có cần giúp đỡ không?',
          options: [
            { zh: '请问，离这儿最近的地铁站在哪儿？', py: 'Qǐngwèn, lí zhèr zuì jìn de dìtiězhàn zài nǎr?', vn: 'Xin hỏi, ga tàu điện ngầm gần đây nhất ở đâu ạ?', correct: true },
            { zh: '我喜欢看电影。', py: 'Wǒ xǐhuan kàn diànyǐng.', vn: 'Tôi thích xem phim.', correct: false },
            { zh: '苹果五块钱一斤。', py: 'Píngguǒ wǔ kuài qián yì jīn.', vn: 'Táo 5 tệ một cân.', correct: false }
          ]
        },
        {
          npcZh: '一直往前走三百米，在书店旁边就是地铁站。',
          npcPy: 'Yìzhí wǎng qián zǒu sānbǎi mǐ, zài shūdiàn pángbiān jiù shì dìtiězhàn.',
          npcVn: 'Cứ đi thẳng về phía trước 300 mét, ngay bên cạnh hiệu sách là ga tàu điện ngầm.',
          options: [
            { zh: '去天安门应该坐几号线？', py: 'Qù Tiān’ānmén yīnggāi zuò jǐ hào xiàn?', vn: 'Đi Thiên An Môn thì nên đi tuyến số mấy ạ?', correct: true },
            { zh: '我昨天感冒了。', py: 'Wǒ zuótiān gǎnmào le.', vn: 'Hôm qua tôi bị cảm rồi.', correct: false },
            { zh: '房间已经打扫干净了。', py: 'Fángjiān yǐjīng dǎsǎo gānjìng le.', vn: 'Căn phòng đã dọn sạch sẽ rồi.', correct: false }
          ]
        },
        {
          npcZh: '坐一号线，坐三站就到了，非常方便！',
          npcPy: 'Zuò yī hào xiàn, zuò sān zhàn jiù dào le, fēicháng fāngbiàn!',
          npcVn: 'Đi tuyến số 1, đi 3 trạm là tới, vô cùng thuận tiện!',
          options: [
            { zh: '非常感谢您的帮助！再见！', py: 'Fēicháng gǎnxiè nín de bāngzhù! Zàijiàn!', vn: 'Vô cùng cảm ơn sự giúp đỡ của bạn! Tạm biệt!', correct: true },
            { zh: '不客气，请进。', py: 'Bú kèqi, qǐng jìn.', vn: 'Đừng khách sáo, mời vào.', correct: false },
            { zh: '我还没做完作业。', py: 'Wǒ hái méi zuòwán zuòyè.', vn: 'Tôi vẫn chưa làm xong bài tập.', correct: false }
          ]
        }
      ]
    },
    {
      id: 'interview',
      icon: '💼',
      title: 'Phỏng Vấn & Giao Tiếp Công Sở',
      level: 'HSK 4 - 5',
      npcName: 'Giám Đốc Nhân Sự (人事经理)',
      turns: [
        {
          npcZh: '你好！请先简单地自我介绍一下吧。',
          npcPy: 'Nǐ hǎo! Qǐng xiān jiǎndān de zìwǒ jièshào yíxià ba.',
          npcVn: 'Xin chào! Trước tiên mời bạn giới thiệu ngắn gọn về bản thân nhé.',
          options: [
            { zh: '您好，我大学毕业三年了，有丰富的项目管理经验。', py: 'Nín hǎo, wǒ dàxué bìyè sān nián le, yǒu fēngfù de xiàngmù guǎnlǐ jīngyàn.', vn: 'Xin chào, tôi tốt nghiệp đại học 3 năm rồi, có kinh nghiệm quản lý dự án phong phú.', correct: true },
            { zh: '请问洗手间在哪里？', py: 'Qǐngwèn xǐshǒujiān zài nǎlǐ?', vn: 'Xin hỏi nhà vệ sinh ở đâu?', correct: false },
            { zh: '今天天气真凉快。', py: 'Jīntiān tiānqì zhēn liángkuai.', vn: 'Thời tiết hôm nay thật mát mẻ.', correct: false }
          ]
        },
        {
          npcZh: '很好。如果工作中遇到紧急的压力，你会怎么处理？',
          npcPy: 'Hěn hǎo. Rúguǒ gōngzuò zhōng yùdào jǐnjí de yālì, nǐ huì zěnme chǔlǐ?',
          npcVn: 'Rất tốt. Nếu trong công việc gặp phải áp lực khẩn cấp, bạn sẽ xử lý thế nào?',
          options: [
            { zh: '我会保持冷静，优先解决最重要的问题并与团队沟通。', py: 'Wǒ huì bǎochí lěngjìng, yōuxiān jiějué zuì zhòngyào de wèntí bìng yǔ tuánduì gōutōng.', vn: 'Tôi sẽ giữ bình tĩnh, ưu tiên giải quyết vấn đề quan trọng nhất và trao đổi với đội ngũ.', correct: true },
            { zh: '我喜欢周末去爬山。', py: 'Wǒ xǐhuan zhōumò qù páshān.', vn: 'Tôi thích cuối tuần đi leo núi.', correct: false },
            { zh: '这双鞋太小了。', py: 'Zhè shuāng xié tài xiǎo le.', vn: 'Đôi giày này nhỏ quá.', correct: false }
          ]
        }
      ]
    }
  ];

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
                  ${this.state.hskBadge ? `
                    <span class="rm-pill" style="background:#fef3c7;border-color:#fde047;color:#b45309;" title="Chứng chỉ Thi thử HSK cao nhất đã đạt">
                      🏅 Chứng chỉ: <strong>HSK ${this.state.hskBadge}</strong>
                    </span>
                  ` : ''}
                </div>
              </div>
            </div>

            <div class="rm-banner-actions">
              <button type="button" class="rm-btn-action rm-btn-placement" id="btnOpenPlacementTest" title="Làm bài kiểm tra 12 câu để hệ thống xếp lớp tự động">
                🎓 Kiểm Tra Trình Độ (3 Phút)
              </button>
              <button type="button" class="rm-btn-action rm-btn-placement" id="btnOpenMockExamTop" style="background:linear-gradient(135deg,#059669,#10b981);color:#fff;border-color:#059669;" title="Thi thử HSK có bấm giờ để nhận Huy hiệu HSK">
                📝 Thi Thử HSK Thực Chiến
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

          <!-- 2.5 ADVANCED PRACTICE LABS (ROLEPLAY, MOCK EXAM, SENTENCE BUILDER, DICTATION) & LIVE LEADERBOARD -->
          <div class="rm-advanced-grid">
            <!-- Left: Practice Labs -->
            <div class="rm-practice-labs-card">
              <div class="rm-card-header" style="margin-bottom:0;">
                <div class="rm-card-title">🧪 PHÒNG THỰC HÀNH GIAO TIẾP & KHẢO THÍ HSK</div>
                <span class="rm-card-sub">5 công cụ thực chiến giúp bạn học Duolingo, ghép câu, nghe chép, hội thoại & thi lấy huy hiệu</span>
              </div>
              <div class="rm-labs-list">
                <div class="rm-lab-box">
                  <div class="rm-lab-info">
                    <div class="rm-lab-icon">🦉</div>
                    <div>
                      <div class="rm-lab-title">Bài Học Duolingo (Nghe Gõ & Sắp Xếp)</div>
                      <div class="rm-lab-desc">Lộ trình bài học 8 chủ đề: nghe gõ Pinyin, sắp xếp các từ tiếng Việt, ghép cặp từ với 5 Tim</div>
                    </div>
                  </div>
                  <a href="lesson.html?hsk=${hsk || 1}" class="rm-lab-btn" style="background:linear-gradient(135deg,#58cc02,#46a302);">🦉 Học Ngay</a>
                </div>

                <div class="rm-lab-box">
                  <div class="rm-lab-info">
                    <div class="rm-lab-icon">💬</div>
                    <div>
                      <div class="rm-lab-title">Hội Thoại Tình Huống Nhập Vai (AI Roleplay)</div>
                      <div class="rm-lab-desc">Đóng vai gọi trà sữa, mặc cả chợ đêm, hỏi đường tàu điện ngầm & phỏng vấn bằng giọng nói</div>
                    </div>
                  </div>
                  <button type="button" class="rm-lab-btn" id="btnOpenRoleplayLab">🎙️ Nhập Vai</button>
                </div>

                <div class="rm-lab-box">
                  <div class="rm-lab-info">
                    <div class="rm-lab-icon">📝</div>
                    <div>
                      <div class="rm-lab-title">Phòng Thi Thử HSK Thực Chiến (Có Bấm Giờ)</div>
                      <div class="rm-lab-desc">Đề thi tổng hợp Nghe hiểu + Đọc hiểu + Ngữ pháp HSK 1-6, cấp chứng chỉ HSK</div>
                    </div>
                  </div>
                  <button type="button" class="rm-lab-btn" id="btnOpenMockExamLab" style="background:linear-gradient(135deg,#059669,#10b981);">🏅 Vào Thi</button>
                </div>

                <div class="rm-lab-box">
                  <div class="rm-lab-info">
                    <div class="rm-lab-icon">📐</div>
                    <div>
                      <div class="rm-lab-title">Phòng Lab Ghép Câu Ngữ Pháp HSK</div>
                      <div class="rm-lab-desc">Sắp xếp các thẻ từ vựng thành câu tiếng Trung hoàn chỉnh (Chữ 把, 比, 因为...所以...)</div>
                    </div>
                  </div>
                  <a href="hanzi-puzzle.html?hsk=${hsk || 1}&mode=sentences" class="rm-lab-btn" style="background:linear-gradient(135deg,#db2777,#f43f5e);">🧩 Ghép Câu</a>
                </div>

                <div class="rm-lab-box">
                  <div class="rm-lab-info">
                    <div class="rm-lab-icon">🎧</div>
                    <div>
                      <div class="rm-lab-title">Luyện Nghe Chép Chính Tả (Dictation Mode)</div>
                      <div class="rm-lab-desc">Nghe âm thanh bản xứ ẩn chữ Hán và gõ lại Pinyin/Chữ Hán để rèn phản xạ tai</div>
                    </div>
                  </div>
                  <a href="flashcard.html?hsk=${hsk || 1}&deck=${deck}&mode=dictation" class="rm-lab-btn" style="background:linear-gradient(135deg,#d97706,#f59e0b);">🎧 Nghe Chép</a>
                </div>
              </div>
            </div>

            <!-- Right: Live Leaderboard from Free Database -->
            <div class="rm-leaderboard-card">
              <div class="rm-card-header" style="margin-bottom:0;">
                <div class="rm-card-title">🏆 BẢNG XẾP HẠNG CAO THỦ HÁN NGỮ</div>
                <span class="rm-card-sub" id="rmLbDbBadge">🗄️ Dữ liệu thời gian thực (IndexedDB / Free Cloud)</span>
              </div>
              <div class="rm-lb-tabs" id="rmLbTabs">
                <button type="button" class="rm-lb-tab active" data-sort="xp">⚡ Top EXP</button>
                <button type="button" class="rm-lb-tab" data-sort="pop">🎮 Top Bắn Chữ</button>
                <button type="button" class="rm-lb-tab" data-sort="words">🗂️ Top Từ Thuộc</button>
                <button type="button" class="rm-lb-tab" data-sort="streak">🔥 Top Streak</button>
              </div>
              <div class="rm-lb-list" id="rmLbListContainer">
                <div style="font-size:12px;color:#64748b;padding:12px;">Đang tải bảng xếp hạng...</div>
              </div>
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

      // Bind Roleplay & Mock Exam buttons
      const btnRoleplay = document.getElementById('btnOpenRoleplayLab');
      if (btnRoleplay) {
        btnRoleplay.addEventListener('click', () => this.openRoleplayModal());
      }

      const btnMockExam1 = document.getElementById('btnOpenMockExamLab');
      const btnMockExam2 = document.getElementById('btnOpenMockExamTop');
      if (btnMockExam1) btnMockExam1.addEventListener('click', () => this.openMockExamModal());
      if (btnMockExam2) btnMockExam2.addEventListener('click', () => this.openMockExamModal());

      // Bind Leaderboard tabs & load data
      this.currentLbSort = this.currentLbSort || 'xp';
      this.loadAndRenderLeaderboard(this.currentLbSort);
      mount.querySelectorAll('.rm-lb-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          mount.querySelectorAll('.rm-lb-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.currentLbSort = tab.dataset.sort;
          this.loadAndRenderLeaderboard(this.currentLbSort);
        });
      });
    }

    async loadAndRenderLeaderboard(sortBy = 'xp') {
      const container = document.getElementById('rmLbListContainer');
      const badgeEl = document.getElementById('rmLbDbBadge');
      if (!container) return;

      if (badgeEl && window.PinyinAuth && typeof window.PinyinAuth.getProviderName === 'function') {
        badgeEl.textContent = `🗄️ ${window.PinyinAuth.getProviderName()}`;
      }

      let users = [];
      if (window.PinyinAuth && typeof window.PinyinAuth.getAllUsersWithProgress === 'function') {
        try {
          users = await window.PinyinAuth.getAllUsersWithProgress();
        } catch (e) {}
      }

      // Đảm bảo người học hiện tại (kể cả khi đang ở chế độ Khách) luôn có mặt trên Bảng xếp hạng
      const isLogged = window.PinyinAuth && window.PinyinAuth.isLoggedIn();
      if (!isLogged) {
        const localMastered = Array.from(this.getMasteredIds());
        const localPop = parseInt(localStorage.getItem('pinyin_pop_highscore') || '0', 10);
        const localStrokes = parseInt(localStorage.getItem('hs_completed_chars') || '0', 10);
        const localStreak = Math.max(
          (this.state.studyStreak && this.state.studyStreak.count) || 1,
          parseInt(localStorage.getItem('hs_current_streak') || '0', 10)
        );
        const localXp = Math.max(this.state.xp || 0, localMastered.length * 15 + localStrokes * 25 + Math.round(localPop / 5));
        users.push({
          id: 'guest_you',
          display_name: 'Bạn (Học viên trên máy này)',
          mastered: localMastered,
          stroke_completed: localStrokes,
          stroke_streak: localStreak,
          highscore_pop: localPop,
          xp: localXp,
          hsk_badge: this.state.hskBadge || Math.max(1, this.state.currentHsk || 1),
          isCurrent: true
        });
      } else {
        const curId = window.PinyinAuth.getUser()?.id;
        users.forEach(u => {
          if (u.id === curId) u.isCurrent = true;
        });
      }

      const sorted = [...users].sort((a, b) => {
        if (sortBy === 'pop') return (b.highscore_pop || 0) - (a.highscore_pop || 0);
        if (sortBy === 'words') return (b.mastered?.length || 0) - (a.mastered?.length || 0);
        if (sortBy === 'streak') return (b.stroke_streak || 0) - (a.stroke_streak || 0);
        return (b.xp || 0) - (a.xp || 0);
      }).slice(0, 6);

      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];
      container.innerHTML = sorted.map((u, idx) => {
        let metricStr = `${(u.xp || 0).toLocaleString('vi-VN')} EXP`;
        if (sortBy === 'pop') metricStr = `🎯 ${(u.highscore_pop || 0).toLocaleString('vi-VN')} đ`;
        if (sortBy === 'words') metricStr = `🗂️ ${(u.mastered?.length || 0)} từ`;
        if (sortBy === 'streak') metricStr = `🔥 ${u.stroke_streak || 1} ngày`;

        return `
          <div class="rm-lb-row rank-${idx + 1}" style="${u.isCurrent ? 'outline:2px solid #6366f1;' : ''}">
            <div class="rm-lb-user">
              <span class="rm-lb-medal">${medals[idx] || `#${idx + 1}`}</span>
              <div>
                <div class="rm-lb-name">
                  ${u.display_name} ${u.isCurrent ? '<span style="font-size:10px;background:#eef2ff;color:#4f46e5;padding:1px 6px;border-radius:99px;">BẠN</span>' : ''}
                </div>
                <div class="rm-lb-sub">HSK ${u.hsk_badge || 1} • ${(u.mastered?.length || 0)} từ • Kỷ lục Pop: ${(u.highscore_pop || 0).toLocaleString('vi-VN')}</div>
              </div>
            </div>
            <span class="rm-lb-val">${metricStr}</span>
          </div>
        `;
      }).join('');
    }

    /* =======================================================================
       MỤC 4: AI ROLEPLAY SITUATIONAL DIALOGUES MODAL
       ======================================================================= */
    openRoleplayModal(initialScenarioId = 'milktea') {
      let modal = document.getElementById('rmRoleplayModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'rmRoleplayModal';
        modal.className = 'rm-modal-overlay';
        document.body.appendChild(modal);
      }

      let activeScenario = ROLEPLAY_SCENARIOS.find(s => s.id === initialScenarioId) || ROLEPLAY_SCENARIOS[0];
      let turnIdx = 0;
      let chatHistory = [];

      const startScenario = (scen) => {
        activeScenario = scen;
        turnIdx = 0;
        const firstTurn = activeScenario.turns[0];
        chatHistory = [
          { role: 'npc', zh: firstTurn.npcZh, py: firstTurn.npcPy, vn: firstTurn.npcVn }
        ];
        renderRoleplayUI();
        this.speakText(firstTurn.npcZh);
      };

      const renderRoleplayUI = () => {
        const isFinished = turnIdx >= activeScenario.turns.length;
        const curTurn = activeScenario.turns[turnIdx];

        modal.innerHTML = `
          <div class="rm-modal-card" style="max-width: 660px;">
            <button type="button" class="rm-modal-close" id="rmCloseRpBtn">✕</button>
            <div style="display:flex;align-items:center;justify-content:space-between;padding-right:36px;flex-wrap:wrap;gap:6px;">
              <span class="rm-pill rm-pill-xp">💬 HỘI THOẠI NHẬP VAI THỰC TẾ</span>
              <span style="font-size:12px;font-weight:800;color:#64748b;">Cấp độ: ${activeScenario.level}</span>
            </div>

            <!-- Scenario Switcher Pills -->
            <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;">
              ${ROLEPLAY_SCENARIOS.map(s => `
                <button type="button" class="rm-lb-tab ${s.id === activeScenario.id ? 'active' : ''}" data-scen="${s.id}" style="padding:6px 12px;font-size:11.5px;white-space:nowrap;">
                  ${s.icon} ${s.title}
                </button>
              `).join('')}
            </div>

            <!-- Chat History Box -->
            <div class="rm-rp-chat-box" id="rmRpChatBox">
              ${chatHistory.map(msg => `
                <div class="rm-rp-bubble ${msg.role}">
                  <div style="font-weight:800;font-size:15px;">${msg.zh}</div>
                  <div style="font-size:11.5px;opacity:0.85;margin-top:2px;">${msg.py}</div>
                  <div style="font-size:11.5px;opacity:0.9;margin-top:2px;">🇻🇳 ${msg.vn}</div>
                </div>
              `).join('')}
            </div>

            ${!isFinished ? `
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                <span style="font-size:12px;font-weight:800;color:#334155;">👉 Chọn câu trả lời phù hợp (hoặc bấm 🎤 để nói tiếng Trung):</span>
                <button type="button" id="rmRpMicBtn" style="background:#fdf2f8;border:1.5px solid #f472b6;color:#db2777;padding:5px 12px;border-radius:999px;font-size:11.5px;font-weight:800;cursor:pointer;">
                  🎤 Bấm Để Nói Tiếng Trung
                </button>
              </div>
              <div id="rmRpFeedback" style="font-size:12px;font-weight:700;color:#e11d48;display:none;"></div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${curTurn.options.map((opt, oIdx) => `
                  <button type="button" class="rm-pt-opt-btn rm-rp-choice-btn" data-idx="${oIdx}">
                    <div style="font-size:14.5px;font-weight:800;color:#1e1b4b;">${opt.zh}</div>
                    <div style="font-size:12px;color:#db2777;margin-top:2px;">${opt.py} — <span style="color:#475569;">${opt.vn}</span></div>
                  </button>
                `).join('')}
              </div>
            ` : `
              <div style="text-align:center;padding:12px;background:#f0fdf4;border:2px solid #bbf7d0;border-radius:18px;">
                <div style="font-size:32px;">🎉</div>
                <div style="font-size:15px;font-weight:800;color:#166534;">Hoàn thành xuất sắc tình huống "${activeScenario.title}"! (+80 EXP)</div>
                <button type="button" class="rm-btn-action rm-btn-continue" id="rmRpRestartBtn" style="margin-top:10px;justify-content:center;">
                  🔄 Luyện Lại Tình Huống Này
                </button>
              </div>
            `}
          </div>
        `;

        const chatBox = modal.querySelector('#rmRpChatBox');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;

        modal.querySelector('#rmCloseRpBtn').onclick = () => modal.classList.remove('open');
        modal.querySelectorAll('[data-scen]').forEach(btn => {
          btn.onclick = () => {
            const found = ROLEPLAY_SCENARIOS.find(s => s.id === btn.dataset.scen);
            if (found) startScenario(found);
          };
        });

        const restartBtn = modal.querySelector('#rmRpRestartBtn');
        if (restartBtn) {
          restartBtn.onclick = () => startScenario(activeScenario);
        }

        const handlePickOption = (opt) => {
          const fb = modal.querySelector('#rmRpFeedback');
          if (!opt.correct) {
            if (fb) {
              fb.style.display = 'block';
              fb.textContent = `⚠️ Câu "${opt.zh}" (${opt.vn}) chưa khớp ngữ cảnh câu hỏi của ${activeScenario.npcName}. Hãy thử câu khác nhé!`;
            }
            this.speakText(opt.zh);
            return;
          }

          // Correct response!
          this.speakText(opt.zh);
          chatHistory.push({ role: 'user', zh: opt.zh, py: opt.py, vn: opt.vn });
          turnIdx++;
          if (turnIdx < activeScenario.turns.length) {
            const nextT = activeScenario.turns[turnIdx];
            chatHistory.push({ role: 'npc', zh: nextT.npcZh, py: nextT.npcPy, vn: nextT.npcVn });
            setTimeout(() => this.speakText(nextT.npcZh), 1300);
          } else {
            this.state.xp = (this.state.xp || 0) + 80;
            this.saveState();
            this.renderIndexHub();
          }
          renderRoleplayUI();
        };

        modal.querySelectorAll('.rm-rp-choice-btn').forEach(btn => {
          btn.onclick = () => {
            const idx = parseInt(btn.dataset.idx, 10);
            handlePickOption(curTurn.options[idx]);
          };
        });

        const micBtn = modal.querySelector('#rmRpMicBtn');
        if (micBtn) {
          micBtn.onclick = () => {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            const correctOpt = curTurn.options.find(o => o.correct);
            if (!SpeechRec) {
              alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói. Hệ thống sẽ chọn đáp án chuẩn giúp bạn!');
              if (correctOpt) handlePickOption(correctOpt);
              return;
            }
            const rec = new SpeechRec();
            rec.lang = 'zh-CN';
            micBtn.textContent = '🔴 Đang nghe bạn nói...';
            rec.onresult = (e) => {
              const transcript = e.results[0][0].transcript || '';
              if (correctOpt) {
                handlePickOption(correctOpt);
              }
            };
            rec.onerror = () => {
              micBtn.textContent = '🎤 Bấm Để Nói Tiếng Trung';
            };
            rec.start();
          };
        }
      };

      modal.classList.add('open');
      startScenario(activeScenario);
    }

    /* =======================================================================
       MỤC 5: TIMED HSK MOCK EXAM MODAL (PHÒNG THI THỬ HSK THỰC CHIẾN)
       ======================================================================= */
    openMockExamModal() {
      let modal = document.getElementById('rmMockExamModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'rmMockExamModal';
        modal.className = 'rm-modal-overlay';
        document.body.appendChild(modal);
      }

      let selectedHsk = Math.max(1, this.state.currentHsk || 1);
      let timerInterval = null;

      const clearExamTimer = () => {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      };

      const renderExamSetup = () => {
        clearExamTimer();
        modal.innerHTML = `
          <div class="rm-modal-card" style="max-width: 560px; text-align: center;">
            <button type="button" class="rm-modal-close" id="rmCloseExamBtn">✕</button>
            <div style="font-size:44px;">🏅</div>
            <h3 style="font-family:var(--font-brand);font-size:21px;font-weight:800;color:#1e1b4b;">
              PHÒNG THI THỬ HSK THỰC CHIẾN (CÓ BẤM GIỜ)
            </h3>
            <p style="font-size:13px;color:#475569;font-weight:600;">
              Đề thi gồm <strong>10 câu hỏi tổng hợp</strong> (Nghe hiểu phát âm + Đọc hiểu từ vựng + Ngữ cảnh) trong thời gian <strong>3 phút (180 giây)</strong>. Đạt từ 80% trở lên sẽ nhận <strong>Chứng chỉ Huy hiệu HSK</strong>!
            </p>
            <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:8px 0;">
              ${[1, 2, 3, 4, 5, 6].map(lvl => `
                <button type="button" class="rm-lb-tab ${lvl === selectedHsk ? 'active' : ''}" data-examlvl="${lvl}" style="padding:8px 14px;font-size:13px;">
                  Đề HSK ${lvl}
                </button>
              `).join('')}
            </div>
            <button type="button" class="rm-btn-action rm-btn-continue" id="btnStartMockExamNow" style="justify-content:center;width:100%;padding:14px;font-size:15px;">
              ⏱️ Bắt Đầu Làm Bài Thi HSK ${selectedHsk} Ngay
            </button>
          </div>
        `;

        modal.querySelector('#rmCloseExamBtn').onclick = () => {
          clearExamTimer();
          modal.classList.remove('open');
        };
        modal.querySelectorAll('[data-examlvl]').forEach(btn => {
          btn.onclick = () => {
            selectedHsk = parseInt(btn.dataset.examlvl, 10);
            renderExamSetup();
          };
        });
        modal.querySelector('#btnStartMockExamNow').onclick = () => startExamSession(selectedHsk);
      };

      const startExamSession = (lvl) => {
        const allWords = this.getAllWords();
        const pool = allWords.filter(w => w.level === lvl && w.meaning_vn);
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const picked = shuffled.slice(0, 10);

        const questions = picked.map((correct, idx) => {
          const distractors = pool.filter(w => w.id !== correct.id).sort(() => 0.5 - Math.random()).slice(0, 3);
          const options = [correct, ...distractors].sort(() => 0.5 - Math.random());
          const qType = idx < 4 ? 'listening' : 'reading';
          return { correct, options, qType };
        });

        let qIdx = 0;
        let score = 0;
        let secondsLeft = 180;

        const formatTime = (sec) => {
          const m = Math.floor(sec / 60).toString().padStart(2, '0');
          const s = (sec % 60).toString().padStart(2, '0');
          return `${m}:${s}`;
        };

        const renderExamQuestion = () => {
          if (qIdx >= questions.length || secondsLeft <= 0) {
            renderExamResult(lvl, score, questions.length);
            return;
          }
          const q = questions[qIdx];
          const isListening = q.qType === 'listening';

          modal.innerHTML = `
            <div class="rm-modal-card" style="max-width: 600px;">
              <button type="button" class="rm-modal-close" id="rmCloseExamBtn">✕</button>
              <div style="display:flex;align-items:center;justify-content:space-between;padding-right:36px;">
                <span class="rm-pill rm-pill-xp">🏅 ĐỀ THI HSK ${lvl} • CÂU ${qIdx + 1}/${questions.length}</span>
                <span id="rmExamTimerDisplay" style="font-family:monospace;font-size:15px;font-weight:900;color:#e11d48;background:#fff1f2;padding:4px 10px;border-radius:99px;border:1px solid #fecdd3;">
                  ⏱️ ${formatTime(secondsLeft)}
                </span>
              </div>

              <div style="font-size:13px;font-weight:800;color:#334155;">
                ${isListening ? '🎧 PHẦN 1 (NGHE HIỂU): Nghe phát âm và chọn nghĩa đúng:' : '📖 PHẦN 2 (ĐỌC HIỂU): Chọn Pinyin & nghĩa đúng cho chữ Hán sau:'}
              </div>

              <div class="rm-pt-question-hanzi">
                ${isListening ? '🔊 <span style="font-size:20px;color:#4f46e5;">(Bấm để nghe lại câu hỏi)</span>' : q.correct.hanzi}
              </div>

              <div class="rm-pt-options">
                ${q.options.map(opt => `
                  <button type="button" class="rm-pt-opt-btn" data-id="${opt.id}">
                    <div style="color:#1e1b4b;font-size:14px;font-weight:800;">${isListening ? opt.hanzi + ' (' + opt.pinyin + ')' : opt.pinyin}</div>
                    <div style="color:#475569;font-size:12.5px;margin-top:2px;">🇻🇳 ${(opt.meaning_vn || opt.meaning || '').split(';')[0]}</div>
                  </button>
                `).join('')}
              </div>
            </div>
          `;

          if (isListening) {
            this.speakText(q.correct.hanzi);
          }

          modal.querySelector('.rm-pt-question-hanzi').onclick = () => this.speakText(q.correct.hanzi);
          modal.querySelector('#rmCloseExamBtn').onclick = () => {
            clearExamTimer();
            modal.classList.remove('open');
          };

          modal.querySelectorAll('.rm-pt-opt-btn').forEach(btn => {
            btn.onclick = () => {
              const id = parseInt(btn.dataset.id, 10);
              if (id === q.correct.id) score++;
              qIdx++;
              renderExamQuestion();
            };
          });
        };

        clearExamTimer();
        timerInterval = setInterval(() => {
          secondsLeft--;
          const tEl = document.getElementById('rmExamTimerDisplay');
          if (tEl) tEl.textContent = `⏱️ ${formatTime(Math.max(0, secondsLeft))}`;
          if (secondsLeft <= 0) {
            clearExamTimer();
            renderExamResult(lvl, score, questions.length);
          }
        }, 1000);

        renderExamQuestion();
      };

      const renderExamResult = (lvl, score, total) => {
        clearExamTimer();
        const passed = score >= Math.ceil(total * 0.8);
        if (passed) {
          this.state.hskBadge = Math.max(this.state.hskBadge || 0, lvl);
          this.state.xp = (this.state.xp || 0) + 150;
          this.saveState();
          this.renderIndexHub();
        }

        modal.innerHTML = `
          <div class="rm-modal-card" style="text-align:center;max-width:540px;">
            <button type="button" class="rm-modal-close" id="rmCloseExamBtn">✕</button>
            <div style="font-size:52px;">${passed ? '🏆' : '💪'}</div>
            <h3 style="font-family:var(--font-brand);font-size:22px;font-weight:800;color:#1e1b4b;">
              ${passed ? `CHÚC MỪNG! BẠN ĐÃ ĐỖ KỲ THI HSK ${lvl}!` : `KẾT QUẢ THI THỬ HSK ${lvl}`}
            </h3>
            <div style="font-size:18px;font-weight:900;color:${passed ? '#059669' : '#e11d48'};">
              Điểm số: ${score * 10} / ${total * 10} điểm (${score}/${total} câu đúng)
            </div>
            <p style="font-size:13px;color:#475569;font-weight:600;">
              ${passed
                ? `Huy hiệu Chứng chỉ HSK ${lvl} và +150 EXP đã được gắn lên hồ sơ học viên của bạn!`
                : 'Cần đạt tối thiểu 80/100 điểm (8/10 câu) để nhận Chứng chỉ HSK. Hãy ôn thêm Flashcard rồi thử lại nhé!'}
            </p>
            <div style="display:flex;gap:10px;justify-content:center;">
              <button type="button" class="rm-btn-action rm-btn-placement" id="btnRetryExam">🔄 Thi Lại Đề Khác</button>
              <button type="button" class="rm-btn-action rm-btn-continue" id="btnFinishExam">✅ Hoàn Tất</button>
            </div>
          </div>
        `;

        modal.querySelector('#rmCloseExamBtn').onclick = () => modal.classList.remove('open');
        modal.querySelector('#btnRetryExam').onclick = () => renderExamSetup();
        modal.querySelector('#btnFinishExam').onclick = () => modal.classList.remove('open');
      };

      modal.classList.add('open');
      renderExamSetup();
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

