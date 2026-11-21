// Lantern Hunt — all sound is synthesised with WebAudio, no sound files.
export function createSoundBank() {
  let context = null;
  let enabled = true;

  function ensureContext() {
    if (!context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
    }
    if (context.state === 'suspended') context.resume().catch(() => {});
    return context;
  }

  /** Play one short oscillator note. */
  function note(frequency, startAt, duration, type, volume) {
    const ctx = ensureContext();
    if (!ctx || !enabled) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(ctx.currentTime + startAt);
    oscillator.stop(ctx.currentTime + startAt + duration + 0.05);
  }

  return {
    get enabled() { return enabled; },
    setEnabled(value) { enabled = value; },
    /** Warm the audio context on the first user gesture so later notes play. */
    unlock() { ensureContext(); },
    /** Two-note chime when a difference is found. */
    found() {
      note(660, 0, 0.16, 'sine', 0.22);
      note(990, 0.09, 0.28, 'sine', 0.22);
    },
    /** Low buzz for a wrong click. */
    wrong() {
      note(140, 0, 0.22, 'sawtooth', 0.10);
      note(110, 0.05, 0.22, 'sawtooth', 0.08);
    },
    /** Soft blip when a hint is used. */
    hint() { note(520, 0, 0.12, 'triangle', 0.16); },
    /** Little arpeggio when a level is cleared. */
    levelClear() {
      [523, 659, 784, 1047].forEach((freq, index) => note(freq, index * 0.11, 0.3, 'triangle', 0.2));
    },
    /** Longer fanfare for winning the whole hunt. */
    victory() {
      [523, 659, 784, 1047, 784, 1047, 1319].forEach((freq, index) => note(freq, index * 0.13, 0.34, 'triangle', 0.2));
    },
    /** Tick when the timer runs low. */
    tick() { note(880, 0, 0.06, 'square', 0.05); },
  };
}
