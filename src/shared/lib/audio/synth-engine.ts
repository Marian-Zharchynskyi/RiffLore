'use client';

import type * as ToneType from 'tone';

export type SynthTonePreset = 'clean-tube' | 'warm-crunch' | 'harmonic-bell';

/**
 * Reference pitches across the 6-string guitar range (E2 to E5).
 * Tone.Sampler automatically interpolates adjacent frets from these base buffers.
 */
const REFERENCE_NOTES: ReadonlyArray<{ note: string; freq: number }> = [
  { note: 'E2', freq: 82.41 },
  { note: 'G2', freq: 98.0 },
  { note: 'A2', freq: 110.0 },
  { note: 'C3', freq: 130.81 },
  { note: 'D3', freq: 146.83 },
  { note: 'F3', freq: 174.61 },
  { note: 'G3', freq: 196.0 },
  { note: 'B3', freq: 246.94 },
  { note: 'D4', freq: 293.66 },
  { note: 'E4', freq: 329.63 },
  { note: 'G4', freq: 392.0 },
  { note: 'B4', freq: 493.88 },
  { note: 'E5', freq: 659.25 },
];

/**
 * Generates a realistic multi-sampled guitar string AudioBuffer using an
 * Extended Karplus-Strong Physical String Waveguide model with:
 * 1. Plectrum (pick) attack transient & pickup/soundhole comb-filter position
 * 2. String gauge damping (wound bass strings vs plain steel treble strings)
 * 3. Guitar body wooden resonance (Helmholtz air + top plate formants) or
 *    Tube Amp overdrive + 4x12" Celestion Cabinet speaker roll-off.
 */
function synthesizePhysicalGuitarSample(
  ctx: BaseAudioContext,
  frequency: number,
  preset: SynthTonePreset
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const durationSeconds = 3.2;
  const totalSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
  const output = buffer.getChannelData(0);

  // Fractional delay line length for accurate pitch
  const period = Math.max(4, Math.round(sampleRate / frequency));
  const delayLine = new Float32Array(period);

  // Pick position along the string (0.14 = bridge/neck sweet spot)
  const pickPosOffset = Math.max(1, Math.floor(period * (preset === 'warm-crunch' ? 0.13 : 0.22)));

  // 1. Initialize string excitation (Pick pluck + warm fundamental body)
  const rawNoise = new Float32Array(period);
  let prevNoise = 0;
  for (let i = 0; i < period; i++) {
    const phase = (i / period) * Math.PI * 2;
    // Filtered pink-ish noise burst + fundamental + 2nd harmonic warmth
    const white = Math.random() * 2 - 1;
    prevNoise = 0.68 * prevNoise + 0.32 * white;

    const pluckHarmonics =
      0.55 * Math.sin(phase) +
      0.28 * Math.sin(phase * 2) +
      0.14 * Math.sin(phase * 3);

    rawNoise[i] = prevNoise * 0.65 + pluckHarmonics * 0.55;
  }

  // Apply pick-position comb filtering (gives real guitar hollow/twang character)
  for (let i = 0; i < period; i++) {
    const delayedIdx = (i - pickPosOffset + period) % period;
    delayLine[i] = rawNoise[i] - 0.45 * rawNoise[delayedIdx];
  }

  // 2. String loop damping & brightness parameters based on pitch & rig preset
  // Wound bass strings (E2-D3) have deeper sustain; treble strings ring clearly
  const isWoundString = frequency < 165;
  const baseDecay =
    preset === 'warm-crunch'
      ? 0.9968
      : preset === 'harmonic-bell'
        ? 0.9958
        : 0.9962;
  const pitchAdjustedDecay = Math.min(
    0.9985,
    baseDecay + (frequency - 82) * 0.0000035
  );

  // Brightness coefficient in the Karplus-Strong two-point averaging filter
  const stringBrightness =
    preset === 'harmonic-bell'
      ? isWoundString
        ? 0.38
        : 0.28
      : preset === 'clean-tube'
        ? isWoundString
          ? 0.45
          : 0.36
        : isWoundString
          ? 0.4
          : 0.32;

  // 3. Run physical waveguide loop across the sample duration
  let ptr = 0;
  let prevSample = 0;
  // Two-pole body/cabinet filter states
  let lpState1 = 0;
  let lpState2 = 0;
  let bodyResState = 0;

  for (let n = 0; n < totalSamples; n++) {
    const current = delayLine[ptr];
    const nextIdx = (ptr + 1) % period;
    const next = delayLine[nextIdx];

    // Low-pass averaging in string feedback loop (simulates bridge & nut energy loss)
    const filtered =
      (1 - stringBrightness) * current + stringBrightness * next;

    // Subtle string stiffness dispersion
    const dispersed = filtered + 0.04 * (filtered - prevSample);
    prevSample = filtered;

    delayLine[ptr] = dispersed * pitchAdjustedDecay;
    ptr = nextIdx;

    // Add crisp plectrum transient during the first 4 milliseconds
    let signal = current;
    if (n < sampleRate * 0.004) {
      const transientEnv = 1 - n / (sampleRate * 0.004);
      signal += (Math.random() * 2 - 1) * 0.18 * transientEnv;
    }

    // 4. Rig-specific Amp / Acoustic Body shaping
    if (preset === 'warm-crunch') {
      // Tube preamp asymmetric soft clipping + 4x12" Cabinet speaker roll-off
      const driven = signal * 3.4;
      const tubeSaturated = Math.tanh(driven) + 0.12 * Math.tanh(driven * driven);
      // 4x12" speaker cone roll-off (~3.8kHz two-pole lowpass) to eliminate digital fizz
      const cutoffAlpha = 0.38;
      lpState1 += cutoffAlpha * (tubeSaturated - lpState1);
      lpState2 += cutoffAlpha * (lpState1 - lpState2);
      signal = lpState2 * 0.72;
    } else if (preset === 'clean-tube') {
      // Fender Twin clean tube warmth: gentle compression + warm midrange
      const warmPreamp = Math.tanh(signal * 1.45);
      const cutoffAlpha = 0.52;
      lpState1 += cutoffAlpha * (warmPreamp - lpState1);
      signal = lpState1 * 0.85;
    } else {
      // Acoustic Steel-String Dreadnought: wood body resonance + bronze string sparkle
      bodyResState = 0.88 * bodyResState + 0.12 * signal;
      const cutoffAlpha = 0.68;
      lpState1 += cutoffAlpha * (signal - lpState1);
      signal = (lpState1 * 0.78 + bodyResState * 0.32) * 0.9;
    }

    // Smooth release tail in the final 250ms so buffers never click
    const fadeStart = totalSamples - Math.floor(sampleRate * 0.25);
    if (n > fadeStart) {
      const fade = 1 - (n - fadeStart) / (totalSamples - fadeStart);
      signal *= fade * fade;
    }

    output[n] = Math.max(-0.95, Math.min(0.95, signal));
  }

  return buffer;
}

class RiffLoreGuitarAudioEngine {
  private toneModule: typeof ToneType | null = null;
  private samplers: Partial<Record<SynthTonePreset, ToneType.Sampler>> = {};
  private reverbNode: ToneType.Reverb | null = null;
  private compressorNode: ToneType.Compressor | null = null;
  private isReady = false;
  private isMuted = false;
  private currentPreset: SynthTonePreset = 'clean-tube';

  private async loadTone() {
    if (!this.toneModule) {
      this.toneModule = await import('tone');
    }
    return this.toneModule;
  }

  public async ensureInitialized(): Promise<void> {
    const Tone = await this.loadTone();

    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }

    if (!this.compressorNode || !this.reverbNode) {
      this.compressorNode = new Tone.Compressor({
        threshold: -18,
        ratio: 3.5,
        attack: 0.008,
        release: 0.18,
      }).toDestination();

      this.reverbNode = new Tone.Reverb({
        decay: 1.5,
        preDelay: 0.012,
        wet: 0.18,
      }).connect(this.compressorNode);
    }

    // Lazily build the physical guitar Sampler for the current preset
    if (!this.samplers[this.currentPreset]) {
      const rawCtx = Tone.getContext().rawContext;
      const urls: Record<string, AudioBuffer> = {};

      for (const ref of REFERENCE_NOTES) {
        urls[ref.note] = synthesizePhysicalGuitarSample(
          rawCtx,
          ref.freq,
          this.currentPreset
        );
      }

      const sampler = new Tone.Sampler({
        urls,
        release: 0.6,
        volume: this.currentPreset === 'warm-crunch' ? -4 : -2,
      }).connect(this.reverbNode);

      this.samplers[this.currentPreset] = sampler;
    }

    this.isReady = true;
  }

  public setPreset(preset: SynthTonePreset): void {
    this.currentPreset = preset;
    // Trigger lazy creation on next note play
  }

  public getPreset(): SynthTonePreset {
    return this.currentPreset;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getIsReady(): boolean {
    return this.isReady;
  }

  public async playNote(note: string, duration = '2n'): Promise<void> {
    if (this.isMuted) return;
    await this.ensureInitialized();
    const Tone = await this.loadTone();
    const activeSampler = this.samplers[this.currentPreset];
    if (!activeSampler) return;

    activeSampler.triggerAttackRelease(note, duration, Tone.immediate());
  }

  /**
   * Strums a guitar chord or interval with natural pick-sweep timing (18ms default)
   * and realistic velocity humanization across strings.
   */
  public async playChordOrInterval(
    notes: string[],
    strumDelayMs = 22
  ): Promise<void> {
    if (this.isMuted) return;
    await this.ensureInitialized();
    const Tone = await this.loadTone();
    const activeSampler = this.samplers[this.currentPreset];
    if (!activeSampler) return;

    const now = Tone.immediate();
    notes.forEach((note, index) => {
      const offsetSeconds = (index * strumDelayMs) / 1000;
      // Slightly emphasize root (first note) and top melody note
      const velocity =
        index === 0
          ? 0.95
          : index === notes.length - 1
            ? 0.9
            : 0.78 + Math.random() * 0.08;
      activeSampler.triggerAttackRelease(
        note,
        '1n',
        now + offsetSeconds,
        velocity
      );
    });
  }
}

export const synthEngine = new RiffLoreGuitarAudioEngine();
