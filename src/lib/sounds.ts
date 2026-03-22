/**
 * Sound Manager for Romantic Birthday Website
 * Uses Web Audio API to generate soft, romantic, cinematic sound effects
 * All sounds are designed to be emotional, warm, magical, and not harsh
 */

// Sound configuration types
export interface SoundConfig {
  duration: number;
  fadeOut?: number;
}

// Individual sound generators
class SoundGenerator {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.1; // Global volume (reduced to be lower than background music)
    }
  }

  private ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * 1. Welcome Screen – soft magical sparkle chime, dreamy and romantic (3s)
   */
  playWelcomeScreen() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 3;

    // Main shimmer chord
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, i) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + duration);
      
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.15 + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.15);
      osc.stop(now + duration);
    });

    // Sparkle shimmer
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      const freq = 2000 + Math.random() * 3000;
      osc.frequency.setValueAtTime(freq, now + i * 0.2);
      
      gain.gain.setValueAtTime(0, now + i * 0.2);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.2 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.5);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.5);
    }
  }

  /**
   * 2. Button Click – soft warm UI click (0.5s)
   */
  playButtonClick() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.5;

    // Soft click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + duration);

    // Subtle warmth
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(220, now);
    gain2.gain.setValueAtTime(0.1, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.connect(gain2);
    gain2.connect(this.masterGain!);
    osc2.start(now);
    osc2.stop(now + 0.3);
  }

  /**
   * 3. Screen Transition – smooth dreamy whoosh (1s)
   */
  playScreenTransition() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 1;

    // Whoosh noise
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.linearRampToValueAtTime(2000, now + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(500, now + duration);
    filter.Q.value = 1;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + duration * 0.3);
    gain.gain.linearRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    noise.start(now);
    noise.stop(now + duration);

    // Ethereal pad
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.linearRampToValueAtTime(440, now + duration);
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.1, now + 0.2);
    oscGain.gain.linearRampToValueAtTime(0, now + duration);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * 4. Gift Box Opening – cute box opening + magical sparkle burst (2s)
   */
  playGiftBoxOpen() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 2;

    // Box lid opening (soft pop)
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.type = 'sine';
    pop.frequency.setValueAtTime(200, now);
    pop.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    pop.frequency.exponentialRampToValueAtTime(100, now + 0.3);
    popGain.gain.setValueAtTime(0.4, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    pop.connect(popGain);
    popGain.connect(this.masterGain!);
    pop.start(now);
    pop.stop(now + 0.3);

    // Magical sparkles
    for (let i = 0; i < 15; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      const baseFreq = 1000 + Math.random() * 3000;
      osc.frequency.setValueAtTime(baseFreq, now + 0.1 + i * 0.1);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1 + i * 0.1 + 0.2);
      
      gain.gain.setValueAtTime(0, now + 0.1 + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1 + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + i * 0.1 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + 0.1 + i * 0.1);
      osc.stop(now + 0.1 + i * 0.1 + 0.3);
    }

    // Happy chime chord
    const chord = [523.25, 659.25, 783.99]; // C5, E5, G5
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.2);
      gain.gain.setValueAtTime(0, now + 0.2);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.2 + i * 0.1 + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + 0.2);
      osc.stop(now + duration);
    });
  }

  /**
   * 5. Heart Burst – soft pop sounds with sparkles (1.5s)
   */
  playHeartBurst() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 1.5;

    // Main pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + 0.5);

    // Sparkle shower
    for (let i = 0; i < 12; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = 1500 + Math.random() * 2500;
      osc.frequency.setValueAtTime(freq, now + 0.05 + i * 0.08);
      gain.gain.setValueAtTime(0, now + 0.05 + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05 + i * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + i * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + 0.05 + i * 0.08);
      osc.stop(now + 0.05 + i * 0.08 + 0.2);
    }

    // Soft heart chord
    const heartChord = [392, 493.88, 587.33]; // G4, B4, D5
    heartChord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + 0.1);
      gain.gain.setValueAtTime(0, now + 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1 + i * 0.05 + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + 0.1);
      osc.stop(now + duration);
    });
  }

  /**
   * 6. Love Letter Open – paper envelope opening + soft heartbeat (4s)
   */
  playLoveLetterOpen() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 4;

    // Paper flap
    const paper = ctx.createOscillator();
    const paperGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    paper.type = 'triangle';
    paper.frequency.setValueAtTime(150, now);
    paper.frequency.linearRampToValueAtTime(300, now + 0.3);
    paper.frequency.linearRampToValueAtTime(200, now + 0.6);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    paperGain.gain.setValueAtTime(0.2, now);
    paperGain.gain.linearRampToValueAtTime(0.3, now + 0.2);
    paperGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    paper.connect(filter);
    filter.connect(paperGain);
    paperGain.connect(this.masterGain!);
    paper.start(now);
    paper.stop(now + 1);

    // Heartbeat - first beat
    const hb1 = ctx.createOscillator();
    const hb1Gain = ctx.createGain();
    const hb1Filter = ctx.createBiquadFilter();
    hb1.type = 'sine';
    hb1.frequency.setValueAtTime(60, now + 0.5);
    hb1.frequency.exponentialRampToValueAtTime(40, now + 0.7);
    hb1Filter.type = 'lowpass';
    hb1Filter.frequency.setValueAtTime(200, now + 0.5);
    hb1Gain.gain.setValueAtTime(0, now + 0.5);
    hb1Gain.gain.linearRampToValueAtTime(0.3, now + 0.55);
    hb1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    hb1.connect(hb1Filter);
    hb1Filter.connect(hb1Gain);
    hb1Gain.connect(this.masterGain!);
    hb1.start(now + 0.5);
    hb1.stop(now + 1);

    // Heartbeat - second beat (lub-dub)
    const hb2 = ctx.createOscillator();
    const hb2Gain = ctx.createGain();
    const hb2Filter = ctx.createBiquadFilter();
    hb2.type = 'sine';
    hb2.frequency.setValueAtTime(50, now + 1.2);
    hb2.frequency.exponentialRampToValueAtTime(35, now + 1.4);
    hb2Filter.type = 'lowpass';
    hb2Filter.frequency.setValueAtTime(180, now + 1.2);
    hb2Gain.gain.setValueAtTime(0, now + 1.2);
    hb2Gain.gain.linearRampToValueAtTime(0.25, now + 1.25);
    hb2Gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    hb2.connect(hb2Filter);
    hb2Filter.connect(hb2Gain);
    hb2Gain.connect(this.masterGain!);
    hb2.start(now + 1.2);
    hb2.stop(now + 1.8);

    // Subtle romantic shimmer
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(880, now + 0.5);
    shimmerGain.gain.setValueAtTime(0, now + 0.5);
    shimmerGain.gain.linearRampToValueAtTime(0.08, now + 1);
    shimmerGain.gain.linearRampToValueAtTime(0.05, now + 3);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(this.masterGain!);
    shimmer.start(now + 0.5);
    shimmer.stop(now + duration);
  }

  /**
   * 7. Typing Sound – slow gentle typing sound, loopable (10s)
   * Returns a function to stop the typing
   */
  playTyping(): () => void {
    const ctx = this.ensureContext();
    if (!ctx) return () => {};

    const intervals: NodeJS.Timeout[] = [];
    let isPlaying = true;

    const typeKey = () => {
      if (!isPlaying) return;
      
      const now = ctx!.currentTime;
      
      // Soft click
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      const filter = ctx!.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 0.1);
    };

    // Play typing every 150-250ms (random for natural feel)
    const interval = setInterval(() => {
      typeKey();
      const nextDelay = 150 + Math.random() * 100;
      intervals.push(setTimeout(typeKey, nextDelay));
    }, 200);

    // Stop function
    return () => {
      isPlaying = false;
      clearInterval(interval);
      intervals.forEach(clearTimeout);
    };
  }

  /**
   * 8. Memory Reveal – soft emotional piano note/chime (2s)
   */
  playMemoryReveal() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 2;

    // Emotional piano chord (arpeggio)
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      
      // Soft attack and long decay
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.15);
      osc.stop(now + duration);
    });

    // Gentle shimmer
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000 + Math.random() * 1000, now + 0.3 + i * 0.2);
      gain.gain.setValueAtTime(0, now + 0.3 + i * 0.2);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.3 + i * 0.2 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.2 + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + 0.3 + i * 0.2);
      osc.stop(now + 0.3 + i * 0.2 + 0.3);
    }
  }

  /**
   * 9. Heart Catch – cute pop when collecting heart (0.5s)
   */
  playHeartCatch() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.5;

    // Quick pop
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.type = 'sine';
    pop.frequency.setValueAtTime(500, now);
    pop.frequency.exponentialRampToValueAtTime(900, now + 0.05);
    pop.frequency.exponentialRampToValueAtTime(600, now + 0.15);
    popGain.gain.setValueAtTime(0.35, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    pop.connect(popGain);
    popGain.connect(this.masterGain!);
    pop.start(now);
    pop.stop(now + 0.25);

    // Cute sparkle
    const sparkle = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkle.type = 'sine';
    sparkle.frequency.setValueAtTime(1500, now + 0.05);
    sparkle.frequency.linearRampToValueAtTime(2000, now + 0.15);
    sparkleGain.gain.setValueAtTime(0, now + 0.05);
    sparkleGain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    sparkle.connect(sparkleGain);
    sparkleGain.connect(this.masterGain!);
    sparkle.start(now + 0.05);
    sparkle.stop(now + 0.35);
  }

  /**
   * 10. Game Complete – soft success chime with sparkles (2s)
   */
  playGameComplete() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 2;

    // Victory chime
    const chimeNotes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chimeNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.15 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.15);
      osc.stop(now + duration);
    });

    // Sparkle burst
    for (let i = 0; i < 15; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = 1200 + Math.random() * 2000;
      osc.frequency.setValueAtTime(freq, now + 0.2 + i * 0.08);
      gain.gain.setValueAtTime(0, now + 0.2 + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.2 + i * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2 + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + 0.2 + i * 0.08);
      osc.stop(now + 0.2 + i * 0.08 + 0.3);
    }
  }

  /**
   * 11. Countdown Tick – soft minimal digital tick (0.3s)
   */
  playCountdownTick() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.3;

    // Soft tick
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.05);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + duration);

    // Subtle warmth
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now);
    gain2.gain.setValueAtTime(0.08, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc2.connect(gain2);
    gain2.connect(this.masterGain!);
    osc2.start(now);
    osc2.stop(now + 0.2);
  }

  /**
   * 12. Candle Blow – blowing candle + magical sparkle (2s)
   */
  playCandleBlow() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 2;

    // Wind/blow sound
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      // White noise with fade
      const envelope = Math.min(1, (bufferSize - i) / (bufferSize * 0.3));
      data[i] = (Math.random() * 2 - 1) * 0.2 * envelope;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(100, now + 1.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.5);
    gain.gain.linearRampToValueAtTime(0.001, now + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    noise.start(now);
    noise.stop(now + 1.5);

    // Magical extinguish shimmer
    for (let i = 0; i < 10; i++) {
      const osc = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc.type = 'sine';
      const freq = 800 + Math.random() * 1200;
      osc.frequency.setValueAtTime(freq, now + 0.8 + i * 0.1);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.8 + i * 0.1 + 0.3);
      gain2.gain.setValueAtTime(0, now + 0.8 + i * 0.1);
      gain2.gain.linearRampToValueAtTime(0.12, now + 0.8 + i * 0.1 + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + i * 0.1 + 0.3);
      osc.connect(gain2);
      gain2.connect(this.masterGain!);
      osc.start(now + 0.8 + i * 0.1);
      osc.stop(now + 0.8 + i * 0.1 + 0.4);
    }

    // Final wish chime
    const wish = ctx.createOscillator();
    const wishGain = ctx.createGain();
    wish.type = 'sine';
    wish.frequency.setValueAtTime(880, now + 1.2);
    wish.frequency.linearRampToValueAtTime(660, now + 1.5);
    wishGain.gain.setValueAtTime(0, now + 1.2);
    wishGain.gain.linearRampToValueAtTime(0.2, now + 1.3);
    wishGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    wish.connect(wishGain);
    wishGain.connect(this.masterGain!);
    wish.start(now + 1.2);
    wish.stop(now + duration);
  }

  /**
   * 13. Fireworks/Confetti – soft celebration fireworks, not loud (5s)
   */
  playFireworks() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 5;

    // Multiple firework launches
    for (let f = 0; f < 3; f++) {
      const startTime = now + f * 1.5;
      
      // Launch whistle
      const launch = ctx.createOscillator();
      const launchGain = ctx.createGain();
      const launchFilter = ctx.createBiquadFilter();
      
      launch.type = 'sine';
      launch.frequency.setValueAtTime(400 + f * 100, startTime);
      launch.frequency.linearRampToValueAtTime(800 + f * 100, startTime + 0.3);
      launch.frequency.linearRampToValueAtTime(200, startTime + 0.8);
      
      launchFilter.type = 'bandpass';
      launchFilter.frequency.setValueAtTime(600, startTime);
      launchFilter.Q.value = 2;
      
      launchGain.gain.setValueAtTime(0, startTime);
      launchGain.gain.linearRampToValueAtTime(0.15, startTime + 0.2);
      launchGain.gain.linearRampToValueAtTime(0.001, startTime + 0.8);
      
      launch.connect(launchFilter);
      launchFilter.connect(launchGain);
      launchGain.connect(this.masterGain!);
      launch.start(startTime);
      launch.stop(startTime + 1);

      // Explosion sparkle
      for (let i = 0; i < 20; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        const baseFreq = 600 + Math.random() * 1800;
        osc.frequency.setValueAtTime(baseFreq, startTime + 0.5 + i * 0.05);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, startTime + 0.5 + i * 0.05 + 0.4);
        
        gain.gain.setValueAtTime(0, startTime + 0.5 + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.5 + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5 + i * 0.05 + 0.4);
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(startTime + 0.5 + i * 0.05);
        osc.stop(startTime + 0.5 + i * 0.05 + 0.5);
      }
    }

    // Final celebration chord
    const chord = [523.25, 659.25, 783.99, 1046.50];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 4);
      gain.gain.setValueAtTime(0, now + 4);
      gain.gain.linearRampToValueAtTime(0.15, now + 4.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + 4);
      osc.stop(now + duration);
    });
  }

  /**
   * 14. Romantic Kiss/Heart Moment – soft romantic shimmer sound (2s)
   */
  playRomanticKiss() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 2;

    // Soft "kiss" sound (subtle pop)
    const kiss = ctx.createOscillator();
    const kissGain = ctx.createGain();
    const kissFilter = ctx.createBiquadFilter();
    
    kiss.type = 'sine';
    kiss.frequency.setValueAtTime(300, now);
    kiss.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    kiss.frequency.exponentialRampToValueAtTime(200, now + 0.2);
    
    kissFilter.type = 'lowpass';
    kissFilter.frequency.setValueAtTime(1000, now);
    
    kissGain.gain.setValueAtTime(0.3, now);
    kissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    
    kiss.connect(kissFilter);
    kissFilter.connect(kissGain);
    kissGain.connect(this.masterGain!);
    kiss.start(now);
    kiss.stop(now + 0.3);

    // Romantic shimmer
    const shimmerNotes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    shimmerNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.1 + i * 0.1);
      
      gain.gain.setValueAtTime(0, now + 0.1 + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1 + i * 0.1 + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + 0.1 + i * 0.1);
      osc.stop(now + duration);
    });

    // Gentle heartbeat
    const hb = ctx.createOscillator();
    const hbGain = ctx.createGain();
    hb.type = 'sine';
    hb.frequency.setValueAtTime(70, now + 0.5);
    hb.frequency.exponentialRampToValueAtTime(50, now + 0.7);
    hbGain.gain.setValueAtTime(0, now + 0.5);
    hbGain.gain.linearRampToValueAtTime(0.2, now + 0.55);
    hbGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    hb.connect(hbGain);
    hbGain.connect(this.masterGain!);
    hb.start(now + 0.5);
    hb.stop(now + 1);

    // Second heartbeat
    const hb2 = ctx.createOscillator();
    const hb2Gain = ctx.createGain();
    hb2.type = 'sine';
    hb2.frequency.setValueAtTime(60, now + 1);
    hb2.frequency.exponentialRampToValueAtTime(45, now + 1.2);
    hb2Gain.gain.setValueAtTime(0, now + 1);
    hb2Gain.gain.linearRampToValueAtTime(0.15, now + 1.05);
    hb2Gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    hb2.connect(hb2Gain);
    hb2Gain.connect(this.masterGain!);
    hb2.start(now + 1);
    hb2.stop(now + 1.5);
  }

  /**
   * 15. Unlock Heart / Success – emotional soft chime सफलता type sound (2s)
   */
  playUnlockHeart() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 2;

    // Emotional unlock chord
    const unlockNotes = [392, 493.88, 587.33, 784]; // G4, B4, D5, G5
    unlockNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      
      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.22, now + i * 0.12 + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.12);
      osc.stop(now + duration);
    });

    // Sparkle magic
    for (let i = 0; i < 12; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = 1000 + Math.random() * 2000;
      osc.frequency.setValueAtTime(freq, now + 0.3 + i * 0.1);
      gain.gain.setValueAtTime(0, now + 0.3 + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.3 + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + 0.3 + i * 0.1);
      osc.stop(now + 0.3 + i * 0.1 + 0.3);
    }

    // Final shimmer
    const final = ctx.createOscillator();
    const finalGain = ctx.createGain();
    final.type = 'sine';
    final.frequency.setValueAtTime(1046.5, now + 1.2); // C6
    finalGain.gain.setValueAtTime(0, now + 1.2);
    finalGain.gain.linearRampToValueAtTime(0.2, now + 1.3);
    finalGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    final.connect(finalGain);
    finalGain.connect(this.masterGain!);
    final.start(now + 1.2);
    final.stop(now + duration);
  }

  /**
   * 16. Background Ambient Loop – very soft romantic ambient pad with light piano (loopable 30s)
   * Returns a function to stop the ambient
   */
  playAmbientLoop(): () => void {
    const ctx = this.ensureContext();
    if (!ctx) return () => {};

    const duration = 30;
    const now = ctx.currentTime;
    let isPlaying = true;

    // Create ambient pad with multiple detuned oscillators
    const frequencies = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
    
    const oscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
    
    frequencies.forEach((freq, i) => {
      // Main oscillator
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // Slow amplitude modulation for warmth
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 5);
      gain.gain.linearRampToValueAtTime(0.08, now + 15);
      gain.gain.linearRampToValueAtTime(0.1, now + 25);
      gain.gain.linearRampToValueAtTime(0.08, now + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + duration);
      
      oscillators.push({ osc, gain });
      
      // Detuned layer for richness
      const detuned = ctx!.createOscillator();
      const detunedGain = ctx!.createGain();
      
      detuned.type = 'triangle';
      detuned.frequency.setValueAtTime(freq * 1.002, now); // Slight detune
      detunedGain.gain.setValueAtTime(0.03, now);
      detunedGain.gain.linearRampToValueAtTime(0.05, now + 5);
      detunedGain.gain.linearRampToValueAtTime(0.03, now + duration);
      
      detuned.connect(detunedGain);
      detunedGain.connect(this.masterGain!);
      detuned.start(now);
      detuned.stop(now + duration);
      
      oscillators.push({ osc: detuned, gain: detunedGain });
    });

    // Light piano-like shimmering
    const shimmerInterval = setInterval(() => {
      if (!isPlaying) return;
      
      const shimmerNow = ctx!.currentTime;
      const freq = 400 + Math.random() * 600;
      
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, shimmerNow);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.9, shimmerNow + 2);
      
      gain.gain.setValueAtTime(0, shimmerNow);
      gain.gain.linearRampToValueAtTime(0.03, shimmerNow + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, shimmerNow + 2);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(shimmerNow);
      osc.stop(shimmerNow + 2);
    }, 2000);

    // Stop function
    return () => {
      isPlaying = false;
      clearInterval(shimmerInterval);
      oscillators.forEach(({ osc, gain }) => {
        try {
          osc.stop();
          gain.disconnect();
        } catch (e) {
          // Oscillator may have already stopped
        }
      });
    };
  }

  /**
   * Set master volume
   */
  setVolume(value: number) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(value, this.ctx!.currentTime);
    }
  }

  /**
   * Mute/unmute sounds
   */
  setMuted(muted: boolean) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx!.currentTime);
    }
  }
}

// Singleton instance
let soundManager: SoundGenerator | null = null;

export function getSoundManager(): SoundGenerator {
  if (!soundManager) {
    soundManager = new SoundGenerator();
  }
  return soundManager;
}

// Export all sound functions
export const playWelcomeScreen = () => getSoundManager().playWelcomeScreen();
export const playButtonClick = () => getSoundManager().playButtonClick();
export const playScreenTransition = () => getSoundManager().playScreenTransition();
export const playGiftBoxOpen = () => getSoundManager().playGiftBoxOpen();
export const playHeartBurst = () => getSoundManager().playHeartBurst();
export const playLoveLetterOpen = () => getSoundManager().playLoveLetterOpen();
export const playTyping = () => getSoundManager().playTyping();
export const playMemoryReveal = () => getSoundManager().playMemoryReveal();
export const playHeartCatch = () => getSoundManager().playHeartCatch();
export const playGameComplete = () => getSoundManager().playGameComplete();
export const playCountdownTick = () => getSoundManager().playCountdownTick();
export const playCandleBlow = () => getSoundManager().playCandleBlow();
export const playFireworks = () => getSoundManager().playFireworks();
export const playRomanticKiss = () => getSoundManager().playRomanticKiss();
export const playUnlockHeart = () => getSoundManager().playUnlockHeart();
export const playAmbientLoop = () => getSoundManager().playAmbientLoop();
export const setSoundVolume = (value: number) => getSoundManager().setVolume(value);
export const setSoundMuted = (muted: boolean) => getSoundManager().setMuted(muted);