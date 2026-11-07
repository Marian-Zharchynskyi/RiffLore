# Design System: "Tube Amp & Boutique Studio"

## 1. Visual Identity & Inspiration
RiffLore uses the **"Tube Amp & Boutique Studio"** aesthetic (inspired by Marshall, Neural DSP plugins, Teenage Engineering, and Gibson custom shop):
- Tactile, dark studio surfaces with subtle 1px metallic borders (`border-white/10`), glowing tube-amber accents, and warm cream typography.
- Base interactive primitives use **`shadcn/ui` (Radix UI + Tailwind CSS)** located in `src/shared/ui/`.
- Do not scatter raw hex values across feature components; use semantic CSS variables / Tailwind tokens declared in `src/app/globals.css`.

## 2. Color Palette Tokens

### Studio Surfaces & Hardware
| Token | Hex | Role |
| :--- | :--- | :--- |
| `--background` | `#0B0C0E` | Deep Onyx main studio backdrop |
| `--card` / `--surface` | `#131519` | Amp chassis / control panel surface |
| `--surface-elevated` | `#1A1D24` | Hover states, raised pedal/module cards |
| `--fretboard-wood` | `#1A1615` | Rosewood / Ebony fingerboard background |
| `--fret-wire` | `#52525B` | Nickel/brass fret wire lines |
| `--foreground` | `#F3F4F6` | Warm cream primary text |
| `--muted-foreground` | `#9CA3AF` | Brushed graphite secondary text |
| `--primary` | `#F59E0B` | Glowing Tube Amber (primary actions, active indicators) |
| `--accent-crimson` | `#EF4444` | Overdrive Crimson (high-gain highlights, root emphasis) |
| `--border` | `rgba(255, 255, 255, 0.09)` | Subtle anodized hardware border |

### Semantic Music Interval Color System (RiffLore Signature)
Across the entire app (SVG Fretboard markers, inline text badges, chord diagrams, A/B audio buttons, and quizzes), intervals MUST use these consistent semantic tokens:

| Interval Role | Degree Symbol | Hex / Token | Visual Meaning |
| :--- | :--- | :--- | :--- |
| **Root (Тоніка)** | `R` / `1` | `#EF4444` (`--interval-root`) | Overdrive Crimson / Amber ring — primary tonal anchor |
| **Minor 3rd (Мала терція)** | `b3` | `#38BDF8` (`--interval-minor-third`) | Ice Blue — cool, melancholic minor quality |
| **Major 3rd (Велика терція)** | `3` | `#F59E0B` (`--interval-major-third`) | Tube Gold / Amber — warm, bright major quality |
| **Perfect 5th (Чиста квінта)** | `5` | `#10B981` (`--interval-fifth`) | Emerald Steel — stable power-chord backbone |
| **Tritone / Blue Note (Тритон)** | `b5` / `#4` | `#D946EF` (`--interval-tritone`) | Electric Magenta/Purple — tension, "Devil's interval" |
| **7ths (Септими)** | `b7` / `7` | `#A78BFA` (`--interval-seventh`) | Warm Violet — harmonic color & jazz/blues tension |
| **Other Scale Notes (2, 4, 6)** | `2, 4, 6` | `#64748B` (`--interval-scale-step`) | Brushed Slate — neutral passing scale tones |

## 3. Typography Hierarchy (`next/font/google`, `OFL-1.1`)
1. **`--font-display` (`Space Grotesk`):** Headings, Module titles, Band Lore headers, Hardware labels.
2. **`--font-sans` (`Plus Jakarta Sans`):** Long-form theory explanations, UI navigation, exercise instructions.
3. **`--font-mono` (`JetBrains Mono`):** Fret numbers, tablature, note badges (`C#`, `Bb`), interval formulas (`1 - b3 - 5`), and tunings (`E A D G B E`).

## 4. Accessibility & Interaction Standards
- Fretboard note markers and studio switches must be keyboard-accessible (`<button>` or `<g role="button" tabIndex={0}>`) with descriptive `aria-label` attributes (e.g., `"6th string, 5th fret, Note A, Root"`).
- Support intuitive keyboard shortcuts in sandbox and lessons where appropriate (e.g., `Space` to play/stop active chord or riff).
