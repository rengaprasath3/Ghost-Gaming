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
  // Sound effects disabled per user request
}
