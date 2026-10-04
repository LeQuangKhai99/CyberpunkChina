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
    // Laser beam animation
    this.lasers.push({
      startX,
      startY,
      endX,
      endY,
      life: 0.18,
      maxLife: 0.18,
      color: '#00f3ff'
    });

    // Particle explosion at target location
    const particleCount = 28;
    const colors = ['#00f3ff', '#ff0055', '#ffe600', '#00ff88', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 220;
      this.particles.push({
        x: endX,
        y: endY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8
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
    const count = 45;
    for (let i = 0; i < count; i++) {
      this.bgParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speed: 40 + Math.random() * 80,
        len: 10 + Math.random() * 25,
        opacity: 0.15 + Math.random() * 0.35
      });
    }
  }

  startRenderLoops() {
    const renderBg = () => {
      this.drawCyberBackground();
      requestAnimationFrame(renderBg);
    };
    requestAnimationFrame(renderBg);
  }

  drawCyberBackground() {
    const ctx = this.bgCtx;
    const w = this.bgCanvas.width;
    const h = this.bgCanvas.height;

    ctx.fillStyle = '#04060d';
    ctx.fillRect(0, 0, w, h);

    // Subtle Neon Chinese Neon Signs in Distance
    ctx.font = '900 64px "ZCOOL QingKe HuangYou", sans-serif';
    ctx.fillStyle = 'rgba(0, 243, 255, 0.03)';
    ctx.fillText('赛博重庆', 60, 180);
    ctx.fillStyle = 'rgba(255, 0, 85, 0.03)';
    ctx.fillText('霓虹夜城', w - 300, 260);
    ctx.fillStyle = 'rgba(255, 230, 0, 0.025)';
    ctx.fillText('未来科技', w / 2 - 120, h / 2);

    // Cyber Rain Lines
    ctx.lineWidth = 1.2;
    for (let i = 0; i < this.bgParticles.length; i++) {
      const p = this.bgParticles[i];
      p.y += p.speed * 0.016;
      if (p.y > h) {
        p.y = -30;
        p.x = Math.random() * w;
      }

      ctx.strokeStyle = `rgba(0, 243, 255, ${p.opacity})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + p.len);
      ctx.stroke();
    }
  }

  renderLasersAndParticles(dt) {
    const ctx = this.laserCtx;
    ctx.clearRect(0, 0, this.laserCanvas.width, this.laserCanvas.height);

    // Draw Laser Beams
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.life -= dt;
      if (l.life <= 0) {
        this.lasers.splice(i, 1);
        continue;
      }

      const alpha = l.life / l.maxLife;

      // Outer glow beam
      ctx.lineWidth = 6;
      ctx.strokeStyle = `rgba(0, 243, 255, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.moveTo(l.startX, l.startY);
      ctx.lineTo(l.endX, l.endY);
      ctx.stroke();

      // Inner intense core beam
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(l.startX, l.startY);
      ctx.lineTo(l.endX, l.endY);
      ctx.stroke();
    }

    // Draw Explosion Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 80 * dt; // Light gravity

      const alpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
}

// Global Launch
window.addEventListener('DOMContentLoaded', () => {
  window.pinyinGame = new PinyinDefenderGame();
  window.pinyinGame.init();
});
