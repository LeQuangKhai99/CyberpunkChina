/**
 * CYBERNET OS // Netrunner Minigames Engine
 * Includes: Cyberpunk 2077 Breach Protocol & Cryptographic Cipher Bypass
 */

class MiniGameEngine {
  constructor(app) {
    this.app = app;
    this.activeGame = null;
    this.timer = null;
    this.timeLeft = 0;
  }

  /* ========================================================================
     GAME 1: CYBERPUNK 2077 BREACH PROTOCOL
     ======================================================================== */
  startBreachProtocol(target = 'ARASAKA SUBNET', difficulty = 'NORMAL') {
    const container = document.getElementById('minigameContainer');
    container.style.display = 'block';

    const hexTokens = ['1C', 'BD', 'E9', '55', '7A', 'FF'];
    const matrixSize = 5;

    // Buffer capacity based on player upgrades
    const bufferCapacity = this.app.player.bufferSize;
    let timeLimit = difficulty === 'HARD' ? 30 : difficulty === 'EASY' ? 45 : 35;
    this.timeLeft = timeLimit;

    // Generate 5x5 Matrix
    const grid = [];
    for (let r = 0; r < matrixSize; r++) {
      const row = [];
      for (let c = 0; c < matrixSize; c++) {
        row.push(hexTokens[Math.floor(Math.random() * hexTokens.length)]);
      }
      grid.push(row);
    }

    // Generate 2 or 3 Target Daemons guaranteed to be solvable
    const daemons = this.generateDaemons(grid, difficulty);

    this.activeGame = {
      type: 'breach',
      target,
      difficulty,
      matrixSize,
      grid,
      daemons,
      buffer: [],
      bufferCapacity,
      currentMode: 'ROW', // 'ROW' or 'COL'
      activeIndex: 0,     // Row 0 initially
      usedCells: new Set(),
      isGameOver: false
    };

    this.renderBreachUI();
    this.startTimer(() => this.handleBreachTimeout());
    this.app.log(`[BREACH INITIATED]: Infiltrating node "${target}". Select coordinates to upload daemon buffer.`, 'line-warning');
    cyberAudio.playGlitch();
  }

  generateDaemons(grid, difficulty) {
    const count = difficulty === 'HARD' ? 3 : 2;
    const daemons = [];
    const daemonTypes = [
      { name: 'DATAMINE_V1', rewardCreds: 350, exp: 80, length: 2 },
      { name: 'CAMERA_OVERRIDE', rewardCreds: 500, exp: 120, length: 3 },
      { name: 'ICE_MELTER_DAEMON', rewardCreds: 850, exp: 200, length: 3 }
    ];

    // Build realistic paths through the grid so it's guaranteed solvable
    let r = 0;
    let c = Math.floor(Math.random() * 5);
    const validChain = [grid[r][c]];

    for (let step = 0; step < 4; step++) {
      if (step % 2 === 0) {
        // next is in same col c, pick random row
        r = (r + 1 + Math.floor(Math.random() * 4)) % 5;
        validChain.push(grid[r][c]);
      } else {
        // next is in same row r, pick random col
        c = (c + 1 + Math.floor(Math.random() * 4)) % 5;
        validChain.push(grid[r][c]);
      }
    }

    for (let i = 0; i < count; i++) {
      const dt = daemonTypes[i];
      const startIdx = Math.min(i, validChain.length - dt.length);
      const seq = validChain.slice(startIdx, startIdx + dt.length);
      daemons.push({
        name: dt.name,
        sequence: seq,
        rewardCreds: dt.rewardCreds,
        exp: dt.exp,
        completed: false
      });
    }

    return daemons;
  }

  renderBreachUI() {
    const container = document.getElementById('minigameContainer');
    const game = this.activeGame;

    let html = `
      <div class="game-header">
        <div class="game-title">⚡ BREACH PROTOCOL // TARGET: ${game.target}</div>
        <div class="game-timer-wrapper">
          <span>BREACH WINDOW:</span>
          <span class="timer-counter ${this.timeLeft <= 10 ? 'timer-urgent' : ''}" id="gameTimer">${this.timeLeft}s</span>
        </div>
      </div>

      <div class="breach-layout">
        <!-- Matrix Grid -->
        <div class="code-matrix-grid" id="matrixGrid">
    `;

    for (let r = 0; r < game.matrixSize; r++) {
      for (let c = 0; c < game.matrixSize; c++) {
        const val = game.grid[r][c];
        const cellKey = `${r}_${c}`;
        const isUsed = game.usedCells.has(cellKey);
        
        // Selectable if in active row/col and not used
        let isSelectable = false;
        let isHighlighted = false;

        if (!isUsed && !game.isGameOver) {
          if (game.currentMode === 'ROW' && r === game.activeIndex) {
            isSelectable = true;
            isHighlighted = true;
          } else if (game.currentMode === 'COL' && c === game.activeIndex) {
            isSelectable = true;
            isHighlighted = true;
          }
        }

        const classes = [
          'matrix-cell',
          isUsed ? 'selected-solved' : '',
          isSelectable ? 'active-selectable' : '',
          isHighlighted ? 'highlight-rowcol' : ''
        ].filter(Boolean).join(' ');

        html += `<div class="${classes}" data-row="${r}" data-col="${c}">${val}</div>`;
      }
    }

    html += `
        </div>

        <!-- Sidebar: Buffer & Targets -->
        <div class="breach-sidebar">
          <div class="buffer-section">
            <div class="section-label">UPLOAD BUFFER (${game.buffer.length}/${game.bufferCapacity})</div>
            <div class="buffer-slots">
    `;

    for (let i = 0; i < game.bufferCapacity; i++) {
      const code = game.buffer[i] || '';
      html += `<div class="buffer-slot ${code ? 'filled' : ''}">${code}</div>`;
    }

    html += `
            </div>
          </div>

          <div class="target-sequences-section">
            <div class="section-label">DAEMON ROUTINES TO INJECT:</div>
    `;

    game.daemons.forEach(daemon => {
      html += `
        <div class="target-seq-item ${daemon.completed ? 'completed' : ''}">
          <div>
            <div style="font-size: 10px; color: #6282a5;">${daemon.name} ${daemon.completed ? '✔ INJECTED' : ''}</div>
            <div class="seq-codes">
              ${daemon.sequence.map(code => `<span>${code}</span>`).join(' ')}
            </div>
          </div>
          <div class="seq-reward">+₮${daemon.rewardCreds}</div>
        </div>
      `;
    });

    html += `
            <div style="margin-top: 10px;">
              <button class="cyber-btn-icon" id="abortBreachBtn" style="width: 100%; justify-content: center;">ABORT OPERATION</button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach event listeners to selectable cells
    container.querySelectorAll('.matrix-cell.active-selectable').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const r = parseInt(e.currentTarget.getAttribute('data-row'), 10);
        const c = parseInt(e.currentTarget.getAttribute('data-col'), 10);
        this.selectBreachCell(r, c);
      });
    });

    // Abort button
    const abortBtn = document.getElementById('abortBreachBtn');
    if (abortBtn) {
      abortBtn.addEventListener('click', () => {
        this.closeGame('BREACH ABORTED BY USER.', false);
      });
    }
  }

  selectBreachCell(r, c) {
    const game = this.activeGame;
    if (!game || game.isGameOver) return;

    cyberAudio.playMatrixPick();

    const val = game.grid[r][c];
    game.usedCells.add(`${r}_${c}`);
    game.buffer.push(val);

    // Switch selection axis
    if (game.currentMode === 'ROW') {
      game.currentMode = 'COL';
      game.activeIndex = c;
    } else {
      game.currentMode = 'ROW';
      game.activeIndex = r;
    }

    // Check completed daemons
    this.checkDaemonSequences();

    // Check if all solved
    const allSolved = game.daemons.every(d => d.completed);
    if (allSolved) {
      this.finishBreach(true);
      return;
    }

    // Check if buffer full
    if (game.buffer.length >= game.bufferCapacity) {
      const anySolved = game.daemons.some(d => d.completed);
      this.finishBreach(anySolved);
      return;
    }

    this.renderBreachUI();
  }

  checkDaemonSequences() {
    const game = this.activeGame;
    const bufStr = game.buffer.join(',');

    game.daemons.forEach(daemon => {
      if (daemon.completed) return;
      const targetStr = daemon.sequence.join(',');
      if (bufStr.includes(targetStr)) {
        daemon.completed = true;
        cyberAudio.playBeep(1200, 0.15);
        this.app.log(`[DAEMON SUCCESS]: Injected "${daemon.name}" into target memory!`, 'line-success');
      }
    });
  }

  finishBreach(isSuccess) {
    const game = this.activeGame;
    game.isGameOver = true;
    this.clearTimer();

    let totalCreds = 0;
    let totalExp = 0;
    let solvedCount = 0;

    game.daemons.forEach(d => {
      if (d.completed) {
        totalCreds += d.rewardCreds;
        totalExp += d.exp;
        solvedCount++;
      }
    });

    if (isSuccess && solvedCount > 0) {
      cyberAudio.playSuccess();
      this.app.addRewards(totalCreds, totalExp);
      this.app.player.hacksCompleted++;
      this.app.updateHud();

      this.closeGame(
        `[BREACH SUCCESSFUL]: ${solvedCount}/${game.daemons.length} Daemons Injected! Acquired +₮${totalCreds} & +${totalExp} EXP.`,
        true
      );
    } else {
      cyberAudio.playError();
      this.app.triggerTraceAlert(25);
      this.closeGame(
        `[BREACH FAILED]: ICE lockdown triggered. Buffer overflow without valid daemon sequence. Trace +25%!`,
        false
      );
    }
  }

  handleBreachTimeout() {
    cyberAudio.playError();
    this.app.triggerTraceAlert(35);
    this.closeGame('[TIMEOUT]: Subnet security detected anomaly! Connection severed. Trace +35%!', false);
  }

  /* ========================================================================
     GAME 2: CRYPTOGRAPHIC CIPHER BYPASS
     ======================================================================== */
  startCipherBypass(difficulty = 'NORMAL') {
    const container = document.getElementById('minigameContainer');
    container.style.display = 'block';

    const codeLength = difficulty === 'HARD' ? 5 : 4;
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    // Pick unique secret code
    const secret = [];
    const pool = [...digits];
    for (let i = 0; i < codeLength; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      secret.push(pool.splice(idx, 1)[0]);
    }

    this.activeGame = {
      type: 'cipher',
      difficulty,
      codeLength,
      secret,
      maxAttempts: 6,
      attempts: [],
      isGameOver: false
    };

    this.timeLeft = 60;
    this.startTimer(() => {
      cyberAudio.playError();
      this.closeGame('[CIPHER TIMEOUT]: Security lock engaged. Cipher bypass failed.', false);
    });

    this.renderCipherUI();
    this.app.log(`[CIPHER DECRYPTOR]: Crack the ${codeLength}-digit security key. You have 6 attempts.`, 'line-warning');
  }

  renderCipherUI() {
    const container = document.getElementById('minigameContainer');
    const game = this.activeGame;

    let html = `
      <div class="game-header">
        <div class="game-title">🔐 CIPHER BYPASS // MILITECH ENCRYPTION LOCK</div>
        <div class="game-timer-wrapper">
          <span>TIME REMAINING:</span>
          <span class="timer-counter ${this.timeLeft <= 15 ? 'timer-urgent' : ''}" id="gameTimer">${this.timeLeft}s</span>
        </div>
      </div>

      <div class="cipher-game-wrapper">
        <div style="font-size: 11px; color: #a3b8cc;">
          Decrypt the sequence. <span style="color: #00ff66;">GREEN</span> = correct position, <span style="color: #ffe600;">YELLOW</span> = wrong position, <span style="color: #6282a5;">GRAY</span> = not in key.
        </div>

        <div class="cipher-history" id="cipherHistory">
    `;

    game.attempts.forEach((att, idx) => {
      html += `
        <div class="cipher-entry">
          <span style="color: #6282a5;">ATTEMPT #${idx + 1}: <strong style="color: #00f0ff; letter-spacing: 2px;">${att.guess}</strong></span>
          <div class="cipher-pegs">
            ${att.feedback.map(f => `<div class="cipher-peg peg-${f.type}">${f.val}</div>`).join('')}
          </div>
        </div>
      `;
    });

    if (game.attempts.length === 0) {
      html += `<div style="color: #4b627e; font-style: italic; padding: 10px;">Enter your guess using the command line: <kbd>guess &lt;code&gt;</kbd> (e.g. guess 1234)</div>`;
    }

    html += `
        </div>

        <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between; margin-top: 6px;">
          <span style="font-size: 11px; color: #ffe600;">ATTEMPTS LEFT: ${game.maxAttempts - game.attempts.length} / ${game.maxAttempts}</span>
          <button class="cyber-btn-icon" id="abortCipherBtn">ABORT CIPHER</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    const abortBtn = document.getElementById('abortCipherBtn');
    if (abortBtn) {
      abortBtn.addEventListener('click', () => {
        this.closeGame('CIPHER BYPASS ABORTED.', false);
      });
    }
  }

  submitCipherGuess(guess) {
    const game = this.activeGame;
    if (!game || game.type !== 'cipher' || game.isGameOver) return;

    guess = guess.trim();
    if (guess.length !== game.codeLength || !/^\d+$/.test(guess)) {
      this.app.log(`[INVALID CODE]: Input must be a ${game.codeLength}-digit number.`, 'line-error');
      cyberAudio.playError();
      return;
    }

    const secret = game.secret;
    const guessArr = guess.split('');
    const feedback = [];

    let exactMatches = 0;
    guessArr.forEach((char, i) => {
      if (char === secret[i]) {
        feedback.push({ val: char, type: 'exact' });
        exactMatches++;
      } else if (secret.includes(char)) {
        feedback.push({ val: char, type: 'exist' });
      } else {
        feedback.push({ val: char, type: 'miss' });
      }
    });

    game.attempts.push({ guess, feedback });
    cyberAudio.playBeep(950, 0.1);

    if (exactMatches === game.codeLength) {
      // Solved!
      cyberAudio.playSuccess();
      const reward = 600;
      const exp = 150;
      this.app.addRewards(reward, exp);
      this.app.player.hacksCompleted++;
      this.app.updateHud();
      this.closeGame(`[KEY CRACKED!]: Code "${guess}" confirmed! Access granted. +₮${reward} / +${exp} EXP.`, true);
      return;
    }

    if (game.attempts.length >= game.maxAttempts) {
      cyberAudio.playError();
      this.closeGame(`[LOCKDOWN]: Security firewall locked out! Correct key was: ${secret.join('')}`, false);
      return;
    }

    this.renderCipherUI();
  }

  /* ========================================================================
     TIMER & ENGINE CONTROLS
     ======================================================================== */
  startTimer(onExpire) {
    this.clearTimer();
    this.timer = setInterval(() => {
      this.timeLeft--;
      const timerEl = document.getElementById('gameTimer');
      if (timerEl) {
        timerEl.textContent = `${this.timeLeft}s`;
        if (this.timeLeft <= 10) {
          timerEl.classList.add('timer-urgent');
          cyberAudio.playBeep(600, 0.04);
        }
      }

      if (this.timeLeft <= 0) {
        this.clearTimer();
        if (onExpire) onExpire();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  closeGame(message, isSuccess = true) {
    this.clearTimer();
    this.activeGame = null;
    const container = document.getElementById('minigameContainer');
    container.style.display = 'none';
    container.innerHTML = '';

    if (message) {
      this.app.log(message, isSuccess ? 'line-success' : 'line-error');
    }
    this.app.focusInput();
  }
}
