import { Platform, Vibration } from 'react-native';

const CHORD_FREQUENCIES: Record<string, number[]> = {
  Em: [82.41, 123.47, 164.81, 196.0, 246.94, 329.63],
  Asus2: [110.0, 164.81, 220.0, 246.94, 329.63],
  Am9: [110.0, 196.0, 293.66, 246.94, 329.63],
  E: [82.41, 123.47, 164.81, 207.65, 246.94, 329.63],
  Am: [110.0, 164.81, 220.0, 261.63, 329.63],
  C: [130.81, 164.81, 196.0, 261.63, 329.63],
  G: [98.0, 123.47, 146.83, 196.0, 293.66, 392.0],
  D: [146.83, 220.0, 293.66, 369.99],
};

/**
 * Plays a guitar chord strum preview on Web (via Web Audio API)
 * and triggers tactile haptic pulse on iOS / Android devices.
 */
export function playChordAudio(chordName: string): void {
  if (Platform.OS !== 'web') {
    try {
      Vibration.vibrate(25);
    } catch {
      // Ignore if vibration permission is unavailable
    }
  }

  if (typeof window !== 'undefined') {
    const win = window as unknown as {
      AudioContext?: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    };
    const AudioCtx = win.AudioContext || win.webkitAudioContext;
    if (!AudioCtx) return;

    try {
      const ctx = new AudioCtx();
      const freqs = CHORD_FREQUENCIES[chordName] ?? CHORD_FREQUENCIES.Em;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const startTime = ctx.currentTime + idx * 0.045;

        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.16, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0008, startTime + 1.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.3);
      });
    } catch {
      // Ignore audio context autoplay errors
    }
  }
}
