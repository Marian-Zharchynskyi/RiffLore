# Music Theory, Fretboard, Audio & Tab Engine Rules

## 1. Music Theory Math (`src/shared/lib/music/`)
- Use `@tonaljs/tonal` as the single source of truth for pitch, interval, scale, mode, and chord calculations.
- **Enharmonic Consistency:** Standardize pitch comparisons using pitch classes or MIDI numbers (`Note.midi("Bb2") === Note.midi("A#2")`) so quiz answers and fretboard highlights never fail due to sharp/flat spelling differences (`A#` vs `Bb`).
- **String & Fret Indexing Convention:**
  - Strings are numbered `1` (highest pitch, thinnest string, e.g., `E4`) to `6` (lowest pitch, thickest string, e.g., `E2`).
  - Frets are numbered `0` (open string / nut) to `24`.
  - Standard E tuning array (from string 6 to string 1): `['E2', 'A2', 'D3', 'G3', 'B3', 'E4']`.

## 2. Web Audio & Tone.js Synthesizer (`src/shared/lib/audio/`)
- **Browser Autoplay Policy:** Never call `Tone.start()` on page load. Always call `await ensureAudioReady()` inside a user interaction handler (`onClick` / `onPointerDown`).
- **Lightweight Polyphonic Synth Architecture:**
  - Use a shared singleton `Tone.PolySynth` (configured with plucked/guitar-like envelope and subtle filter/drive) rather than creating new audio nodes per click.
  - Keep click-to-sound latency minimal (`lookAhead = 0` or immediate trigger `synth.triggerAttackRelease(note, duration, Tone.immediate())`).
- **A/B Comparison Playback:**
  - Stop any currently playing sequence before starting sample A or sample B so intervals never muddy together unless playing a chord simultaneously.

## 3. AlphaTab Integration (`src/widgets/tab-stage/`)
- `@coderline/alphatab` is licensed under `MPL-2.0` — import it unmodified via npm.
- Always load AlphaTab inside a client-only component (`ssr: false`) and clean up the `AlphaTabApi` instance (`api.destroy()`) inside the `useEffect` cleanup function to prevent Web Worker and audio memory leaks.
- Theme AlphaTab's SVG output using CSS/AlphaTab `Settings.display.resources` so notation colors match our "Tube Amp & Boutique Studio" dark theme.
