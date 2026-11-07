# 🎸 RiffLore

**RiffLore** is an interactive web platform for guitarists and rock music enthusiasts designed to solve the #1 problem of self-taught players: **tab dependency and the gap between playing riffs and understanding music theory**.

RiffLore combines an interactive, hands-on **Guitar Theory Track** with an open-access **Fretboard, Riff & Rock Lore Sandbox** — built with zero artificial paywalls or progression gates (**Dual-Mode / No-Wall Philosophy**).

---

## ✨ Core Pillars

1. **Interactive Theory Track (Deep & Engaging):**
   * Structured modules from fretboard geometry and intervals to CAGED, scales/modes, and the Circle of Fifths.
   * Every theoretical concept is paired with an **inline interactive SVG fretboard**, **instant A/B audio comparisons** (powered by Web Audio / Tone.js), hands-on guitar exercises, and interactive fretboard mini-trainers.
2. **Fretboard Sandbox (Open Exploration):**
   * Visualize any key, scale, mode, CAGED shape, or chord arpeggio across 12–24 frets in real time.
   * Toggle between note names (`C, D#, G`), interval degrees (`1, b3, 5`), and custom guitar tunings (`E Standard`, `Drop D`, `Eb Standard`, `D Standard`).
3. **Song & Riff Theory Deconstructor:**
   * Interactive guitar tabs powered by **AlphaTab** paired with deep harmonic breakdowns explaining *why* iconic rock and metal riffs work.
   * Legal audio playback via synthesized Web Audio / MIDI and official Spotify / YouTube embeds.
4. **3D Gear Showcase & Rock Lore:**
   * Unbranded 3D models of iconic guitars, pedals, and amplifiers rendered with **Three.js / React Three Fiber**, accompanied by historical band setups and album lore.

---

## 🎨 Design System: "Tube Amp & Boutique Studio"

Inspired by classic tube amplifiers and boutique audio plugins (Marshall, Neural DSP, Gibson), the interface combines:
* **Studio Hardware Surfaces:** Deep Onyx (`#0B0C0E`), Amp Chassis (`#131519`), and Rosewood/Ebony Fretboard (`#1A1615`).
* **Signature Accents:** Glowing Tube Amber (`#F59E0B`) and Overdrive Crimson (`#EF4444`).
* **Semantic Interval Synesthesia:** Every musical interval has a dedicated semantic color across the entire app (Root = Crimson/Amber, Minor 3rd = Ice Blue, Major 3rd = Gold, Perfect 5th = Emerald, Tritone `b5` = Electric Purple).
* **Typography (`OFL-1.1`):** `Space Grotesk` (Display & Lore), `Plus Jakarta Sans` (Theory & UI), and `JetBrains Mono` (Frets, Tabs & Interval Formulas).

---

## 🛠️ Tech Stack & Licenses

| Layer | Technology | License | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router), React, TypeScript | MIT | SSR/SSG, routing, type-safe component architecture |
| **Architecture** | Feature-Sliced Design (FSD) | — | Clean layer boundaries (`app → views → widgets → features → entities → shared`) |
| **Styling & UI** | Tailwind CSS, `shadcn/ui` (Radix UI), Lucide | MIT / ISC | Accessible primitives, custom dark studio design system |
| **Animations** | Framer Motion (`motion`) | MIT | Smooth UI transitions and fretboard state animations |
| **Music Theory** | `@tonaljs/tonal` | MIT | Algorithmic calculation of notes, intervals, scales, chords |
| **Audio Engine** | `tone` (Tone.js) / Web Audio API | MIT | Real-time polyphonic synthesis and interval A/B playback |
| **Tab Rendering** | `@coderline/alphatab` | MPL-2.0 | Interactive guitar tab rendering (Guitar Pro / MusicXML) |
| **3D Graphics** | `three`, `@react-three/fiber`, `@react-three/drei` | MIT | Interactive 3D gear rigs and hardware visualization |
| **State & Validation** | `zustand`, `zod` | MIT | Client-side state (`localStorage` persistence) & schema validation |

---

## 📂 Project Architecture (Feature-Sliced Design)

```text
RiffLore/
├── .agents/
│   └── rules/                    # Domain & architectural rules for AI coding agents
├── public/                       # Static assets (3D models, tab files, icons)
├── src/
│   ├── app/                      # 1. Next.js App Router (routes, layouts, globals.css)
│   ├── views/                    # 2. Full page compositions (home, lesson, sandbox, riff, gear)
│   ├── widgets/                  # 3. Composite UI blocks (interactive-fretboard, tab-stage, gear-3d-viewer)
│   ├── features/                 # 4. User interactions (scale-selector, tuning-switcher, audio-ab-test, quiz)
│   ├── entities/                 # 5. Business entities, Zod schemas & repositories (lesson, riff, gear, note)
│   └── shared/                   # 6. Reusable infrastructure
│       ├── ui/                   # Base design-system primitives (shadcn/ui)
│       ├── lib/
│       │   ├── music/            # Pure music-theory logic wrapping @tonaljs/tonal
│       │   ├── audio/            # Web Audio / Tone.js synth engine
│       │   ├── assets/           # Asset URL resolver (local /public -> Cloudflare R2 CDN ready)
│       │   └── utils.ts          # Shared helpers
│       ├── config/               # Theme tokens, tunings, navigation constants
│       └── content/              # Structured lessons (MDX/JSON), riffs, and lore
├── AGENTS.md                     # Root guidance for AI coding agents
└── README.md
```

---

## ⚖️ Legal & Licensing Compliance

* **Software Dependencies:** Every third-party library is checked for its license before selection. Permissive licenses (`MIT`, `Apache-2.0`, `ISC`, `BSD`, `OFL-1.1`) are preferred; libraries with restrictive or non-commercial licenses (`GPL`, `AGPL`, `CC-BY-NC`) are flagged with a warning regarding future monetization impact.
* **Audio & Tabs:** Original studio master recordings are never hosted. Educational examples use real-time Web Audio synthesis (Fair Use), and full songs use official Spotify/YouTube embeds.
* **3D Models & Trademarks:** 3D hardware models use generic/unbranded silhouettes without trademarked headstock logos. Brand names in text are used strictly under Nominative Fair Use for historical education.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check & production build
npm run build
```
