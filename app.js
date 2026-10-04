/**
 * CYBERNET OS // Core Application & Terminal Controller
 */

class CyberTerminalApp {
  constructor() {
    this.outputEl = document.getElementById('terminalOutput');
    this.inputEl = document.getElementById('terminalInput');
    this.viewportEl = document.getElementById('terminalViewport');
    this.bgCanvas = document.getElementById('bgCanvas');
    this.oscCanvas = document.getElementById('oscCanvas');

    // Netrunner State
    this.player = {
      alias: 'VEXEL',
      rank: 'SCRIPT KIDDIE',
      level: 1,
      exp: 120,
      nextLevelExp: 500,
      credits: 1250,
      bufferSize: 4,
      iceBreaker: 'v1.2 Standard',
      iceLevel: 1,
      hacksCompleted: 0,
      traceLevel: 0
    };

    // Subnet Target Registry
    this.targets = [
      { id: 't1', name: 'ARASAKA-FINANCIAL-PROXY', diff: 'NORMAL', creds: '₮450-800', sec: 'HIGH', x: 0.3, y: 0.4 },
      { id: 't2', name: 'KIROSHI-OPTICS-VAULT', diff: 'EASY', creds: '₮300-500', sec: 'MED', x: 0.7, y: 0.25 },
      { id: 't3', name: 'MILITECH-BLACKSITE-RADAR', diff: 'HARD', creds: '₮800-1400', sec: 'CRITICAL', x: 0.8, y: 0.75 },
      { id: 't4', name: 'TRAUMA-TEAM-SUBNET-04', diff: 'NORMAL', creds: '₮400-750', sec: 'MED', x: 0.2, y: 0.7 }
    ];

    // Shop Upgrades
    this.shopItems = [
      { id: 'buffer5', name: 'BUFFER EXPANSION (+1 SLOT)', cost: 1500, desc: 'Increases Breach buffer from 4 to 5 slots.', bought: false, req: 4 },
      { id: 'buffer6', name: 'NEURAL BUFFER OVERDRIVE (+1 SLOT)', cost: 3500, desc: 'Expands Breach buffer to 6 slots.', bought: false, req: 5 },
      { id: 'ice2', name: 'TETRATHRON ICE-BREAKER v2.0', cost: 2000, desc: 'Gives +20% bonus credits from all completed daemons.', bought: false },
      { id: 'overclock', name: 'CYBERDECK OVERCLOCK RELAY', cost: 1800, desc: 'Extends breach time window by +10 seconds.', bought: false }
    ];

    this.history = [];
    this.historyIndex = -1;
    this.commandsList = [
      'help', 'scan', 'breach', 'decrypt', 'guess', 'abort', 'shop', 'buy', 
      'stats', 'trace', 'clear-trace', 'theme', 'sound', 'bgm', 'crt', 
      'matrix', 'ping', 'cat', 'ls', 'whoami', 'clear'
    ];

    this.minigameEngine = new MiniGameEngine(this);
    this.matrixRainMode = false;
    this.particles = [];
    this.matrixDrops = [];
  }

  init() {
    this.setupEventListeners();
    this.setupCanvas();
    this.setupOscilloscope();
    this.setupClock();
    this.renderTargets();
    this.updateHud();

    // Welcome Banner
    this.displayWelcomeMessage();
  }

  displayWelcomeMessage() {
    const ascii = `
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███╗   ██╗███████╗████████╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗████╗  ██║██╔════╝╚══██╔══╝
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██╔██╗ ██║█████╗     ██║   
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██║╚██╗██║██╔══╝     ██║   
╚██████╗   ██║   ██████╔╝███████╗██║  ██║██║ ╚████║███████╗   ██║   
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   
    `;
    this.log(ascii, 'ascii-banner');
    this.log('========================================================================', 'line-dim');
    this.log('>> NETRUNNER INTERFACE INITIALIZED. MILITECH PARALINE MK.IV CYBERDECK READY.', 'line-system');
    this.log('>> Current User: GUEST_VEXEL [Status: STEALTH PROTOCOL ACTIVE]', 'line-dim');
    this.log('>> Type <span style="color:#00ff66;font-weight:700;">help</span> to inspect available commands, or click any quick command chip above.', 'line-prompt');
    this.log('========================================================================\n', 'line-dim');
  }

  setupEventListeners() {
    // Input Key Handling
    this.inputEl.addEventListener('keydown', (e) => {
      // Audio click
      if (e.key !== 'Enter' && e.key !== 'Tab') {
        cyberAudio.playKeyClick();
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = this.inputEl.value.trim();
        this.inputEl.value = '';
        if (cmd) {
          cyberAudio.playEnter();
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.executeCommand(cmd);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.inputEl.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputEl.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.inputEl.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.handleAutocomplete();
      }
    });

    // Auto-focus input on terminal click
    this.viewportEl.addEventListener('click', (e) => {
      if (!window.getSelection().toString()) {
        this.focusInput();
      }
    });

    // Quick Command Buttons
    document.querySelectorAll('.quick-cmd-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const cmd = e.currentTarget.getAttribute('data-cmd');
        cyberAudio.playBeep(1100, 0.05);
        this.executeCommand(cmd);
      });
    });

    // Header Sound & CRT toggles
    const soundBtn = document.getElementById('soundToggleBtn');
    soundBtn.addEventListener('click', () => {
      cyberAudio.ensureContext();
      const active = cyberAudio.toggleSound();
      soundBtn.querySelector('.btn-text').textContent = active ? 'SFX: ON' : 'SFX: MUTED';
      soundBtn.querySelector('.icon').textContent = active ? '🔊' : '🔇';
      this.log(`[AUDIO]: Sound FX ${active ? 'enabled' : 'muted'}.`, 'line-dim');
    });

    const musicBtn = document.getElementById('musicToggleBtn');
    musicBtn.addEventListener('click', () => {
      cyberAudio.ensureContext();
      const active = cyberAudio.toggleBgm();
      musicBtn.querySelector('.btn-text').textContent = active ? 'BGM: ON' : 'BGM: OFF';
      this.log(`[BGM]: Generative synthwave ambient arpeggiator ${active ? 'started' : 'stopped'}.`, 'line-dim');
    });

    const crtBtn = document.getElementById('crtToggleBtn');
    crtBtn.addEventListener('click', () => {
      document.body.classList.toggle('crt-enabled');
      const isEnabled = document.body.classList.contains('crt-enabled');
      crtBtn.querySelector('.btn-text').textContent = isEnabled ? 'CRT: ON' : 'CRT: OFF';
    });

    // Theme selector
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.addEventListener('change', (e) => {
      this.setTheme(e.target.value);
    });

    // Window Resize
    window.addEventListener('resize', () => {
      this.setupCanvas();
    });
  }

  handleAutocomplete() {
    const val = this.inputEl.value.trim().toLowerCase();
    if (!val) return;
    const match = this.commandsList.find(c => c.startsWith(val));
    if (match) {
      this.inputEl.value = match + ' ';
      cyberAudio.playBeep(1200, 0.04);
    }
  }

  setTheme(themeName) {
    document.body.classList.remove('theme-cyberpunk', 'theme-matrix', 'theme-amber', 'theme-syndicate');
    document.body.classList.add(themeName);
    const select = document.getElementById('themeSelect');
    if (select) select.value = themeName;
    cyberAudio.playGlitch();
    this.log(`[SYSTEM THEME]: Active palette switched to "${themeName.replace('theme-', '').toUpperCase()}".`, 'line-system');
  }

  focusInput() {
    this.inputEl.focus();
  }

  log(htmlContent, className = 'line-prompt') {
    const div = document.createElement('div');
    div.className = `terminal-line ${className}`;
    div.innerHTML = htmlContent;
    this.outputEl.appendChild(div);
    this.viewportEl.scrollTop = this.viewportEl.scrollHeight;
  }

  /* ========================================================================
     COMMAND PROCESSOR
     ======================================================================== */
  executeCommand(rawCmd) {
    // Log user input echo
    this.log(`<span class="prompt-user">guest@nightcity</span>:<span class="prompt-path">~/ops</span># <strong>${rawCmd}</strong>`);

    const parts = rawCmd.split(' ').filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        this.cmdHelp();
        break;

      case 'scan':
        this.cmdScan();
        break;

      case 'breach':
        this.cmdBreach(args);
        break;

      case 'decrypt':
      case 'cipher':
        this.cmdCipher(args);
        break;

      case 'guess':
        if (this.minigameEngine.activeGame && this.minigameEngine.activeGame.type === 'cipher') {
          this.minigameEngine.submitCipherGuess(args[0] || '');
        } else {
          this.log('[ERROR]: No active Cipher bypass minigame. Type "decrypt" to launch one.', 'line-error');
        }
        break;

      case 'abort':
        if (this.minigameEngine.activeGame) {
          this.minigameEngine.closeGame('Operation aborted.', false);
        } else {
          this.log('[INFO]: No active hacking minigame to abort.', 'line-dim');
        }
        break;

      case 'shop':
      case 'market':
        this.cmdShop();
        break;

      case 'buy':
        this.cmdBuy(args[0]);
        break;

      case 'stats':
      case 'profile':
        this.cmdStats();
        break;

      case 'trace':
        this.cmdTrace();
        break;

      case 'clear-trace':
        this.cmdClearTrace();
        break;

      case 'theme':
        if (args[0]) {
          const t = 'theme-' + args[0].toLowerCase();
          if (['theme-cyberpunk', 'theme-matrix', 'theme-amber', 'theme-syndicate'].includes(t)) {
            this.setTheme(t);
          } else {
            this.log('[ERROR]: Available themes: cyberpunk, matrix, amber, syndicate.', 'line-error');
          }
        } else {
          this.log('[USAGE]: theme <cyberpunk | matrix | amber | syndicate>', 'line-warning');
        }
        break;

      case 'sound':
        if (args[0] === 'off') {
          cyberAudio.isMuted = true;
          this.log('[AUDIO]: Sound FX disabled.', 'line-dim');
        } else {
          cyberAudio.isMuted = false;
          this.log('[AUDIO]: Sound FX enabled.', 'line-success');
        }
        break;

      case 'bgm':
        const active = cyberAudio.toggleBgm();
        this.log(`[BGM]: Synthesizer drone ${active ? 'enabled' : 'disabled'}.`, 'line-system');
        break;

      case 'crt':
        document.body.classList.toggle('crt-enabled');
        this.log(`[CRT]: Screen flicker overlay toggled.`, 'line-dim');
        break;

      case 'matrix':
        this.matrixRainMode = !this.matrixRainMode;
        this.log(`[MATRIX MODE]: Canvas mode switched to ${this.matrixRainMode ? 'DIGITAL DATA RAIN' : 'NEURAL CONSTELLATION'}.`, 'line-system');
        break;

      case 'ping':
        this.cmdPing(args[0] || 'arasaka.corp.net');
        break;

      case 'ls':
        this.log('<span style="color:#00f0ff;">daemons/</span>  <span style="color:#00f0ff;">exploits/</span>  <span style="color:#ffe600;">corpo_secrets.txt</span>  <span style="color:#ff0055;">passwords.enc</span>  <span style="color:#00ff66;">netrunner_manifesto.md</span>');
        break;

      case 'cat':
        this.cmdCat(args[0]);
        break;

      case 'whoami':
        this.log(`ALIAS: ${this.player.alias} // RANK: ${this.player.rank} // CLEARANCE: LVL ${this.player.level}`);
        break;

      case 'sudo':
        cyberAudio.playError();
        this.log('User guest is not in sudoers file. This corporate incident will be reported to Arasaka SecOps.', 'line-error');
        break;

      case 'clear':
        this.outputEl.innerHTML = '';
        break;

      default:
        cyberAudio.playError();
        this.log(`Command not found: "${cmd}". Type <span style="color:#00f0ff;">help</span> for commands list.`, 'line-error');
        break;
    }
  }

  /* ========================================================================
     COMMAND IMPLEMENTATIONS
     ======================================================================== */
  cmdHelp() {
    cyberAudio.playBeep(900, 0.08);
    const helpTable = `
<div style="margin: 8px 0; font-size: 12px;">
  <div style="color: #00f0ff; font-weight: 700; margin-bottom: 6px;">[ CYBERNET OPERATING SYSTEM // COMMAND REFERENCE ]</div>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="color:#ffe600; width: 140px; padding: 2px 0;">scan</td><td style="color:#a3b8cc;">Scan local subnet & discover vulnerable corpo nodes</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">breach [target]</td><td style="color:#a3b8cc;">Launch Cyberpunk 2077 Breach Protocol hex matrix minigame</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">decrypt</td><td style="color:#a3b8cc;">Start Cryptographic Cipher Bypass code-breaking game</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">guess &lt;code&gt;</td><td style="color:#a3b8cc;">Submit code guess for active Cipher minigame</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">abort</td><td style="color:#a3b8cc;">Abort current active minigame</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">shop / market</td><td style="color:#a3b8cc;">Access Black Market cyberdeck upgrades</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">buy &lt;item_id&gt;</td><td style="color:#a3b8cc;">Purchase cyberdeck upgrades & RAM extensions</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">stats / profile</td><td style="color:#a3b8cc;">Display Netrunner dossier, level, creds & telemetry</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">trace</td><td style="color:#a3b8cc;">Check corporate trace risk level</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">clear-trace</td><td style="color:#a3b8cc;">Pay ₮200 to erase corporate intrusion trace</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">theme &lt;name&gt;</td><td style="color:#a3b8cc;">Switch theme: cyberpunk, matrix, amber, syndicate</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">matrix</td><td style="color:#a3b8cc;">Toggle matrix digital data rain background</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">sound [on|off]</td><td style="color:#a3b8cc;">Toggle procedural Web Audio sound synthesis</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">bgm [on|off]</td><td style="color:#a3b8cc;">Toggle generative synthwave arpeggio drone</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">ping &lt;host&gt;</td><td style="color:#a3b8cc;">Send ICMP probe to cyber target</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">cat &lt;file&gt;</td><td style="color:#a3b8cc;">Read lore files (e.g. cat corpo_secrets.txt)</td></tr>
    <tr><td style="color:#ffe600; padding: 2px 0;">clear</td><td style="color:#a3b8cc;">Clear terminal screen buffer</td></tr>
  </table>
</div>
    `;
    this.log(helpTable);
  }

  cmdScan() {
    cyberAudio.playGlitch();
    this.log('[SCANNING LOCAL SUBNET...] Penetrating subnet firewall...', 'line-system');
    
    setTimeout(() => {
      this.renderTargets();
      this.log(`[SCAN COMPLETE]: Found ${this.targets.length} vulnerable subnet nodes in range:`, 'line-success');
      this.targets.forEach(t => {
        this.log(`- <strong style="color:#00f0ff;">${t.name}</strong> [Diff: ${t.diff} | Security: ${t.sec} | Bounty: ${t.creds}] (type "breach ${t.name}")`);
      });
      cyberAudio.playBeep(1400, 0.1);
    }, 400);
  }

  cmdBreach(args) {
    if (this.minigameEngine.activeGame) {
      this.log('[WARNING]: An operation is already active. Complete or "abort" first.', 'line-warning');
      return;
    }

    let targetName = 'ARASAKA-FINANCIAL-PROXY';
    let diff = 'NORMAL';

    if (args.length > 0) {
      const match = this.targets.find(t => t.name.toLowerCase().includes(args[0].toLowerCase()));
      if (match) {
        targetName = match.name;
        diff = match.diff;
      } else {
        targetName = args.join(' ').toUpperCase();
      }
    }

    this.minigameEngine.startBreachProtocol(targetName, diff);
  }

  cmdCipher(args) {
    if (this.minigameEngine.activeGame) {
      this.log('[WARNING]: An operation is already active. Complete or "abort" first.', 'line-warning');
      return;
    }
    const diff = (args[0] && args[0].toUpperCase() === 'HARD') ? 'HARD' : 'NORMAL';
    this.minigameEngine.startCipherBypass(diff);
  }

  cmdShop() {
    cyberAudio.playBeep(850, 0.1);
    let html = `
<div style="margin: 8px 0;">
  <div style="color: #ffe600; font-weight: 700; margin-bottom: 6px;">[ NIGHT CITY BLACK MARKET // CYBERDECK RIGS ]</div>
  <div style="color: #6282a5; margin-bottom: 8px;">Available balance: <strong style="color:#ffe600;">₮ ${this.player.credits}</strong></div>
    `;

    this.shopItems.forEach(item => {
      const status = item.bought ? '<span style="color:#00ff66;">[INSTALLED]</span>' : `<button class="quick-cmd-chip" data-buy="${item.id}">BUY ₮${item.cost}</button>`;
      html += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid rgba(0,240,255,0.1);">
          <div>
            <div style="color: #00f0ff; font-weight: 700;">${item.name}</div>
            <div style="font-size: 10px; color: #6282a5;">${item.desc} (ID: <code style="color:#ffe600;">${item.id}</code>)</div>
          </div>
          <div>${status}</div>
        </div>
      `;
    });

    html += `
      <div style="margin-top: 8px; font-size: 11px; color: #6282a5;">To purchase, type: <kbd>buy &lt;item_id&gt;</kbd> (e.g. buy buffer5)</div>
</div>
    `;
    this.log(html);

    // Attach buy listeners
    setTimeout(() => {
      this.outputEl.querySelectorAll('[data-buy]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-buy');
          this.executeCommand(`buy ${id}`);
        });
      });
    }, 50);
  }

  cmdBuy(itemId) {
    if (!itemId) {
      this.log('[USAGE]: buy <item_id> (type "shop" to view inventory)', 'line-warning');
      return;
    }

    const item = this.shopItems.find(i => i.id.toLowerCase() === itemId.toLowerCase());
    if (!item) {
      cyberAudio.playError();
      this.log(`[SHOP ERROR]: Item "${itemId}" not found in Black Market catalog.`, 'line-error');
      return;
    }

    if (item.bought) {
      this.log(`[INFO]: ${item.name} is already installed on your cyberdeck.`, 'line-dim');
      return;
    }

    if (this.player.credits < item.cost) {
      cyberAudio.playError();
      this.log(`[INSUFFICIENT FUNDS]: Requires ₮${item.cost}, but you have ₮${this.player.credits}. Hack more targets!`, 'line-error');
      return;
    }

    // Purchase successful
    this.player.credits -= item.cost;
    item.bought = true;
    cyberAudio.playSuccess();

    if (item.id === 'buffer5') {
      this.player.bufferSize = 5;
    } else if (item.id === 'buffer6') {
      this.player.bufferSize = 6;
    } else if (item.id === 'ice2') {
      this.player.iceBreaker = 'v2.0 Tetrathron (+20% payout)';
      this.player.iceLevel = 2;
    }

    this.updateHud();
    this.log(`[UPGRADE INSTALLED]: Successfully acquired "${item.name}"!`, 'line-success');
  }

  cmdStats() {
    cyberAudio.playBeep(1000, 0.08);
    const html = `
<div style="margin: 8px 0; background: rgba(0,0,0,0.3); padding: 10px; border: 1px solid rgba(0,240,255,0.2);">
  <div style="color: #00f0ff; font-weight: 700; margin-bottom: 6px;">[ NETRUNNER DOSSIER // PROFILE SUMMARY ]</div>
  <div>OPERATIVE ALIAS: <strong style="color:#fff;">${this.player.alias}</strong></div>
  <div>CLASS / RANK: <span style="color:#ff0055; font-weight:700;">${this.player.rank}</span> (Level ${this.player.level})</div>
  <div>EXPERIENCE: <span style="color:#ffe600;">${this.player.exp} / ${this.player.nextLevelExp} EXP</span></div>
  <div>ACCOUNT CREDITS: <span style="color:#ffe600; font-weight:700;">₮ ${this.player.credits}</span></div>
  <div>INSTALLED BUFFER: <span style="color:#00ff66;">${this.player.bufferSize} Hex Slots</span></div>
  <div>ICE BREAKER: <span style="color:#00f0ff;">${this.player.iceBreaker}</span></div>
  <div>HACKS COMPLETED: <span style="color:#fff;">${this.player.hacksCompleted}</span></div>
  <div>CORPO TRACE THREAT: <span style="color:${this.player.traceLevel > 50 ? '#ff0055' : '#00ff66'};">${this.player.traceLevel}%</span></div>
</div>
    `;
    this.log(html);
  }

  cmdTrace() {
    const level = this.player.traceLevel;
    if (level === 0) {
      this.log('[TRACE CLEAN]: Stealth signature active. No corporate detection detected.', 'line-success');
    } else if (level < 50) {
      this.log(`[TRACE ELEVATED]: Subnet trace at ${level}%. Clean your trace before 100% with "clear-trace".`, 'line-warning');
    } else {
      cyberAudio.playAlarm();
      this.log(`[DANGER]: Corpo trace at ${level}%! Arasaka NetSec counter-intrusion imminent! Type "clear-trace" to dump proxy!`, 'line-error');
    }
  }

  cmdClearTrace() {
    if (this.player.traceLevel === 0) {
      this.log('[INFO]: Trace level is already 0%. No scrub needed.', 'line-dim');
      return;
    }
    const cost = 200;
    if (this.player.credits < cost) {
      cyberAudio.playError();
      this.log(`[ERROR]: Requires ₮${cost} to buy decoy proxy tunnels.`, 'line-error');
      return;
    }
    this.player.credits -= cost;
    this.player.traceLevel = 0;
    cyberAudio.playSuccess();
    this.updateHud();
    this.log('[TRACE SCRUBBED]: Decoy proxy servers established. Trace reset to 0%.', 'line-success');
  }

  cmdPing(host) {
    this.log(`PING ${host} (198.51.100.${Math.floor(Math.random()*254)}): 56 data bytes`, 'line-dim');
    cyberAudio.playBeep(900, 0.05);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      const time = (12 + Math.random() * 20).toFixed(1);
      this.log(`64 bytes from ${host}: icmp_seq=${count} ttl=54 time=${time} ms`);
      cyberAudio.playKeyClick();
      if (count >= 4) {
        clearInterval(interval);
        this.log(`--- ${host} ping statistics --- \n4 packets transmitted, 4 received, 0% packet loss`, 'line-system');
      }
    }, 300);
  }

  cmdCat(filename) {
    if (!filename) {
      this.log('[USAGE]: cat <filename> (type "ls" to view files)', 'line-warning');
      return;
    }

    if (filename.includes('manifesto')) {
      cyberAudio.playBeep(1100, 0.1);
      this.log(`
<span style="color:#00ff66;">=== NETRUNNER MANIFESTO // 2077 ===</span>
"We do not seek control over the Net. We seek freedom from the mega-corps who fence it.
Every byte encrypted is a barricade; every breach is a breath of digital air.
Stay fast, stay quiet, leave no trace."
      `);
    } else if (filename.includes('corpo')) {
      this.log(`
<span style="color:#ff0055;">=== TOP SECRET // ARASAKA SEC-OPS LOGS ===</span>
[MEMO-994]: Subject VEXEL spotted infiltrating sub-orbital relay nodes.
Counter-ICE deployed. Authorization for flatline protocol requested.
      `);
    } else if (filename.includes('passwords')) {
      cyberAudio.playGlitch();
      this.log('[DECRYPTION FAILED]: File is encrypted with 4096-bit Militech Quantum Cipher. Run "decrypt" to launch cipher bypass engine.', 'line-error');
    } else {
      this.log(`cat: ${filename}: No such file or directory.`, 'line-error');
    }
  }

  /* ========================================================================
     REWARDS & TELEMETRY UPDATES
     ======================================================================== */
  addRewards(creds, exp) {
    // Apply ICE-breaker bonus if owned
    if (this.player.iceLevel === 2) {
      creds = Math.floor(creds * 1.2);
    }
    this.player.credits += creds;
    this.player.exp += exp;

    // Check Level Up
    if (this.player.exp >= this.player.nextLevelExp) {
      this.player.level++;
      this.player.exp -= this.player.nextLevelExp;
      this.player.nextLevelExp = Math.floor(this.player.nextLevelExp * 1.6);
      
      const ranks = ['SCRIPT KIDDIE', 'CODE INFILTRATOR', 'NETRUNNER', 'CYBER PHANTOM', 'GHOST IN THE SHELL'];
      this.player.rank = ranks[Math.min(this.player.level - 1, ranks.length - 1)];

      this.log(`\n🎉 [LEVEL UP]: Netrunner Level increased to ${this.player.level}! Promoted to "${this.player.rank}"!`, 'line-success');
    }

    this.updateHud();
  }

  triggerTraceAlert(amount) {
    this.player.traceLevel = Math.min(100, this.player.traceLevel + amount);
    this.updateHud();

    if (this.player.traceLevel >= 100) {
      cyberAudio.playAlarm();
      this.log('\n🚨 [CRITICAL ALERT]: CORPO ICE COUNTER-HACK DETECTED! ₮500 drained by intrusion defense!', 'line-error');
      this.player.credits = Math.max(0, this.player.credits - 500);
      this.player.traceLevel = 40; // reset to 40
      this.updateHud();
    }
  }

  updateHud() {
    // Top Bar
    document.getElementById('headerCreds').textContent = `₮ ${this.player.credits.toLocaleString()}`;
    const traceFill = document.getElementById('topTraceFill');
    const traceVal = document.getElementById('topTraceVal');
    traceFill.style.width = `${this.player.traceLevel}%`;
    traceVal.textContent = `${this.player.traceLevel}%`;

    // Dossier Card
    document.getElementById('dossierRank').textContent = `CLASS: ${this.player.rank}`;
    document.getElementById('currentExp').textContent = this.player.exp;
    document.getElementById('nextLevelExp').textContent = this.player.nextLevelExp;
    const expPct = Math.min(100, Math.floor((this.player.exp / this.player.nextLevelExp) * 100));
    document.getElementById('expBarFill').style.width = `${expPct}%`;

    document.getElementById('hudIceBreaker').textContent = this.player.iceBreaker;
    document.getElementById('hudBufferSize').textContent = `${this.player.bufferSize} Slots`;
    document.getElementById('hudHacksCount').textContent = this.player.hacksCompleted;
    document.getElementById('hudTotalCreds').textContent = `₮ ${this.player.credits.toLocaleString()}`;

    // Ice Threat
    const threatBadge = document.getElementById('iceThreatLevel');
    if (this.player.traceLevel >= 70) {
      threatBadge.textContent = 'CRITICAL';
      threatBadge.style.background = 'rgba(255,0,85,0.4)';
    } else if (this.player.traceLevel >= 30) {
      threatBadge.textContent = 'ELEVATED';
      threatBadge.style.background = 'rgba(255,230,0,0.3)';
    } else {
      threatBadge.textContent = 'SECURE';
      threatBadge.style.background = 'rgba(0,240,255,0.15)';
    }
  }

  renderTargets() {
    const listEl = document.getElementById('targetList');
    const radarNodes = document.getElementById('radarNodesContainer');
    listEl.innerHTML = '';
    radarNodes.innerHTML = '';

    this.targets.forEach(t => {
      // List Item
      const item = document.createElement('div');
      item.className = `target-item ${t.sec === 'CRITICAL' ? 'high-sec' : ''}`;
      item.innerHTML = `
        <div class="target-item-info">
          <span class="target-name">${t.name}</span>
          <span class="target-diff">[${t.diff}] // Bounty: ${t.creds}</span>
        </div>
        <button class="target-hack-btn">HACK</button>
      `;

      item.querySelector('.target-hack-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.executeCommand(`breach ${t.name}`);
      });

      item.addEventListener('click', () => {
        this.executeCommand(`breach ${t.name}`);
      });

      listEl.appendChild(item);

      // Radar Blip
      const blip = document.createElement('div');
      blip.className = 'radar-blip';
      blip.style.left = `${t.x * 100}%`;
      blip.style.top = `${t.y * 100}%`;
      blip.title = `${t.name} (${t.diff})`;
      blip.addEventListener('click', () => {
        this.executeCommand(`breach ${t.name}`);
      });
      radarNodes.appendChild(blip);
    });
  }

  /* ========================================================================
     BACKGROUND CANVAS & OSCILLOSCOPE ANIMATIONS
     ======================================================================== */
  setupCanvas() {
    const canvas = this.bgCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize Constellation Particles
    this.particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1
      });
    }

    // Initialize Matrix Rain Drops
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    this.matrixDrops = [];
    for (let i = 0; i < columns; i++) {
      this.matrixDrops[i] = Math.floor(Math.random() * -50);
    }

    if (!this.canvasLoopStarted) {
      this.canvasLoopStarted = true;
      const animate = () => {
        this.drawBackground(ctx, canvas);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }

  drawBackground(ctx, canvas) {
    if (this.matrixRainMode) {
      // Matrix Rain Effect
      ctx.fillStyle = 'rgba(5, 7, 17, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66';
      ctx.font = '14px monospace';

      const katakana = '0123456789ABCDEF0123456789アカサタナハマヤラワ';
      for (let i = 0; i < this.matrixDrops.length; i++) {
        const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
        ctx.fillText(text, i * 16, this.matrixDrops[i] * 16);

        if (this.matrixDrops[i] * 16 > canvas.height && Math.random() > 0.975) {
          this.matrixDrops[i] = 0;
        }
        this.matrixDrops[i]++;
      }
    } else {
      // Neural Constellation Network
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }
  }

  setupOscilloscope() {
    const canvas = this.oscCanvas;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const drawOsc = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = this.player.traceLevel > 50 ? '#ff0055' : '#00f0ff';
      ctx.beginPath();

      const midY = canvas.height / 2;
      for (let x = 0; x < canvas.width; x++) {
        const noise = (Math.random() - 0.5) * 6;
        const y = midY + Math.sin(x * 0.08 + phase) * 16 + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.12;
      requestAnimationFrame(drawOsc);
    };

    requestAnimationFrame(drawOsc);

    // Randomize telemetry traffic rate periodically
    setInterval(() => {
      const inRate = Math.floor(180 + Math.random() * 120);
      const inboundEl = document.getElementById('inboundRate');
      if (inboundEl) inboundEl.textContent = `${inRate} kb/s`;
    }, 2000);
  }

  setupClock() {
    const clockEl = document.getElementById('cyberClock');
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      clockEl.textContent = `${h}:${m}:${s} NC-ST`;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }
}

// Instantiate on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.cyberApp = new CyberTerminalApp();
  window.cyberApp.init();

  // First interaction audio context unlock
  document.body.addEventListener('click', () => {
    cyberAudio.ensureContext();
  }, { once: true });
});
