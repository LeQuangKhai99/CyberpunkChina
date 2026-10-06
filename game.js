/**
 * CYBERPUNK CHINA // 赛博拼音 - PINYIN DEFENDER ENGINE
 * Core Game Loop, Laser Targeting, Collision & Vocabulary Manager
 */

class PinyinDefenderGame {
  constructor() {
    this.arenaEl = document.getElementById('gameArena');
    this.inputEl = document.getElementById('pinyinInput');
    this.turretBarrel = document.getElementById('turretBarrel');
    this.healthDisplay = document.getElementById('healthDisplay');
    this.healthBarFill = document.getElementById('healthBarFill');
    this.healthCard = document.querySelector('.hud-health-card');
    this.scoreDisplay = document.getElementById('scoreDisplay');
    this.comboDisplay = document.getElementById('comboDisplay');
    this.streakDisplay = document.getElementById('streakDisplay');
    this.killsDisplay = document.getElementById('killsCount');
    this.accuracyDisplay = document.getElementById('accuracyDisplay');
    this.damageFlashEl = document.getElementById('damageFlash');
    this.gameWrapper = document.getElementById('gameWrapper');

    // Laser & Background Canvases
    this.bgCanvas = document.getElementById('bgCanvas');
    this.bgCtx = this.bgCanvas.getContext('2d');
    this.laserCanvas = document.getElementById('laserCanvas');
    this.laserCtx = this.laserCanvas.getContext('2d');

    // Game State
    this.health = 100; // 100 HP Core Shield
    this.score = 0;
    this.combo = 1;
    this.streak = 0;
    this.maxCombo = 1;
    this.kills = 0;
    this.missed = 0;
    this.totalTypedWords = 0;

    this.activeWords = [];
    this.wordPool = [];
    this.hskLevel = 'all';
    this.meaningLang = 'vi';
    this.pinyinVisible = true;
    this.baseSpeed = 1.0;
    this.speedMultiplier = 1.0;

    this.isStarted = false;
    this.isPaused = false;
    this.isGameOver = false;

    this.spawnTimer = null;
    this.lastTime = 0;
    this.lasers = [];
    this.particles = [];
    this.bgParticles = [];
  }

  init() {
    this.setupCanvases();
    this.setupEventListeners();
    this.prepareWordPool();
    this.initBgParticles();
    this.startRenderLoops();
  }

  /* ========================================================================
     VOCABULARY POOL PREPARATION
     ======================================================================== */
  prepareWordPool() {
    const rawList = window.CHINESE_WORDS_5000 || [];
    if (this.hskLevel === 'all') {
      this.wordPool = rawList;
    } else {
      const lvl = parseInt(this.hskLevel, 10);
      this.wordPool = rawList.filter(w => w.level === lvl);
    }

    if (this.wordPool.length === 0) {
      this.wordPool = rawList; // Fallback
    }
  }

  getRandomWord() {
    if (this.wordPool.length === 0) this.prepareWordPool();
    const idx = Math.floor(Math.random() * this.wordPool.length);
    return this.wordPool[idx];
  }

  /* ========================================================================
     EVENT LISTENERS & CONTROLS
     ======================================================================== */
  setupEventListeners() {
    // Start Game Button - Unlocks audio & starts BGM by default
    document.getElementById('startGameBtn').addEventListener('click', () => {
      document.getElementById('startModal').style.display = 'none';
      gameAudio.ensureContext();
      if (!gameAudio.bgmMuted) {
        gameAudio.startBgm();
      }
      gameAudio.playGameStart();
      this.startGame();
    });

    // Global audio context unlock on any first user touch/click/press
    const unlockSound = () => {
      gameAudio.ensureContext();
      if (this.isStarted && !this.isGameOver && !gameAudio.bgmMuted && !gameAudio.bgmTimer) {
        gameAudio.startBgm();
      }
    };
    document.addEventListener('pointerdown', unlockSound, { once: true });
    document.addEventListener('keydown', unlockSound, { once: true });

    // Restart Game Button
    document.getElementById('restartGameBtn').addEventListener('click', () => {
      document.getElementById('gameOverModal').style.display = 'none';
      gameAudio.ensureContext();
      if (!gameAudio.bgmMuted && !gameAudio.bgmTimer) {
        gameAudio.startBgm();
      }
      this.restartGame();
    });

    // Resume Button
    document.getElementById('resumeGameBtn').addEventListener('click', () => {
      this.togglePause();
    });

    // Pinyin Input Keydown & Input
    this.inputEl.addEventListener('input', () => {
      gameAudio.playKeypress();
      this.handlePinyinInput();
    });

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Clear input on Enter/Space if player wants to re-target
        this.inputEl.value = '';
        this.clearTargetHighlights();
      }
    });

    // Keep input focused when clicking on the arena
    this.arenaEl.addEventListener('click', () => {
      this.focusInput();
    });

    // Prominent Pinyin Toggle Button (Memorization Challenge Mode)
    const togglePinyinBtn = document.getElementById('togglePinyinBtn');
    const pinyinStatusPill = document.getElementById('pinyinStatusPill');
    if (togglePinyinBtn) {
      togglePinyinBtn.addEventListener('click', () => {
        this.pinyinVisible = !this.pinyinVisible;
        togglePinyinBtn.classList.toggle('mode-hidden', !this.pinyinVisible);
        this.arenaEl.classList.toggle('pinyin-hidden-mode', !this.pinyinVisible);

        const iconSpan = togglePinyinBtn.querySelector('.pinyin-btn-icon');
        if (this.pinyinVisible) {
          if (iconSpan) iconSpan.textContent = '👁️';
          if (pinyinStatusPill) pinyinStatusPill.textContent = 'HIỆN';
          togglePinyinBtn.title = 'Chế độ ghi nhớ: Bấm để ẨN Pinyin';
        } else {
          if (iconSpan) iconSpan.textContent = '🙈';
          if (pinyinStatusPill) pinyinStatusPill.textContent = 'ẨN (THỬ THÁCH)';
          togglePinyinBtn.title = 'Chế độ ghi nhớ: Bấm để HIỆN Pinyin';
        }
        this.focusInput();
      });
    }

    // Keyboard shortcut F2 or Alt+P to toggle Pinyin on-the-fly
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F2' || (e.altKey && (e.key === 'p' || e.key === 'P'))) {
        e.preventDefault();
        if (togglePinyinBtn) togglePinyinBtn.click();
      }
    });

    // HSK Level Selector
    const hskSelect = document.getElementById('hskSelect');
    hskSelect.addEventListener('change', (e) => {
      this.hskLevel = e.target.value;
      this.prepareWordPool();
      this.focusInput();
    });

    // Speed Selector
    const speedSelect = document.getElementById('speedSelect');
    speedSelect.addEventListener('change', (e) => {
      this.baseSpeed = parseFloat(e.target.value);
      this.updateEffectiveSpeed();
      this.focusInput();
    });

    // Meaning Language Selector (Vietnamese / Bilingual / English)
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.meaningLang = e.target.value;
        this.updateActiveWordsMeanings();
        this.focusInput();
      });
    }

    // Toggle Voice Button
    const voiceBtn = document.getElementById('voiceToggleBtn');
    voiceBtn.addEventListener('click', () => {
      gameAudio.voiceEnabled = !gameAudio.voiceEnabled;
      voiceBtn.classList.toggle('active', gameAudio.voiceEnabled);
      voiceBtn.querySelector('.btn-txt').textContent = gameAudio.voiceEnabled ? 'GIỌNG ĐỌC: BẬT' : 'GIỌNG ĐỌC: TẮT';
      this.focusInput();
    });

    // Toggle SFX Button
    const sfxBtn = document.getElementById('sfxToggleBtn');
    sfxBtn.addEventListener('click', () => {
      gameAudio.ensureContext();
      gameAudio.sfxMuted = !gameAudio.sfxMuted;
      sfxBtn.classList.toggle('active', !gameAudio.sfxMuted);
      sfxBtn.querySelector('.btn-txt').textContent = !gameAudio.sfxMuted ? 'HIỆU ỨNG: BẬT' : 'HIỆU ỨNG: TẮT';
      this.focusInput();
    });

    // Toggle BGM Button
    const bgmBtn = document.getElementById('bgmToggleBtn');
    bgmBtn.addEventListener('click', () => {
      gameAudio.ensureContext();
      const active = gameAudio.toggleBgm();
      bgmBtn.classList.toggle('active', active);
      bgmBtn.querySelector('.btn-txt').textContent = active ? 'NHẠC: BẬT' : 'NHẠC: TẮT';
      this.focusInput();
    });

    // Pause Button
    const pauseBtn = document.getElementById('pauseBtn');
    pauseBtn.addEventListener('click', () => {
      this.togglePause();
    });

    // Settings Gear Button — toggle collapsible settings panel
    const settingsGearBtn = document.getElementById('settingsGearBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsGearBtn && settingsPanel) {
      settingsGearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = settingsPanel.classList.toggle('open');
        settingsGearBtn.classList.toggle('open', isOpen);
        // When closing, return focus to input
        if (!isOpen) this.focusInput();
      });

      // Close settings panel when clicking anywhere outside it
      document.addEventListener('click', (e) => {
        if (
          settingsPanel.classList.contains('open') &&
          !settingsPanel.contains(e.target) &&
          e.target !== settingsGearBtn &&
          !settingsGearBtn.contains(e.target)
        ) {
          settingsPanel.classList.remove('open');
          settingsGearBtn.classList.remove('open');
          this.focusInput();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isStarted && !this.isGameOver) {
        // Close settings panel first if open, then pause
        if (settingsPanel && settingsPanel.classList.contains('open')) {
          settingsPanel.classList.remove('open');
          if (settingsGearBtn) settingsGearBtn.classList.remove('open');
          this.focusInput();
        } else {
          this.togglePause();
        }
      }
    });

    // Window Resize
    window.addEventListener('resize', () => {
      this.setupCanvases();
    });
  }

  focusInput() {
    if (!this.isPaused && !this.isGameOver) {
      this.inputEl.focus();
    }
  }

  togglePause() {
    if (!this.isStarted || this.isGameOver) return;
    this.isPaused = !this.isPaused;
    const modal = document.getElementById('pauseModal');
    const pauseBtn = document.getElementById('pauseBtn');

    if (this.isPaused) {
      modal.style.display = 'flex';
      pauseBtn.querySelector('.btn-txt').textContent = 'TIẾP TỤC';
    } else {
      modal.style.display = 'none';
      pauseBtn.querySelector('.btn-txt').textContent = 'TẠM DỪNG';
      this.focusInput();
      this.lastTime = performance.now();
    }
  }

  /* ========================================================================
     GAME LOOP & SPAWNER
     ======================================================================== */
  startGame() {
    this.isStarted = true;
    this.isPaused = false;
    this.isGameOver = false;
    this.health = 100;
    this.score = 0;
    this.combo = 1;
    this.streak = 0;
    this.maxCombo = 1;
    this.kills = 0;
    this.missed = 0;
    this.totalTypedWords = 0;
    this.activeWords = [];
    this.lasers = [];
    this.particles = [];

    this.arenaEl.querySelectorAll('.falling-word').forEach(el => el.remove());
    this.updateHud();
    this.focusInput();
    gameAudio.playComboChime(6);

    this.lastTime = performance.now();
    this.scheduleNextSpawn();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  restartGame() {
    this.startGame();
  }

  scheduleNextSpawn() {
    if (this.spawnTimer) clearTimeout(this.spawnTimer);
    if (!this.isStarted || this.isPaused || this.isGameOver) return;

    // Spawn delay decreases as score/kills increase (from 2400ms down to 1100ms)
    const minDelay = 1100;
    const maxDelay = 2400;
    const progress = Math.min(1, this.kills / 60);
    const delay = (maxDelay - (maxDelay - minDelay) * progress) / this.baseSpeed;

    this.spawnTimer = setTimeout(() => {
      this.spawnWord();
      this.scheduleNextSpawn();
    }, delay);
  }

  spawnWord() {
    if (this.isPaused || this.isGameOver) return;
    // Limit concurrent words on screen (max 5)
    if (this.activeWords.length >= 5) return;

    const data = this.getRandomWord();
    if (!data) return;

    const arenaRect = this.arenaEl.getBoundingClientRect();
    const charCount = (data.hanzi || '').length;
    const wordWidth = Math.max(130, 70 + charCount * 38);
    const minX = wordWidth / 2 + 15;
    const maxX = Math.max(minX + 20, arenaRect.width - wordWidth / 2 - 15);
    const x = minX + Math.random() * (maxX - minX);
    const y = -70;

    // Word falling speed: slightly varies per word + increases with progression
    const speed = (28 + Math.random() * 12 + Math.min(30, this.kills * 0.4)) * this.baseSpeed;

    let displayMeaning = data.meaning_vn || data.meaning || '';
    if (this.meaningLang === 'bi') {
      displayMeaning = data.meaning_vn ? `${data.meaning_vn} • ${data.meaning}` : data.meaning;
    } else if (this.meaningLang === 'en') {
      displayMeaning = data.meaning || data.meaning_vn || '';
    }

    // Create DOM element for crisp rendering
    const el = document.createElement('div');
    el.className = 'falling-word';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    el.innerHTML = `
      <div class="word-hsk-pill">HSK ${data.level}</div>
      <div class="word-hanzi">${data.hanzi}</div>
      <div class="word-pinyin-badge" id="badge_${data.id}">
        <span class="pinyin-text">${data.pinyin}</span>
      </div>
      <div class="word-meaning" title="${data.meaning_vn || data.meaning || ''}">${displayMeaning}</div>
    `;

    this.arenaEl.appendChild(el);

    const wordObj = {
      id: data.id,
      hanzi: data.hanzi,
      pinyin: data.pinyin,
      clean: data.clean,
      spaced: data.spaced,
      num: data.num,
      meaning_vn: data.meaning_vn || '',
      meaning_en: data.meaning || '',
      meaning: data.meaning_vn || data.meaning || '',
      level: data.level,
      x,
      y,
      speed,
      el,
      width: wordWidth,
      height: 80
    };

    this.activeWords.push(wordObj);
  }

  updateActiveWordsMeanings() {
    this.activeWords.forEach(w => {
      const meaningEl = w.el.querySelector('.word-meaning');
      if (meaningEl) {
        let txt = w.meaning_vn || w.meaning_en || '';
        if (this.meaningLang === 'bi') {
          txt = w.meaning_vn ? `${w.meaning_vn} • ${w.meaning_en}` : w.meaning_en;
        } else if (this.meaningLang === 'en') {
          txt = w.meaning_en || w.meaning_vn || '';
        }
        meaningEl.textContent = txt;
        meaningEl.title = w.meaning_vn || w.meaning_en || '';
      }
    });
  }

  gameLoop(currentTime) {
    if (!this.isStarted) return;

    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    if (!this.isPaused && !this.isGameOver) {
      this.updatePhysics(dt);
    }

    this.renderLasersAndParticles(dt);
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  updatePhysics(dt) {
    const arenaRect = this.arenaEl.getBoundingClientRect();
    const groundY = arenaRect.height - 40; // Collision threshold with ground

    for (let i = this.activeWords.length - 1; i >= 0; i--) {
      const w = this.activeWords[i];
      w.y += w.speed * dt;
      w.el.style.top = `${w.y}px`;

      // Check Danger zone (< 25% height to ground)
      if (groundY - w.y < 120) {
        w.el.classList.add('danger-imminent');
      }

      // Check ground collision -> SHIELD DAMAGE!
      if (w.y >= groundY) {
        this.handleGroundHit(w, i);
      }
    }
  }

  /* ========================================================================
     SHIELD DAMAGE & GAME OVER
     ======================================================================== */
  handleGroundHit(word, index) {
    // Remove from active words
    this.activeWords.splice(index, 1);
    word.el.remove();

    // Damage Core Shield: -1 HP
    this.health = Math.max(0, this.health - 1);
    this.missed++;
    this.streak = 0;
    this.combo = 1;

    // Visual & Audio Feedback
    gameAudio.playShieldDamage();
    this.triggerScreenShake();

    if (this.health <= 25 && this.health > 0) {
      gameAudio.playCriticalAlarm();
    }

    this.updateHud();

    // Check Defeat condition
    if (this.health <= 0) {
      this.handleGameOver();
    }
  }

  triggerScreenShake() {
    this.gameWrapper.classList.remove('screen-shake');
    void this.gameWrapper.offsetWidth; // Trigger reflow
    this.gameWrapper.classList.add('screen-shake');

    this.damageFlashEl.classList.add('active');
    setTimeout(() => {
      this.damageFlashEl.classList.remove('active');
    }, 150);
  }

  handleGameOver() {
    this.isGameOver = true;
    if (this.spawnTimer) clearTimeout(this.spawnTimer);
    gameAudio.playGameOver();

    // Populate Game Over Modal
    document.getElementById('finalScore').textContent = this.score.toLocaleString();
    document.getElementById('finalKills').textContent = this.kills;
    document.getElementById('finalMaxCombo').textContent = `x${this.maxCombo}`;
    document.getElementById('finalMissed').textContent = this.missed;

    // Update local and cloud high score
    const currentHigh = parseInt(localStorage.getItem('pinyin_pop_highscore') || '0', 10);
    if (this.score > currentHigh) {
      localStorage.setItem('pinyin_pop_highscore', this.score.toString());
      if (window.PinyinAuth && typeof window.PinyinAuth.triggerDebouncedSync === 'function') {
        window.PinyinAuth.triggerDebouncedSync();
      }
    }

    document.getElementById('gameOverModal').style.display = 'flex';
  }

  /* ========================================================================
     TYPING & LASER CANNON TARGETING
     ======================================================================== */
  handlePinyinInput() {
    const rawVal = this.inputEl.value.trim().toLowerCase();
    const cleanVal = rawVal.replace(/[^a-z0-9]/g, '');

    if (!cleanVal) {
      this.clearTargetHighlights();
      this.aimTurretAtCenter();
      return;
    }

    // Find all active words whose clean pinyin starts with cleanVal
    const matches = this.activeWords.filter(w => {
      return w.clean.startsWith(cleanVal) || 
             w.spaced.replace(/\s+/g, '').startsWith(cleanVal) ||
             w.num.startsWith(cleanVal);
    });

    if (matches.length > 0) {
      // Pick the lowest (most dangerous) word as the primary locked target
      matches.sort((a, b) => b.y - a.y);
      const target = matches[0];

      if (this.lockedTargetId !== target.id) {
        this.lockedTargetId = target.id;
        if (window.gameAudio && typeof window.gameAudio.playTargetLock === 'function') {
          window.gameAudio.playTargetLock();
        }
      }

      this.highlightLockedTarget(target, cleanVal);
      this.aimTurretAt(target.x, target.y);

      // Check for EXACT match!
      const exactMatch = matches.find(w => {
        return w.clean === cleanVal || 
               w.spaced.replace(/\s+/g, '') === cleanVal ||
               w.num === cleanVal;
      });

      if (exactMatch) {
        this.destroyWord(exactMatch);
      }
    } else {
      this.clearTargetHighlights();
      this.aimTurretAtCenter();
    }
  }

  highlightLockedTarget(targetWord, typedPrefix) {
    this.activeWords.forEach(w => {
      if (w.id === targetWord.id) {
        w.el.classList.add('locked-target');
        // Highlight matched prefix in badge
        const badge = w.el.querySelector('.pinyin-text');
        if (badge) {
          const matchedLen = Math.min(typedPrefix.length, w.pinyin.length);
          const matchedPart = w.pinyin.substring(0, matchedLen);
          const restPart = w.pinyin.substring(matchedLen);
          badge.innerHTML = `<span class="pinyin-matched">${matchedPart}</span><span class="pinyin-unmatched">${restPart}</span>`;
        }
      } else {
        w.el.classList.remove('locked-target');
        const badge = w.el.querySelector('.pinyin-text');
        if (badge) badge.textContent = w.pinyin;
      }
    });
  }

  clearTargetHighlights() {
    this.lockedTargetId = null;
    this.activeWords.forEach(w => {
      w.el.classList.remove('locked-target');
      const badge = w.el.querySelector('.pinyin-text');
      if (badge) badge.textContent = w.pinyin;
    });
  }

  aimTurretAt(targetX, targetY) {
    const arenaRect = this.arenaEl.getBoundingClientRect();
    const turretX = arenaRect.width / 2;
    const turretY = arenaRect.height + 20;

    const dx = targetX - turretX;
    const dy = targetY - turretY;
    const angleRad = Math.atan2(dx, -dy);
    const angleDeg = angleRad * (180 / Math.PI);

    this.turretBarrel.style.transform = `rotate(${angleDeg}deg)`;
  }

  aimTurretAtCenter() {
    this.turretBarrel.style.transform = `rotate(0deg)`;
  }

  /* ========================================================================
     WORD DESTRUCTION & LASER BLASTS
     ======================================================================== */
  destroyWord(word) {
    // Clear input immediately for rapid successive typing
    this.inputEl.value = '';
    this.lockedTargetId = null;

    // Remove from active words
    const idx = this.activeWords.indexOf(word);
    if (idx !== -1) {
      this.activeWords.splice(idx, 1);
    }
    word.el.remove();

    // Fire laser beam from turret to target position
    const arenaRect = this.arenaEl.getBoundingClientRect();
    const turretX = arenaRect.width / 2;
    const turretY = arenaRect.height + 15;
    this.fireLaser(turretX, turretY, word.x, word.y + 25);

    // 8-Bit Audio SFX (scales with combo) & Voice Pronunciation
    gameAudio.playLaser(this.combo);
    gameAudio.playExplosion(this.combo);
    gameAudio.speakChinese(word.hanzi);

    // Score & Combo Update
    this.kills++;
    this.streak++;
    this.totalTypedWords++;

    if (this.streak >= 15) this.combo = 5;
    else if (this.streak >= 10) this.combo = 4;
    else if (this.streak >= 5) this.combo = 3;
    else if (this.streak >= 2) this.combo = 2;
    else this.combo = 1;

    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }

    if (this.streak > 1 && this.streak % 3 === 0) {
      gameAudio.playComboChime(this.streak);
    }

    // HSK Level Point Scaling: Higher HSK level words grant significantly more points!
    const HSK_TIER_POINTS = {
      1: 100,    // HSK 1: 100 pts
      2: 250,    // HSK 2: 250 pts
      3: 500,    // HSK 3: 500 pts
      4: 1000,   // HSK 4: 1,000 pts
      5: 2000,   // HSK 5: 2,000 pts
      6: 4000    // HSK 6: 4,000 pts
    };
    const basePts = HSK_TIER_POINTS[word.level] || (100 * (word.level || 1));
    const earnedPts = basePts * this.combo;
    this.score += earnedPts;

    // Spawn visual feedback showing character and Vietnamese meaning
    this.spawnDestroyedPopup(word.x, word.y, word, earnedPts);

    this.updateHud();
    this.aimTurretAtCenter();
  }

  spawnDestroyedPopup(x, y, word, pts) {
    const popup = document.createElement('div');
    popup.className = 'destroyed-popup';
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    let meaningText = word.meaning_vn || word.meaning_en || '';
    if (this.meaningLang === 'bi') {
      meaningText = word.meaning_vn ? `${word.meaning_vn} • ${word.meaning_en}` : word.meaning_en;
    } else if (this.meaningLang === 'en') {
      meaningText = word.meaning_en || word.meaning_vn || '';
    }

    popup.innerHTML = `
      <span class="popup-hanzi">${word.hanzi}</span>
      <span class="popup-meaning">${meaningText}</span>
      <span class="popup-pts">+${pts.toLocaleString()} [HSK ${word.level}]</span>
    `;

    this.arenaEl.appendChild(popup);
    setTimeout(() => popup.remove(), 1200);
  }

  fireLaser(startX, startY, endX, endY) {
    // Laser star beam animation
    this.lasers.push({
      startX,
      startY,
      endX,
      endY,
      life: 0.22,
      maxLife: 0.22,
      color: '#ff4b82'
    });

    // Festive Confetti burst at target location
    const particleCount = 36;
    const colors = ['#ff4b82', '#ffb703', '#06d6a0', '#00b4d8', '#7209b7', '#f72585', '#ffffff', '#fbbf24'];
    const shapes = ['star', 'rect', 'circle'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 260;
      this.particles.push({
        x: endX,
        y: endY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60, // Slight upward burst
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 12,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 1.0
      });
    }
  }

  /* ========================================================================
     HUD TELEMETRY UPDATE
     ======================================================================== */
  updateHud() {
    this.healthDisplay.textContent = `${this.health} / 100 HP`;
    this.healthBarFill.style.width = `${Math.max(0, this.health)}%`;

    if (this.health <= 25) {
      this.healthCard.classList.remove('health-warning');
      this.healthCard.classList.add('health-critical');
    } else if (this.health <= 55) {
      this.healthCard.classList.remove('health-critical');
      this.healthCard.classList.add('health-warning');
    } else {
      this.healthCard.classList.remove('health-warning', 'health-critical');
    }

    this.scoreDisplay.textContent = this.score.toLocaleString();
    this.comboDisplay.textContent = `x${this.combo}`;
    this.streakDisplay.textContent = `${this.streak} CHUỖI`;
    this.killsDisplay.textContent = this.kills;

    const total = this.kills + this.missed;
    const acc = total > 0 ? Math.round((this.kills / total) * 100) : 100;
    this.accuracyDisplay.textContent = `${acc}%`;
  }

  /* ========================================================================
     CANVAS GRAPHICS & PARTICLES
     ======================================================================== */
  setupCanvases() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.bgCanvas.width = w;
    this.bgCanvas.height = h;
    this.laserCanvas.width = w;
    this.laserCanvas.height = h;
  }

  initBgParticles() {
    this.bgParticles = [];
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Floating Clouds
    this.clouds = [
      { x: w * 0.1, y: h * 0.15, size: 75, speed: 12, opacity: 0.85 },
      { x: w * 0.65, y: h * 0.25, size: 95, speed: 16, opacity: 0.9 },
      { x: w * 0.85, y: h * 0.08, size: 60, speed: 9, opacity: 0.75 },
      { x: w * 0.35, y: h * 0.35, size: 80, speed: 14, opacity: 0.8 }
    ];

    // Cheerful Rising Bubbles & Sparkle Stars
    const count = 35;
    const bubbleColors = [
      'rgba(255, 182, 193, 0.45)', // Pink
      'rgba(186, 230, 253, 0.45)', // Sky blue
      'rgba(254, 240, 138, 0.45)', // Soft yellow
      'rgba(187, 247, 208, 0.45)', // Mint
      'rgba(233, 213, 255, 0.45)'  // Lavender
    ];

    for (let i = 0; i < count; i++) {
      this.bgParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 6 + Math.random() * 18,
        speed: 15 + Math.random() * 35,
        swingSpeed: 1 + Math.random() * 2,
        swingAmp: 10 + Math.random() * 20,
        initialX: Math.random() * w,
        color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        isStar: Math.random() > 0.6,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 2
      });
    }
  }

  startRenderLoops() {
    let lastT = performance.now();
    const renderBg = (currT) => {
      const dt = Math.min(0.1, (currT - lastT) / 1000);
      lastT = currT;
      this.drawCheerfulBackground(dt, currT);
      requestAnimationFrame(renderBg);
    };
    requestAnimationFrame(renderBg);
  }

  drawCheerfulBackground(dt, currT) {
    const ctx = this.bgCtx;
    const w = this.bgCanvas.width;
    const h = this.bgCanvas.height;

    // Vibrant & Cheerful Dreamy Candy Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#7dd3fc');    // Crisp sunny sky blue
    skyGrad.addColorStop(0.35, '#bae6fd'); // Soft pastel blue
    skyGrad.addColorStop(0.7, '#fbcfe8');  // Pastel candy pink
    skyGrad.addColorStop(1, '#fed7aa');    // Warm peach sunset
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Floating Clouds
    if (this.clouds) {
      for (let i = 0; i < this.clouds.length; i++) {
        const c = this.clouds[i];
        c.x += c.speed * dt;
        if (c.x - c.size * 2 > w) {
          c.x = -c.size * 2;
          c.y = Math.random() * (h * 0.4);
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size * 0.6, 0, Math.PI * 2);
        ctx.arc(c.x + c.size * 0.45, c.y - c.size * 0.25, c.size * 0.5, 0, Math.PI * 2);
        ctx.arc(c.x + c.size * 0.9, c.y, c.size * 0.55, 0, Math.PI * 2);
        ctx.arc(c.x + c.size * 0.45, c.y + c.size * 0.1, c.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Rising Bubbles & Twinkling Floating Stars
    const timeSec = currT * 0.001;
    for (let i = 0; i < this.bgParticles.length; i++) {
      const p = this.bgParticles[i];
      p.y -= p.speed * dt;
      p.x = p.initialX + Math.sin(timeSec * p.swingSpeed + i) * p.swingAmp;
      p.rot += p.rotSpeed * dt;

      if (p.y < -30) {
        p.y = h + 20;
        p.initialX = Math.random() * w;
      }

      if (p.isStar) {
        // Draw Twinkling Golden Star
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const starSize = 5 + Math.sin(timeSec * 3 + i) * 2;
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;
        this.drawStarShape(ctx, 0, 0, 5, starSize, starSize * 0.45);
        ctx.fill();
        ctx.restore();
      } else {
        // Draw Glossy Translucent Bubble
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Bubble Highlight
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        ctx.restore();
      }
    }
  }

  drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }

  renderLasersAndParticles(dt) {
    const ctx = this.laserCtx;
    ctx.clearRect(0, 0, this.laserCanvas.width, this.laserCanvas.height);

    // Draw Cheerful Rainbow Laser Star Beams
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.life -= dt;
      if (l.life <= 0) {
        this.lasers.splice(i, 1);
        continue;
      }

      const alpha = l.life / l.maxLife;

      // Outer Rainbow Glow Beam
      ctx.lineWidth = 9;
      ctx.strokeStyle = `rgba(255, 110, 180, ${alpha * 0.65})`;
      ctx.beginPath();
      ctx.moveTo(l.startX, l.startY);
      ctx.lineTo(l.endX, l.endY);
      ctx.stroke();

      // Middle Golden Beam
      ctx.lineWidth = 5;
      ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.85})`;
      ctx.beginPath();
      ctx.moveTo(l.startX, l.startY);
      ctx.lineTo(l.endX, l.endY);
      ctx.stroke();

      // Inner Diamond White Core
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(l.startX, l.startY);
      ctx.lineTo(l.endX, l.endY);
      ctx.stroke();

      // Star Head at target
      ctx.save();
      ctx.translate(l.endX, l.endY);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.drawStarShape(ctx, 0, 0, 4, 14 * alpha, 5 * alpha);
      ctx.fill();
      ctx.restore();
    }

    // Draw Colorful Festive Confetti Explosion Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 140 * dt; // Gravity
      p.vx *= 0.98;    // Air resistance
      if (p.rot !== undefined) p.rot += p.rotSpeed * dt;

      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.rot) ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;

      if (p.shape === 'star') {
        this.drawStarShape(ctx, 0, 0, 5, p.size * 1.5, p.size * 0.6);
        ctx.fill();
      } else if (p.shape === 'rect') {
        ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;
  }
}

// Global Launch
window.addEventListener('DOMContentLoaded', () => {
  window.pinyinGame = new PinyinDefenderGame();
  window.pinyinGame.init();
});
