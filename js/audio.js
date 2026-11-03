/*
 * Synthesized sounds via the Web Audio API – no audio files, no licensing questions.
 * The AudioContext is created on the first user input (browser autoplay rules).
 */
(function (root) {
  'use strict';

  let ctx = null;
  let master = null;
  let lastTick = 0;

  function ensure() {
    if (!ctx) {
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone({ freq, freqEnd, type = 'sine', at = 0, dur = 0.15, vol = 0.3, attack = 0.005 }) {
    if (!ensure()) return;
    const t0 = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function noise({ at = 0, dur = 0.4, vol = 0.25, from = 400, to = 4000 }) {
    if (!ensure()) return;
    const t0 = ctx.currentTime + at;
    const len = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(from, t0);
    filter.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(gain).connect(master);
    src.start(t0);
  }

  const Sound = {
    unlock: ensure,

    spinStart() {
      noise({ dur: 0.45, vol: 0.3, from: 300, to: 3500 });
      tone({ freq: 180, freqEnd: 520, type: 'sawtooth', dur: 0.3, vol: 0.08 });
    },

    tick() {
      const now = performance.now();
      if (now - lastTick < 45) return;   // throttle at high reel speed
      lastTick = now;
      tone({ freq: 1500, type: 'square', dur: 0.025, vol: 0.05 });
    },

    reelStop(index) {
      // each reel gets its own pitch → audible build-up
      const base = [196, 247, 294][index] || 220;
      tone({ freq: base * 2, freqEnd: base, type: 'triangle', dur: 0.18, vol: 0.35 });
      noise({ dur: 0.08, vol: 0.15, from: 2000, to: 800 });
    },

    spillover() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
      notes.forEach((f, i) => tone({ freq: f, type: 'square', at: i * 0.11, dur: 0.22, vol: 0.12 }));
      tone({ freq: 1046.5, type: 'triangle', at: 0.66, dur: 0.8, vol: 0.25 });
    },

    nearMiss() {
      tone({ freq: 440, freqEnd: 415, type: 'triangle', dur: 0.3, vol: 0.25 });
      tone({ freq: 392, freqEnd: 311, type: 'triangle', at: 0.32, dur: 0.6, vol: 0.25 });
    },

    miss() {
      tone({ freq: 220, freqEnd: 140, type: 'sine', dur: 0.5, vol: 0.3 });
    },
  };

  root.VSM = root.VSM || {};
  root.VSM.Sound = Sound;
})(window);
