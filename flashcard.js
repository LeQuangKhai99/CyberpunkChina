/**
 * PINYIN POP! 🗂️ - FLASHCARD & ACTIVE RECALL STUDY ENGINE
 * Full-featured Chinese Vocabulary Flashcards (HSK 1-6)
 */

class ChineseFlashcardApp {
  constructor() {
    this.rawWords = window.CHINESE_WORDS_5000 || [];
    this.filteredWords = [];
    this.deckWords = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.autoVoice = true;
    this.slideshowInterval = null;
    this.isSlideshow = false;
    this.wordsPerDeck = 25;
    this.currentDeckIndex = 0;

    // Study Mastery Progress (Persisted in localStorage)
    this.masteredSet = new Set(this.loadFromStorage('pinyin_pop_mastered'));
    this.reviewSet = new Set(this.loadFromStorage('pinyin_pop_review'));
    this.favoritesSet = new Set(this.loadFromStorage('pinyin_pop_favs'));

    // Speech Voice
    this.chineseVoice = null;
    this.initVoice();

    // DOM Elements
    this.activeCard = document.getElementById('activeCard');
    this.cardFrontHanzi = document.getElementById('cardFrontHanzi');
    this.cardFrontHsk = document.getElementById('cardFrontHsk');
    this.cardBackHanziMini = document.getElementById('cardBackHanziMini');
    this.cardBackPinyin = document.getElementById('cardBackPinyin');
    this.cardBackMeaningVn = document.getElementById('cardBackMeaningVn');
    this.cardBackMeaningEn = document.getElementById('cardBackMeaningEn');
    this.cardBackHsk = document.getElementById('cardBackHsk');
    this.cardFavBtn = document.getElementById('cardFavBtn');
    this.cardSpeakBtn = document.getElementById('cardSpeakBtn');
    this.cardBackSpeakBtn = document.getElementById('cardBackSpeakBtn');

    // Controls & Telemetry
    this.hskFilter = document.getElementById('fcHskFilter');
    this.deckSelect = document.getElementById('fcDeckSelect');
    this.searchInput = document.getElementById('fcSearchInput');
    this.clearSearchBtn = document.getElementById('fcClearSearch');
    this.currentCardIdxEl = document.getElementById('fcCurrentCardIdx');
    this.totalCardsEl = document.getElementById('fcTotalCards');
    this.masteredCountEl = document.getElementById('fcMasteredCount');
    this.reviewCountEl = document.getElementById('fcReviewCount');
    this.progressFillEl = document.getElementById('fcProgressFill');
    this.slideshowBtn = document.getElementById('fcSlideshowBtn');
    this.slideshowBtnTxt = document.getElementById('slideshowBtnTxt');
    this.voiceToggleBtn = document.getElementById('fcVoiceToggle');

    // Views
    this.flashcardView = document.getElementById('flashcardView');
    this.quizView = document.getElementById('quizView');
    this.listView = document.getElementById('listView');
    this.tabFlashcard = document.getElementById('tabFlashcardMode');
    this.tabQuiz = document.getElementById('tabQuizMode');
    this.tabList = document.getElementById('tabListMode');

    // Background Canvas
    this.bgCanvas = document.getElementById('fcBgCanvas');
    this.bgCtx = this.bgCanvas ? this.bgCanvas.getContext('2d') : null;
    this.bgParticles = [];
  }

  init() {
    this.setupBackgroundCanvas();
    this.setupEventListeners();
    this.applyHskFilter();
    this.renderCard();
    this.updateStats();

    // Listen for cross-device cloud progress synchronization
    window.addEventListener('cloud-progress-updated', () => {
      this.masteredSet = new Set(this.loadFromStorage('pinyin_pop_mastered'));
      this.reviewSet = new Set(this.loadFromStorage('pinyin_pop_review'));
      this.favoritesSet = new Set(this.loadFromStorage('pinyin_pop_favs'));
      this.updateStats();
      this.updateCardStatusBadges();
    });
  }

  /* ========================================================================
     STORAGE & SPEECH
     ======================================================================== */
  loadFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveToStorage(key, set) {
    try {
      localStorage.setItem(key, JSON.stringify(Array.from(set)));
      if (window.PinyinAuth && typeof window.PinyinAuth.triggerDebouncedSync === 'function') {
        window.PinyinAuth.triggerDebouncedSync();
      }
    } catch (e) {}
  }

  initVoice() {
    if (!('speechSynthesis' in window)) return;
    const findVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      this.chineseVoice = voices.find(v => v.lang === 'zh-CN' || v.lang.includes('zh') || v.lang.includes('cmn')) || null;
    };
    findVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = findVoice;
    }
  }

  speakChinese(text) {
    if (!('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      if (this.chineseVoice) utterance.voice = this.chineseVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  /* ========================================================================
     FILTERING & DECK BATCHING
     ======================================================================== */
  applyHskFilter() {
    const val = this.hskFilter.value;
    const search = this.searchInput.value.trim().toLowerCase();

    let list = this.rawWords;

    if (val === 'fav') {
      list = list.filter(w => this.favoritesSet.has(w.id));
    } else if (val === 'learning') {
      list = list.filter(w => this.reviewSet.has(w.id));
    } else if (val !== 'all') {
      const lvl = parseInt(val, 10);
      list = list.filter(w => w.level === lvl);
    }

    // Apply text search if typed
    if (search) {
      list = list.filter(w => {
        return (w.hanzi && w.hanzi.includes(search)) ||
               (w.clean && w.clean.includes(search)) ||
               (w.pinyin && w.pinyin.toLowerCase().includes(search)) ||
               (w.meaning_vn && w.meaning_vn.toLowerCase().includes(search)) ||
               (w.meaning && w.meaning.toLowerCase().includes(search));
      });
    }

    this.filteredWords = list.length > 0 ? list : this.rawWords.slice(0, 10);
    this.populateDecks();
  }

  populateDecks() {
    this.deckSelect.innerHTML = '';
    const total = this.filteredWords.length;
    const numDecks = Math.ceil(total / this.wordsPerDeck);

    // Option for all words
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = `⚡ Toàn bộ (${total.toLocaleString()} từ)`;
    this.deckSelect.appendChild(allOpt);

    // Sub-decks of 25 words
    for (let i = 0; i < numDecks; i++) {
      const start = i * this.wordsPerDeck + 1;
      const end = Math.min((i + 1) * this.wordsPerDeck, total);
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `📖 Bài ${i + 1} (Từ ${start} - ${end})`;
      if (i === 0) opt.selected = true;
      this.deckSelect.appendChild(opt);
    }

    this.loadDeckWords();
  }

  loadDeckWords() {
    const deckVal = this.deckSelect.value;
    if (deckVal === 'all') {
      this.deckWords = [...this.filteredWords];
    } else {
      const idx = parseInt(deckVal, 10) || 0;
      const start = idx * this.wordsPerDeck;
      const end = start + this.wordsPerDeck;
      this.deckWords = this.filteredWords.slice(start, end);
    }

    this.currentIndex = 0;
    this.isFlipped = false;
    if (this.activeCard) this.activeCard.classList.remove('flipped');
    this.renderCard();
    this.updateStats();

    if (this.listView && this.listView.style.display !== 'none') {
      this.renderVocabularyGrid();
    }
  }

  /* ========================================================================
     CARD RENDERING & ACTIVE RECALL
     ======================================================================== */
  getCurrentWord() {
    if (!this.deckWords || this.deckWords.length === 0) return null;
    return this.deckWords[this.currentIndex];
  }

  renderCard() {
    const word = this.getCurrentWord();
    if (!word) return;

    // Reset flip
    this.isFlipped = false;
    this.activeCard.classList.remove('flipped');

    // Front Face
    this.cardFrontHanzi.textContent = word.hanzi;
    this.cardFrontHsk.textContent = `HSK ${word.level}`;
    const isFav = this.favoritesSet.has(word.id);
    this.cardFavBtn.classList.toggle('active', isFav);
    this.cardFavBtn.textContent = isFav ? '⭐' : '☆';

    // Back Face
    this.cardBackHanziMini.textContent = word.hanzi;
    this.cardBackPinyin.textContent = word.pinyin || word.clean;
    this.cardBackMeaningVn.textContent = word.meaning_vn || word.meaning || 'Chưa cập nhật nghĩa';
    this.cardBackMeaningEn.textContent = word.meaning || '';
    this.cardBackHsk.textContent = `HSK ${word.level}`;

    // Telemetry
    this.currentCardIdxEl.textContent = this.currentIndex + 1;
    this.totalCardsEl.textContent = this.deckWords.length;
    const pct = Math.round(((this.currentIndex + 1) / this.deckWords.length) * 100);
    this.progressFillEl.style.width = `${pct}%`;

    // Auto speak if enabled
    if (this.autoVoice) {
      this.speakChinese(word.hanzi);
    }
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
    this.activeCard.classList.toggle('flipped', this.isFlipped);
  }

  nextCard() {
    if (this.currentIndex < this.deckWords.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back
    }
    this.renderCard();
  }

  prevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.deckWords.length - 1;
    }
    this.renderCard();
  }

  shuffleDeck() {
    for (let i = this.deckWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deckWords[i], this.deckWords[j]] = [this.deckWords[j], this.deckWords[i]];
    }
    this.currentIndex = 0;
    this.renderCard();
  }

  toggleFavorite() {
    const word = this.getCurrentWord();
    if (!word) return;
    if (this.favoritesSet.has(word.id)) {
      this.favoritesSet.delete(word.id);
    } else {
      this.favoritesSet.add(word.id);
    }
    this.saveToStorage('pinyin_pop_favs', this.favoritesSet);
    const isFav = this.favoritesSet.has(word.id);
    this.cardFavBtn.classList.toggle('active', isFav);
    this.cardFavBtn.textContent = isFav ? '⭐' : '☆';
  }

  markHard() {
    const word = this.getCurrentWord();
    if (!word) return;
    this.reviewSet.add(word.id);
    this.masteredSet.delete(word.id);
    this.saveToStorage('pinyin_pop_review', this.reviewSet);
    this.saveToStorage('pinyin_pop_mastered', this.masteredSet);
    this.updateStats();
    this.nextCard();
  }

  markEasy() {
    const word = this.getCurrentWord();
    if (!word) return;
    this.masteredSet.add(word.id);
    this.reviewSet.delete(word.id);
    this.saveToStorage('pinyin_pop_mastered', this.masteredSet);
    this.saveToStorage('pinyin_pop_review', this.reviewSet);
    this.updateStats();
    this.nextCard();
  }

  updateStats() {
    this.masteredCountEl.textContent = this.masteredSet.size;
    this.reviewCountEl.textContent = this.reviewSet.size;
  }

  toggleSlideshow() {
    this.isSlideshow = !this.isSlideshow;
    this.slideshowBtn.classList.toggle('active', this.isSlideshow);
    if (this.isSlideshow) {
      this.slideshowBtnTxt.textContent = 'DỪNG LẬT';
      this.slideshowInterval = setInterval(() => {
        if (!this.isFlipped) {
          this.flipCard();
        } else {
          this.nextCard();
        }
      }, 3500);
    } else {
      this.slideshowBtnTxt.textContent = 'TỰ ĐỘNG LẬT';
      if (this.slideshowInterval) clearInterval(this.slideshowInterval);
    }
  }

  /* ========================================================================
     QUIZ TEST MODE
     ======================================================================== */
  initQuiz() {
    this.quizIndex = 0;
    this.quizQuestions = [];
    const pool = this.deckWords.length >= 4 ? this.deckWords : this.filteredWords;

    // Pick 10 random words for quiz
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const sample = shuffled.slice(0, Math.min(10, shuffled.length));

    this.quizQuestions = sample.map(correct => {
      // 3 wrong distractors
      const wrong = pool.filter(w => w.id !== correct.id).sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [correct, ...wrong].sort(() => 0.5 - Math.random());
      return { correct, options };
    });

    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    if (this.quizIndex >= this.quizQuestions.length) {
      alert(`🎉 Chúc mừng bạn đã hoàn thành bài trắc nghiệm với ${this.quizQuestions.length} câu hỏi!`);
      this.switchView('flashcard');
      return;
    }

    const q = this.quizQuestions[this.quizIndex];
    document.getElementById('quizCurrentQ').textContent = this.quizIndex + 1;
    document.getElementById('quizHskBadge').textContent = `HSK ${q.correct.level}`;
    document.getElementById('quizTargetHanzi').textContent = q.correct.hanzi;
    document.getElementById('quizFeedbackBox').style.display = 'none';

    const grid = document.getElementById('quizOptionsGrid');
    grid.innerHTML = '';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `
        <span class="quiz-opt-pinyin">${opt.pinyin}</span>
        <span class="quiz-opt-meaning">${opt.meaning_vn || opt.meaning || ''}</span>
      `;

      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        // Disable all buttons in question
        Array.from(grid.children).forEach(b => b.disabled = true);

        const isCorrect = opt.id === q.correct.id;
        if (isCorrect) {
          btn.classList.add('correct');
          this.masteredSet.add(q.correct.id);
          this.reviewSet.delete(q.correct.id);
          document.getElementById('quizFeedbackMsg').textContent = 'Chính xác tuyệt vời! 🎉';
        } else {
          btn.classList.add('wrong');
          this.reviewSet.add(q.correct.id);
          document.getElementById('quizFeedbackMsg').textContent = `Chưa đúng rồi! Đáp án là: ${q.correct.pinyin} (${q.correct.meaning_vn || q.correct.meaning})`;
          // Highlight correct one
          Array.from(grid.children).forEach(b => {
            if (b.querySelector('.quiz-opt-pinyin').textContent === q.correct.pinyin) {
              b.classList.add('correct');
            }
          });
        }

        this.speakChinese(q.correct.hanzi);
        this.saveToStorage('pinyin_pop_mastered', this.masteredSet);
        this.saveToStorage('pinyin_pop_review', this.reviewSet);
        this.updateStats();

        document.getElementById('quizFeedbackBox').style.display = 'flex';
      });

      grid.appendChild(btn);
    });

    document.getElementById('quizSpeakBtn').onclick = () => this.speakChinese(q.correct.hanzi);
  }

  /* ========================================================================
     DICTIONARY LIST GRID
     ======================================================================== */
  renderVocabularyGrid() {
    const grid = document.getElementById('vocabGrid');
    const totalEl = document.getElementById('listTotalCount');
    grid.innerHTML = '';
    totalEl.textContent = this.deckWords.length;

    this.deckWords.forEach(word => {
      const card = document.createElement('div');
      card.className = 'vocab-grid-card';
      card.innerHTML = `
        <div class="vocab-left">
          <span class="vocab-hanzi">${word.hanzi}</span>
          <span class="vocab-pinyin">${word.pinyin} [HSK ${word.level}]</span>
          <span class="vocab-meaning">${word.meaning_vn || word.meaning || ''}</span>
        </div>
        <button class="card-icon-btn speak-btn" title="Nghe phát âm">🔊</button>
      `;

      card.querySelector('.speak-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.speakChinese(word.hanzi);
      });

      card.addEventListener('click', () => {
        this.speakChinese(word.hanzi);
      });

      grid.appendChild(card);
    });
  }

  /* ========================================================================
     VIEW SWITCHING
     ======================================================================== */
  switchView(mode) {
    this.tabFlashcard.classList.toggle('active', mode === 'flashcard');
    this.tabQuiz.classList.toggle('active', mode === 'quiz');
    this.tabList.classList.toggle('active', mode === 'list');

    this.flashcardView.style.display = mode === 'flashcard' ? 'flex' : 'none';
    this.quizView.style.display = mode === 'quiz' ? 'flex' : 'none';
    this.listView.style.display = mode === 'list' ? 'flex' : 'none';

    if (mode === 'quiz') {
      this.initQuiz();
    } else if (mode === 'list') {
      this.renderVocabularyGrid();
    }
  }

  /* ========================================================================
     EVENT LISTENERS & KEYBOARDS
     ======================================================================== */
  setupEventListeners() {
    // Card Flip Click
    this.activeCard.addEventListener('click', (e) => {
      // Don't flip if clicking icon buttons inside card
      if (e.target.closest('.card-icon-btn')) return;
      this.flipCard();
    });

    // Speak Buttons
    this.cardSpeakBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const w = this.getCurrentWord();
      if (w) this.speakChinese(w.hanzi);
    });

    this.cardBackSpeakBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const w = this.getCurrentWord();
      if (w) this.speakChinese(w.hanzi);
    });

    // Favorite Button
    this.cardFavBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFavorite();
    });

    // Navigation & Mastery Buttons
    document.getElementById('fcPrevBtn').addEventListener('click', () => this.prevCard());
    document.getElementById('fcNextBtn').addEventListener('click', () => this.nextCard());
    document.getElementById('fcFlipBtn').addEventListener('click', () => this.flipCard());
    document.getElementById('fcRecallHardBtn').addEventListener('click', () => this.markHard());
    document.getElementById('fcRecallEasyBtn').addEventListener('click', () => this.markEasy());
    document.getElementById('fcShuffleBtn').addEventListener('click', () => this.shuffleDeck());
    this.slideshowBtn.addEventListener('click', () => this.toggleSlideshow());

    // Filter Change
    this.hskFilter.addEventListener('change', () => this.applyHskFilter());
    this.deckSelect.addEventListener('change', () => this.loadDeckWords());

    // Search Input
    this.searchInput.addEventListener('input', () => {
      this.clearSearchBtn.style.display = this.searchInput.value ? 'block' : 'none';
      this.applyHskFilter();
    });

    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.clearSearchBtn.style.display = 'none';
      this.applyHskFilter();
    });

    // Voice Auto-toggle
    this.voiceToggleBtn.addEventListener('click', () => {
      this.autoVoice = !this.autoVoice;
      this.voiceToggleBtn.classList.toggle('active', this.autoVoice);
      this.voiceToggleBtn.querySelector('.btn-txt').textContent = this.autoVoice ? 'TỰ ĐỘNG ĐỌC: BẬT' : 'TỰ ĐỘNG ĐỌC: TẮT';
    });

    // View Switch Tabs
    this.tabFlashcard.addEventListener('click', () => this.switchView('flashcard'));
    this.tabQuiz.addEventListener('click', () => this.switchView('quiz'));
    this.tabList.addEventListener('click', () => this.switchView('list'));

    // Quiz Next
    document.getElementById('quizNextBtn').addEventListener('click', () => {
      this.quizIndex++;
      this.renderQuizQuestion();
    });

    // Shortcuts Modal
    const modal = document.getElementById('fcShortcutsModal');
    document.getElementById('fcHelpBtn').addEventListener('click', () => {
      modal.style.display = 'flex';
    });
    document.getElementById('fcCloseHelpBtn').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't trigger if typing in input
      if (document.activeElement === this.searchInput) return;

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        this.flipCard();
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        e.preventDefault();
        this.nextCard();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        this.prevCard();
      } else if (e.key === '1' || e.key.toLowerCase() === 'x') {
        this.markHard();
      } else if (e.key === '2' || e.key.toLowerCase() === 'c') {
        this.markEasy();
      } else if (e.key.toLowerCase() === 's') {
        const w = this.getCurrentWord();
        if (w) this.speakChinese(w.hanzi);
      } else if (e.key.toLowerCase() === 'f') {
        this.toggleFavorite();
      }
    });
  }

  /* ========================================================================
     BACKGROUND CANVAS ANIMATION
     ======================================================================== */
  setupBackgroundCanvas() {
    if (!this.bgCanvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.bgCanvas.width = w;
    this.bgCanvas.height = h;

    this.bgParticles = [];
    const colors = ['rgba(255, 182, 193, 0.4)', 'rgba(186, 230, 253, 0.4)', 'rgba(254, 240, 138, 0.4)', 'rgba(233, 213, 255, 0.4)'];
    for (let i = 0; i < 30; i++) {
      this.bgParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 6 + Math.random() * 16,
        speed: 12 + Math.random() * 25,
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
    skyGrad.addColorStop(0, '#bae6fd');
    skyGrad.addColorStop(0.5, '#fbcfe8');
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
    }
  }
}

// Global Launch
window.addEventListener('DOMContentLoaded', () => {
  window.flashcardApp = new ChineseFlashcardApp();
  window.flashcardApp.init();
});
