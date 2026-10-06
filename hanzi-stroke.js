/**
 * HANZI STROKE MASTER (TẬP VIẾT CHỮ HÁN THEO BÚT THUẬN)
 * Fully interactive calligraphy canvas, stroke-order animator, quiz engine,
 * HSK 1-6 word explorer, and step-by-step stroke breakdown.
 */

(function() {
  'use strict';

  // =========================================================================
  // 1. AUDIO SYNTHESIZER (WEB AUDIO API & TTS)
  // =========================================================================
  class HanziAudioEngine {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playCorrectStroke() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }

    playMistake() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.16);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    playFanfare() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + i * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    }

    speak(text) {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.lang === 'zh-CN' || v.lang.startsWith('zh'));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  }

  // =========================================================================
  // 2. BACKGROUND AMBIENT CANVAS
  // =========================================================================
  function initAmbientCanvas() {
    const canvas = document.getElementById('hsBgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = [
      'rgba(236, 72, 153, 0.12)',
      'rgba(139, 92, 246, 0.12)',
      'rgba(59, 130, 246, 0.10)',
      'rgba(245, 158, 11, 0.10)'
    ];

    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 12 + Math.random() * 24,
        speedY: 0.3 + Math.random() * 0.7,
        speedX: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function render() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y + p.r < 0) {
          p.y = h + p.r;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(render);
    }
    render();
  }

  // =========================================================================
  // 3. HANZI STROKE APP CONTROLLER
  // =========================================================================
  class HanziStrokeApp {
    constructor() {
      this.audio = new HanziAudioEngine();
      this.writer = null;
      this.currentWord = null;
      this.currentCharIndex = 0;
      this.currentSpeed = 1.0;
      this.outlineVisible = true; // Faint stroke outline always ON by default!
      this.breakdownRevealedAll = false; // Initially hide breakdown cards until user draws them correctly
      this.currentCorrectStrokeIndex = 0;
      this.isQuizMode = false;

      // Telemetry stats
      this.stats = {
        completed: parseInt(localStorage.getItem('hs_completed_chars') || '0', 10),
        correctStrokes: parseInt(localStorage.getItem('hs_correct_strokes') || '0', 10),
        totalAttempts: parseInt(localStorage.getItem('hs_total_attempts') || '0', 10),
        streak: parseInt(localStorage.getItem('hs_current_streak') || '0', 10)
      };

      // Vocab dataset
      this.allWords = [];
      this.filteredWords = [];
      this.currentFilterLevel = 'all';
      this.searchQuery = '';
      this.renderedCount = 0;
      this.chunkSize = 60;

      this.dom = {};
    }

    init() {
      this.cacheDom();
      this.bindEvents();
      this.initVocabDataset();
      this.updateStatsUI();

      // Listen for cross-device cloud progress synchronization
      window.addEventListener('cloud-progress-updated', () => {
        this.stats.completed = parseInt(localStorage.getItem('hs_completed_chars') || '0', 10);
        this.stats.correctStrokes = parseInt(localStorage.getItem('hs_correct_strokes') || '0', 10);
        this.stats.totalAttempts = parseInt(localStorage.getItem('hs_total_attempts') || '0', 10);
        this.stats.streak = parseInt(localStorage.getItem('hs_current_streak') || '0', 10);
        this.updateStatsUI();
      });

      // Check URL parameters for specific character or word: ?char=... or ?word=...
      const urlParams = new URLSearchParams(window.location.search);
      const requestedChar = urlParams.get('char') || urlParams.get('word');

      if (requestedChar) {
        const found = this.allWords.find(w => w.hanzi === requestedChar || w.hanzi.includes(requestedChar));
        if (found) {
          this.loadWord(found);
          return;
        } else {
          this.loadCustomWord(requestedChar);
          return;
        }
      }

      // Default load: Pick a fresh random word from the 5,000 vocabulary dataset on each visit!
      if (this.filteredWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.filteredWords.length);
        this.loadWord(this.filteredWords[randomIndex]);
      } else {
        this.loadCustomWord('学', 'xué', 'Hán Việt: HỌC', 'Học tập, nghiên cứu', 1);
      }
    }

    cacheDom() {
      this.dom = {
        audioToggle: document.getElementById('btnAudioToggle'),
        lblAudioStatus: document.getElementById('lblAudioStatus'),
        vocabCount: document.getElementById('lblVocabCount'),
        customInput: document.getElementById('inputCustomChar'),
        btnCustom: document.getElementById('btnCustomChar'),
        searchInput: document.getElementById('inputSearchVocab'),
        btnClearSearch: document.getElementById('btnClearSearch'),
        hskChips: document.getElementById('hskChipsContainer'),
        btnRandom: document.getElementById('btnRandomWord'),
        wordList: document.getElementById('hsWordListContainer'),

        // Target display
        targetHanziLarge: document.getElementById('targetHanziLarge'),
        targetPinyin: document.getElementById('targetPinyin'),
        targetHanViet: document.getElementById('targetHanViet'),
        targetHskLevel: document.getElementById('targetHskLevel'),
        targetMeaningVn: document.getElementById('targetMeaningVn'),
        btnSpeakTarget: document.getElementById('btnSpeakTarget'),
        charSwitcherWrap: document.getElementById('charSwitcherWrap'),

        // Canvas & Prompts
        promptBanner: document.getElementById('hsPromptBanner'),
        gridBox: document.getElementById('gridBoxContainer'),
        writerTarget: document.getElementById('hanziWriterTarget'),
        btnAnimate: document.getElementById('btnAnimateChar'),
        btnQuiz: document.getElementById('btnStartQuiz'),
        btnHint: document.getElementById('btnStrokeHint'),
        btnOutline: document.getElementById('btnToggleOutline'),
        btnReset: document.getElementById('btnResetCanvas'),
        speedBtns: document.querySelectorAll('.hs-speed-btn'),

        // Breakdown track
        breakdownTrack: document.getElementById('strokeBreakdownTrack'),
        lblTotalStrokes: document.getElementById('lblTotalStrokes'),
        btnToggleBreakdownReveal: document.getElementById('btnToggleBreakdownReveal'),

        // Stats
        statCompleted: document.getElementById('statCompletedChars'),
        statAccuracy: document.getElementById('statStrokeAccuracy'),
        statStreak: document.getElementById('statCurrentStreak'),

        // Modal
        modal: document.getElementById('completionModal'),
        modalChar: document.getElementById('modalCharPreview'),
        modalStars: document.getElementById('modalStars'),
        modalDesc: document.getElementById('modalDesc'),
        btnModalRetry: document.getElementById('btnModalRetry'),
        btnModalNext: document.getElementById('btnModalNext')
      };
    }

    bindEvents() {
      // Audio toggle
      this.dom.audioToggle.addEventListener('click', () => {
        const enabled = this.audio.toggle();
        this.dom.lblAudioStatus.textContent = enabled ? 'ÂM THANH: BẬT' : 'ÂM THANH: TẮT';
        this.dom.audioToggle.style.opacity = enabled ? '1' : '0.6';
      });

      // Speak target
      this.dom.btnSpeakTarget.addEventListener('click', () => {
        if (this.currentWord) {
          this.audio.speak(this.currentWord.hanzi);
        }
      });

      // Custom character submit
      const handleCustomSubmit = () => {
        const val = this.dom.customInput.value.trim();
        if (!val) return;
        this.loadCustomWord(val);
      };
      this.dom.btnCustom.addEventListener('click', handleCustomSubmit);
      this.dom.customInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleCustomSubmit();
      });

      // Search
      this.dom.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.dom.btnClearSearch.classList.toggle('visible', !!this.searchQuery);
        this.filterAndRenderWordList();
      });

      this.dom.btnClearSearch.addEventListener('click', () => {
        this.dom.searchInput.value = '';
        this.searchQuery = '';
        this.dom.btnClearSearch.classList.remove('visible');
        this.filterAndRenderWordList();
      });

      // HSK Level filter tabs
      this.dom.hskChips.addEventListener('click', (e) => {
        const btn = e.target.closest('.hs-hsk-chip');
        if (!btn) return;
        this.dom.hskChips.querySelectorAll('.hs-hsk-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilterLevel = btn.dataset.level;
        this.filterAndRenderWordList();
      });

      // Random word
      this.dom.btnRandom.addEventListener('click', () => {
        if (this.filteredWords.length === 0) return;
        const rand = this.filteredWords[Math.floor(Math.random() * this.filteredWords.length)];
        this.loadWord(rand);
      });

      // Canvas Action Buttons
      this.dom.btnAnimate.addEventListener('click', () => this.animateCurrentChar());
      this.dom.btnQuiz.addEventListener('click', () => this.startQuizMode());
      this.dom.btnHint.addEventListener('click', () => this.hintNextStroke());
      this.dom.btnOutline.addEventListener('click', () => this.toggleOutline());
      this.dom.btnReset.addEventListener('click', () => this.resetCanvas());

      // Breakdown reveal toggle
      if (this.dom.btnToggleBreakdownReveal) {
        this.dom.btnToggleBreakdownReveal.addEventListener('click', () => this.toggleBreakdownReveal());
      }

      // Speed Buttons
      this.dom.speedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.dom.speedBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentSpeed = parseFloat(btn.dataset.speed) || 1.0;
          if (this.writer) {
            // Re-instantiate writer to apply new speed
            this.setupHanziWriter(this.getCurrentChar());
          }
        });
      });

      // Modal Buttons
      this.dom.btnModalRetry.addEventListener('click', () => {
        this.dom.modal.classList.remove('active');
        this.startQuizMode();
      });

      this.dom.btnModalNext.addEventListener('click', () => {
        this.dom.modal.classList.remove('active');
        // If compound word has another character, go to next character
        if (this.currentWord && this.currentCharIndex < this.currentWord.hanzi.length - 1) {
          this.switchChar(this.currentCharIndex + 1);
        } else {
          // Otherwise pick next random or next in list
          if (this.filteredWords.length > 0) {
            const curIdx = this.filteredWords.findIndex(w => w === this.currentWord);
            const nextWord = this.filteredWords[(curIdx + 1) % this.filteredWords.length];
            this.loadWord(nextWord);
          }
        }
      });

      // Delegated click on word item or load more button
      this.dom.wordList.addEventListener('click', (e) => {
        const item = e.target.closest('.hs-word-item');
        if (item) {
          const hz = item.dataset.hanzi;
          const word = this.filteredWords.find(w => w.hanzi === hz) || this.allWords.find(w => w.hanzi === hz);
          if (word) {
            this.loadWord(word);
          }
          return;
        }

        const btnLoadMore = e.target.closest('#btnLoadMoreWords');
        if (btnLoadMore) {
          this.renderMoreWords();
        }
      });

      // Infinite scroll on word list
      this.dom.wordList.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = this.dom.wordList;
        if (scrollTop + clientHeight >= scrollHeight - 120) {
          this.renderMoreWords();
        }
      });

      // Responsive redraw on mobile orientation change
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (this.currentWord) {
            this.setupHanziWriter(this.getCurrentChar());
          }
        }, 250);
      });
    }

    // =======================================================================
    // VOCABULARY DATASET & LIST RENDERING
    // =======================================================================
    initVocabDataset() {
      if (Array.isArray(window.CHINESE_WORDS_5000) && window.CHINESE_WORDS_5000.length > 0) {
        this.allWords = window.CHINESE_WORDS_5000;
      } else if (Array.isArray(window.WORDS) && window.WORDS.length > 0) {
        this.allWords = window.WORDS;
      } else {
        // Fallback default set
        this.allWords = [
          { hanzi: '学', pinyin: 'xué', meaning_vn: 'Học tập', level: 1, hanviet: 'HỌC' },
          { hanzi: '好', pinyin: 'hǎo', meaning_vn: 'Tốt, đẹp, hay', level: 1, hanviet: 'HẢO' },
          { hanzi: '你', pinyin: 'nǐ', meaning_vn: 'Bạn, anh, chị', level: 1, hanviet: 'NHĨ' },
          { hanzi: '中国', pinyin: 'zhōng guó', meaning_vn: 'Trung Quốc', level: 1, hanviet: 'TRUNG QUỐC' },
          { hanzi: '爱', pinyin: 'ài', meaning_vn: 'Yêu, tình yêu', level: 1, hanviet: 'ÁI' }
        ];
      }

      this.dom.vocabCount.textContent = `${this.allWords.length.toLocaleString('vi-VN')} từ`;
      this.filterAndRenderWordList();
    }

    filterAndRenderWordList() {
      let list = this.allWords;

      // Filter by HSK Level
      if (this.currentFilterLevel !== 'all') {
        const lvl = parseInt(this.currentFilterLevel, 10);
        list = list.filter(w => (w.level || w.hsk || 1) === lvl);
      }

      // Filter by Search Query
      if (this.searchQuery) {
        const q = this.searchQuery;
        list = list.filter(w => {
          const hz = (w.hanzi || '').toLowerCase();
          const py = (w.pinyin || '').toLowerCase();
          const vn = (w.meaning_vn || w.meaning || '').toLowerCase();
          const hv = (w.hanviet || '').toLowerCase();
          return hz.includes(q) || py.includes(q) || vn.includes(q) || hv.includes(q);
        });
      }

      this.filteredWords = list;
      this.renderedCount = 0;
      this.dom.wordList.innerHTML = '';

      // Update badge count
      if (this.currentFilterLevel === 'all' && !this.searchQuery) {
        this.dom.vocabCount.textContent = `${this.allWords.length.toLocaleString('vi-VN')} từ`;
      } else {
        this.dom.vocabCount.textContent = `${this.filteredWords.length.toLocaleString('vi-VN')} từ`;
      }

      if (this.filteredWords.length === 0) {
        this.dom.wordList.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 24px 0; font-size: 13px;">Không tìm thấy từ nào phù hợp!</div>';
        return;
      }

      // Render initial chunk
      this.renderMoreWords();
    }

    renderMoreWords() {
      if (this.renderedCount >= this.filteredWords.length) return;

      // Remove existing list footer if present
      const existingFooter = document.getElementById('hsListFooter');
      if (existingFooter) existingFooter.remove();

      const nextChunk = this.filteredWords.slice(this.renderedCount, this.renderedCount + this.chunkSize);
      this.renderedCount += nextChunk.length;

      const fragment = document.createDocumentFragment();
      nextChunk.forEach(w => {
        const isActive = this.currentWord && this.currentWord.hanzi === w.hanzi;
        const div = document.createElement('div');
        div.className = `hs-word-item ${isActive ? 'active' : ''}`;
        div.dataset.hanzi = w.hanzi;
        div.innerHTML = `
          <div class="hs-word-hanzi-col">
            <span class="hs-item-hanzi">${w.hanzi}</span>
            <span class="hs-item-pinyin">${w.pinyin || ''}</span>
          </div>
          <div class="hs-item-meaning">${w.meaning_vn || w.meaning || ''}</div>
        `;
        fragment.appendChild(div);
      });

      this.dom.wordList.appendChild(fragment);

      // Add footer status & manual load more button
      const footer = document.createElement('div');
      footer.id = 'hsListFooter';
      footer.style.cssText = 'text-align: center; padding: 12px 0 8px; font-size: 11px; font-weight: 700; color: #64748b;';

      if (this.renderedCount < this.filteredWords.length) {
        const remaining = this.filteredWords.length - this.renderedCount;
        footer.innerHTML = `
          <button id="btnLoadMoreWords" style="background: #fdf2f8; border: 1.5px solid #fbcfe8; color: #db2777; padding: 6px 16px; border-radius: 999px; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.15s ease;">
            ⬇️ Tải thêm từ (còn ${remaining.toLocaleString('vi-VN')} từ)
          </button>
          <div style="font-size: 10px; margin-top: 4px; color: #94a3b8;">Đang hiển thị ${this.renderedCount} / ${this.filteredWords.length.toLocaleString('vi-VN')} từ</div>
        `;
      } else {
        footer.innerHTML = `✨ Đã hiển thị trọn vẹn ${this.filteredWords.length.toLocaleString('vi-VN')} từ`;
      }

      this.dom.wordList.appendChild(footer);
    }

    // =======================================================================
    // WORD LOADING & MULTI-CHAR HANDLING
    // =======================================================================
    loadWord(word) {
      this.currentWord = word;
      this.currentCharIndex = 0;
      this.updateWordHeaderUI();
      this.setupHanziWriter(this.getCurrentChar());
      this.updateActiveListItem();
    }

    loadCustomWord(text, pinyin = '', hanviet = '', meaning = '', level = 1) {
      const cleanHanzi = text.replace(/[^\u4e00-\u9fa5]/g, '') || text[0] || '学';
      this.currentWord = {
        hanzi: cleanHanzi,
        pinyin: pinyin || 'zhōng wén',
        hanviet: hanviet || 'Hán tự tự chọn',
        meaning_vn: meaning || 'Chữ Hán tự chọn',
        level: level
      };
      this.currentCharIndex = 0;
      this.updateWordHeaderUI();
      this.setupHanziWriter(this.getCurrentChar());
    }

    getCurrentChar() {
      if (!this.currentWord || !this.currentWord.hanzi) return '学';
      return this.currentWord.hanzi[this.currentCharIndex] || this.currentWord.hanzi[0];
    }

    switchChar(index) {
      if (!this.currentWord || index < 0 || index >= this.currentWord.hanzi.length) return;
      this.currentCharIndex = index;
      this.updateCharSwitcherUI();
      this.setupHanziWriter(this.getCurrentChar());
    }

    updateWordHeaderUI() {
      const w = this.currentWord;
      if (!w) return;

      this.dom.targetHanziLarge.textContent = w.hanzi;
      this.dom.targetPinyin.textContent = w.pinyin || '';
      this.dom.targetHanViet.textContent = w.hanviet ? `Hán Việt: ${w.hanviet}` : `Hán tự (${w.hanzi.length} chữ)`;
      this.dom.targetHskLevel.textContent = `HSK ${w.level || w.hsk || 1}`;
      this.dom.targetMeaningVn.textContent = w.meaning_vn || w.meaning || '';

      // Multi-char tabs
      if (w.hanzi.length > 1) {
        this.dom.charSwitcherWrap.style.display = 'flex';
        this.updateCharSwitcherUI();
      } else {
        this.dom.charSwitcherWrap.style.display = 'none';
      }
    }

    updateCharSwitcherUI() {
      const w = this.currentWord;
      if (!w || w.hanzi.length <= 1) return;

      let html = '';
      for (let i = 0; i < w.hanzi.length; i++) {
        const char = w.hanzi[i];
        const isActive = (i === this.currentCharIndex);
        html += `<button class="hs-char-tab ${isActive ? 'active' : ''}" data-index="${i}">${char}</button>`;
      }
      this.dom.charSwitcherWrap.innerHTML = html;

      this.dom.charSwitcherWrap.querySelectorAll('.hs-char-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const idx = parseInt(tab.dataset.index, 10);
          this.switchChar(idx);
        });
      });
    }

    updateActiveListItem() {
      if (!this.currentWord) return;
      this.dom.wordList.querySelectorAll('.hs-word-item').forEach(item => {
        const isCur = item.dataset.hanzi === this.currentWord.hanzi;
        item.classList.toggle('active', isCur);
        if (isCur) {
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
    }

    // =======================================================================
    // HANZI WRITER INITIALIZATION & BREAKDOWN
    // =======================================================================
    setupHanziWriter(char) {
      if (!window.HanziWriter) {
        this.setPrompt('Lỗi tải thư viện HanziWriter! Vui lòng làm mới trang.', 'error');
        return;
      }

      // Clear existing canvas
      this.dom.writerTarget.innerHTML = '';
      this.isQuizMode = false;
      this.currentCorrectStrokeIndex = 0;
      this.dom.btnQuiz.classList.remove('active');

      // Compute responsive canvas dimension
      let targetSize = 320;
      if (this.dom.gridBox && this.dom.gridBox.parentElement) {
        const parentW = this.dom.gridBox.parentElement.getBoundingClientRect().width;
        const availableW = Math.floor(parentW - 20);
        targetSize = Math.min(320, Math.max(220, availableW));
        this.dom.gridBox.style.width = `${targetSize}px`;
        this.dom.gridBox.style.height = `${targetSize}px`;
      }

      try {
        this.writer = HanziWriter.create(this.dom.writerTarget, char, {
          width: targetSize,
          height: targetSize,
          padding: Math.round(targetSize * 0.056),
          showOutline: this.outlineVisible,
          strokeAnimationSpeed: this.currentSpeed,
          delayBetweenStrokes: Math.max(100, 200 / this.currentSpeed),
          strokeColor: '#1e1b4b',
          radicalColor: '#ec4899',
          highlightColor: '#10b981',
          drawingColor: '#e11d48',
          drawingWidth: Math.max(10, Math.round(targetSize * 0.042)),
          showCharacter: false,
          showHintAfterMisses: 2,
          markStrokeCorrectAfterMisses: 3
        });

        // Fetch stroke data for breakdown track using official HanziWriter API
        const targetChar = char;
        HanziWriter.loadCharacterData(targetChar).then(data => {
          if (this.getCurrentChar() !== targetChar) return;
          this.renderStrokeBreakdown(data);
        }).catch(err => {
          console.warn('Could not load stroke breakdown for:', targetChar, err);
          this.dom.lblTotalStrokes.textContent = 'Bút thuận tiêu chuẩn';
          this.dom.breakdownTrack.innerHTML = '<span style="font-size: 11px; color: #94a3b8; padding: 10px;">Chưa có dữ liệu phân rã SVG chi tiết cho chữ này</span>';
        });

        // ACTIVATE WRITING MODE DIRECTLY BY DEFAULT!
        // The user can write right away with mouse/finger/stylus without watching animation first!
        this.startQuizMode();

      } catch (err) {
        console.error('HanziWriter setup error:', err);
        this.setPrompt('Không thể khởi tạo chữ này. Thử chữ khác nhé!', 'error');
      }
    }

    renderStrokeBreakdown(data) {
      if (!data || !data.strokes || data.strokes.length === 0) {
        this.dom.lblTotalStrokes.textContent = 'Bút thuận tiêu chuẩn';
        this.dom.breakdownTrack.innerHTML = '<span style="font-size: 11px; color: #94a3b8; padding: 10px;">Đang cập nhật dữ liệu nét...</span>';
        return;
      }

      const total = data.strokes.length;
      this.dom.lblTotalStrokes.textContent = `Tổng: ${total} nét`;

      // Use HanziWriter official glyph coordinate scaling transform
      const transformStr = (window.HanziWriter && typeof HanziWriter.getScalingTransform === 'function')
        ? HanziWriter.getScalingTransform(1024, 1024, 60).transform
        : 'translate(60, 847) scale(0.88, -0.88)';

      let html = '';
      for (let i = 0; i < total; i++) {
        // Build mini SVG showing strokes up to index i
        let pathsHtml = '';
        for (let j = 0; j <= i; j++) {
          const isLatest = (j === i);
          const strokeFill = isLatest ? '#ec4899' : '#cbd5e1';
          pathsHtml += `<path d="${data.strokes[j]}" fill="${strokeFill}" />`;
        }

        const isLocked = !this.breakdownRevealedAll && ((i + 1) > this.currentCorrectStrokeIndex);
        const stateClass = isLocked ? 'locked' : 'revealed';

        html += `
          <div class="hs-step-card ${stateClass}" data-step="${i + 1}" title="Nét thứ ${i + 1}">
            <span class="hs-step-num">Nét ${i + 1}</span>
            <div class="hs-step-canvas-wrap">
              <svg viewBox="0 0 1024 1024" width="44" height="44" style="display: block; overflow: visible;">
                <g transform="${transformStr}">
                  ${pathsHtml}
                </g>
              </svg>
            </div>
          </div>
        `;
      }

      this.dom.breakdownTrack.innerHTML = html;

      // Click step card to animate that specific stroke
      this.dom.breakdownTrack.querySelectorAll('.hs-step-card').forEach(card => {
        card.addEventListener('click', () => {
          const step = parseInt(card.dataset.step, 10);
          this.highlightStepCard(step);
          if (this.writer) {
            if (typeof this.writer.animateStroke === 'function') {
              this.writer.animateStroke(step - 1);
            } else {
              this.writer.animateCharacter({
                strokeAnimationSpeed: this.currentSpeed * 1.5
              });
            }
          }
        });
      });
    }

    highlightStepCard(step) {
      this.dom.breakdownTrack.querySelectorAll('.hs-step-card').forEach(c => {
        const s = parseInt(c.dataset.step, 10);
        const isActive = (s === step);
        c.classList.toggle('active', isActive);
        if (isActive) {
          c.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        }
      });
    }

    // =======================================================================
    // ANIMATION & QUIZ CONTROLS
    // =======================================================================
    animateCurrentChar() {
      if (!this.writer) return;
      this.isQuizMode = false;
      this.dom.btnQuiz.classList.remove('active');
      this.dom.btnAnimate.classList.add('active');
      const char = this.getCurrentChar();
      this.setPrompt(`🎬 Đang phát nét bút thuận chữ "${char}"... (Xem xong bạn sẽ được tự tay viết ngay)`, 'hint');

      // Cancel any ongoing quiz before playing animation
      if (typeof this.writer.cancelQuiz === 'function') {
        this.writer.cancelQuiz();
      }

      // Temporarily reveal all cards while watching animation
      this.dom.breakdownTrack.querySelectorAll('.hs-step-card').forEach(c => {
        c.classList.remove('locked');
        c.classList.add('revealed');
      });

      this.writer.animateCharacter({
        onComplete: () => {
          this.dom.btnAnimate.classList.remove('active');
          // Automatically return to quiz mode so user can write immediately!
          setTimeout(() => {
            this.startQuizMode();
            this.setPrompt(`✨ Đã xem xong mẫu! Bạn hãy tự tay viết lại chữ "${char}" ngay nhé!`, 'success');
          }, 350);
        }
      });
    }

    startQuizMode() {
      if (!this.writer) return;
      this.isQuizMode = true;
      this.dom.btnQuiz.classList.add('active');
      this.dom.btnAnimate.classList.remove('active');
      const char = this.getCurrentChar();
      this.setPrompt(`✍️ Bạn hãy tự tay viết nét thứ 1 của chữ "${char}"! (Nếu quên có thể nhấp "Xem Mẫu")`, 'hint');

      let mistakeCount = 0;
      let strokeIndex = 0;

      this.writer.quiz({
        onCorrectStroke: (data) => {
          strokeIndex = data.strokeNum + 1;
          this.currentCorrectStrokeIndex = strokeIndex;
          this.audio.playCorrectStroke();

          // Unlock and reveal this stroke in the breakdown track
          const card = this.dom.breakdownTrack.querySelector(`.hs-step-card[data-step="${strokeIndex}"]`);
          if (card) {
            card.classList.remove('locked');
            card.classList.add('revealed');
          }
          this.highlightStepCard(strokeIndex);

          this.stats.correctStrokes++;
          this.stats.totalAttempts++;
          this.stats.streak++;
          this.updateStatsUI();

          const total = data.totalStrokes || strokeIndex;
          this.setPrompt(`🎉 Chính xác nét ${strokeIndex}/${total}! Hãy vẽ tiếp nét tiếp theo.`, 'success');
        },

        onMistake: (data) => {
          mistakeCount++;
          this.audio.playMistake();
          this.stats.totalAttempts++;
          this.stats.streak = 0;
          this.updateStatsUI();

          if (data.mistakesOnStroke >= 2) {
            this.setPrompt(`💡 Nét này hơi khó? Nhấp "Gợi Ý Nét" để xem hướng nét nhé!`, 'error');
          } else {
            this.setPrompt(`⚠️ Nét chưa đúng thứ tự hoặc vị trí rồi, hãy thử lại!`, 'error');
          }
        },

        onComplete: (summary) => {
          this.audio.playFanfare();
          this.stats.completed++;
          this.updateStatsUI();
          this.saveStatsToStorage();

          // Reveal all cards on complete
          this.dom.breakdownTrack.querySelectorAll('.hs-step-card').forEach(c => {
            c.classList.remove('locked');
            c.classList.add('revealed');
          });

          this.showCompletionModal(summary, mistakeCount);
        }
      });
    }

    hintNextStroke() {
      if (!this.writer) return;
      if (typeof this.writer.highlightStroke === 'function') {
        this.writer.highlightStroke();
        this.setPrompt('💡 Đã hiển thị gợi ý nét tiếp theo màu xanh lá!', 'hint');
      } else {
        this.writer.animateCharacter();
      }
    }

    toggleOutline() {
      this.outlineVisible = !this.outlineVisible;
      this.dom.btnOutline.textContent = this.outlineVisible ? '👁️ Nét Mờ: BẬT' : '👁️ Nét Mờ: TẮT';
      if (this.writer) {
        if (this.outlineVisible) {
          this.writer.showOutline();
        } else {
          this.writer.hideOutline();
        }
      }
    }

    toggleBreakdownReveal() {
      this.breakdownRevealedAll = !this.breakdownRevealedAll;
      if (this.dom.btnToggleBreakdownReveal) {
        this.dom.btnToggleBreakdownReveal.textContent = this.breakdownRevealedAll ? '🔒 Ẩn Nét (Thử Thách)' : '👁️ Mở Khóa Nét';
        this.dom.btnToggleBreakdownReveal.classList.toggle('active', this.breakdownRevealedAll);
      }
      this.dom.breakdownTrack.querySelectorAll('.hs-step-card').forEach(c => {
        const step = parseInt(c.dataset.step, 10);
        if (this.breakdownRevealedAll || step <= this.currentCorrectStrokeIndex) {
          c.classList.remove('locked');
          c.classList.add('revealed');
        } else {
          c.classList.add('locked');
          c.classList.remove('revealed');
        }
      });
    }

    resetCanvas() {
      if (!this.writer) return;
      this.currentCorrectStrokeIndex = 0;
      this.writer.cancelQuiz();
      this.setupHanziWriter(this.getCurrentChar());
    }

    setPrompt(text, type = 'info') {
      this.dom.promptBanner.textContent = text;
      this.dom.promptBanner.className = `hs-prompt-banner ${type}`;
    }

    // =======================================================================
    // CELEBRATION MODAL & TELEMETRY
    // =======================================================================
    showCompletionModal(summary, mistakes) {
      const char = this.getCurrentChar();
      this.dom.modalChar.textContent = char;

      let stars = '⭐⭐⭐';
      let title = 'Tuyệt Vời!';
      let desc = `Bạn đã hoàn thành chữ "${char}" với 0 lỗi sai! Bút thuận cực kỳ chuẩn xác.`;

      if (mistakes === 1 || mistakes === 2) {
        stars = '⭐⭐';
        title = 'Rất Tốt!';
        desc = `Bạn đã viết xong chữ "${char}" chỉ với ${mistakes} lần chỉnh sửa.`;
      } else if (mistakes > 2) {
        stars = '⭐';
        title = 'Đã Hoàn Thành!';
        desc = `Bạn đã chinh phục thành công chữ "${char}"! Luyện lại lần nữa để ghi nhớ sâu hơn nhé.`;
      }

      this.dom.modalStars.textContent = stars;
      this.dom.modalDesc.textContent = desc;
      this.dom.modal.classList.add('active');
    }

    updateStatsUI() {
      this.dom.statCompleted.textContent = this.stats.completed;
      this.dom.statStreak.textContent = `${this.stats.streak} 🔥`;

      const accuracy = this.stats.totalAttempts > 0
        ? Math.round((this.stats.correctStrokes / this.stats.totalAttempts) * 100)
        : 100;
      this.dom.statAccuracy.textContent = `${accuracy}%`;
    }

    saveStatsToStorage() {
      localStorage.setItem('hs_completed_chars', this.stats.completed.toString());
      localStorage.setItem('hs_correct_strokes', this.stats.correctStrokes.toString());
      localStorage.setItem('hs_total_attempts', this.stats.totalAttempts.toString());
      localStorage.setItem('hs_current_streak', this.stats.streak.toString());

      if (window.PinyinAuth && typeof window.PinyinAuth.triggerDebouncedSync === 'function') {
        window.PinyinAuth.triggerDebouncedSync();
      }
    }
  }

  // =========================================================================
  // BOOTSTRAP ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    const app = new HanziStrokeApp();
    app.init();
    window.hanziStrokeApp = app;
  });

})();
