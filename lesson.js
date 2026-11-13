/**
 * PINYIN POP! 🦉 DUOLINGO-STYLE LESSON RUNNER & HUB (EXTENDED EDITION)
 * 28 Thematic Everyday Units + 201 HSK Decks Covering All 5,000 Words
 */

(function() {
  'use strict';

  /* ==========================================================================
     1. PURE WEB AUDIO SYNTHESIZER FOR TACTILE DUOLINGO SFX
     ========================================================================== */
  class DuoAudioEngine {
    constructor() {
      this.ctx = null;
      this.voice = null;
      this.soundEnabled = true;
      this.initVoices();
    }

    ensureContext() {
      if (!this.soundEnabled) return;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    initVoices() {
      if ('speechSynthesis' in window) {
        const setVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          this.voice = voices.find(v => v.lang && (v.lang.startsWith('zh') || v.lang === 'cmn-Hans-CN')) || null;
        };
        setVoice();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = setVoice;
        }
      }
    }

    speak(text, slow = false) {
      if (!text || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'zh-CN';
        utter.rate = slow ? 0.58 : 0.95;
        utter.pitch = 1.0;
        if (this.voice) utter.voice = this.voice;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn('Speech error:', e);
      }
    }

    playTap() {
      if (!this.soundEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    playCorrect() {
      if (!this.soundEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.07 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.07);
        osc.stop(this.ctx.currentTime + i * 0.07 + 0.3);
      });
    }

    playIncorrect() {
      if (!this.soundEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      const notes = [349.23, 293.66]; // F4, D4
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.12 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.12);
        osc.stop(this.ctx.currentTime + i * 0.12 + 0.24);
      });
    }

    playMatch() {
      if (!this.soundEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    }

    playFanfare() {
      if (!this.soundEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      const melody = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.12 },
        { f: 1046.5, d: 0.35 }
      ];
      let t = this.ctx.currentTime;
      melody.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + item.d + 0.05);
        t += item.d;
      });
    }
  }

  /* ==========================================================================
     2. 28 THEMATIC UNITS (CURATED SENTENCES & DUOLINGO EXERCISES)
     ========================================================================== */
  const THEMATIC_UNITS = [
    // --- HSK 1 (CĂN BẢN DUOLINGO: TỪNG TỪ ĐƠN LẺ DỄ ĐẾN CÂU GHÉP) ---
    {
      id: 'unit_1',
      title: 'Chào Hỏi, Giới Thiệu & Làm Quen',
      level: 'HSK 1',
      hsk: 1,
      icon: '🌱',
      desc: 'Học từ những chữ Hán đơn lẻ cơ bản nhất: 你, 好, 你好, 我, 谢谢.',
      skills: ['Chào hỏi', 'Đại từ', 'Làm quen', 'Cảm ơn'],
      questions: [
        {
          type: 'introduce_word',
          title: 'Làm quen với chữ Hán đầu tiên:',
          icon: '👋',
          hanzi: '你',
          pinyin: 'nǐ',
          meaning: 'Bạn, anh, chị (ngôi thứ 2)',
          hint: 'Gồm bộ Nhân đứng (亻) chỉ con người',
          options: [
            { text: 'Bạn, anh, chị', correct: true },
            { text: 'Tôi, mình', correct: false },
            { text: 'Ăn cơm', correct: false }
          ]
        },
        {
          type: 'introduce_word',
          title: 'Làm quen với chữ Hán thứ hai:',
          icon: '✨',
          hanzi: '好',
          pinyin: 'hǎo',
          meaning: 'Tốt, đẹp, khỏe, lành',
          hint: 'Gồm chữ Nữ (女) và Tử (子) - người phụ nữ có con là điều tốt lành',
          options: [
            { text: 'Tốt, đẹp, khỏe', correct: true },
            { text: 'Tạm biệt', correct: false },
            { text: 'Uống nước', correct: false }
          ]
        },
        {
          type: 'listen_select_word',
          title: 'Nghe âm thanh và chọn chữ Hán đúng:',
          targetWord: '好',
          hanzi: '好',
          options: [
            { hanzi: '好', pinyin: 'hǎo', correct: true },
            { hanzi: '你', pinyin: 'nǐ', correct: false }
          ]
        },
        {
          type: 'introduce_word',
          title: 'Ghép 2 chữ đơn thành câu chào:',
          icon: '🤝',
          hanzi: '你好',
          pinyin: 'nǐ hǎo',
          meaning: 'Xin chào! (Bạn + Tốt)',
          hint: 'Lời chào phổ biến và thân thiện nhất tiếng Trung',
          options: [
            { text: 'Xin chào!', correct: true },
            { text: 'Cảm ơn!', correct: false },
            { text: 'Hẹn gặp lại!', correct: false }
          ]
        },
        {
          type: 'arrange_vn',
          title: 'Dịch lời chào sau sang tiếng Việt:',
          hanzi: '你好',
          pinyin: 'nǐ hǎo',
          meaning: 'Xin chào',
          correctChips: ['Xin', 'chào'],
          distractors: ['Tạm biệt', 'Không']
        },
        {
          type: 'introduce_word',
          title: 'Làm quen với đại từ xưng hô bản thân:',
          icon: '🙋',
          hanzi: '我',
          pinyin: 'wǒ',
          meaning: 'Tôi, mình, tao (ngôi thứ 1)',
          hint: 'Chỉ chính bản thân người nói',
          options: [
            { text: 'Tôi, mình', correct: true },
            { text: 'Anh ấy', correct: false },
            { text: 'Bạn bè', correct: false }
          ]
        },
        {
          type: 'match_pairs',
          title: 'Ghép các cặp từ bạn vừa học:',
          pairs: [
            { zh: '你', vn: 'Bạn' },
            { zh: '好', vn: 'Tốt' },
            { zh: '你好', vn: 'Xin chào' },
            { zh: '我', vn: 'Tôi' }
          ]
        },
        {
          type: 'listen_pinyin',
          title: 'Nghe phát âm và gõ Pinyin (từ đơn):',
          hanzi: '你',
          pinyin: 'nǐ',
          clean: 'ni',
          meaning: 'Bạn, anh, chị',
          hint: 'n_'
        },
        {
          type: 'introduce_word',
          title: 'Học cách nói lời cảm ơn lịch sự:',
          icon: '🙏',
          hanzi: '谢谢',
          pinyin: 'xiè xie',
          meaning: 'Cảm ơn',
          hint: 'Nói lời cảm ơn khi nhận sự giúp đỡ',
          options: [
            { text: 'Cảm ơn', correct: true },
            { text: 'Xin lỗi', correct: false },
            { text: 'Tạm biệt', correct: false }
          ]
        },
        {
          type: 'multiple_choice',
          title: 'Chọn nghĩa đúng của câu:',
          prompt: '你好！',
          subPrompt: 'Nǐ hǎo!',
          options: [
            { text: 'Xin chào!', correct: true },
            { text: 'Cảm ơn!', correct: false },
            { text: 'Tạm biệt!', correct: false }
          ]
        }
      ]
    },
    {
      id: 'unit_2',
      title: 'Số Đếm, Ngày Tháng & Giờ Giấc',
      level: 'HSK 1',
      hsk: 1,
      icon: '⏰',
      desc: 'Học từ số đếm dễ nhất: 一 (1), 二 (2), 三 (3), 天 (ngày) và 今天 (hôm nay).',
      skills: ['Số đếm 1-3', 'Ngày tháng', 'Hôm nay', 'Thời gian'],
      questions: [
        {
          type: 'introduce_word',
          title: 'Làm quen với số 1 trong tiếng Trung:',
          icon: '1️⃣',
          hanzi: '一',
          pinyin: 'yī',
          meaning: 'Số 1, một',
          hint: 'Chỉ 1 nét ngang đơn giản',
          options: [
            { text: 'Số một (1)', correct: true },
            { text: 'Số hai (2)', correct: false },
            { text: 'Số ba (3)', correct: false }
          ]
        },
        {
          type: 'introduce_word',
          title: 'Làm quen với số 2 trong tiếng Trung:',
          icon: '2️⃣',
          hanzi: '二',
          pinyin: 'èr',
          meaning: 'Số 2, hai',
          hint: 'Gồm 2 nét ngang song song',
          options: [
            { text: 'Số hai (2)', correct: true },
            { text: 'Số ba (3)', correct: false },
            { text: 'Số bốn (4)', correct: false }
          ]
        },
        {
          type: 'introduce_word',
          title: 'Làm quen với số 3 trong tiếng Trung:',
          icon: '3️⃣',
          hanzi: '三',
          pinyin: 'sān',
          meaning: 'Số 3, ba',
          hint: 'Gồm 3 nét ngang',
          options: [
            { text: 'Số ba (3)', correct: true },
            { text: 'Số một (1)', correct: false },
            { text: 'Số hai (2)', correct: false }
          ]
        },
        {
          type: 'listen_select_word',
          title: 'Nghe phát âm và chọn số đúng:',
          targetWord: '三',
          hanzi: '三',
          options: [
            { hanzi: '三', pinyin: 'sān', correct: true },
            { hanzi: '一', pinyin: 'yī', correct: false },
            { hanzi: '二', pinyin: 'èr', correct: false }
          ]
        },
        {
          type: 'introduce_word',
          title: 'Làm quen với chữ Thiên (Ngày, trời):',
          icon: '☀️',
          hanzi: '天',
          pinyin: 'tiān',
          meaning: 'Ngày, bầu trời',
          hint: 'Chữ Nhất ở trên chữ Đại',
          options: [
            { text: 'Ngày, bầu trời', correct: true },
            { text: 'Đêm, tối', correct: false },
            { text: 'Nước', correct: false }
          ]
        },
        {
          type: 'introduce_word',
          title: 'Ghép từ chỉ thời gian:',
          icon: '📅',
          hanzi: '今天',
          pinyin: 'jīn tiān',
          meaning: 'Hôm nay',
          hint: 'Kim (hiện tại) + Thiên (ngày) = Hôm nay',
          options: [
            { text: 'Hôm nay', correct: true },
            { text: 'Hôm qua', correct: false },
            { text: 'Ngày mai', correct: false }
          ]
        },
        {
          type: 'match_pairs',
          title: 'Ghép các cặp số và từ vừa học:',
          pairs: [
            { zh: '一', vn: 'Số 1' },
            { zh: '二', vn: 'Số 2' },
            { zh: '三', vn: 'Số 3' },
            { zh: '今天', vn: 'Hôm nay' }
          ]
        },
        {
          type: 'arrange_vn',
          title: 'Dịch từ sau sang tiếng Việt:',
          hanzi: '今天',
          pinyin: 'jīn tiān',
          meaning: 'Hôm nay',
          correctChips: ['Hôm', 'nay'],
          distractors: ['qua', 'mai']
        },
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm của số 3:',
          hanzi: '三',
          pinyin: 'sān',
          clean: 'san',
          meaning: 'Số 3, ba',
          hint: 's_n'
        }
      ]
    },
    {
      id: 'unit_3',
      title: 'Gia Đình, Người Thân & Xưng Hô',
      level: 'HSK 1',
      hsk: 1,
      icon: '👨‍👩‍👧',
      desc: 'Làm quen với các từ xưng hô gia đình gần gũi: 爸爸, 妈妈, 爱 (yêu), 家 (nhà).',
      skills: ['Bố mẹ', 'Yêu thương', 'Gia đình', 'Nhà cửa'],
      questions: [
        {
          type: 'introduce_word',
          title: 'Làm quen với từ xưng hô Bố:',
          icon: '👨',
          hanzi: '爸爸',
          pinyin: 'bà ba',
          meaning: 'Bố, ba, cha',
          hint: 'Từ gọi bố thân mật',
          options: [
            { text: 'Bố, cha', correct: true },
            { text: 'Mẹ, má', correct: false },
            { text: 'Anh trai', correct: false }
          ]
        },
        {
          type: 'introduce_word',
          title: 'Làm quen với từ xưng hô Mẹ:',
          icon: '👩',
          hanzi: '妈妈',
          pinyin: 'mā ma',
          meaning: 'Mẹ, má, u',
          hint: 'Từ gọi mẹ thân thương',
          options: [
            { text: 'Mẹ, má', correct: true },
            { text: 'Chị gái', correct: false },
            { text: 'Bà ngoại', correct: false }
          ]
        },
        {
          type: 'listen_select_word',
          title: 'Nghe phát âm và chọn từ đúng:',
          targetWord: '妈妈',
          hanzi: '妈妈',
          options: [
            { hanzi: '妈妈', pinyin: 'mā ma', correct: true },
            { hanzi: '爸爸', pinyin: 'bà ba', correct: false }
          ]
        },
        {
          type: 'introduce_word',
          title: 'Làm quen với động từ Yêu thương:',
          icon: '❤️',
          hanzi: '爱',
          pinyin: 'ài',
          meaning: 'Yêu, thương, yêu thích',
          hint: 'Biểu đạt tình cảm yêu thương',
          options: [
            { text: 'Yêu, thương', correct: true },
            { text: 'Ghét', correct: false },
            { text: 'Đi chơi', correct: false }
          ]
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu ngắn bày tỏ tình cảm:',
          hanzi: '我爱妈妈',
          pinyin: 'Wǒ ài māma',
          meaning: 'Tôi yêu mẹ',
          correctChips: ['Tôi', 'yêu', 'mẹ'],
          distractors: ['bố', 'ghét', 'anh']
        },
        {
          type: 'match_pairs',
          title: 'Ghép cặp các từ người thân vừa học:',
          pairs: [
            { zh: '爸爸', vn: 'Bố' },
            { zh: '妈妈', vn: 'Mẹ' },
            { zh: '爱', vn: 'Yêu' },
            { zh: '我', vn: 'Tôi' }
          ]
        },
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm của từ Bố:',
          hanzi: '爸爸',
          pinyin: 'bà ba',
          clean: 'ba ba',
          meaning: 'Bố, cha',
          hint: 'b_ b_'
        },
        {
          type: 'multiple_choice',
          title: 'Chọn nghĩa đúng của câu:',
          prompt: '我爱爸爸',
          subPrompt: 'Wǒ ài bàba',
          options: [
            { text: 'Tôi yêu bố', correct: true },
            { text: 'Bố yêu mẹ', correct: false },
            { text: 'Tôi là học sinh', correct: false }
          ]
        }
      ]
    },
    {
      id: 'unit_4',
      title: 'Ẩm Thực, Ăn Uống & Trà Nước',
      level: 'HSK 1',
      hsk: 1,
      icon: '🧋',
      desc: 'Học từ đơn căn bản: 吃 (ăn), 喝 (uống), 水 (nước), 茶 (trà), 好吃 (ngon).',
      skills: ['Ăn uống', 'Nước uống', 'Trà', 'Khen ngon'],
      questions: [
        {
          type: 'introduce_word',
          title: 'Làm quen với động từ Ăn:',
          icon: '🍚',
          hanzi: '吃',
          pinyin: 'chī',
          meaning: 'Ăn',
          hint: 'Có bộ Khẩu (口) ở trước chỉ hành động bằng miệng',
          options: [
            { text: 'Ăn', correct: true },
            { text: 'Uống', correct: false },
            { text: 'Ngủ', correct: false }
          ]
        },
        {
          type: 'introduce_word',
          title: 'Làm quen với động từ Uống:',
          icon: '🥤',
          hanzi: '喝',
          pinyin: 'hē',
          meaning: 'Uống',
          hint: 'Cũng có bộ Khẩu (口) chỉ việc uống',
          options: [
            { text: 'Uống', correct: true },
            { text: 'Chạy', correct: false },
            { text: 'Nói', correct: false }
          ]
        },
        {
          type: 'introduce_word',
          title: 'Làm quen với từ Nước:',
          icon: '💧',
          hanzi: '水',
          pinyin: 'shuǐ',
          meaning: 'Nước',
          hint: 'Nước lọc, dòng nước mát',
          options: [
            { text: 'Nước', correct: true },
            { text: 'Lửa', correct: false },
            { text: 'Đất', correct: false }
          ]
        },
        {
          type: 'arrange_vn',
          title: 'Ghép từ đơn giản:',
          hanzi: '喝水',
          pinyin: 'hē shuǐ',
          meaning: 'Uống nước',
          correctChips: ['Uống', 'nước'],
          distractors: ['Ăn', 'cơm']
        },
        {
          type: 'introduce_word',
          title: 'Làm quen với thức uống Trà:',
          icon: '🍵',
          hanzi: '茶',
          pinyin: 'chá',
          meaning: 'Trà, chè',
          hint: 'Bộ Thảo (艹) ở trên chỉ lá cây trà',
          options: [
            { text: 'Trà, chè', correct: true },
            { text: 'Cà phê', correct: false },
            { text: 'Sữa', correct: false }
          ]
        },
        {
          type: 'match_pairs',
          title: 'Ghép cặp các từ ẩm thực vừa học:',
          pairs: [
            { zh: '吃', vn: 'Ăn' },
            { zh: '喝', vn: 'Uống' },
            { zh: '水', vn: 'Nước' },
            { zh: '茶', vn: 'Trà' }
          ]
        },
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm của từ Trà:',
          hanzi: '茶',
          pinyin: 'chá',
          clean: 'cha',
          meaning: 'Trà, chè',
          hint: 'ch_'
        },
        {
          type: 'multiple_choice',
          title: 'Chọn nghĩa đúng của cụm từ:',
          prompt: '喝茶',
          subPrompt: 'hē chá',
          options: [
            { text: 'Uống trà', correct: true },
            { text: 'Ăn cơm', correct: false },
            { text: 'Uống nước', correct: false }
          ]
        }
      ]
    },
    {
      id: 'unit_5',
      title: 'Mua Sắm, Tiền Tệ & Giá Cả',
      level: 'HSK 1 - 2',
      hsk: 2,
      icon: '🛍️',
      desc: 'Hỏi giá tiền, mặc cả, chọn kích cỡ và thanh toán qua di động.',
      skills: ['Mua sắm', 'Hỏi giá', 'Đắt rẻ', 'Thanh toán'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '便宜',
          pinyin: 'pián yi',
          clean: 'pian yi',
          meaning: 'Rẻ, giá rẻ',
          hint: 'p___ y_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '这件衣服太贵了',
          pinyin: 'Zhè jiàn yīfu tài guì le',
          meaning: 'Chiếc áo này đắt quá',
          correctChips: ['Chiếc áo này', 'đắt', 'quá'],
          distractors: ['rẻ', 'đẹp', 'mua']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp từ mua sắm tương ứng',
          pairs: [
            { zh: '买', vn: 'Mua' },
            { zh: '卖', vn: 'Bán' },
            { zh: '钱', vn: 'Tiền' },
            { zh: '商店', vn: 'Cửa hàng' }
          ]
        },
        {
          type: 'arrange_zh',
          title: 'Sắp xếp các từ tiếng Trung thành câu hoàn chỉnh',
          vietnamese: 'Quyển sách này bao nhiêu tiền?',
          hanziSentence: '这本书多少钱',
          correctChips: ['这本', '书', '多少', '钱'],
          distractors: ['衣服', '贵']
        }
      ]
    },
    {
      id: 'unit_6',
      title: 'Nơi Ở, Đồ Đạc & Sinh Hoạt',
      level: 'HSK 1 - 2',
      hsk: 2,
      icon: '🏠',
      desc: 'Miêu tả phòng ở, đồ dùng gia đình (bàn, ghế, giường, tủ) và thói quen ở nhà.',
      skills: ['Phòng ốc', 'Đồ gia dụng', 'Chỗ ở', 'Vị trí'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '房间',
          pinyin: 'fáng jiān',
          clean: 'fang jian',
          meaning: 'Căn phòng',
          hint: 'f___ j___'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '书在桌子上面',
          pinyin: 'Shū zài zhuōzi shàngmiàn',
          meaning: 'Sách ở trên mặt bàn',
          correctChips: ['Sách', 'ở trên', 'mặt bàn'],
          distractors: ['dưới', 'ghế', 'trong tủ']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp đồ đạc tương ứng',
          pairs: [
            { zh: '桌子', vn: 'Cái bàn' },
            { zh: '椅子', vn: 'Cái ghế' },
            { zh: '门', vn: 'Cánh cửa' },
            { zh: '睡觉', vn: 'Đi ngủ' }
          ]
        }
      ]
    },
    {
      id: 'unit_7',
      title: 'Giao Thông, Đi Lại & Hỏi Đường',
      level: 'HSK 1 - 2',
      hsk: 2,
      icon: '🚖',
      desc: 'Hỏi đường, đón xe taxi, đi tàu hỏa, máy bay và chỉ phương hướng trước sau.',
      skills: ['Hỏi đường', 'Taxi / Ga tàu', 'Sân bay', 'Phương hướng'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '火车站',
          pinyin: 'huǒ chē zhàn',
          clean: 'huo che zhan',
          meaning: 'Nhà ga tàu hỏa',
          hint: 'h__ ch_ zh__'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '明天我去北京旅游',
          pinyin: 'Míngtiān wǒ qù Běijīng lǚyóu',
          meaning: 'Ngày mai tôi đi Bắc Kinh du lịch',
          correctChips: ['Ngày mai', 'tôi', 'đi Bắc Kinh', 'du lịch'],
          distractors: ['hôm qua', 'công tác', 'về nhà']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp từ giao thông tương ứng',
          pairs: [
            { zh: '飞机', vn: 'Máy bay' },
            { zh: '出租车', vn: 'Xe taxi' },
            { zh: '前面', vn: 'Phía trước' },
            { zh: '后面', vn: 'Phía sau' }
          ]
        }
      ]
    },
    {
      id: 'unit_8',
      title: 'Thời Tiết, Bốn Mùa & Thiên Nhiên',
      level: 'HSK 1 - 2',
      hsk: 2,
      icon: '🌦️',
      desc: 'Nói về thời tiết nóng lạnh, mưa nắng, bốn mùa xuân hạ thu đông.',
      skills: ['Nắng mưa', 'Nhiệt độ', 'Bốn mùa', 'Cảm nhận'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '天气',
          pinyin: 'tiān qì',
          clean: 'tian qi',
          meaning: 'Thời tiết',
          hint: 't___ q_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '今天比昨天冷得多',
          pinyin: 'Jīntiān bǐ zuótiān lěng de duō',
          meaning: 'Hôm nay lạnh hơn hôm qua rất nhiều',
          correctChips: ['Hôm nay', 'lạnh hơn', 'hôm qua', 'rất nhiều'],
          distractors: ['nóng', 'ít', 'ấm áp']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp từ thời tiết tương ứng',
          pairs: [
            { zh: '下雨', vn: 'Trời mưa' },
            { zh: '晴天', vn: 'Trời nắng quang' },
            { zh: '很冷', vn: 'Rất lạnh' },
            { zh: '太热', vn: 'Quá nóng' }
          ]
        }
      ]
    },

    // --- HSK 2 - 3 (SƠ TRUNG CẤP) ---
    {
      id: 'unit_9',
      title: 'Sức Khỏe, Cơ Thể & Bệnh Viện',
      level: 'HSK 2 - 3',
      hsk: 2,
      icon: '🏥',
      desc: 'Khám bệnh, miêu tả triệu chứng sốt ho đau bụng, mua thuốc tại tiệm thuốc.',
      skills: ['Triệu chứng', 'Khám bệnh', 'Uống thuốc', 'Chăm sóc'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '生病',
          pinyin: 'shēng bìng',
          clean: 'sheng bing',
          meaning: 'Bị ốm, ngã bệnh',
          hint: 'sh___ b___'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '医生说你要多喝水',
          pinyin: 'Yīshēng shuō nǐ yào duō hē shuǐ',
          meaning: 'Bác sĩ nói bạn phải uống nhiều nước',
          correctChips: ['Bác sĩ', 'nói', 'bạn phải', 'uống nhiều nước'],
          distractors: ['uống thuốc', 'nghỉ ngơi', 'chạy bộ']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp từ y tế tương ứng',
          pairs: [
            { zh: '医院', vn: 'Bệnh viện' },
            { zh: '吃药', vn: 'Uống thuốc' },
            { zh: '身体', vn: 'Cơ thể / Sức khỏe' },
            { zh: '舒服', vn: 'Dễ chịu' }
          ]
        }
      ]
    },
    {
      id: 'unit_10',
      title: 'Học Tập, Trường Lớp & Thi Cử',
      level: 'HSK 2 - 3',
      hsk: 2,
      icon: '📚',
      desc: 'Nói về việc học tập ở trường, làm bài kiểm tra, ôn thi và kết quả.',
      skills: ['Học tập', 'Thi cử', 'Bài tập', 'Thành tích'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '考试',
          pinyin: 'kǎo shì',
          clean: 'kao shi',
          meaning: 'Kỳ thi, thi cử',
          hint: 'k__ sh_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '我每天都努力学习汉语',
          pinyin: 'Wǒ měitiān dōu nǔlì xuéxí Hànyǔ',
          meaning: 'Mỗi ngày tôi đều chăm chỉ học tiếng Trung',
          correctChips: ['Mỗi ngày', 'tôi', 'đều chăm chỉ', 'học', 'tiếng Trung'],
          distractors: ['lười biếng', 'tiếng Anh', 'thầy giáo']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp từ học tập tương ứng',
          pairs: [
            { zh: '学习', vn: 'Học tập' },
            { zh: '懂', vn: 'Hiểu bài' },
            { zh: '教室', vn: 'Phòng học' },
            { zh: '作业', vn: 'Bài tập về nhà' }
          ]
        }
      ]
    },
    {
      id: 'unit_11',
      title: 'Công Việc, Công Ty & Nghề Nghiệp',
      level: 'HSK 2 - 3',
      hsk: 2,
      icon: '💼',
      desc: 'Giao tiếp nơi công sở, thảo luận công việc với đồng nghiệp và cấp trên.',
      skills: ['Công sở', 'Họp hành', 'Kế hoạch', 'Nhiệm vụ'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '工作',
          pinyin: 'gōng zuò',
          clean: 'gong zuo',
          meaning: 'Làm việc, công việc',
          hint: 'g___ z__'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '他在一家大公司工作',
          pinyin: 'Tā zài yì jiā dà gōngsī gōngzuò',
          meaning: 'Anh ấy làm việc tại một công ty lớn',
          correctChips: ['Anh ấy', 'làm việc', 'tại', 'một công ty lớn'],
          distractors: ['trường học', 'nhà hàng', 'bệnh viện']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp từ công sở tương ứng',
          pairs: [
            { zh: '公司', vn: 'Công ty' },
            { zh: '上班', vn: 'Đi làm' },
            { zh: '经理', vn: 'Giám đốc' },
            { zh: '会议', vn: 'Cuộc họp' }
          ]
        }
      ]
    },
    {
      id: 'unit_12',
      title: 'Sở Thích, Âm Nhạc & Thể Thao',
      level: 'HSK 2 - 3',
      hsk: 2,
      icon: '🎨',
      desc: 'Bày tỏ sở thích ca hát, chơi bóng rổ, đá bóng, bơi lội và nghe nhạc.',
      skills: ['Thể thao', 'Âm nhạc', 'Phim ảnh', 'Giải trí'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '唱歌',
          pinyin: 'chàng gē',
          clean: 'chang ge',
          meaning: 'Hát, ca hát',
          hint: 'ch___ g_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '今天天气真好我们去跑步吧',
          pinyin: 'Jīntiān tiānqì zhēn hǎo wǒmen qù pǎobù ba',
          meaning: 'Thời tiết hôm nay thật đẹp chúng ta đi chạy bộ nhé',
          correctChips: ['Thời tiết', 'hôm nay', 'thật đẹp', 'chúng ta', 'đi chạy bộ nhé'],
          distractors: ['ở nhà', 'xem phim', 'trời mưa']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp từ sở thích tương ứng',
          pairs: [
            { zh: '电影', vn: 'Phim ảnh' },
            { zh: '游泳', vn: 'Bơi lội' },
            { zh: '打篮球', vn: 'Chơi bóng rổ' },
            { zh: '跳舞', vn: 'Khiêu vũ' }
          ]
        }
      ]
    },
    {
      id: 'unit_13',
      title: 'Công Nghệ, Di Động & Mạng Xã Hội',
      level: 'HSK 2 - 3',
      hsk: 3,
      icon: '📱',
      desc: 'Nói về lướt web, gửi email, gọi video, nhắn tin WeChat và chụp ảnh.',
      skills: ['Điện thoại', 'Mạng xã hội', 'Tin nhắn', 'Internet'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '手机',
          pinyin: 'shǒu jī',
          clean: 'shou ji',
          meaning: 'Điện thoại di động',
          hint: 'sh__ j_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '请你给我发一个微信',
          pinyin: 'Qǐng nǐ gěi wǒ fā yí gè Wēixìn',
          meaning: 'Xin bạn hãy gửi cho tôi một tin nhắn WeChat',
          correctChips: ['Xin bạn', 'hãy gửi', 'cho tôi', 'tin nhắn WeChat'],
          distractors: ['gọi điện', 'gặp mặt', 'email']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp công nghệ tương ứng',
          pairs: [
            { zh: '电脑', vn: 'Máy tính' },
            { zh: '上网', vn: 'Lướt mạng' },
            { zh: '发短信', vn: 'Gửi tin nhắn' },
            { zh: '拍照', vn: 'Chụp ảnh' }
          ]
        }
      ]
    },
    {
      id: 'unit_14',
      title: 'Thời Trang, Màu Sắc & Ngoại Hình',
      level: 'HSK 2 - 3',
      hsk: 3,
      icon: '👗',
      desc: 'Miêu tả quần áo, kiểu tóc, vóc dáng cao gầy và màu sắc ưa thích.',
      skills: ['Màu sắc', 'Trang phục', 'Vóc dáng', 'Thẩm mỹ'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '漂亮',
          pinyin: 'piào liang',
          clean: 'piao liang',
          meaning: 'Xinh đẹp, đẹp đẽ',
          hint: 'p___ l____'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '这条红色的裙子真好看',
          pinyin: 'Zhè tiáo hóngsè de qúnzi zhēn hǎokàn',
          meaning: 'Chiếc váy màu đỏ này trông thật đẹp',
          correctChips: ['Chiếc váy', 'màu đỏ này', 'trông thật đẹp'],
          distractors: ['màu xanh', 'chiếc áo', 'quá đắt']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp màu sắc & trang phục tương ứng',
          pairs: [
            { zh: '红色', vn: 'Màu đỏ' },
            { zh: '白色', vn: 'Màu trắng' },
            { zh: '裤子', vn: 'Quần' },
            { zh: '鞋子', vn: 'Đôi giày' }
          ]
        }
      ]
    },
    {
      id: 'unit_15',
      title: 'Đô Thị, Địa Danh & Tham Quan',
      level: 'HSK 2 - 3',
      hsk: 3,
      icon: '🏙️',
      desc: 'Khám phá các thành phố lớn (Bắc Kinh, Thượng Hải), đi công viên, siêu thị.',
      skills: ['Thành phố', 'Địa danh', 'Công viên', 'Bản đồ'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '城市',
          pinyin: 'chéng shì',
          clean: 'cheng shi',
          meaning: 'Thành phố, đô thị',
          hint: 'ch___ sh_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '我想去中国看长城',
          pinyin: 'Wǒ xiǎng qù Zhōngguó kàn Chángchéng',
          meaning: 'Tôi muốn đến Trung Quốc ngắm Vạn Lý Trường Thành',
          correctChips: ['Tôi', 'muốn đến', 'Trung Quốc', 'ngắm Vạn Lý Trường Thành'],
          distractors: ['Bắc Kinh', 'đi máy bay', 'du lịch']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp địa danh tương ứng',
          pairs: [
            { zh: '北京', vn: 'Bắc Kinh' },
            { zh: '上海', vn: 'Thượng Hải' },
            { zh: '公园', vn: 'Công viên' },
            { zh: '超市', vn: 'Siêu thị' }
          ]
        }
      ]
    },

    // --- HSK 3 - 4 (TRUNG CẤP) ---
    {
      id: 'unit_16',
      title: 'Cảm Xúc, Tâm Trạng & Tính Cách',
      level: 'HSK 3 - 4',
      hsk: 3,
      icon: '😊',
      desc: 'Bày tỏ niềm vui, nỗi buồn, sự lo lắng, nhiệt tình và tính cách con người.',
      skills: ['Tâm trạng', 'Cảm xúc', 'Tính cách', 'Sự đồng cảm'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '难过',
          pinyin: 'nán guò',
          clean: 'nan guo',
          meaning: 'Buồn bã, đau lòng',
          hint: 'n__ g__'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '虽然工作很忙但是我很快乐',
          pinyin: 'Suīrán gōngzuò hěn máng dànshì wǒ hěn kuàilè',
          meaning: 'Tuy công việc rất bận nhưng tôi rất vui vẻ',
          correctChips: ['Tuy', 'công việc rất bận', 'nhưng', 'tôi rất vui vẻ'],
          distractors: ['mệt mỏi', 'buồn bã', 'nghỉ ngơi']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp tính cách tương ứng',
          pairs: [
            { zh: '热情', vn: 'Nhiệt tình' },
            { zh: '认真', vn: 'Chăm chỉ, nghiêm túc' },
            { zh: '担心', vn: 'Lo lắng' },
            { zh: '聪明', vn: 'Thông minh' }
          ]
        }
      ]
    },
    {
      id: 'unit_17',
      title: 'Ngân Hàng, Tài Chính & Thanh Toán',
      level: 'HSK 3 - 4',
      hsk: 3,
      icon: '🏦',
      desc: 'Giao dịch ngân hàng, gửi tiền, đổi ngoại tệ, dùng thẻ tín dụng và đầu tư.',
      skills: ['Ngân hàng', 'Thẻ tín dụng', 'Tỷ giá', 'Tiết kiệm'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '银行',
          pinyin: 'yín háng',
          clean: 'yin hang',
          meaning: 'Ngân hàng',
          hint: 'y_n h___'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '我想在这家银行换钱',
          pinyin: 'Wǒ xiǎng zài zhè jiā yínháng huàn qián',
          meaning: 'Tôi muốn đổi tiền ở ngân hàng này',
          correctChips: ['Tôi muốn', 'đổi tiền', 'ở ngân hàng này'],
          distractors: ['rút tiền', 'gửi tiền', 'mua sắm']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp tài chính tương ứng',
          pairs: [
            { zh: '信用卡', vn: 'Thẻ tín dụng' },
            { zh: '现金', vn: 'Tiền mặt' },
            { zh: '存钱', vn: 'Gửi tiết kiệm' },
            { zh: '收入', vn: 'Thu nhập' }
          ]
        }
      ]
    },
    {
      id: 'unit_18',
      title: 'Du Lịch Quốc Tế & Khách Sạn',
      level: 'HSK 3 - 4',
      hsk: 4,
      icon: '✈️',
      desc: 'Làm thủ tục hải quan, xin visa, đặt phòng khách sạn và dịch vụ phòng.',
      skills: ['Hộ chiếu', 'Visa', 'Đặt phòng', 'Hải quan'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '护照',
          pinyin: 'hù zhào',
          clean: 'hu zhao',
          meaning: 'Hộ chiếu',
          hint: 'h_ zh__'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '我已经预订了双人房间',
          pinyin: 'Wǒ yǐjīng yùdìng le shuāngrén fángjiān',
          meaning: 'Tôi đã đặt trước một phòng đôi',
          correctChips: ['Tôi đã', 'đặt trước', 'một phòng đôi'],
          distractors: ['phòng đơn', 'hủy phòng', 'thanh toán']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp du lịch tương ứng',
          pairs: [
            { zh: '签证', vn: 'Thị thực (Visa)' },
            { zh: '行李箱', vn: 'Vali hành lý' },
            { zh: '导游', vn: 'Hướng dẫn viên' },
            { zh: '宾馆', vn: 'Khách sạn' }
          ]
        }
      ]
    },
    {
      id: 'unit_19',
      title: 'Nấu Nướng & Hương Vị Ẩm Thực',
      level: 'HSK 3 - 4',
      hsk: 4,
      icon: '🍳',
      desc: 'Miêu tả các vị chua cay mặn ngọt đắng, cách xào nấu, nêm nếm gia vị.',
      skills: ['Gia vị', 'Vị giác', 'Xào nấu', 'Bí quyết nấu'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '味道',
          pinyin: 'wèi dào',
          clean: 'wei dao',
          meaning: 'Mùi vị, hương vị',
          hint: 'w__ d__'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '四川菜的味道又麻又辣',
          pinyin: 'Sìchuān cài de wèidào yòu má yòu là',
          meaning: 'Món Tứ Xuyên vừa có vị tê lại vừa cay',
          correctChips: ['Món Tứ Xuyên', 'vừa có vị tê', 'lại vừa cay'],
          distractors: ['rất ngọt', 'mặn', 'chua']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp hương vị tương ứng',
          pairs: [
            { zh: '酸', vn: 'Chua' },
            { zh: '甜', vn: 'Ngọt' },
            { zh: '苦', vn: 'Đắng' },
            { zh: '辣', vn: 'Cay' }
          ]
        }
      ]
    },
    {
      id: 'unit_20',
      title: 'Tuyển Dụng, Phỏng Vấn & Thăng Tiến',
      level: 'HSK 4 - 5',
      hsk: 4,
      icon: '🏢',
      desc: 'Chuẩn bị CV, trả lời câu hỏi phỏng vấn, đàm phán lương và thăng tiến nghề nghiệp.',
      skills: ['Phỏng vấn', 'Sơ yếu lý lịch', 'Lương bổng', 'Kinh nghiệm'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '面试',
          pinyin: 'miàn shì',
          clean: 'mian shi',
          meaning: 'Phỏng vấn',
          hint: 'm___ sh_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '他不仅聪明而且非常努力',
          pinyin: 'Tā bùjǐn cōngming érqiě fēicháng nǔlì',
          meaning: 'Anh ấy không những thông minh mà còn vô cùng nỗ lực',
          correctChips: ['Anh ấy', 'không những', 'thông minh', 'mà còn', 'vô cùng nỗ lực'],
          distractors: ['lười biếng', 'chậm chạp', 'thất bại']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp tuyển dụng tương ứng',
          pairs: [
            { zh: '简历', vn: 'Hồ sơ lý lịch' },
            { zh: '薪水', vn: 'Tiền lương' },
            { zh: '经验', vn: 'Kinh nghiệm' },
            { zh: '责任', vn: 'Trách nhiệm' }
          ]
        }
      ]
    },
    {
      id: 'unit_21',
      title: 'Động Thực Vật, Môi Trường & Sinh Thái',
      level: 'HSK 3 - 4',
      hsk: 4,
      icon: '🌿',
      desc: 'Thế giới động vật (gấu trúc, chim, mèo), bảo vệ rừng và biến đổi khí hậu.',
      skills: ['Muông thú', 'Cây cối', 'Bảo vệ rừng', 'Sinh thái'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '保护',
          pinyin: 'bǎo hù',
          clean: 'bao hu',
          meaning: 'Bảo vệ, gìn giữ',
          hint: 'b__ h_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '大熊猫是中国的国宝',
          pinyin: 'Dàxióngmāo shì Zhōngguó de guóbǎo',
          meaning: 'Gấu trúc là quốc bảo của Trung Quốc',
          correctChips: ['Gấu trúc', 'là', 'quốc bảo', 'của Trung Quốc'],
          distractors: ['động vật hoang dã', 'quý hiếm', 'rừng già']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp thiên nhiên tương ứng',
          pairs: [
            { zh: '森林', vn: 'Rừng rậm' },
            { zh: '环境', vn: 'Môi trường' },
            { zh: '污染', vn: 'Ô nhiễm' },
            { zh: '自然', vn: 'Tự nhiên' }
          ]
        }
      ]
    },
    {
      id: 'unit_22',
      title: 'Văn Hóa, Lễ Hội & Phong Tục',
      level: 'HSK 4 - 5',
      hsk: 4,
      icon: '🎭',
      desc: 'Tìm hiểu Tết Nguyên Đán, Tết Trung Thu, lì xì, kinh kịch và trà đạo.',
      skills: ['Lễ tết', 'Phong tục', 'Lì xì', 'Nghệ thuật'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '春节',
          pinyin: 'chūn jié',
          clean: 'chun jie',
          meaning: 'Tết Nguyên Đán',
          hint: 'ch__ j__'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '过年的时候全家人一起吃团圆饭',
          pinyin: 'Guònián de shíhou quánjiā rén yìqǐ chī tuányuán fàn',
          meaning: 'Vào dịp Tết cả gia đình cùng nhau ăn bữa cơm đoàn viên',
          correctChips: ['Vào dịp Tết', 'cả gia đình', 'cùng nhau ăn', 'bữa cơm đoàn viên'],
          distractors: ['bánh chưng', 'đi chơi', 'tặng quà']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp văn hóa tương ứng',
          pairs: [
            { zh: '中秋节', vn: 'Tết Trung Thu' },
            { zh: '礼物', vn: 'Món quà' },
            { zh: '传统', vn: 'Truyền thống' },
            { zh: '历史', vn: 'Lịch sử' }
          ]
        }
      ]
    },
    {
      id: 'unit_23',
      title: 'Quan Hệ Xã Hội & Giao Tiếp Đời Sống',
      level: 'HSK 4 - 5',
      hsk: 4,
      icon: '🤝',
      desc: 'Xây dựng mối quan hệ, giải quyết bất đồng, lắng nghe và tôn trọng lẫn nhau.',
      skills: ['Xã hội', 'Tôn trọng', 'Lắng nghe', 'Tình bạn'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '交流',
          pinyin: 'jiāo liú',
          clean: 'jiao liu',
          meaning: 'Giao lưu, trò chuyện',
          hint: 'j___ l__'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '不管多么困难我们都要坚持',
          pinyin: 'Bùguǎn duōme kùnnan wǒmen dōu yào jiānchí',
          meaning: 'Bất kể khó khăn thế nào chúng ta đều phải kiên trì',
          correctChips: ['Bất kể', 'khó khăn thế nào', 'chúng ta', 'đều phải kiên trì'],
          distractors: ['từ bỏ', 'dễ dàng', 'thất vọng']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp giao tiếp tương ứng',
          pairs: [
            { zh: '礼貌', vn: 'Lịch sự' },
            { zh: '尊重', vn: 'Tôn trọng' },
            { zh: '意见', vn: 'Ý kiến' },
            { zh: '友谊', vn: 'Tình hữu nghị' }
          ]
        }
      ]
    },
    {
      id: 'unit_24',
      title: 'Khoa Học, Sáng Tạo & Đổi Mới',
      level: 'HSK 4 - 5',
      hsk: 5,
      icon: '🚀',
      desc: 'Công nghệ cao, trí tuệ nhân tạo, nghiên cứu vũ trụ và các phát minh vĩ đại.',
      skills: ['Khoa học', 'Phát minh', 'Công nghệ AI', 'Thí nghiệm'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '发明',
          pinyin: 'fā míng',
          clean: 'fa ming',
          meaning: 'Phát minh, sáng chế',
          hint: 'f_ m___'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '科技的发展改变了我们的生活',
          pinyin: 'Kējì de fāzhǎn gǎibiàn le wǒmen de shēnghuó',
          meaning: 'Sự phát triển của khoa học đã thay đổi cuộc sống của chúng ta',
          correctChips: ['Sự phát triển', 'của khoa học', 'đã thay đổi', 'cuộc sống của chúng ta'],
          distractors: ['làm khó', 'kinh tế', 'chậm lại']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp khoa học tương ứng',
          pairs: [
            { zh: '科学', vn: 'Khoa học' },
            { zh: '实验', vn: 'Thí nghiệm' },
            { zh: '探索', vn: 'Thăm dò, khám phá' },
            { zh: '现代', vn: 'Hiện đại' }
          ]
        }
      ]
    },

    // --- HSK 5 - 6 (CAO CẤP) ---
    {
      id: 'unit_25',
      title: 'Kinh Doanh, Đàm Phán & Hợp Đồng',
      level: 'HSK 5 - 6',
      hsk: 5,
      icon: '📈',
      desc: 'Ký kết hợp đồng thương mại, thương lượng điều khoản và chiến lược tiếp thị.',
      skills: ['Hợp đồng', 'Thương thảo', 'Thị trường', 'Lợi nhuận'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '合同',
          pinyin: 'hé tong',
          clean: 'he tong',
          meaning: 'Bản hợp đồng',
          hint: 'h_ t___'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '双方经过友好协商达成了协议',
          pinyin: 'Shuāngfāng jīngguò yǒuhǎo xiéshāng dáchéng le xiéyì',
          meaning: 'Hai bên qua thương lượng hữu nghị đã đạt được thỏa thuận',
          correctChips: ['Hai bên', 'qua thương lượng', 'hữu nghị', 'đã đạt được', 'thỏa thuận'],
          distractors: ['hủy bỏ', 'tranh chấp', 'ký nhầm']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp kinh doanh tương ứng',
          pairs: [
            { zh: '谈判', vn: 'Đàm phán' },
            { zh: '市场', vn: 'Thị trường' },
            { zh: '利润', vn: 'Lợi nhuận' },
            { zh: '合作', vn: 'Hợp tác' }
          ]
        }
      ]
    },
    {
      id: 'unit_26',
      title: 'Triết Lý, Nhân Sinh & Thành Ngữ Hán',
      level: 'HSK 5 - 6',
      hsk: 5,
      icon: '🧠',
      desc: 'Thành ngữ 4 chữ kinh điển (Mã đáo thành công, Nhất tâm nhất ý) và bài học cuộc sống.',
      skills: ['Thành ngữ', 'Nhân sinh', 'Tu dưỡng', 'Bền chí'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '坚持',
          pinyin: 'jiān chí',
          clean: 'jian chi',
          meaning: 'Kiên trì, giữ vững',
          hint: 'j___ ch_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '与其浪费时间不如立刻行动',
          pinyin: 'Yǔqí làngfèi shíjiān bùrú lìkè xíngdòng',
          meaning: 'Thà lập tức hành động còn hơn lãng phí thời gian',
          correctChips: ['Thà lập tức', 'hành động', 'còn hơn là', 'lãng phí thời gian'],
          distractors: ['chần chừ', 'chờ đợi', 'ngủ quên']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp thành ngữ tương ứng',
          pairs: [
            { zh: '马到成功', vn: 'Mã đáo thành công' },
            { zh: '一心一意', vn: 'Một lòng một dạ' },
            { zh: '自相矛盾', vn: 'Tự mâu thuẫn' },
            { zh: '知足常乐', vn: 'Biết đủ là vui' }
          ]
        }
      ]
    },
    {
      id: 'unit_27',
      title: 'Biện Luận, Tư Duy & Luận Điểm',
      level: 'HSK 5 - 6',
      hsk: 6,
      icon: '⚖️',
      desc: 'Diễn đạt quan điểm học thuật, tranh biện logic, đưa ra bằng chứng và lập luận.',
      skills: ['Lập luận', 'Chứng cứ', 'Phản biện', 'Kết luận'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '证据',
          pinyin: 'zhèng jù',
          clean: 'zheng ju',
          meaning: 'Chứng cứ, bằng chứng',
          hint: 'zh___ j_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '唯有不断创新才能保持领先',
          pinyin: 'Wéiyǒu bùduàn chuàngxīn cáinéng bǎochí lǐngxiān',
          meaning: 'Chỉ có không ngừng sáng tạo mới có thể giữ vững vị thế dẫn đầu',
          correctChips: ['Chỉ có', 'không ngừng sáng tạo', 'mới có thể', 'giữ vững vị thế dẫn đầu'],
          distractors: ['thụt lùi', 'ngừng lại', 'học theo']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp biện luận tương ứng',
          pairs: [
            { zh: '观点', vn: 'Quan điểm' },
            { zh: '结论', vn: 'Kết luận' },
            { zh: '赞成', vn: 'Tán thành' },
            { zh: '反对', vn: 'Phản đối' }
          ]
        }
      ]
    },
    {
      id: 'unit_28',
      title: 'Đô Thị Hóa & Xã Hội Toàn Cầu',
      level: 'HSK 5 - 6',
      hsk: 6,
      icon: '🏛️',
      desc: 'Bàn luận về chính sách đô thị hóa, dân số, kinh tế vĩ mô và hội nhập toàn cầu.',
      skills: ['Toàn cầu hóa', 'Kinh tế vĩ mô', 'Chính sách', 'Phát triển bền vững'],
      questions: [
        {
          type: 'listen_pinyin',
          title: 'Nghe và gõ lại phiên âm Pinyin',
          hanzi: '政策',
          pinyin: 'zhèng cè',
          clean: 'zheng ce',
          meaning: 'Chính sách, đường lối',
          hint: 'zh___ c_'
        },
        {
          type: 'arrange_vn',
          title: 'Dịch câu sau sang tiếng Việt',
          hanzi: '经济全球化促进了国际贸易的发展',
          pinyin: 'Jīngjì quánqiúhuà cùjìn le guójì màoyì de fāzhǎn',
          meaning: 'Toàn cầu hóa kinh tế thúc đẩy sự phát triển của thương mại quốc tế',
          correctChips: ['Toàn cầu hóa kinh tế', 'thúc đẩy', 'sự phát triển', 'của thương mại quốc tế'],
          distractors: ['gây khó khăn', 'ngăn cản', 'khủng hoảng']
        },
        {
          type: 'match_pairs',
          title: 'Chạm vào các cặp xã hội vĩ mô tương ứng',
          pairs: [
            { zh: '全球化', vn: 'Toàn cầu hóa' },
            { zh: '统计', vn: 'Thống kê' },
            { zh: '趋势', vn: 'Xu hướng' },
            { zh: '资源', vn: 'Tài nguyên' }
          ]
        }
      ]
    }
  ];

  /* ==========================================================================
     3. LESSON MANAGER CONTROLLER (WITH 28 UNITS + 201 HSK DECKS)
     ========================================================================== */
  class DuolingoLessonApp {
    constructor() {
      this.audio = new DuoAudioEngine();
      this.state = this.loadState();
      
      // Active Mode: 'themes' (28 Thematic Units) vs 'decks' (201 HSK Decks)
      this.activeMode = 'themes';
      this.themeFilter = 'all';
      this.deckHskLevel = 1;
      this.searchKeyword = '';

      // Active Lesson State
      this.currentUnit = null;
      this.questions = [];
      this.currentIndex = 0;
      this.hearts = 5;
      this.correctCount = 0;
      this.consecutiveCorrect = 0;
      this.lessonXpEarned = 0;
      this.startTime = 0;
      this.mistakesQueue = [];
      this.isAnswerChecked = false;
      this.currentSelectedAnswer = null;

      // DOM Cache
      this.dom = {};
      this.initDom();
      this.initEvents();
      this.renderHub();
      this.initBgCanvas();

      // Listen for Database Cloud Sync updates
      window.addEventListener('cloud-progress-updated', () => {
        this.state = this.loadState();
        this.renderHub();
      });

      // Check URL query parameters
      this.checkUrlParams();
    }

    initDom() {
      this.dom.hubView = document.getElementById('lessonHubView');
      this.dom.runnerView = document.getElementById('lessonRunnerView');
      this.dom.unitsGrid = document.getElementById('hubUnitsGrid');
      this.dom.deckGrid = document.getElementById('hubDeckGrid');

      // Mode & Filter Bars
      this.dom.btnModeThemes = document.getElementById('btnModeThemes');
      this.dom.btnModeDecks = document.getElementById('btnModeDecks');
      this.dom.themeFilterBar = document.getElementById('themeFilterBar');
      this.dom.deckFilterBar = document.getElementById('deckFilterBar');
      this.dom.searchInput = document.getElementById('hubSearchInput');

      // Runner DOM
      this.dom.progressBar = document.getElementById('runnerProgressBar');
      this.dom.heartsCount = document.getElementById('runnerHeartsCount');
      this.dom.heartsBox = document.getElementById('runnerHeartsBox');
      this.dom.exerciseCanvas = document.getElementById('exerciseCanvas');
      this.dom.bottomBar = document.getElementById('runnerBottomBar');
      this.dom.btnCheck = document.getElementById('btnRunnerCheck');
      this.dom.btnSkip = document.getElementById('btnRunnerSkip');
      this.dom.feedbackArea = document.getElementById('runnerFeedbackArea');
      this.dom.btnCloseRunner = document.getElementById('btnRunnerClose');

      // Modals
      this.dom.celebModal = document.getElementById('celebrationModal');
      this.dom.quitModal = document.getElementById('quitConfirmModal');
      this.dom.outOfHeartsModal = document.getElementById('outOfHeartsModal');
    }

    loadState() {
      let extra = {};
      try {
        extra = JSON.parse(localStorage.getItem('pinyin_pop_extra_data') || '{}');
      } catch (e) {
        extra = {};
      }
      return {
        xp: extra.xp || 0,
        studyStreak: extra.studyStreak || { count: 1, lastDate: null },
        completedUnits: extra.completedDuoUnits || {},
        hearts: 5
      };
    }

    saveState(forceSync = false) {
      try {
        let extra = {};
        try {
          extra = JSON.parse(localStorage.getItem('pinyin_pop_extra_data') || '{}');
        } catch (e) {}
        extra.xp = this.state.xp;
        extra.studyStreak = this.state.studyStreak;
        extra.completedDuoUnits = this.state.completedUnits;
        extra.duoTotalAnswers = (extra.duoTotalAnswers || 0) + 1;
        localStorage.setItem('pinyin_pop_extra_data', JSON.stringify(extra));

        // Synchronize with Multi-Driver Database (Driver 1: IndexedDB PinyinPopDB + Driver 2/3/4: Cloud if logged in)
        if (window.PinyinAuth) {
          // Lưu vào IndexedDB cục bộ (hoạt động bền vững ngay cả khi người dùng offline / là khách)
          if (window.PinyinAuth.idb && typeof window.PinyinAuth.idb.saveProgress === 'function') {
            const currentUid = window.PinyinAuth.currentUser ? window.PinyinAuth.currentUser.id : (localStorage.getItem('pinyin_pop_active_uid') || 'guest_user');
            const localData = typeof window.PinyinAuth.gatherLocalProgress === 'function' ? window.PinyinAuth.gatherLocalProgress() : null;
            if (localData) {
              localData.user_id = currentUid;
              localData.updated_at = new Date().toISOString();
              window.PinyinAuth.idb.saveProgress(localData).catch(() => {});
            }
          }

          // Đồng bộ 2 chiều lên Cloud nếu đang đăng nhập
          if (forceSync && typeof window.PinyinAuth.syncBidirectional === 'function') {
            window.PinyinAuth.syncBidirectional();
          } else if (typeof window.PinyinAuth.triggerDebouncedSync === 'function') {
            window.PinyinAuth.triggerDebouncedSync(600);
          }
        }
      } catch (e) {
        console.warn('Lỗi lưu tiến độ bài học:', e);
      }
    }

    recordMasteredWord(hanzi) {
      if (!hanzi || typeof hanzi !== 'string') return;
      try {
        const mastered = JSON.parse(localStorage.getItem('pinyin_pop_mastered') || '[]');
        if (!mastered.includes(hanzi)) {
          mastered.push(hanzi);
          localStorage.setItem('pinyin_pop_mastered', JSON.stringify(mastered));
        }
      } catch (e) {}
    }

    updateDailyQuestProgress() {
      try {
        const today = new Date().toISOString().slice(0, 10);
        let extra = JSON.parse(localStorage.getItem('pinyin_pop_extra_data') || '{}');
        if (!extra.dailyQuests || extra.dailyQuests.date !== today) {
          extra.dailyQuests = {
            date: today,
            flashcards: 0,
            strokes: 0,
            tonePuzzle: 0,
            arcadeKills: 0,
            duoLessons: 1,
            rewarded: []
          };
        } else {
          extra.dailyQuests.duoLessons = (extra.dailyQuests.duoLessons || 0) + 1;
        }
        localStorage.setItem('pinyin_pop_extra_data', JSON.stringify(extra));
      } catch (e) {}
    }

    updateStudyStreak() {
      const today = new Date().toISOString().slice(0, 10);
      if (!this.state.studyStreak || !this.state.studyStreak.lastDate) {
        this.state.studyStreak = { count: 1, lastDate: today };
        return;
      }
      if (this.state.studyStreak.lastDate === today) return;

      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (this.state.studyStreak.lastDate === yesterday) {
        this.state.studyStreak.count = (this.state.studyStreak.count || 0) + 1;
      } else {
        this.state.studyStreak.count = 1;
      }
      this.state.studyStreak.lastDate = today;
    }

    spawnFloatingXp(pts, isCombo = false) {
      const bottomBar = this.dom.bottomBar;
      if (!bottomBar) return;
      const pill = document.createElement('div');
      pill.className = 'floating-xp-pill';
      pill.textContent = isCombo ? `+${pts} XP 🔥 COMBO!` : `+${pts} XP ✨`;
      bottomBar.appendChild(pill);
      setTimeout(() => {
        if (pill.parentNode) pill.parentNode.removeChild(pill);
      }, 1200);
    }

    checkUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const unitId = params.get('unit');
      const hskParam = params.get('hsk');
      const deckParam = params.get('deck');

      if (unitId) {
        const u = THEMATIC_UNITS.find(item => item.id === unitId);
        if (u) {
          this.startLesson(u);
          return;
        }
      }
      if (hskParam && deckParam !== null) {
        this.startHskDeckLesson(parseInt(hskParam, 10) || 1, parseInt(deckParam, 10) || 0);
        return;
      }
      if (hskParam) {
        this.startDynamicHskLesson(parseInt(hskParam, 10) || 1);
      }
    }

    /* ========================================================================
       RENDER HUB: THEMES OR DECKS
       ======================================================================== */
    renderHub() {
      // Update Top Hub Stat Badges
      const streakEl = document.getElementById('hubStreakCount');
      const heartsEl = document.getElementById('hubHeartsCount');
      const xpEl = document.getElementById('hubXpCount');
      if (streakEl) streakEl.textContent = this.state.studyStreak.count || 1;
      if (heartsEl) heartsEl.textContent = this.state.hearts;
      if (xpEl) xpEl.textContent = this.state.xp;

      if (this.activeMode === 'themes') {
        if (this.dom.unitsGrid) this.dom.unitsGrid.style.display = 'grid';
        if (this.dom.deckGrid) this.dom.deckGrid.style.display = 'none';
        if (this.dom.themeFilterBar) this.dom.themeFilterBar.style.display = 'flex';
        if (this.dom.deckFilterBar) this.dom.deckFilterBar.style.display = 'none';
        this.renderThematicUnits();
      } else {
        if (this.dom.unitsGrid) this.dom.unitsGrid.style.display = 'none';
        if (this.dom.deckGrid) this.dom.deckGrid.style.display = 'grid';
        if (this.dom.themeFilterBar) this.dom.themeFilterBar.style.display = 'none';
        if (this.dom.deckFilterBar) this.dom.deckFilterBar.style.display = 'flex';
        this.renderHskDecks();
      }
    }

    renderThematicUnits() {
      const grid = this.dom.unitsGrid;
      if (!grid) return;
      grid.innerHTML = '';

      let list = THEMATIC_UNITS;

      // Filter by HSK Level
      if (this.themeFilter === 'hsk1') list = list.filter(u => u.hsk === 1);
      else if (this.themeFilter === 'hsk2') list = list.filter(u => u.hsk === 2);
      else if (this.themeFilter === 'hsk3') list = list.filter(u => u.hsk === 3 || u.hsk === 4);
      else if (this.themeFilter === 'hsk5') list = list.filter(u => u.hsk >= 5);

      // Search keyword
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase().trim();
        list = list.filter(u => 
          u.title.toLowerCase().includes(kw) || 
          u.desc.toLowerCase().includes(kw) ||
          u.skills.some(s => s.toLowerCase().includes(kw))
        );
      }

      if (list.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #ffffff; border-radius: 20px; border: 2px dashed #cbd5e1;">
            <div style="font-size: 40px;">🔍</div>
            <div style="font-family: var(--font-brand); font-size: 18px; font-weight: 800; color: #1e1b4b; margin-top: 8px;">Không tìm thấy chủ đề phù hợp</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Hãy thử tìm từ khóa khác như "ẩm thực", "kinh doanh", "du lịch"...</div>
          </div>
        `;
        return;
      }

      list.forEach(unit => {
        const isDone = !!this.state.completedUnits[unit.id];
        const card = document.createElement('div');
        card.className = 'hub-unit-card';

        card.innerHTML = `
          <div class="hub-unit-top">
            <div class="hub-unit-icon">${unit.icon}</div>
            <div class="hub-unit-meta">
              <span class="hub-unit-level">${unit.level}</span>
              <h3 class="hub-unit-title">${unit.title}</h3>
              <p class="hub-unit-desc">${unit.desc}</p>
            </div>
          </div>
          <div class="hub-unit-skills">
            ${unit.skills.map(s => `<span class="hub-skill-pill">✨ ${s}</span>`).join('')}
          </div>
          <div class="hub-unit-footer">
            <div class="hub-unit-stars">
              ${isDone ? '⭐⭐⭐ ĐÃ THUỘC' : '⭐ BÀI MỚI'}
            </div>
            <button type="button" class="hub-unit-launch-btn" data-unit-id="${unit.id}">
              ${isDone ? '🔄 ÔN TẬP' : '🚀 BẮT ĐẦU'}
            </button>
          </div>
        `;

        card.querySelector('.hub-unit-launch-btn').addEventListener('click', () => {
          this.audio.playTap();
          this.startLesson(unit);
        });

        grid.appendChild(card);
      });
    }

    /* ========================================================================
       RENDER 201 HSK DECKS (COVERING ENTIRE 5,000 WORDS DATASET)
       ======================================================================== */
    renderHskDecks() {
      const grid = this.dom.deckGrid;
      if (!grid) return;
      grid.innerHTML = '';

      const allWords = window.CHINESE_WORDS_5000 || [];
      const pool = allWords.filter(w => w.level === this.deckHskLevel);
      const totalDecks = Math.ceil(pool.length / 25);

      for (let d = 0; d < totalDecks; d++) {
        const deckSlice = pool.slice(d * 25, (d + 1) * 25);
        const deckId = `deck_hsk${this.deckHskLevel}_${d}`;
        const isDone = !!this.state.completedUnits[deckId];
        const previewStr = deckSlice.slice(0, 6).map(w => w.hanzi).join(' · ');

        // Search filter
        if (this.searchKeyword) {
          const kw = this.searchKeyword.toLowerCase().trim();
          const matches = deckSlice.some(w => 
            w.hanzi.includes(kw) || 
            (w.pinyin && w.pinyin.toLowerCase().includes(kw)) ||
            (w.meaning_vn && w.meaning_vn.toLowerCase().includes(kw))
          );
          if (!matches && !`bài ${d + 1}`.includes(kw)) continue;
        }

        const card = document.createElement('div');
        card.className = 'hub-deck-card';
        card.innerHTML = `
          <div class="deck-card-top">
            <span class="deck-card-badge">🌱 HSK ${this.deckHskLevel}</span>
            <span style="font-size: 11px; font-weight: 800; color: ${isDone ? '#059669' : '#0284c7'};">
              ${isDone ? '✅ ĐÃ THUỘC' : `ĐỦ ${deckSlice.length} TỪ VỰNG`}
            </span>
          </div>
          <h3 class="deck-card-title">Bài ${d + 1}: ${deckSlice[0] ? deckSlice[0].hanzi : ''} ~ ${deckSlice[deckSlice.length - 1] ? deckSlice[deckSlice.length - 1].hanzi : ''}</h3>
          <div class="deck-card-words-preview" title="${deckSlice.map(w => w.hanzi).join(', ')}">
            ${previewStr}... (${deckSlice.length} từ)
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-deck-preview-words" style="background:#f1f5f9; border:2px solid #cbd5e1; border-radius:12px; padding:7px 12px; font-family:var(--font-brand); font-size:12px; font-weight:800; color:#334155; cursor:pointer;">
              📖 XEM ${deckSlice.length} TỪ
            </button>
            <button type="button" class="hub-unit-launch-btn btn-deck-launch" style="padding: 8px 16px; font-size: 12px;">
              🚀 HỌC BÀI
            </button>
          </div>
        `;

        card.querySelector('.btn-deck-preview-words').addEventListener('click', (e) => {
          e.stopPropagation();
          this.audio.playTap();
          this.showDeckWordsModal(this.deckHskLevel, d);
        });

        card.querySelector('.btn-deck-launch').addEventListener('click', () => {
          this.audio.playTap();
          this.startHskDeckLesson(this.deckHskLevel, d);
        });

        grid.appendChild(card);
      }
    }

    /* Modal hiển thị đầy đủ danh sách 25 từ của Deck */
    showDeckWordsModal(hskLevel, deckIndex) {
      const modal = document.getElementById('deckWordsModal');
      if (!modal) return;

      const allWords = window.CHINESE_WORDS_5000 || [];
      const pool = allWords.filter(w => w.level === hskLevel);
      const deckSlice = pool.slice(deckIndex * 25, (deckIndex + 1) * 25);
      if (deckSlice.length === 0) return;

      const titleEl = document.getElementById('deckModalTitle');
      const subtitleEl = document.getElementById('deckModalSubtitle');
      const countTag = document.getElementById('deckModalCountTag');
      const listEl = document.getElementById('deckModalWordsList');
      const btnStart = document.getElementById('btnDeckModalStart');
      const btnClose = document.getElementById('btnDeckModalClose');

      if (titleEl) titleEl.textContent = `HSK ${hskLevel} - Bài ${deckIndex + 1}: ${deckSlice[0].hanzi} ~ ${deckSlice[deckSlice.length - 1].hanzi}`;
      if (subtitleEl) subtitleEl.textContent = `Bao trọn toàn bộ ${deckSlice.length} từ vựng chuẩn HSK ${hskLevel} (Từ số ${deckIndex * 25 + 1} đến ${deckIndex * 25 + deckSlice.length})`;
      if (countTag) countTag.textContent = `Đủ ${deckSlice.length} từ vựng`;

      if (listEl) {
        listEl.innerHTML = '';
        deckSlice.forEach((w, idx) => {
          const row = document.createElement('div');
          row.className = 'deck-word-row';
          row.innerHTML = `
            <div class="deck-word-left">
              <span class="deck-word-num">${idx + 1}</span>
              <button type="button" class="deck-word-speaker-btn" title="Nghe phát âm ${w.hanzi}">🔊</button>
              <span class="deck-word-hanzi">${w.hanzi}</span>
              <span class="deck-word-pinyin">${w.pinyin}</span>
            </div>
            <span class="deck-word-meaning" title="${w.meaning_vn || w.meaning}">${w.meaning_vn || w.meaning}</span>
          `;

          row.querySelector('.deck-word-speaker-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.audio.playTap();
            this.audio.speak(w.hanzi);
          });

          listEl.appendChild(row);
        });
      }

      if (btnStart) {
        btnStart.onclick = () => {
          this.audio.playTap();
          modal.style.display = 'none';
          this.startHskDeckLesson(hskLevel, deckIndex);
        };
      }

      if (btnClose) {
        btnClose.onclick = () => {
          this.audio.playTap();
          modal.style.display = 'none';
        };
      }

      modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
      };

      modal.style.display = 'flex';
    }

    /* ========================================================================
       START HSK DECK LESSON (BAO TRỌN 100% TẤT CẢ CÁC TỪ TRONG DECK)
       ======================================================================== */
    startHskDeckLesson(hskLevel, deckIndex) {
      const allWords = window.CHINESE_WORDS_5000 || [];
      const pool = allWords.filter(w => w.level === hskLevel);
      const deckSlice = pool.slice(deckIndex * 25, (deckIndex + 1) * 25);

      if (!deckSlice || deckSlice.length === 0) {
        alert('Không tìm thấy từ vựng trong bài học này!');
        return;
      }

      const len = deckSlice.length;
      const otherWords = allWords.filter(w => !deckSlice.some(d => d.hanzi === w.hanzi));
      const getWrongMeanings = (count = 2) => {
        return otherWords.sort(() => 0.5 - Math.random()).slice(0, count).map(w => (w.meaning_vn || w.meaning).split(';')[0]);
      };

      const generatedQuestions = [];

      // 1. DUOLINGO BƯỚC 1: LÀM QUEN TỪ VỰNG ĐẦU TIÊN (INTRODUCE WORD 0)
      const w0 = deckSlice[0];
      const w0Meaning = (w0.meaning_vn || w0.meaning).split(';')[0];
      generatedQuestions.push({
        type: 'introduce_word',
        title: `Làm quen từ mới đầu tiên (HSK ${hskLevel} - Bài ${deckIndex + 1})`,
        icon: '🌱',
        hanzi: w0.hanzi,
        pinyin: w0.pinyin,
        meaning: w0Meaning,
        hint: `Phiên âm: ${w0.pinyin}`,
        options: [
          { text: w0Meaning, correct: true },
          ...getWrongMeanings(2).map(t => ({ text: t, correct: false }))
        ].sort(() => 0.5 - Math.random())
      });

      // 2. DUOLINGO BƯỚC 2: NGHE & CHỌN CHỮ ĐÚNG (AUDIO RECOGNITION TỪ 0)
      if (len > 1) {
        generatedQuestions.push({
          type: 'listen_select_word',
          title: `Nghe phát âm và chọn chữ Hán chính xác:`,
          targetWord: w0.hanzi,
          hanzi: w0.hanzi,
          options: [
            { hanzi: w0.hanzi, pinyin: w0.pinyin, correct: true },
            { hanzi: deckSlice[1].hanzi, pinyin: deckSlice[1].pinyin, correct: false },
            { hanzi: (deckSlice[2] || otherWords[0]).hanzi, pinyin: (deckSlice[2] || otherWords[0]).pinyin, correct: false }
          ].sort(() => 0.5 - Math.random())
        });
      }

      // 3. DUOLINGO BƯỚC 3: LÀM QUEN TỪ VỰNG THỨ HAI (INTRODUCE WORD 1)
      if (len > 1) {
        const w1 = deckSlice[1];
        const w1Meaning = (w1.meaning_vn || w1.meaning).split(';')[0];
        generatedQuestions.push({
          type: 'introduce_word',
          title: `Làm quen từ mới thứ hai:`,
          icon: '🌿',
          hanzi: w1.hanzi,
          pinyin: w1.pinyin,
          meaning: w1Meaning,
          hint: `Phiên âm: ${w1.pinyin}`,
          options: [
            { text: w1Meaning, correct: true },
            ...getWrongMeanings(2).map(t => ({ text: t, correct: false }))
          ].sort(() => 0.5 - Math.random())
        });
      }

      // 4. DUOLINGO BƯỚC 4 - 9: GHÉP CẶP TOÀN BỘ CÁC TỪ VỰNG TRONG DECK (MỖI VÒNG 4 TỪ)
      // Bao quát từ 0 đến len-1 không sót một từ nào!
      for (let i = 0; i < len; i += 4) {
        const chunk = deckSlice.slice(i, i + 4);
        if (chunk.length >= 2) {
          generatedQuestions.push({
            type: 'match_pairs',
            title: `Ghép cặp từ vựng (${i + 1} - ${Math.min(len, i + chunk.length)} / ${len} từ):`,
            pairs: chunk.map(w => ({ zh: w.hanzi, vn: (w.meaning_vn || w.meaning).split(';')[0] }))
          });
        }
      }

      // 10. DUOLINGO BƯỚC 10: TRẮC NGHIỆM PHẢN XẠ NHẬN DIỆN
      if (len > 5) {
        const midWord = deckSlice[Math.floor(len / 2)];
        const midMeaning = (midWord.meaning_vn || midWord.meaning).split(';')[0];
        generatedQuestions.push({
          type: 'multiple_choice',
          title: 'Nghe phát âm và chọn nghĩa đúng của từ:',
          audioPrompt: midWord.hanzi,
          hanzi: midWord.hanzi,
          pinyin: midWord.pinyin,
          options: [
            { text: midMeaning, correct: true },
            ...getWrongMeanings(3).map(t => ({ text: t, correct: false }))
          ].sort(() => 0.5 - Math.random())
        });
      }

      // 11. DUOLINGO BƯỚC 11: SẮP XẾP NGHĨA TIẾNG VIỆT
      if (len > 3) {
        const arrWord = deckSlice[len - 2];
        const arrMeaning = (arrWord.meaning_vn || arrWord.meaning).split(';')[0];
        const arrWords = arrMeaning.split(/[;,\s]+/).filter(Boolean).slice(0, 3);
        generatedQuestions.push({
          type: 'arrange_vn',
          title: 'Sắp xếp các từ tiếng Việt để hoàn thành nghĩa:',
          hanzi: arrWord.hanzi,
          pinyin: arrWord.pinyin,
          meaning: arrMeaning,
          correctChips: arrWords.length > 0 ? arrWords : [arrMeaning],
          distractors: ['rất', 'không']
        });
      }

      // 12. DUOLINGO BƯỚC 12: THỬ THÁCH NGHE & GÕ PHIÊN ÂM PINYIN TỪ CUỐI CÙNG
      const lastWord = deckSlice[len - 1];
      generatedQuestions.push({
        type: 'listen_pinyin',
        title: `Thử thách cuối bài: Nghe và gõ lại phiên âm Pinyin của từ "${lastWord.hanzi}":`,
        hanzi: lastWord.hanzi,
        pinyin: lastWord.pinyin,
        clean: lastWord.clean,
        meaning: (lastWord.meaning_vn || lastWord.meaning).split(';')[0],
        hint: lastWord.clean ? lastWord.clean.slice(0, 1) + '___' : ''
      });

      const deckUnit = {
        id: `deck_hsk${hskLevel}_${deckIndex}`,
        title: `HSK ${hskLevel} - Bài ${deckIndex + 1}`,
        level: `HSK ${hskLevel}`,
        hsk: hskLevel,
        questions: generatedQuestions
      };

      this.startLesson(deckUnit);
    }

    /* ========================================================================
       DYNAMIC HSK RANDOM PRACTICE
       ======================================================================== */
    startDynamicHskLesson(hskLevel) {
      const allWords = window.CHINESE_WORDS_5000 || [];
      const pool = allWords.filter(w => w.level === hskLevel);
      if (!pool || pool.length === 0) return;

      const randomDeckIdx = Math.floor(Math.random() * Math.ceil(pool.length / 25));
      this.startHskDeckLesson(hskLevel, randomDeckIdx);
    }

    /* ========================================================================
       START & RUN LESSON
       ======================================================================== */
    startLesson(unit) {
      this.currentUnit = unit;
      this.questions = [...unit.questions];
      this.currentIndex = 0;
      this.hearts = 5;
      this.correctCount = 0;
      this.consecutiveCorrect = 0;
      this.lessonXpEarned = 0;
      this.startTime = Date.now();
      this.mistakesQueue = [];
      this.isAnswerChecked = false;
      this.currentSelectedAnswer = null;

      const rxp = document.getElementById('runnerLessonXpCount');
      if (rxp) rxp.textContent = '+0';

      // Switch view
      this.dom.hubView.style.display = 'none';
      this.dom.runnerView.style.display = 'flex';
      window.scrollTo(0, 0);

      this.updateHeartsDisplay();
      this.updateProgress();
      this.renderCurrentQuestion();
    }

    updateHeartsDisplay() {
      if (this.dom.heartsCount) this.dom.heartsCount.textContent = this.hearts;
      if (this.hearts <= 0) {
        this.showOutOfHeartsModal();
      }
    }

    updateProgress() {
      const total = this.questions.length;
      const pct = Math.min(100, Math.round((this.currentIndex / total) * 100));
      if (this.dom.progressBar) {
        this.dom.progressBar.style.width = `${pct}%`;
      }
    }

    /* ========================================================================
       RENDER QUESTION
       ======================================================================== */
    renderCurrentQuestion() {
      this.isAnswerChecked = false;
      this.currentSelectedAnswer = null;
      this.resetBottomBar();

      if (this.currentIndex >= this.questions.length) {
        if (this.mistakesQueue.length > 0) {
          this.questions.push(...this.mistakesQueue);
          this.mistakesQueue = [];
        } else {
          this.finishLesson();
          return;
        }
      }

      const q = this.questions[this.currentIndex];
      const canvas = this.dom.exerciseCanvas;
      canvas.innerHTML = '';

      switch (q.type) {
        case 'introduce_word':
          this.renderIntroduceWord(q, canvas);
          break;
        case 'listen_select_word':
          this.renderListenSelectWord(q, canvas);
          break;
        case 'listen_pinyin':
          this.renderListenPinyin(q, canvas);
          break;
        case 'arrange_vn':
          this.renderArrangeWordBank(q, canvas, false);
          break;
        case 'arrange_zh':
          this.renderArrangeWordBank(q, canvas, true);
          break;
        case 'match_pairs':
          this.renderMatchPairs(q, canvas);
          break;
        case 'multiple_choice':
          this.renderMultipleChoice(q, canvas);
          break;
        default:
          this.renderListenPinyin(q, canvas);
          break;
      }
    }

    /* TYPE 0: INTRODUCE NEW WORD (DUOLINGO FIRST-CONTACT SCAFFOLDING) */
    renderIntroduceWord(q, container) {
      container.innerHTML = `
        <span class="exercise-type-tag tag-new-word">✨ TỪ VỰNG MỚI (LÀM QUEN)</span>
        <h2 class="exercise-title">${q.title || 'Làm quen với từ mới sau đây:'}</h2>

        <div class="duo-hero-word-card">
          <div class="hero-word-icon">${q.icon || '💡'}</div>
          <div class="hero-word-center">
            <div class="hero-word-hanzi">${q.hanzi}</div>
            <div class="hero-word-pinyin">${q.pinyin}</div>
          </div>
          <div class="hero-word-audio-row">
            <button type="button" class="btn-speaker-big" id="btnIntroAudio" title="Nghe phát âm chuẩn">🔊</button>
            <button type="button" class="btn-speaker-turtle" id="btnIntroAudioSlow" title="Nghe chậm 0.6x">🐢</button>
          </div>
          <div class="hero-word-meaning-box">
            <div class="hero-meaning-label">Nghĩa tiếng Việt:</div>
            <div class="hero-meaning-text">${q.meaning}</div>
            ${q.hint ? `<div class="hero-hint-text">💡 Mẹo: ${q.hint}</div>` : ''}
          </div>
        </div>

        <div class="exercise-sub-prompt">Chạm vào nghĩa đúng bên dưới để ghi nhớ:</div>
        <div class="choice-options-grid" id="introOptionsGrid"></div>
      `;

      // Phát âm tự động sau 350ms
      setTimeout(() => this.audio.speak(q.hanzi), 350);

      const btnAudio = container.querySelector('#btnIntroAudio');
      const btnSlow = container.querySelector('#btnIntroAudioSlow');
      if (btnAudio) btnAudio.addEventListener('click', () => {
        this.audio.playTap();
        this.audio.speak(q.hanzi, false);
      });
      if (btnSlow) btnSlow.addEventListener('click', () => {
        this.audio.playTap();
        this.audio.speak(q.hanzi, true);
      });

      const grid = container.querySelector('#introOptionsGrid');
      const badges = ['A', 'B', 'C', 'D'];
      (q.options || []).forEach((opt, idx) => {
        const card = document.createElement('div');
        card.className = 'choice-option-card';
        card.innerHTML = `
          <div class="choice-option-badge">${badges[idx]}</div>
          <div class="choice-option-text">${opt.text}</div>
        `;
        card.addEventListener('click', () => {
          this.audio.playTap();
          container.querySelectorAll('.choice-option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.onAnswerChange(opt);
        });
        grid.appendChild(card);
      });
    }

    /* TYPE 0.5: LISTEN & SELECT WORD (AUDIO RECOGNITION TAP) */
    renderListenSelectWord(q, container) {
      container.innerHTML = `
        <span class="exercise-type-tag tag-listen-select">👂 NGHE & CHỌN TỪ ĐÚNG</span>
        <h2 class="exercise-title">${q.title || 'Nghe âm thanh và chọn chữ Hán chính xác:'}</h2>

        <div class="audio-prompt-row" style="margin: 20px 0;">
          <button type="button" class="btn-speaker-big" id="btnListenSelectNormal" style="width:72px; height:72px; font-size:32px;" title="Nghe phát âm">🔊</button>
          <button type="button" class="btn-speaker-turtle" id="btnListenSelectSlow" style="width:50px; height:50px; font-size:22px;" title="Nghe chậm 0.6x">🐢</button>
        </div>

        <div class="exercise-sub-prompt">Chạm vào từng thẻ để nghe thử và chọn chữ Hán chuẩn:</div>
        <div class="listen-word-cards-grid" id="listenWordCardsGrid"></div>
      `;

      const targetWord = q.targetWord || q.hanzi;
      setTimeout(() => this.audio.speak(targetWord), 350);

      const btnAudio = container.querySelector('#btnListenSelectNormal');
      const btnSlow = container.querySelector('#btnListenSelectSlow');
      if (btnAudio) btnAudio.addEventListener('click', () => {
        this.audio.playTap();
        this.audio.speak(targetWord, false);
      });
      if (btnSlow) btnSlow.addEventListener('click', () => {
        this.audio.playTap();
        this.audio.speak(targetWord, true);
      });

      const grid = container.querySelector('#listenWordCardsGrid');
      (q.options || []).forEach(opt => {
        const card = document.createElement('div');
        card.className = 'listen-word-card';
        card.innerHTML = `
          <div class="listen-word-card-hanzi">${opt.hanzi}</div>
          <div class="listen-word-card-pinyin">${opt.pinyin || ''}</div>
        `;
        card.addEventListener('click', () => {
          this.audio.playTap();
          this.audio.speak(opt.hanzi, false);
          grid.querySelectorAll('.listen-word-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.onAnswerChange(opt);
        });
        grid.appendChild(card);
      });
    }

    /* TYPE 1: LISTEN & TYPE PINYIN */
    renderListenPinyin(q, container) {
      container.innerHTML = `
        <span class="exercise-type-tag">🎧 NGHE & GÕ PHIÊN ÂM</span>
        <h2 class="exercise-title">${q.title}</h2>

        <div class="audio-prompt-row">
          <button type="button" class="btn-speaker-big" id="btnAudioNormal" title="Nghe phát âm chuẩn (Phím Space hoặc R)">
            🔊
          </button>
          <button type="button" class="btn-speaker-turtle" id="btnAudioSlow" title="Nghe chậm tốc độ 0.6x (Phím T)">
            🐢
          </button>
        </div>

        <div class="chinese-prompt-box">
          <div class="chinese-prompt-hanzi">${q.hanzi}</div>
          <div class="chinese-prompt-pinyin" style="color:#64748b; font-size:14px;">Nghĩa: ${q.meaning}</div>
        </div>

        <div class="pinyin-input-wrap">
          <input type="text" class="pinyin-input-field" id="pinyinInputBox" 
                 placeholder="Gõ Pinyin (ví dụ: ${q.clean || q.pinyin})..." 
                 autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
          
          <div class="pinyin-tone-bar">
            ${['ā', 'á', 'ǎ', 'à', 'ō', 'ó', 'ǒ', 'ò', 'ē', 'é', 'ě', 'è', 'ī', 'í', 'ǐ', 'ì', 'ū', 'ú', 'ǔ', 'ù', 'ǖ', 'ǘ', 'ǚ', 'ǜ'].map(t => `
              <button type="button" class="tone-accent-btn" data-accent="${t}">${t}</button>
            `).join('')}
          </div>
        </div>
      `;

      setTimeout(() => this.audio.speak(q.hanzi), 350);

      const btnNorm = container.querySelector('#btnAudioNormal');
      const btnSlow = container.querySelector('#btnAudioSlow');
      const input = container.querySelector('#pinyinInputBox');

      btnNorm.addEventListener('click', () => {
        this.audio.playTap();
        this.audio.speak(q.hanzi, false);
      });
      btnSlow.addEventListener('click', () => {
        this.audio.playTap();
        this.audio.speak(q.hanzi, true);
      });

      container.querySelectorAll('.tone-accent-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.audio.playTap();
          const acc = btn.dataset.accent;
          const start = input.selectionStart || input.value.length;
          const end = input.selectionEnd || input.value.length;
          const text = input.value;
          input.value = text.substring(0, start) + acc + text.substring(end);
          input.focus();
          input.setSelectionRange(start + acc.length, start + acc.length);
          this.onAnswerChange(input.value.trim());
        });
      });

      input.addEventListener('input', () => {
        this.onAnswerChange(input.value.trim());
      });

      setTimeout(() => input.focus(), 150);
    }

    /* TYPE 2 & 3: REARRANGE WORD BANK CHIPS */
    renderArrangeWordBank(q, container, isChineseTarget = false) {
      container.innerHTML = `
        <span class="exercise-type-tag">🧱 SẮP XẾP TỪ THÀNH CÂU</span>
        <h2 class="exercise-title">${q.title}</h2>

        ${!isChineseTarget ? `
          <div class="chinese-prompt-box">
            <div style="display:flex;align-items:center;gap:14px;">
              <button type="button" class="btn-speaker-big" id="btnSentenceAudio" style="width:50px;height:50px;font-size:22px;">🔊</button>
              <div>
                <div class="chinese-prompt-hanzi" style="font-size:26px;">${q.hanzi}</div>
                <div class="chinese-prompt-pinyin">${q.pinyin}</div>
              </div>
            </div>
          </div>
        ` : `
          <div class="chinese-prompt-box">
            <div style="font-size:18px;font-weight:800;color:#1e1b4b;">${q.vietnamese}</div>
          </div>
        `}

        <div class="word-answer-zone" id="wordAnswerZone"></div>
        <div class="word-bank-zone" id="wordBankZone"></div>
      `;

      if (!isChineseTarget) {
        setTimeout(() => this.audio.speak(q.hanzi), 350);
        const btnS = container.querySelector('#btnSentenceAudio');
        if (btnS) btnS.addEventListener('click', () => this.audio.speak(q.hanzi));
      }

      const answerZone = container.querySelector('#wordAnswerZone');
      const bankZone = container.querySelector('#wordBankZone');

      const allWords = [...q.correctChips, ...(q.distractors || [])].sort(() => 0.5 - Math.random());
      
      const chipData = allWords.map((word, idx) => ({
        id: `chip_${idx}`,
        text: word,
        isAnswered: false
      }));

      const answeredList = [];

      const renderChips = () => {
        bankZone.innerHTML = '';
        chipData.forEach(item => {
          if (item.isAnswered) {
            const placeholder = document.createElement('div');
            placeholder.className = `duo-chip-placeholder ${isChineseTarget ? 'chip-chinese' : ''}`;
            placeholder.textContent = item.text;
            bankZone.appendChild(placeholder);
          } else {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = `duo-word-chip ${isChineseTarget ? 'chip-chinese' : ''}`;
            chip.textContent = item.text;
            chip.addEventListener('click', () => {
              this.audio.playTap();
              item.isAnswered = true;
              answeredList.push(item);
              renderChips();
              renderAnswerZone();
              this.onAnswerChange(answeredList.map(c => c.text).join(' '));
            });
            bankZone.appendChild(chip);
          }
        });
      };

      const renderAnswerZone = () => {
        answerZone.innerHTML = '';
        answeredList.forEach((item, pos) => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = `duo-word-chip ${isChineseTarget ? 'chip-chinese' : ''}`;
          chip.textContent = item.text;
          chip.addEventListener('click', () => {
            this.audio.playTap();
            item.isAnswered = false;
            answeredList.splice(pos, 1);
            renderChips();
            renderAnswerZone();
            this.onAnswerChange(answeredList.map(c => c.text).join(' '));
          });
          answerZone.appendChild(chip);
        });
      };

      renderChips();
    }

    /* TYPE 4: MATCHING PAIRS (TAP MATCHING) */
    renderMatchPairs(q, container) {
      container.innerHTML = `
        <span class="exercise-type-tag">🔗 GHÉP CẶP TỪ VỰNG</span>
        <h2 class="exercise-title">${q.title}</h2>
        <div class="matching-pairs-grid" id="matchingGrid"></div>
      `;

      const grid = container.querySelector('#matchingGrid');
      const items = [];
      q.pairs.forEach((p, idx) => {
        items.push({ id: idx, type: 'zh', text: p.zh });
        items.push({ id: idx, type: 'vn', text: p.vn });
      });

      items.sort(() => 0.5 - Math.random());

      let selectedTile = null;
      let matchedCount = 0;
      const totalPairs = q.pairs.length;

      items.forEach((item) => {
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'match-pair-tile';
        tile.textContent = item.text;
        if (item.type === 'zh') tile.style.fontFamily = 'var(--font-cjk)';

        tile.addEventListener('click', () => {
          if (tile.classList.contains('matched')) return;

          this.audio.playTap();
          if (item.type === 'zh') this.audio.speak(item.text);

          if (!selectedTile) {
            selectedTile = { element: tile, data: item };
            tile.classList.add('selected');
          } else {
            if (selectedTile.element === tile) {
              tile.classList.remove('selected');
              selectedTile = null;
              return;
            }

            if (selectedTile.data.id === item.id && selectedTile.data.type !== item.type) {
              this.audio.playMatch();
              tile.classList.add('matched');
              selectedTile.element.classList.remove('selected');
              selectedTile.element.classList.add('matched');
              selectedTile = null;
              matchedCount++;

              if (matchedCount >= totalPairs) {
                this.onAnswerChange('ALL_MATCHED');
              }
            } else {
              this.audio.playIncorrect();
              tile.classList.add('mismatch');
              selectedTile.element.classList.add('mismatch');
              setTimeout(() => {
                tile.classList.remove('mismatch');
                if (selectedTile && selectedTile.element) {
                  selectedTile.element.classList.remove('mismatch', 'selected');
                }
                selectedTile = null;
              }, 400);
            }
          }
        });

        grid.appendChild(tile);
      });
    }

    /* TYPE 5: MULTIPLE CHOICE */
    renderMultipleChoice(q, container) {
      container.innerHTML = `
        <span class="exercise-type-tag">🎯 TRẮC NGHIỆM ĐÁP ÁN</span>
        <h2 class="exercise-title">${q.title}</h2>

        ${q.audioPrompt ? `
          <div class="audio-prompt-row">
            <button type="button" class="btn-speaker-big" id="btnMcAudio">🔊</button>
            <div>
              <div class="chinese-prompt-hanzi" style="font-size:28px;">${q.hanzi || ''}</div>
              <div class="chinese-prompt-pinyin">${q.pinyin || ''}</div>
            </div>
          </div>
        ` : ''}

        ${q.prompt ? `
          <div class="chinese-prompt-box">
            <div class="chinese-prompt-hanzi" style="font-size:24px;">${q.prompt}</div>
            ${q.subPrompt ? `<div class="chinese-prompt-pinyin">${q.subPrompt}</div>` : ''}
          </div>
        ` : ''}

        <div class="choice-options-grid" id="choiceOptionsGrid"></div>
      `;

      if (q.audioPrompt) {
        setTimeout(() => this.audio.speak(q.audioPrompt), 350);
        const btnA = container.querySelector('#btnMcAudio');
        if (btnA) btnA.addEventListener('click', () => this.audio.speak(q.audioPrompt));
      }

      const grid = container.querySelector('#choiceOptionsGrid');
      const badges = ['A', 'B', 'C', 'D'];

      q.options.forEach((opt, idx) => {
        const card = document.createElement('div');
        card.className = 'choice-option-card';
        card.innerHTML = `
          <div class="choice-option-badge">${badges[idx]}</div>
          <div class="choice-option-text">${opt.text}</div>
        `;

        card.addEventListener('click', () => {
          this.audio.playTap();
          container.querySelectorAll('.choice-option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.onAnswerChange(opt);
        });

        grid.appendChild(card);
      });
    }

    /* ========================================================================
       ANSWER CHECKING & FEEDBACK DRAWER
       ======================================================================== */
    onAnswerChange(val) {
      this.currentSelectedAnswer = val;
      if (val && String(val).length > 0) {
        this.dom.btnCheck.disabled = false;
        this.dom.btnCheck.classList.remove('duo-btn-disabled');
      } else {
        this.dom.btnCheck.disabled = true;
        this.dom.btnCheck.classList.add('duo-btn-disabled');
      }
    }

    checkAnswer() {
      if (this.isAnswerChecked) {
        this.currentIndex++;
        this.updateProgress();
        this.renderCurrentQuestion();
        return;
      }

      const q = this.questions[this.currentIndex];
      let isCorrect = false;
      let targetDisplay = '';

      if (q.type === 'listen_pinyin') {
        const userVal = String(this.currentSelectedAnswer || '').toLowerCase().trim();
        const cleanTarget = String(q.clean || q.pinyin).toLowerCase().trim();
        const pinyinTarget = String(q.pinyin).toLowerCase().trim();

        const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ü/g, 'v').replace(/\s+/g, '');
        const normUser = normalize(userVal);
        const normClean = normalize(cleanTarget);
        const normPinyin = normalize(pinyinTarget);

        isCorrect = normUser && (normUser === normClean || normUser === normPinyin || userVal === pinyinTarget);
        targetDisplay = `${q.pinyin} (${q.clean}) - ${q.meaning}`;
      } else if (q.type === 'arrange_vn') {
        const targetSentence = q.correctChips.join(' ').toLowerCase().trim();
        const userSentence = String(this.currentSelectedAnswer || '').toLowerCase().trim();
        isCorrect = userSentence === targetSentence;
        targetDisplay = q.meaning;
      } else if (q.type === 'arrange_zh') {
        const targetSentence = q.correctChips.join('').replace(/\s+/g, '');
        const userSentence = String(this.currentSelectedAnswer || '').replace(/\s+/g, '');
        isCorrect = userSentence === targetSentence;
        targetDisplay = q.hanziSentence;
      } else if (q.type === 'match_pairs') {
        isCorrect = this.currentSelectedAnswer === 'ALL_MATCHED';
        targetDisplay = 'Đã ghép hoàn hảo!';
      } else if (q.type === 'multiple_choice' || q.type === 'introduce_word' || q.type === 'listen_select_word') {
        isCorrect = !!(this.currentSelectedAnswer && this.currentSelectedAnswer.correct);
        const correctOpt = q.options ? q.options.find(o => o.correct) : null;
        targetDisplay = correctOpt ? (correctOpt.text || `${correctOpt.hanzi} (${correctOpt.pinyin || ''})`) : (q.meaning || '');
      }

      this.isAnswerChecked = true;
      this.showFeedback(isCorrect, targetDisplay, q);
    }

    showFeedback(isCorrect, targetAnswer, q) {
      const bottom = this.dom.bottomBar;
      const feedback = this.dom.feedbackArea;
      const btn = this.dom.btnCheck;

      if (isCorrect) {
        this.correctCount++;
        this.consecutiveCorrect++;
        this.audio.playCorrect();

        // 1. Tính toán điểm kinh nghiệm theo combo
        const isCombo = this.consecutiveCorrect >= 3;
        const pts = isCombo ? 15 : 10;
        this.lessonXpEarned += pts;
        this.state.xp += pts;

        // 2. Cập nhật nhãn XP trực tiếp trên Runner bar & Hub
        const rxp = document.getElementById('runnerLessonXpCount');
        if (rxp) rxp.textContent = `+${this.lessonXpEarned}`;
        const hubXp = document.getElementById('hubXpCount');
        if (hubXp) hubXp.textContent = this.state.xp;

        // 3. Hiệu ứng viên kẹo nổi +XP bay lên
        this.spawnFloatingXp(pts, isCombo);

        // 4. Lưu chữ Hán đã làm chủ vào Database
        if (q && q.hanzi && q.hanzi.length <= 6) {
          this.recordMasteredWord(q.hanzi);
        }

        // 5. Lưu vào Database (IndexedDB PinyinPopDB + Cloud DB sync debounced)
        this.saveState(false);

        bottom.className = 'runner-bottom-bar feedback-correct';
        feedback.innerHTML = `
          <div class="feedback-icon-bubble">✓</div>
          <div class="feedback-texts">
            <span class="feedback-status-title">Xuất sắc! +${pts} XP ${isCombo ? '🔥 Combo!' : '🎉'}</span>
            <span class="feedback-target-answer">Chính xác tuyệt đối!</span>
          </div>
        `;
        btn.textContent = 'TIẾP TỤC ➔';
        btn.className = 'duo-btn duo-btn-green btn-check-main';
        btn.disabled = false;
      } else {
        this.consecutiveCorrect = 0;
        this.hearts--;
        this.updateHeartsDisplay();
        this.audio.playIncorrect();

        if (this.dom.heartsBox) {
          this.dom.heartsBox.classList.add('heart-damage-shake');
          setTimeout(() => this.dom.heartsBox.classList.remove('heart-damage-shake'), 600);
        }

        this.mistakesQueue.push(q);

        // Lưu trạng thái tiến trình câu làm
        this.saveState(false);

        bottom.className = 'runner-bottom-bar feedback-incorrect';
        feedback.innerHTML = `
          <div class="feedback-icon-bubble">✕</div>
          <div class="feedback-texts">
            <span class="feedback-status-title">Chưa chính xác 🥺</span>
            <span class="feedback-target-answer">Đáp án đúng: <strong>${targetAnswer}</strong></span>
          </div>
        `;
        btn.textContent = 'ĐÃ HIỂU ➔';
        btn.className = 'duo-btn duo-btn-red btn-check-main';
        btn.disabled = false;
      }
    }

    resetBottomBar() {
      const bottom = this.dom.bottomBar;
      const feedback = this.dom.feedbackArea;
      const btn = this.dom.btnCheck;

      bottom.className = 'runner-bottom-bar';
      feedback.innerHTML = '';
      btn.textContent = 'KIỂM TRA';
      btn.className = 'duo-btn duo-btn-green duo-btn-disabled btn-check-main';
      btn.disabled = true;
    }

    /* ========================================================================
       LESSON COMPLETE & REWARD
       ======================================================================== */
    finishLesson() {
      this.audio.playFanfare();
      const durationSec = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
      const accuracy = Math.round((this.correctCount / Math.max(1, this.currentIndex)) * 100);
      
      // Thưởng bonus hoàn thành: 50 XP nếu giữ trọn 5 tim (hoàn hảo), 30 XP thông thường
      const bonusXp = this.hearts === 5 ? 50 : 30;
      this.lessonXpEarned += bonusXp;
      this.state.xp += bonusXp;

      // Cập nhật chuỗi Streak, Daily Quests & đơn vị bài hoàn thành
      this.updateStudyStreak();
      this.updateDailyQuestProgress();
      if (this.currentUnit) {
        this.state.completedUnits[this.currentUnit.id] = true;
      }

      // Lưu cưỡng bức và đồng bộ ngay lập tức 2 chiều lên Cloud Database (Firebase / Google Sheets / Supabase)
      this.saveState(true);

      // Cập nhật giao diện Hub
      const hubXp = document.getElementById('hubXpCount');
      if (hubXp) hubXp.textContent = this.state.xp;
      const streakEl = document.getElementById('hubStreakCount');
      if (streakEl) streakEl.textContent = this.state.studyStreak ? this.state.studyStreak.count || 1 : 1;

      this.launchConfetti();

      const modal = this.dom.celebModal;
      if (modal) {
        modal.querySelector('#celebXpVal').textContent = `+${this.lessonXpEarned}`;
        modal.querySelector('#celebAccVal').textContent = `${accuracy}%`;
        modal.querySelector('#celebTimeVal').textContent = `${durationSec}s`;
        modal.style.display = 'flex';
      }
    }

    launchConfetti() {
      const canvas = document.getElementById('confettiCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = ['#58cc02', '#1cb0f6', '#ffc800', '#ff4b4b', '#ce82ff', '#ff9600'];
      for (let i = 0; i < 90; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          r: 5 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 16,
          vy: -6 - Math.random() * 14,
          gravity: 0.35,
          alpha: 1
        });
      }

      let frame = 0;
      function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.alpha -= 0.009;
          if (p.alpha > 0) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1;
        frame++;
        if (frame < 120) requestAnimationFrame(render);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      render();
    }

    showOutOfHeartsModal() {
      if (this.dom.outOfHeartsModal) {
        this.dom.outOfHeartsModal.style.display = 'flex';
      }
    }

    refillHeartsAndContinue() {
      this.hearts = 5;
      this.updateHeartsDisplay();
      if (this.dom.outOfHeartsModal) {
        this.dom.outOfHeartsModal.style.display = 'none';
      }
    }

    quitLesson() {
      if (this.dom.quitModal) this.dom.quitModal.style.display = 'none';
      this.dom.runnerView.style.display = 'none';
      this.dom.hubView.style.display = 'flex';
      window.scrollTo(0, 0);
      this.saveState(true);
      this.renderHub();
    }

    /* ========================================================================
       EVENTS & KEYBOARD SHORTCUTS
       ======================================================================== */
    initEvents() {
      // Mode Switch: Themes vs Decks
      if (this.dom.btnModeThemes) {
        this.dom.btnModeThemes.addEventListener('click', () => {
          this.audio.playTap();
          this.activeMode = 'themes';
          this.dom.btnModeThemes.classList.add('active');
          this.dom.btnModeDecks.classList.remove('active');
          this.renderHub();
        });
      }
      if (this.dom.btnModeDecks) {
        this.dom.btnModeDecks.addEventListener('click', () => {
          this.audio.playTap();
          this.activeMode = 'decks';
          this.dom.btnModeDecks.classList.add('active');
          this.dom.btnModeThemes.classList.remove('active');
          this.renderHub();
        });
      }

      // Search Bar Input
      if (this.dom.searchInput) {
        this.dom.searchInput.addEventListener('input', (e) => {
          this.searchKeyword = e.target.value;
          this.renderHub();
        });
      }

      // Thematic Filter Buttons
      const themeFilterBtns = document.querySelectorAll('#themeFilterBar .hub-filter-btn');
      themeFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.audio.playTap();
          themeFilterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.themeFilter = btn.dataset.filter;
          this.renderThematicUnits();
        });
      });

      // Deck HSK Level Buttons
      const deckFilterBtns = document.querySelectorAll('#deckFilterBar .hub-filter-btn');
      deckFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.audio.playTap();
          deckFilterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.deckHskLevel = parseInt(btn.dataset.deckHsk, 10) || 1;
          this.renderHskDecks();
        });
      });

      // Runner Check Button
      this.dom.btnCheck.addEventListener('click', () => {
        this.checkAnswer();
      });

      // Skip Button
      this.dom.btnSkip.addEventListener('click', () => {
        this.audio.playTap();
        this.currentSelectedAnswer = 'SKIPPED';
        this.checkAnswer();
      });

      // Close Runner
      this.dom.btnCloseRunner.addEventListener('click', () => {
        this.audio.playTap();
        if (this.dom.quitModal) this.dom.quitModal.style.display = 'flex';
      });

      // Quit Modal Buttons
      const btnConfirmQuit = document.getElementById('btnQuitConfirm');
      const btnCancelQuit = document.getElementById('btnQuitCancel');
      if (btnConfirmQuit) btnConfirmQuit.addEventListener('click', () => this.quitLesson());
      if (btnCancelQuit) btnCancelQuit.addEventListener('click', () => {
        this.audio.playTap();
        this.dom.quitModal.style.display = 'none';
      });

      // Out of Hearts Buttons
      const btnRefill = document.getElementById('btnRefillHearts');
      const btnExitHearts = document.getElementById('btnExitNoHearts');
      if (btnRefill) btnRefill.addEventListener('click', () => {
        this.audio.playTap();
        this.refillHeartsAndContinue();
      });
      if (btnExitHearts) btnExitHearts.addEventListener('click', () => this.quitLesson());

      // Celebration Buttons
      const btnCelebDone = document.getElementById('btnCelebContinue');
      if (btnCelebDone) btnCelebDone.addEventListener('click', () => {
        this.audio.playTap();
        this.dom.celebModal.style.display = 'none';
        this.quitLesson();
      });

      // Global Keyboard Shortcuts
      window.addEventListener('keydown', (e) => {
        if (this.dom.runnerView.style.display === 'flex') {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (!this.dom.btnCheck.disabled) {
              this.checkAnswer();
            }
          } else if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
            const cards = this.dom.exerciseCanvas.querySelectorAll('.choice-option-card');
            const listenCards = this.dom.exerciseCanvas.querySelectorAll('.listen-word-card');
            const idx = parseInt(e.key, 10) - 1;
            if (cards[idx]) cards[idx].click();
            else if (listenCards[idx]) listenCards[idx].click();
          } else if (e.key.toLowerCase() === 'r' && (e.ctrlKey || e.altKey)) {
            e.preventDefault();
            const btnA = this.dom.exerciseCanvas.querySelector('#btnIntroAudio') || this.dom.exerciseCanvas.querySelector('#btnListenSelectNormal') || this.dom.exerciseCanvas.querySelector('#btnAudioNormal') || this.dom.exerciseCanvas.querySelector('#btnSentenceAudio') || this.dom.exerciseCanvas.querySelector('#btnMcAudio');
            if (btnA) btnA.click();
          } else if (e.key.toLowerCase() === 't' && (e.ctrlKey || e.altKey)) {
            e.preventDefault();
            const btnT = this.dom.exerciseCanvas.querySelector('#btnIntroAudioSlow') || this.dom.exerciseCanvas.querySelector('#btnListenSelectSlow') || this.dom.exerciseCanvas.querySelector('#btnAudioSlow');
            if (btnT) btnT.click();
          }
        }
      });
    }

    initBgCanvas() {
      const canvas = document.getElementById('duoBgCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let w = canvas.width = window.innerWidth;
      let h = canvas.height = window.innerHeight;

      window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      });

      const bubbles = [];
      for (let i = 0; i < 25; i++) {
        bubbles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 10 + Math.random() * 25,
          speed: 10 + Math.random() * 20,
          color: 'rgba(88, 204, 2, 0.08)'
        });
      }

      function draw() {
        ctx.clearRect(0, 0, w, h);
        bubbles.forEach(b => {
          b.y -= b.speed * 0.016;
          if (b.y < -30) {
            b.y = h + 20;
            b.x = Math.random() * w;
          }
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.fill();
        });
        requestAnimationFrame(draw);
      }
      draw();
    }
  }

  // Mount Application
  window.addEventListener('DOMContentLoaded', () => {
    window.duoLessonApp = new DuolingoLessonApp();
  });

})();
