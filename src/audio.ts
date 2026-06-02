/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for Retro and Cinematic Game Sound Effects
let audioCtx: AudioContext | null = null;
let silenceTimeout: any = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume if suspended (browser security policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Low-pass, high-pass filtration helper
function createFilter(ctx: AudioContext, type: BiquadFilterType, frequency: number) {
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(frequency, ctx.currentTime);
  return filter;
}

// Math-based White Noise creator for rifle bursts, fire sparks, and deep breathing
function playNoise(ctx: AudioContext, duration: number, lpFreq: number, hpFreq: number, volumeStart: number, volumeEnd: number, startTimeOffset = 0) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  const gainNode = ctx.createGain();
  const now = ctx.currentTime + startTimeOffset;
  gainNode.gain.setValueAtTime(volumeStart, now);
  gainNode.gain.exponentialRampToValueAtTime(Math.max(volumeEnd, 0.0001), now + duration);

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(lpFreq, now);

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(hpFreq, now);

  noiseNode.connect(hp);
  hp.connect(lp);
  lp.connect(gainNode);
  gainNode.connect(ctx.destination);

  noiseNode.start(now);
  noiseNode.stop(now + duration);
  return { noiseNode, lp };
}

/**
 * Play a stylized sound effect for a specific game trigger
 */
export function playSound(type: 'coc' | 'bgmi' | 'pogo' | 'chess' | 'fire' | 'dragon_breath' | 'click' | 'reboot') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const destination = ctx.destination;
    const now = ctx.currentTime;

    if (type === 'coc') {
      // --- Clash of Clans Original Starting Fanfare ---
      // 1. Double Deep War Drums
      const drumTValues = [0, 0.2];
      drumTValues.forEach((offset) => {
        const drumOsc = ctx.createOscillator();
        const drumGain = ctx.createGain();
        drumOsc.type = 'sine';
        drumOsc.frequency.setValueAtTime(75, now + offset);
        drumOsc.frequency.exponentialRampToValueAtTime(10, now + offset + 0.28);

        drumGain.gain.setValueAtTime(0.7, now + offset);
        drumGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.28);

        drumOsc.connect(drumGain);
        drumGain.connect(destination);
        drumOsc.start(now + offset);
        drumOsc.stop(now + offset + 0.3);
      });

      // 2. Brass Trumpet Fanfare: G4 (392Hz) -> C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
      const notes = [
        { f: 392, start: 0.35, dur: 0.12 },
        { f: 523, start: 0.47, dur: 0.12 },
        { f: 659, start: 0.59, dur: 0.12 },
        { f: 784, start: 0.71, dur: 0.12 },
        { f: 1046, start: 0.83, dur: 0.50 }
      ];

      notes.forEach((note) => {
        // Overlay Sawtooth and Triangle for rich wooden brass timbre
        const oscSaw = ctx.createOscillator();
        const oscTri = ctx.createOscillator();
        const brassGain = ctx.createGain();
        const brassFilter = ctx.createBiquadFilter();

        oscSaw.type = 'sawtooth';
        oscSaw.frequency.setValueAtTime(note.f, now + note.start);

        oscTri.type = 'triangle';
        oscTri.frequency.setValueAtTime(note.f * 1.005, now + note.start); // slight detune

        brassFilter.type = 'lowpass';
        // Sweep brass lowpass to give that trumpet "parp" attack
        brassFilter.frequency.setValueAtTime(600, now + note.start);
        brassFilter.frequency.exponentialRampToValueAtTime(2200, now + note.start + 0.05);
        brassFilter.frequency.linearRampToValueAtTime(1000, now + note.start + note.dur);
        brassFilter.Q.setValueAtTime(4, now + note.start);

        brassGain.gain.setValueAtTime(0.001, now + note.start);
        brassGain.gain.linearRampToValueAtTime(0.18, now + note.start + 0.03); // rapid fade-in
        brassGain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.dur);

        oscSaw.connect(brassFilter);
        oscTri.connect(brassFilter);
        brassFilter.connect(brassGain);
        brassGain.connect(destination);

        oscSaw.start(now + note.start);
        oscTri.start(now + note.start);
        oscSaw.stop(now + note.start + note.dur + 0.05);
        oscTri.stop(now + note.start + note.dur + 0.05);
      });

      // 3. Triumphant Sword Clang chime
      const clangOsc1 = ctx.createOscillator();
      const clangOsc2 = ctx.createOscillator();
      const clangGain = ctx.createGain();
      const clangTime = now + 0.88;

      clangOsc1.type = 'sine';
      clangOsc1.frequency.setValueAtTime(1200, clangTime);
      clangOsc2.type = 'triangle';
      clangOsc2.frequency.setValueAtTime(1650, clangTime);

      clangGain.gain.setValueAtTime(0.15, clangTime);
      clangGain.gain.exponentialRampToValueAtTime(0.001, clangTime + 0.4);

      clangOsc1.connect(clangGain);
      clangOsc2.connect(clangGain);
      clangGain.connect(destination);

      clangOsc1.start(clangTime);
      clangOsc2.start(clangTime);
      clangOsc1.stop(clangTime + 0.45);
      clangOsc2.stop(clangTime + 0.45);
    } 
    else if (type === 'bgmi') {
      // --- BGMI/PUBG Special Squad Tactical Anthem ---
      // 1. Deep Cinematic Cinematic Orchestral Brass Hit
      const brassOsc = ctx.createOscillator();
      const brassGain = ctx.createGain();
      brassOsc.type = 'sawtooth';
      brassOsc.frequency.setValueAtTime(110, now);
      brassOsc.frequency.linearRampToValueAtTime(70, now + 0.4);

      brassGain.gain.setValueAtTime(0.4, now);
      brassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      const lp = createFilter(ctx, 'lowpass', 280);
      brassOsc.connect(lp);
      lp.connect(brassGain);
      brassGain.connect(destination);

      brassOsc.start(now);
      brassOsc.stop(now + 0.5);

      // 2. Sniper Bolt-Action sliding reload chambering sound (Clack-Shlick!)
      // Frame "clack"
      const boltOsc1 = ctx.createOscillator();
      const boltGain1 = ctx.createGain();
      boltOsc1.type = 'triangle';
      boltOsc1.frequency.setValueAtTime(1300, now + 0.42);
      boltGain1.gain.setValueAtTime(0.25, now + 0.42);
      boltGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.47);
      boltOsc1.connect(boltGain1);
      boltGain1.connect(destination);
      boltOsc1.start(now + 0.42);
      boltOsc1.stop(now + 0.48);

      // Slide metallic friction "shlick"
      playNoise(ctx, 0.12, 1800, 900, 0.22, 0.001, 0.5);

      // 3. Heavy Sniper Gunshot with deep mountain valley decay echo
      const shotTime = 0.72;
      // Gunshot blast wave
      playNoise(ctx, 0.45, 1200, 80, 0.85, 0.001, shotTime);
      // Gunshot metallic ring tail
      playNoise(ctx, 1.15, 3000, 1000, 0.18, 0.001, shotTime + 0.05);

      // Deep subsonic thump
      const thumpOsc = ctx.createOscillator();
      const thumpGain = ctx.createGain();
      thumpOsc.type = 'sine';
      thumpOsc.frequency.setValueAtTime(62, now + shotTime);
      thumpOsc.frequency.exponentialRampToValueAtTime(1, now + shotTime + 0.4);

      thumpGain.gain.setValueAtTime(0.8, now + shotTime);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, now + shotTime + 0.4);

      thumpOsc.connect(thumpGain);
      thumpGain.connect(destination);
      thumpOsc.start(now + shotTime);
      thumpOsc.stop(now + shotTime + 0.45);
    } 
    else if (type === 'pogo') {
      // --- Pokémon GO Sparkling Capture & Opening Chime ---
      // 1. Shimmering map scan notes
      const initialChimes = [1200, 1500, 1800];
      initialChimes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        gain.gain.setValueAtTime(0.08, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.18);
        
        osc.connect(gain);
        gain.connect(destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.22);
      });

      // 2. Magical Pokemon Title Theme Major Scale: C6 -> D6 -> G6 -> F#6 -> G6
      const themeNotes = [
        { f: 1047, t: 0.42, d: 0.12 }, // C6
        { f: 1175, t: 0.54, d: 0.12 }, // D6
        { f: 1568, t: 0.66, d: 0.12 }, // G6
        { f: 1480, t: 0.78, d: 0.12 }, // F#6
        { f: 1568, t: 0.90, d: 0.45 }  // G6
      ];

      themeNotes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        // Triangle wave for pleasant digital flute sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.t);

        gain.gain.setValueAtTime(0.12, now + note.t);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);

        // Simple echo / feedback representation
        const echoGain = ctx.createGain();
        echoGain.gain.setValueAtTime(0.04, now + note.t + 0.18);
        echoGain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d + 0.18);

        osc.connect(gain);
        gain.connect(destination);

        osc.connect(echoGain);
        echoGain.connect(destination);

        osc.start(now + note.t);
        osc.stop(now + note.t + note.d + 0.22);
      });
    } 
    else if (type === 'chess') {
      // --- Chess.com Wood Click-Clack & Game Started Chime ---
      // 1. Two wood taps of chess pieces landing on board (wood block click-clack style)
      const taps = [
        { t: 0.0, f: 280, d: 0.05 },
        { t: 0.15, f: 215, d: 0.05 }
      ];

      taps.forEach((tap) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(tap.f, now + tap.t);
        osc.frequency.linearRampToValueAtTime(tap.f * 0.7, now + tap.t + tap.d);

        gain.gain.setValueAtTime(0.35, now + tap.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tap.t + tap.d);

        // Filter to make it sound muddy like wood instead of glass
        const lpFilter = createFilter(ctx, 'lowpass', 550);
        osc.connect(lpFilter);
        lpFilter.connect(gain);
        gain.connect(destination);

        osc.start(now + tap.t);
        osc.stop(now + tap.t + tap.d + 0.02);
      });

      // 2. Play Chess.com Electronic Game Start Chime (Soaring harmonic chord E5 -> A5 -> C#6 -> E6)
      const chord = [659, 880, 1109, 1318];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.35);

        gain.gain.setValueAtTime(0.08, now + 0.35 + idx * 0.02); // spread/strum arpeggio slightly
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35 + 0.65);

        osc.connect(gain);
        gain.connect(destination);
        osc.start(now + 0.35);
        osc.stop(now + 0.35 + 0.7);
      });
    } 
    else if (type === 'fire' || type === 'dragon_breath') {
      // --- Shendu Dragon Fire Breathing Cinematic Sound ---
      // This plays when invoking attack on Shendu
      const breatheTime = now;

      // PHASE 1: Dramatic heavy dragonic air inhalation (0.0s to 1.2s)
      playNoise(ctx, 1.2, 550, 100, 0.001, 0.38, 0);
      
      // Secondary minor rising growl pitch during inhalation
      const riseOsc = ctx.createOscillator();
      const riseGain = ctx.createGain();
      riseOsc.type = 'sawtooth';
      riseOsc.frequency.setValueAtTime(65, breatheTime);
      riseOsc.frequency.linearRampToValueAtTime(140, breatheTime + 1.2);
      
      riseGain.gain.setValueAtTime(0.001, breatheTime);
      riseGain.gain.linearRampToValueAtTime(0.15, breatheTime + 1.2);
      riseGain.gain.exponentialRampToValueAtTime(0.0001, breatheTime + 1.3);

      const growlLp = createFilter(ctx, 'lowpass', 220);
      riseOsc.connect(growlLp);
      growlLp.connect(riseGain);
      riseGain.connect(destination);

      riseOsc.start(breatheTime);
      riseOsc.stop(breatheTime + 1.35);

      // PHASE 2: Epic Eruption Fire Blast roar! (starts at 1.22s, decays over 1.8s)
      const explodeOffset = 1.22;
      // High frequency burning, sizzling, & volcano flame crackles
      playNoise(ctx, 1.8, 3200, 800, 0.78, 0.001, explodeOffset);
      // Mid-low roaring rushing air
      playNoise(ctx, 1.5, 900, 150, 0.65, 0.001, explodeOffset);

      // Monster deep bass growl
      const beastOsc = ctx.createOscillator();
      const beastGain = ctx.createGain();
      beastOsc.type = 'sawtooth';
      beastOsc.frequency.setValueAtTime(48, breatheTime + explodeOffset);
      
      // fast pitch warbling growl modulation via sub-LFO (simulated manually with rapid schedule parameters)
      const lfoSteps = 20;
      for (let i = 0; i < lfoSteps; i++) {
        const stepTime = breatheTime + explodeOffset + (i * 0.08);
        const randFreq = 38 + Math.random() * 25;
        beastOsc.frequency.setValueAtTime(randFreq, stepTime);
      }

      beastGain.gain.setValueAtTime(0.75, breatheTime + explodeOffset);
      beastGain.gain.exponentialRampToValueAtTime(0.001, breatheTime + explodeOffset + 1.8);

      const beastLp = createFilter(ctx, 'lowpass', 120);
      beastOsc.connect(beastLp);
      beastLp.connect(beastGain);
      beastGain.connect(destination);

      beastOsc.start(breatheTime + explodeOffset);
      beastOsc.stop(breatheTime + explodeOffset + 1.95);
    }
    else if (type === 'click') {
      // Fast tactile vintage interface click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
    else if (type === 'reboot') {
      // Retro systems active laser sweep
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(300, now);
      osc1.frequency.exponentialRampToValueAtTime(1100, now + 0.8);
      
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(150, now);
      osc2.frequency.exponentialRampToValueAtTime(550, now + 0.8);
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
      
      const filter = createFilter(ctx, 'lowpass', 750);
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1);
      osc2.stop(now + 1);
    }
  } catch (err) {
    console.warn('Audio synthesis bypassed: ', err);
  }
}
