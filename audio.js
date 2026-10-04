/**
 * CYBERPUNK CHINA // 8-Bit Retro Chiptune Web Audio Engine & Speech Engine
 * Authentic 8-Bit Square/Triangle/Noise Synthesizer with Continuously Varying SFX
 */

class CyberPinyinAudio {
  constructor() {
    this.ctx = null;
    this.sfxMuted = false;
    this.bgmMuted = false; // DEFAULT ON as requested!
    this.voiceEnabled = true;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.chineseVoice = null;
    this.initialized = false;

    // Preloaded 8-Bit Audio Assets (Game SFX from files)
    this.audioFiles = {};
    this.initAudioFiles();

    // 8-Bit Noise Buffer (NES 16-level LFSR stepped emulation)
    this.noiseBuffer = null;

    // Variation Counters for Continuous Dynamic Variety
    this.laserVarIndex = 0;
    this.explosionVarIndex = 0;
    this.keyNoteIndex = 0;
    this.lastLaserTime = 0;

    // 8-Bit Chiptune BGM Sequencer
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.bgmPattern = 0;
  }

  initAudioFiles() {
    try {
      this.audioFiles = {
        laser: new Audio('assets/audio/laser_8bit.wav'),
        explosion: new Audio('assets/audio/explosion_8bit.wav'),
        coin: new Audio('assets/audio/coin_8bit.wav'),
        levelUp: new Audio('assets/audio/level_up_8bit.wav'),
        bgm: new Audio('assets/audio/bgm_8bit_loop.wav')
      };
      if (this.audioFiles.bgm) {
        this.audioFiles.bgm.loop = true;
        this.audioFiles.bgm.volume = 0.35;
      }
    } catch (e) {
      console.warn('Audio files init warning:', e);
    }
  }

  playFile(name, volume = 0.8) {
    if (this.sfxMuted) return;
    try {
      const orig = this.audioFiles[name];
      if (orig) {
        const sound = orig.cloneNode();
        sound.volume = volume;
        sound.play().catch(() => {});
      }
    } catch (e) {}
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.init8BitNoiseBuffer();
      this.loadVoices();
      this.initialized = true;
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

  /**
   * Generates a 2-second loopable authentic 8-bit quantized noise buffer
   * mimicking the NES Ricoh 2A03 / Game Boy stepped pseudo-random noise channel.
   */
  init8BitNoiseBuffer() {
    if (this.noiseBuffer || !this.ctx) return;
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 2;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = this.noiseBuffer.getChannelData(0);

    let lastSample = 0;
    for (let i = 0; i < bufferSize; i++) {
      // Step rate clock (every 4 samples creates the classic chunky ~11kHz 8-bit clock rate)
      if (i % 4 === 0) {
        const raw = Math.random() * 2 - 1;
        // 16-level stepped quantization
        lastSample = Math.round(raw * 8) / 8;
      }
      data[i] = lastSample;
    }
  }

  loadVoices() {
    if ('speechSynthesis' in window) {
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        this.chineseVoice = voices.find(v => v.lang.startsWith('zh')) || null;
      };
      setVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
    }
  }

  speakChinese(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
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

  /* ==========================================================================
     8-BIT LASER CANNON BLASTS (5 Continuously Varying Retro Styles)
     ========================================================================== */
  playLaser(combo = 1) {
    if (this.sfxMuted) return;
    this.playFile('laser', Math.min(0.85, 0.45 + (combo - 1) * 0.08));
    if (!this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    // Micro pitch variation (±9%) and subtle upward transposition with combo streak
    const comboPitchMod = Math.min(1.4, 1 + (combo - 1) * 0.06);
    const randomDetune = 0.93 + Math.random() * 0.14;
    const pitch = comboPitchMod * randomDetune;

    const style = this.laserVarIndex;
    this.laserVarIndex = (this.laserVarIndex + 1) % 5;

    switch (style) {
      case 0:
        // Style 0: Classic 8-Bit Downward Zap (Square Wave fast sweep + Noise crack)
        this.synthSquareSweep(1750 * pitch, 120 * pitch, 0.08, 0.35, t);
        this.synth8BitNoise(0.04, 1200 * pitch, 0.15, t);
        break;

      case 1:
        // Style 1: Dual-Pulse 8-Bit Arcade Blaster (Double square pulse)
        this.synthSquareSweep(1450 * pitch, 320 * pitch, 0.045, 0.32, t);
        this.synthSquareSweep(1850 * pitch, 280 * pitch, 0.045, 0.30, t + 0.038);
        break;

      case 2:
        // Style 2: Staccato Chiptune Triple-Arp Laser (Fast 3-step frequency drop)
        this.synthArpLaser(
          [1600 * pitch, 1050 * pitch, 520 * pitch, 180 * pitch],
          0.022,
          0.32,
          t
        );
        break;

      case 3:
        // Style 3: 8-Bit Phaser Beam (Fast vibrato frequency sweep)
        this.synthVibratoSquare(2100 * pitch, 220 * pitch, 0.09, 45, 0.34, t);
        break;

      case 4:
      default:
        // Style 4: Heavy 8-Bit Pulse Cannon (Square wave sweep + crunchy noise tail)
        this.synthSquareSweep(1250 * pitch, 90 * pitch, 0.10, 0.38, t);
        this.synth8BitNoise(0.06, 950 * pitch, 0.20, t + 0.02);
        break;
    }
  }

  synthSquareSweep(startFreq, endFreq, duration, volume, startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  synthArpLaser(freqs, stepDuration, volume, startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    freqs.forEach((f, idx) => {
      osc.frequency.setValueAtTime(f, startTime + idx * stepDuration);
    });

    const totalDuration = freqs.length * stepDuration;
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + totalDuration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(startTime);
    osc.stop(startTime + totalDuration);
  }

  synthVibratoSquare(startFreq, endFreq, duration, vibratoRate, volume, startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);

    lfo.type = 'sawtooth';
    lfo.frequency.setValueAtTime(vibratoRate, startTime);
    lfoGain.gain.setValueAtTime(120, startTime);

    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    lfo.start(startTime);
    osc.start(startTime);
    lfo.stop(startTime + duration);
    osc.stop(startTime + duration);
  }

  /* ==========================================================================
     8-BIT EXPLOSIONS & IMPACTS (4 Continuously Varying Retro Styles)
     ========================================================================== */
  playExplosion(combo = 1) {
    if (this.sfxMuted) return;
    this.playFile('explosion', Math.min(0.9, 0.55 + (combo - 1) * 0.08));
    if (!this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const style = this.explosionVarIndex;
    this.explosionVarIndex = (this.explosionVarIndex + 1) % 4;

    const pitchMod = 0.90 + Math.random() * 0.20;

    switch (style) {
      case 0:
        // Style 0: Crunchy 8-Bit Noise Crash + Low Triangle Boom
        this.synth8BitNoise(0.24, 1400 * pitchMod, 0.45, t);
        this.synthTriangleBoom(160 * pitchMod, 32, 0.22, 0.45, t);
        break;

      case 1:
        // Style 1: Pixel Shatter Debris (Crunch noise + 3-step descending square tone)
        this.synth8BitNoise(0.18, 2200 * pitchMod, 0.38, t);
        [380, 260, 140].forEach((freq, idx) => {
          setTimeout(() => {
            if (!this.ctx) return;
            const ct = this.ctx.currentTime;
            this.synthSquareSweep(freq * pitchMod, (freq * 0.5) * pitchMod, 0.05, 0.22, ct);
          }, idx * 28);
        });
        break;

      case 2:
        // Style 2: Sub-Bass Retro Rumble (Distorted square rumble + bitcrushed hiss)
        this.synthSquareSweep(130 * pitchMod, 30, 0.26, 0.48, t);
        this.synth8BitNoise(0.15, 800 * pitchMod, 0.32, t + 0.02);
        break;

      case 3:
      default:
        // Style 3: Retro Score Pickup / Shatter Chime (Crunch burst + rapid ascending triad)
        this.synth8BitNoise(0.16, 1600 * pitchMod, 0.38, t);
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          setTimeout(() => {
            if (!this.ctx) return;
            const ct = this.ctx.currentTime;
            this.synthSquareSweep(freq * pitchMod, freq * 0.95 * pitchMod, 0.04, 0.18, ct);
          }, idx * 30);
        });
        break;
    }
  }

  synth8BitNoise(duration, filterCutoff, volume, startTime) {
    if (!this.noiseBuffer) this.init8BitNoiseBuffer();
    if (!this.noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterCutoff, startTime);
    filter.frequency.exponentialRampToValueAtTime(60, startTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    source.start(startTime);
    source.stop(startTime + duration);
  }

  synthTriangleBoom(startFreq, endFreq, duration, volume, startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /* ==========================================================================
     8-BIT TARGET LOCK-ON CHIRP
     ========================================================================== */
  playTargetLock() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    // 2-tone retro lock chirp (C6 -> G6)
    osc.frequency.setValueAtTime(1046.50, t);
    osc.frequency.setValueAtTime(1567.98, t + 0.025);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  /* ==========================================================================
     8-BIT MELODIC KEYSTROKE BLEEPS (Pentatonic Rotating Typing Feedback)
     ========================================================================== */
  playKeypress() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    // Retro pentatonic note pool for melodic, non-fatiguing, delightful typing
    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50];
    const baseFreq = pentatonic[this.keyNoteIndex % pentatonic.length];
    this.keyNoteIndex = (this.keyNoteIndex + 1) % pentatonic.length;

    // Micro detune (±3%) so every keystroke has character
    const freq = baseFreq * (0.97 + Math.random() * 0.06);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.028);
  }

  /* ==========================================================================
     8-BIT MULTI-TIER COMBO ARPEGGIOS (Mario / Sonic / Arcade Style)
     ========================================================================== */
  playComboChime(streak) {
    if (this.sfxMuted) return;
    this.playFile('coin', 0.85);
    if (!this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    let notes = [];
    let speed = 0.032;

    if (streak >= 15) {
      // Overdrive: 6-Note Grand Victory Fanfare
      notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      speed = 0.028;
    } else if (streak >= 10) {
      // High Combo: 5-Note Ascending Pentatonic Run
      notes = [659.25, 783.99, 987.77, 1318.51, 1567.98];
      speed = 0.030;
    } else if (streak >= 6) {
      // Mid Combo: 4-Note Classic Arcade Coin Arpeggio
      notes = [523.25, 659.25, 783.99, 1046.50];
      speed = 0.034;
    } else {
      // Low Combo: 3-Note Triad
      notes = [523.25, 659.25, 783.99];
      speed = 0.038;
    }

    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const ct = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ct);

        gain.gain.setValueAtTime(0.24, ct);
        gain.gain.exponentialRampToValueAtTime(0.0001, ct + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(ct);
        osc.stop(ct + 0.12);
      }, idx * (speed * 1000));
    });
  }

  /* ==========================================================================
     8-BIT SHIELD DAMAGE CRASH (Crunchy NES Impact)
     ========================================================================== */
  playShieldDamage() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;

    // Crunchy noise burst
    this.synth8BitNoise(0.28, 850, 0.55, t);

    // Dissonant descending dual square wave impact
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'square';

    osc1.frequency.setValueAtTime(150, t);
    osc1.frequency.linearRampToValueAtTime(45, t + 0.28);

    osc2.frequency.setValueAtTime(115, t);
    osc2.frequency.linearRampToValueAtTime(38, t + 0.28);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.30);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.30);
    osc2.stop(t + 0.30);
  }

  /* ==========================================================================
     8-BIT CRITICAL ALARM (Alternating Square Wave Retro Siren)
     ========================================================================== */
  playCriticalAlarm() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(660, t + 0.08);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  /* ==========================================================================
     8-BIT GAME OVER TUNE (Classic Descending Minor Triads)
     ========================================================================== */
  playGameOver() {
    if (this.sfxMuted || !this.initialized) return;
    this.ensureContext();

    // Classic 8-bit death fanfare: descending minor run
    const deathTune = [
      { f: 440.00, dur: 0.14 },
      { f: 415.30, dur: 0.14 },
      { f: 392.00, dur: 0.14 },
      { f: 349.23, dur: 0.20 },
      { f: 293.66, dur: 0.20 },
      { f: 220.00, dur: 0.32 },
      { f: 146.83, dur: 0.50 }
    ];

    let delay = 0;
    deathTune.forEach((note) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.30, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + note.dur);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + note.dur);
      }, delay * 1000);
      delay += note.dur * 0.9;
    });

    // Final sub-bass boom
    setTimeout(() => {
      if (!this.ctx) return;
      this.synthTriangleBoom(120, 25, 0.6, 0.45, this.ctx.currentTime);
      this.synth8BitNoise(0.4, 600, 0.35, this.ctx.currentTime);
    }, delay * 1000);
  }

  /* ==========================================================================
     AUTHENTIC MULTI-TRACK 8-BIT CHIPTUNE BGM GENERATOR
     Square Lead + Triangle Bass + Noise Drum Channel (Dynamically Evolving)
     ========================================================================== */
  startBgm() {
    this.bgmMuted = false;
    this.ensureContext();
    if (this.bgmTimer) return true;

    // 8-Bit Chiptune Musical Sequences (Key of D / Pentatonic Cyberpunk)
    // Melodic Patterns for Channel 1 (Square Lead)
    const patterns = [
      // Pattern 0: Catchy Retro Arcade Hook
      [293.66, 349.23, 440.00, 523.25, 587.33, 523.25, 440.00, 349.23, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23, 293.66, 0],
      // Pattern 1: Rapid 8-Bit Arpeggio Cascade
      [587.33, 440.00, 349.23, 293.66, 523.25, 440.00, 349.23, 261.63, 440.00, 349.23, 293.66, 220.00, 392.00, 349.23, 293.66, 440.00],
      // Pattern 2: High-Energy Syncopated Jump
      [587.33, 0, 587.33, 659.25, 698.46, 659.25, 587.33, 0, 523.25, 0, 523.25, 587.33, 440.00, 0, 392.00, 440.00],
      // Pattern 3: Cyberpunk Pentatonic Groove
      [440.00, 523.25, 587.33, 698.46, 587.33, 523.25, 440.00, 392.00, 349.23, 392.00, 440.00, 523.25, 440.00, 349.23, 293.66, 0]
    ];

    // Bassline for Channel 2 (Triangle Bass)
    const basslines = [
      [146.83, 146.83, 174.61, 174.61, 196.00, 196.00, 220.00, 146.83],
      [146.83, 220.00, 174.61, 261.63, 196.00, 220.00, 146.83, 293.66],
      [110.00, 146.83, 130.81, 174.61, 146.83, 220.00, 110.00, 146.83]
    ];

    const stepDuration = 0.135; // ~111 BPM 16th-note groove
    this.bgmStep = 0;
    this.bgmPattern = 0;

    this.bgmTimer = setInterval(() => {
      if (!this.ctx || this.bgmMuted) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const t = this.ctx.currentTime;
      const curPat = patterns[this.bgmPattern % patterns.length];
      const curBass = basslines[this.bgmPattern % basslines.length];

      const leadNote = curPat[this.bgmStep % curPat.length];
      const bassNote = curBass[Math.floor(this.bgmStep / 2) % curBass.length];

      // 1. Channel 1: Square Wave Lead Melody
      if (leadNote > 0) {
        const oscLead = this.ctx.createOscillator();
        const gainLead = this.ctx.createGain();

        oscLead.type = 'square';
        // Add subtle chiptune vibrato on accented beats
        oscLead.frequency.setValueAtTime(leadNote, t);
        if (this.bgmStep % 4 === 0) {
          oscLead.frequency.linearRampToValueAtTime(leadNote * 1.015, t + 0.08);
          oscLead.frequency.linearRampToValueAtTime(leadNote, t + 0.12);
        }

        gainLead.gain.setValueAtTime(0.085, t);
        gainLead.gain.exponentialRampToValueAtTime(0.0001, t + stepDuration * 0.95);

        oscLead.connect(gainLead);
        gainLead.connect(this.bgmGain);

        oscLead.start(t);
        oscLead.stop(t + stepDuration * 0.95);
      }

      // 2. Channel 2: Triangle Wave Bouncy Bass (every 2 steps)
      if (this.bgmStep % 2 === 0 && bassNote > 0) {
        const oscBass = this.ctx.createOscillator();
        const gainBass = this.ctx.createGain();

        oscBass.type = 'triangle';
        oscBass.frequency.setValueAtTime(bassNote, t);

        gainBass.gain.setValueAtTime(0.14, t);
        gainBass.gain.exponentialRampToValueAtTime(0.0001, t + stepDuration * 1.8);

        oscBass.connect(gainBass);
        gainBass.connect(this.bgmGain);

        oscBass.start(t);
        oscBass.stop(t + stepDuration * 1.8);
      }

      // 3. Channel 3: 8-Bit Noise Drums (Kick, Snare & Hi-Hat)
      const beatInBar = this.bgmStep % 8;
      if (beatInBar === 0 || beatInBar === 4) {
        // 8-Bit Kick: Low pitch triangle drop
        this.synthTriangleBoom(110, 30, 0.08, 0.20, t);
      } else if (beatInBar === 2 || beatInBar === 6) {
        // 8-Bit Snare: Crunchy bandpass noise burst
        this.synth8BitNoise(0.07, 1800, 0.15, t);
      } else {
        // 8-Bit Closed Hi-Hat: Crisp short noise tick
        this.synth8BitNoise(0.02, 3800, 0.07, t);
      }

      this.bgmStep++;
      // Evolve pattern every 32 steps (2 full bars)
      if (this.bgmStep % 32 === 0) {
        this.bgmPattern = (this.bgmPattern + 1) % patterns.length;
      }
    }, stepDuration * 1000);

    return true;
  }

  stopBgm() {
    this.bgmMuted = true;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    try {
      if (this.audioFiles && this.audioFiles.bgm) {
        this.audioFiles.bgm.pause();
      }
    } catch (e) {}
    return false;
  }

  toggleBgm() {
    if (this.bgmMuted) {
      return this.startBgm();
    } else {
      return this.stopBgm();
    }
  }

  playGameStart() {
    this.ensureContext();
    this.playFile('levelUp', 0.85);
    if (!this.sfxMuted && this.ctx) {
      const t = this.ctx.currentTime;
      [261.63, 329.63, 392.00, 523.25].forEach((freq, idx) => {
        this.synthSquareSweep(freq, freq * 1.05, 0.08, 0.28, t + idx * 0.06);
      });
    }
  }
}

// Global instance
const gameAudio = new CyberPinyinAudio();
window.gameAudio = gameAudio;
