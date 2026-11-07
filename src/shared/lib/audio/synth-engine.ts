'use client';

import type * as ToneType from 'tone';

export type SynthTonePreset = 'clean-tube' | 'warm-crunch' | 'harmonic-bell';

class RiffLoreSynthEngine {
  private toneModule: typeof ToneType | null = null;
  private synth: ToneType.PolySynth | null = null;
  private isReady = false;
  private isMuted = false;
  private currentPreset: SynthTonePreset = 'warm-crunch';

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

    if (!this.synth) {
      const filter = new Tone.Filter({
        frequency: 2600,
        type: 'lowpass',
        rolloff: -12,
      }).toDestination();

      const reverb = new Tone.Reverb({
        decay: 1.4,
        wet: 0.18,
      }).connect(filter);

      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: 'fatsawtooth',
          count: 3,
          spread: 14,
        },
        envelope: {
          attack: 0.006,
          decay: 0.35,
          sustain: 0.18,
          release: 0.9,
        },
        volume: -8,
      }).connect(reverb);

      this.applyPresetSettings(this.currentPreset);
      this.isReady = true;
    }
  }

  public setPreset(preset: SynthTonePreset): void {
    this.currentPreset = preset;
    if (this.synth) {
      this.applyPresetSettings(preset);
    }
  }

  private applyPresetSettings(preset: SynthTonePreset): void {
    if (!this.synth) return;

    if (preset === 'clean-tube') {
      this.synth.set({
        oscillator: { type: 'fatsine', count: 2, spread: 10 },
        envelope: { attack: 0.005, decay: 0.4, sustain: 0.15, release: 1.1 },
      });
    } else if (preset === 'warm-crunch') {
      this.synth.set({
        oscillator: { type: 'fatsawtooth', count: 3, spread: 14 },
        envelope: { attack: 0.005, decay: 0.32, sustain: 0.22, release: 0.85 },
      });
    } else {
      this.synth.set({
        oscillator: { type: 'fattriangle', count: 3, spread: 20 },
        envelope: { attack: 0.004, decay: 0.5, sustain: 0.1, release: 1.2 },
      });
    }
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

  public async playNote(note: string, duration = '8n'): Promise<void> {
    if (this.isMuted) return;
    await this.ensureInitialized();
    const Tone = await this.loadTone();
    this.synth?.triggerAttackRelease(note, duration, Tone.immediate());
  }

  public async playChordOrInterval(notes: string[], strumDelayMs = 45): Promise<void> {
    if (this.isMuted) return;
    await this.ensureInitialized();
    const Tone = await this.loadTone();
    this.synth?.releaseAll();

    const now = Tone.immediate();
    notes.forEach((note, index) => {
      const offsetSeconds = (index * strumDelayMs) / 1000;
      this.synth?.triggerAttackRelease(note, '2n', now + offsetSeconds);
    });
  }
}

export const synthEngine = new RiffLoreSynthEngine();
