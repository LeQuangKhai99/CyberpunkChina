/**
 * CYBERNET OS // Procedural Web Audio Synthesizer
 * Pure Web Audio API - Zero external audio file dependencies
 */

class CyberAudioSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmEnabled = false;
    this.bgmInterval = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.initialized = true;
      const statusEl = document.getElementById('audioStateIndicator');
      if (statusEl) statusEl.textContent = 'AUDIO SYNTH: ACTIVE (WEB AUDIO API)';
    } catch (e) {
      console.warn('Web Audio could not be initialized:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  /**
   * Mechanical futuristic key click with random variance
   */
  playKeyClick() {
    if (this.isMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Subtle randomize
    const freq = 900 + Math.random() * 400;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(2.5, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  /**
   * Action Confirmation / Enter Key tone
   */
  playEnter() {
    if (this.isMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  /**
   * Standard sci-fi chirp
   */
  playBeep(freq = 880, duration = 0.08, type = 'sine') {
    if (this.isMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  /**
   * Low harsh error / access denied buzzer
   */
  playError() {
    if (this.isMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(140, t);
    osc1.frequency.linearRampToValueAtTime(80, t + 0.22);
    osc2.frequency.setValueAtTime(138, t);
    osc2.frequency.linearRampToValueAtTime(78, t + 0.22);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.25);
    osc2.stop(t + 0.25);
  }

  /**
   * Ascending high-tech triumph chord
   */
  playSuccess() {
    if (this.isMuted || !this.initialized) return;
    this.ensureContext();

    const notes = [440, 554.37, 659.25, 880]; // A major cyber chime
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.22);
      }, idx * 60);
    });
  }

  /**
   * Cyber Matrix code select ping
   */
  playMatrixPick() {
    if (this.isMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.05);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Glitch burst noise
   */
  playGlitch() {
    if (this.isMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(250, t);
    osc.frequency.setValueAtTime(1600, t + 0.02);
    osc.frequency.setValueAtTime(100, t + 0.04);
    osc.frequency.setValueAtTime(800, t + 0.06);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  /**
   * Generative Ambient Synthwave Drone / Arpeggiator (BGM)
   */
  toggleBgm() {
    this.bgmEnabled = !this.bgmEnabled;
    this.ensureContext();

    if (!this.bgmEnabled) {
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
      return false;
    }

    // Scale notes: Synthwave minor pentatonic (D minor: D, F, G, A, C)
    const scale = [146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 349.23, 392.00, 440.00];
    let step = 0;

    this.bgmInterval = setInterval(() => {
      if (!this.ctx || this.isMuted || !this.bgmEnabled) return;
      const t = this.ctx.currentTime;

      // Arpeggio note
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const note = scale[step % scale.length];
      step = (step + Math.floor(Math.random() * 3) + 1) % scale.length;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600 + Math.sin(t * 0.5) * 300, t);
      filter.Q.setValueAtTime(3, t);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(t);
      osc.stop(t + 0.28);
    }, 220);

    return true;
  }
}

// Global Audio Instance
const cyberAudio = new CyberAudioSystem();
