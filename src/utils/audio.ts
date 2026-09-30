/**
 * Web Audio API Procedural Sound Synthesizer
 * Zero external audio files required. Runs in any modern browser.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  // Ambient loop synthesizer nodes
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private rumbleOsc1: OscillatorNode | null = null;
  private rumbleOsc2: OscillatorNode | null = null;
  private isAmbientRunning: boolean = false;
  private hasUserInteracted: boolean = false;
  private stopTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Read persistent preference immediately so initial state is never out of sync
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('colossal_sound_enabled');
        if (stored !== null) {
          this.enabled = stored === 'true';
        }
      } catch {
        this.enabled = true;
      }

      // Listen for initial user interaction to unlock Web Audio if enabled
      const unlockAudio = () => {
        this.hasUserInteracted = true;
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        if (this.enabled && !this.isAmbientRunning) {
          this.startAmbient();
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
    }
  }

  private initCtx(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Generate an 8-second Brownian noise buffer for deep wind and cavern atmosphere */
  private createBrownianNoiseBuffer(ctx: AudioContext, seconds: number = 8): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Integrated Brownian filter formula
      lastOut = (lastOut + 0.02 * white) / 1.02;
      output[i] = lastOut * 3.5;
    }
    return buffer;
  }

  /** Starts the subtle, low-frequency cavern wind and stone-rumble synthesizer loop */
  public startAmbient() {
    if (!this.enabled) return;

    if (this.stopTimeoutId) {
      clearTimeout(this.stopTimeoutId);
      this.stopTimeoutId = null;
    }

    if (this.isAmbientRunning && this.ambientGain) {
      return;
    }

    this.stopAmbient(true);

    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      // Master Ambient Gain Node with smooth fade-in
      this.ambientGain = ctx.createGain();
      const now = ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(0.0001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.038, now + 1.2);
      this.ambientGain.connect(ctx.destination);

      // Low-pass Filter for cavern acoustic dampening
      this.ambientFilter = ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(180, now);
      this.ambientFilter.Q.setValueAtTime(2.2, now);
      this.ambientFilter.connect(this.ambientGain);

      // LFO to simulate slow, breathing subterranean wind drafts
      this.lfoOsc = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      this.lfoOsc.type = 'sine';
      this.lfoOsc.frequency.setValueAtTime(0.12, now); // ~8.3s cycle
      lfoGain.gain.setValueAtTime(75, now);
      this.lfoOsc.connect(lfoGain);
      lfoGain.connect(this.ambientFilter.frequency);
      this.lfoOsc.start();

      // Looping Brownian wind noise source
      const noiseBuffer = this.createBrownianNoiseBuffer(ctx, 8);
      this.noiseSource = ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;
      this.noiseSource.connect(this.ambientFilter);
      this.noiseSource.start();

      // Deep Stone-Rumble Sub-Oscillators (48Hz sine and 74Hz triangle)
      this.rumbleOsc1 = ctx.createOscillator();
      const rumbleGain1 = ctx.createGain();
      this.rumbleOsc1.type = 'sine';
      this.rumbleOsc1.frequency.setValueAtTime(48, now);
      rumbleGain1.gain.setValueAtTime(0.018, now);
      this.rumbleOsc1.connect(rumbleGain1);
      rumbleGain1.connect(this.ambientGain);
      this.rumbleOsc1.start();

      this.rumbleOsc2 = ctx.createOscillator();
      const rumbleGain2 = ctx.createGain();
      this.rumbleOsc2.type = 'triangle';
      this.rumbleOsc2.frequency.setValueAtTime(74, now);
      rumbleGain2.gain.setValueAtTime(0.012, now);
      this.rumbleOsc2.connect(rumbleGain2);
      rumbleGain2.connect(this.ambientGain);
      this.rumbleOsc2.start();

      this.isAmbientRunning = true;
    } catch (e) {
      console.warn('Ambient synthesizer initialization deferred:', e);
    }
  }

  /** Stops and cleanly disconnects the ambient noise loop with smooth fade-out */
  public stopAmbient(immediate: boolean = false) {
    if (this.stopTimeoutId) {
      clearTimeout(this.stopTimeoutId);
      this.stopTimeoutId = null;
    }

    if (!this.ambientGain || !this.ctx) {
      this.isAmbientRunning = false;
      return;
    }

    const cleanNodes = () => {
      try {
        if (this.noiseSource) {
          this.noiseSource.stop();
          this.noiseSource.disconnect();
          this.noiseSource = null;
        }
        if (this.lfoOsc) {
          this.lfoOsc.stop();
          this.lfoOsc.disconnect();
          this.lfoOsc = null;
        }
        if (this.rumbleOsc1) {
          this.rumbleOsc1.stop();
          this.rumbleOsc1.disconnect();
          this.rumbleOsc1 = null;
        }
        if (this.rumbleOsc2) {
          this.rumbleOsc2.stop();
          this.rumbleOsc2.disconnect();
          this.rumbleOsc2 = null;
        }
        if (this.ambientFilter) {
          this.ambientFilter.disconnect();
          this.ambientFilter = null;
        }
        if (this.ambientGain) {
          this.ambientGain.disconnect();
          this.ambientGain = null;
        }
      } catch {
        // ignore cleanup on stopped nodes
      }
      this.isAmbientRunning = false;
      this.stopTimeoutId = null;
    };

    if (immediate) {
      cleanNodes();
      return;
    }

    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      this.stopTimeoutId = setTimeout(cleanNodes, 400);
    } catch {
      cleanNodes();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('colossal_sound_enabled', String(enabled));
      }
    } catch {
      // ignore storage errors
    }
    if (enabled) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public isAmbientActive(): boolean {
    return this.isAmbientRunning;
  }

  /** Subtle terminal keystroke blip */
  public playKeyBlip() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }

  /** Footstep in gravel / stone corridor */
  public playFootstep() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  /** Crisp electronic chime for picking up items */
  public playItemChime() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const chimeFrequencies = [659.25, 880, 1174.66, 1760];
    chimeFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.045;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.18);
      gain.gain.setValueAtTime(0.065, t);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  /** Low-frequency square-wave warning rumble when entering dark room without illumination */
  public playDarknessWarningRumble() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(48, now);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(53.5, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);
    filter.frequency.linearRampToValueAtTime(80, now + 1.2);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.45);
    gain.gain.linearRampToValueAtTime(0.13, now + 0.75);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.4);
    osc2.stop(now + 1.4);
  }

  /** Celebratory melody for unlocking the grate, defeating the snake, or inner treasury victory */
  public playCelebratoryMelody() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const notes = [
      { f: 523.25, d: 0.11, t: 'triangle' as const },
      { f: 659.25, d: 0.11, t: 'triangle' as const },
      { f: 783.99, d: 0.11, t: 'triangle' as const },
      { f: 1046.5, d: 0.14, t: 'square' as const },
      { f: 880.0,  d: 0.12, t: 'triangle' as const },
      { f: 1046.5, d: 0.35, t: 'sine' as const },
    ];
    let curTime = ctx.currentTime;
    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = note.t;
      osc.frequency.setValueAtTime(note.f, curTime);
      gain.gain.setValueAtTime(0.08, curTime);
      gain.gain.exponentialRampToValueAtTime(0.001, curTime + note.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(curTime);
      osc.stop(curTime + note.d);
      curTime += note.d * 0.92;
    });
  }

  /** Metallic key jingle / unlock mechanical sound */
  public playUnlock() {
    const ctx = this.initCtx();
    if (!ctx) return;
    [1200, 1800, 2400].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, t + 0.1);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    });
  }

  /** Warm lantern ignition swoosh / flame spark */
  public playLanternLight() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }

  /** Cheerful green bird chirping melody */
  public playBirdSong() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const notes = [1760, 2093, 2637, 2093, 3136];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 1.1, t + 0.04);
      osc.frequency.linearRampToValueAtTime(freq, t + 0.07);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.075);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  /** Threatening snake hiss and sudden strike */
  public playSnakeHiss() {
    const ctx = this.initCtx();
    if (!ctx) return;
    // Generate white noise for hiss
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4500, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  /** Dramatic ominous death chord */
  public playDeathChord() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const freqs = [110, 116.5, 130.8, 164.8]; // Diminished doom harmony
    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    });
  }

  /** Triumphant victory fanfare */
  public playVictoryFanfare() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.5, d: 0.35 }, // C6
    ];
    let curT = ctx.currentTime;
    melody.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, curT);
      gain.gain.setValueAtTime(0.1, curT);
      gain.gain.exponentialRampToValueAtTime(0.001, curT + note.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(curT);
      osc.stop(curT + note.d);
      curT += note.d * 0.9;
    });
  }

  /** Magical chime for ancient incantations (XYZZY) */
  public playMagicChime() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const chimeNotes = [587.33, 880, 1174.66, 1760, 2349.32]; // D5, A5, D6, A6, D7
    chimeNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.05;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }

  /** Subterranean warp / teleport whoosh */
  public playWarpSound() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  /** Item pick up tone */
  public playItemGet() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  /** Shimmering iridescent crystal bridge manifestation */
  public playCrystalBridge() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  /** Subterranean water drop echo */
  public playWaterDrop() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  /** Melodic songbird chirp */
  public playBirdChirp() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const notes = [2200, 2600, 2400, 2800];
    notes.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.linearRampToValueAtTime(f + 200, t + 0.04);
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    });
  }

  /** Threatening snake rattle and hiss */
  public playSnakeRattle() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4500, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  /** Monstrous dragon roar and ground tremor */
  public playDragonRoar() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 1.2);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  }

  /** Radiant treasure bank fanfare chime */
  public playTreasureBank() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const coins = [880, 1174.66, 1479.98, 1760, 2093, 2349.32];
    coins.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  /** Dwarf iron axe throw swoosh and impact */
  public playAxeThrow() {
    const ctx = this.initCtx();
    if (!ctx) return;
    // Whoosh
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);

    // Stone thud impact
    setTimeout(() => {
      if (!this.ctx) return;
      const thud = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thud.type = 'square';
      thud.frequency.setValueAtTime(90, this.ctx.currentTime);
      thud.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);
      thudGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      thudGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      thud.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thud.start();
      thud.stop(this.ctx.currentTime + 0.15);
    }, 240);
  }

  /** Delicate Ming vase shattering */
  public playVaseShatter() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const freqs = [2400, 3100, 4200, 1800, 3600];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.02;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 0.4, t + 0.2);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }
}

export const sound = new SoundSystem();
