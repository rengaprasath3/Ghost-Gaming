/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for Retro Game Sound Effects
let audioCtx: AudioContext | null = null;

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

/**
 * Play a stylized sound effect for a specific game trigger
 */
export function playSound(type: 'coc' | 'bgmi' | 'pogo' | 'chess' | 'fire' | 'click' | 'reboot') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const destination = ctx.destination;

    if (type === 'coc') {
      // Clash of Clans - Clan War drum beat and metallic clang
      const now = ctx.currentTime;
      
      // Low drum boom
      const drumOsc = ctx.createOscillator();
      const drumGain = ctx.createGain();
      drumOsc.type = 'sine';
      drumOsc.frequency.setValueAtTime(80, now);
      drumOsc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      drumGain.gain.setValueAtTime(0.6, now);
      drumGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      drumOsc.connect(drumGain);
      drumGain.connect(destination);
      drumOsc.start(now);
      drumOsc.stop(now + 0.35);

      // Sword clang
      const swordOsc = ctx.createOscillator();
      const swordGain = ctx.createGain();
      swordOsc.type = 'triangle';
      swordOsc.frequency.setValueAtTime(800, now);
      swordOsc.frequency.linearRampToValueAtTime(1200, now + 0.05);
      swordOsc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
      
      swordGain.gain.setValueAtTime(0.3, now);
      swordGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      
      swordOsc.connect(swordGain);
      swordGain.connect(destination);
      swordOsc.start(now);
      swordOsc.stop(now + 0.28);
    } 
    else if (type === 'bgmi') {
      // BGMI - Sniper gunshot sound effect (pulsed white noise / decaying sine)
      const now = ctx.currentTime;
      
      // Laser zip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
      
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      
      // Highpass filter for gun shot crunch
      const filter = createFilter(ctx, 'highpass', 500);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);
      
      osc.start(now);
      osc.stop(now + 0.2);
    } 
    else if (type === 'pogo') {
      // Pokemon GO - Retro sparkly capture sound / chime
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // Major chord arpeggio
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        
        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.15);
        
        osc.connect(gain);
        gain.connect(destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.18);
      });
    } 
    else if (type === 'chess') {
      // Chess - Strategic wood click and slide
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.06);
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      
      osc.connect(gain);
      gain.connect(destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } 
    else if (type === 'fire') {
      // Shendu roaring flame breath (White noise mixed with bass rumble)
      const now = ctx.currentTime;
      
      // Bass rumble
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(55, now);
      bassOsc.frequency.linearRampToValueAtTime(35, now + 0.5);
      
      bassGain.gain.setValueAtTime(0.5, now);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      const lowpass = createFilter(ctx, 'lowpass', 150);
      bassOsc.connect(lowpass);
      lowpass.connect(bassGain);
      bassGain.connect(destination);
      
      bassOsc.start(now);
      bassOsc.stop(now + 0.5);

      // White-noise spark crackle (approximated with high frequency wave modulation)
      const crackleOsc = ctx.createOscillator();
      const crackleGain = ctx.createGain();
      crackleOsc.type = 'triangle';
      crackleOsc.frequency.setValueAtTime(2000, now);
      
      // modulate frequency quickly to sound like fire crackles
      for (let i = 0; i < 5; i++) {
        crackleOsc.frequency.setValueAtTime(1000 + Math.random() * 2000, now + i * 0.1);
      }
      
      crackleGain.gain.setValueAtTime(0.2, now);
      crackleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      crackleOsc.connect(crackleGain);
      crackleGain.connect(destination);
      crackleOsc.start(now);
      crackleOsc.stop(now + 0.5);
    }
    else if (type === 'click') {
      // Fast UI button click
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.connect(gain);
      gain.connect(destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
    else if (type === 'reboot') {
      // Classic ancient summon/reboot laser beam chime
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(300, now);
      osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.8);
      
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(150, now);
      osc2.frequency.exponentialRampToValueAtTime(600, now + 0.8);
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.95);
      
      const filter = createFilter(ctx, 'lowpass', 800);
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
    console.warn('Audio synthesizing bypassed: ', err);
  }
}
