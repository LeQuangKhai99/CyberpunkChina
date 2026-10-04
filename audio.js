/**
 * CYBERPUNK CHINA // Web Audio API Synthesizer & Speech Engine
 * Procedural SFX, Chinese TTS Pronunciation & Ambient Synthwave BGM
 */

class CyberPinyinAudio {
  constructor() {
    this.ctx = null;
    this.sfxMuted = false;
    this.bgmMuted = false;
    this.voiceEnabled = true;
    this.bgmInterval = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.chineseVoice = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.initialized = true;
      this.loadVoices();
    } catch (e) {
      console.warn('Web Audio initialization error:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  loadVoices() {
    if ('speechSynthesis' in window) {
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        // Find Chinese zh-CN or zh-HK voice
        this.chineseVoice = voices.find(v => v.lang.startsWith('zh')) || null;
      };
      setVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
    }
  }

  /**
   * Speak Chinese character using native SpeechSynthesis
   */
  speakChinese(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'zh-CN';
      utter.rate = 0.95;
      utter.pitch = 1.0;
      if (this.chineseVoice) {
        utter.voice = this.chineseVoice;
      }
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  }

  /**
   * Laser cannon blast sound
   */
  playLaser() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.14);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  /**
   * Neon particle explosion sound
   */
  playExplosion() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    
    // Low punch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.25);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.25);

    // Chime harmonics
    [880, 1320].forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const ct = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ct);
        g.gain.setValueAtTime(0.15, ct);
        g.gain.exponentialRampToValueAtTime(0.001, ct + 0.15);
        o.connect(g);
        g.connect(this.masterGain);
        o.start(ct);
        o.stop(ct + 0.15);
      }, idx * 40);
    });
  }

  /**
   * Ground Shield Damage sound (Metallic crash + alarm)
   */
  playShieldDamage() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(120, t);
    osc1.frequency.linearRampToValueAtTime(60, t + 0.3);
    osc2.frequency.setValueAtTime(185, t);
    osc2.frequency.linearRampToValueAtTime(75, t + 0.3);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.35);
    osc2.stop(t + 0.35);
  }

  /**
   * Typing keystroke sound
   */
  playKeypress() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900 + Math.random() * 300, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  /**
   * Combo streak sound
   */
  playComboChime(streak) {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const baseFreq = 523.25; // C5
    const multiplier = 1 + (streak % 8) * 0.12;
    const freq = baseFreq * multiplier;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  /**
   * Critical Health Alarm
   */
  playCriticalAlarm() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(750, t);
    osc.frequency.setValueAtTime(600, t + 0.1);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  /**
   * Game Over Sound
   */
  playGameOver() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const notes = [440, 392, 349, 293, 220];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.4);
      }, idx * 140);
    });
  }

  /**
   * Generative Cyberpunk Synthwave Drone (Chinese Pentatonic Minor)
   */
  toggleBgm() {
    this.bgmMuted = !this.bgmMuted;
    this.ensureContext();

    if (this.bgmMuted) {
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
      return false;
    }

    // Chinese pentatonic scale in D: D, F, G, A, C
    const scale = [146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 349.23, 392.00];
    let step = 0;

    this.bgmInterval = setInterval(() => {
      if (!this.ctx || this.bgmMuted) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const note = scale[step % scale.length];
      step = (step + Math.floor(Math.random() * 2) + 1) % scale.length;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500 + Math.sin(t * 0.4) * 250, t);
      filter.Q.setValueAtTime(3, t);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(t);
      osc.stop(t + 0.28);
    }, 240);

    return true;
  }
}

// Global instance
const gameAudio = new CyberPinyinAudio();
