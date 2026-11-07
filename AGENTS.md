# AGENTS.md

This file provides universal guidance to AI coding agents (Google Antigravity, Claude Code, Cursor) working in the **RiffLore** repository.

## Project Overview

**RiffLore** is an interactive web platform for guitarists combining structured, hands-on music theory lessons with an open-access **Fretboard Sandbox**, **Song Theory Deconstructor (Interactive Tabs)**, and **3D Gear & Rock Lore Showcase**.
Built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **`@tonaljs/tonal`**, **Tone.js**, **AlphaTab**, and **Three.js / React Three Fiber** using **Feature-Sliced Design (FSD)**.

## How Agent Rules Are Organized

This root `AGENTS.md` holds universal, always-relevant standards. Narrower architectural and domain conventions live in `.agents/rules/*.md` — check the matching rule file whenever touching that area:

| Rules file | Applies to |
| :--- | :--- |
| `.agents/rules/dependencies-and-licensing.md` | `package.json`, all new libraries, fonts, 3D models, audio assets — **License verification & warning rules** |
| `.agents/rules/architecture-and-patterns.md` | `src/**` — **Feature-Sliced Design (FSD)** layers, Next.js App Router conventions, future DB/Blob migration readiness |
| `.agents/rules/design-system.md` | `src/**` — **"Tube Amp & Boutique Studio"** tokens, semantic interval color coding, typography, `shadcn/ui` conventions |
| `.agents/rules/music-and-audio.md` | `src/shared/lib/music/**`, `src/shared/lib/audio/**`, `src/widgets/**` — Tonal.js math, Tone.js Web Audio lifecycle, AlphaTab |

---

## Core Architecture Principles (Feature-Sliced Design)

1. **Feature-Sliced Hierarchy (`app` → `views` → `widgets` → `features` → `entities` → `shared`):**
   - **`src/app/`**: Next.js App Router routes, layouts, global providers, and `globals.css`.
   - **`src/views/`**: Full page compositions (named `views` to avoid conflict with Next.js legacy `pages/`).
   - **`src/widgets/`**: Autonomous composite blocks (`interactive-fretboard`, `tab-stage`, `gear-3d-viewer`, `studio-header`).
   - **`src/features/`**: User actions & interactive tools (`scale-selector`, `tuning-switcher`, `audio-ab-test`, `fretboard-quiz`).
   - **`src/entities/`**: Domain models, Zod schemas, repositories, and entity stores (`lesson`, `riff`, `gear`, `music-note`).
   - **`src/shared/`**: Base `shadcn/ui` kit (`shared/ui`), pure `@tonaljs/tonal` music math (`shared/lib/music`), singleton `Tone.js` synth (`shared/lib/audio`), asset helpers (`shared/lib/assets`), and local content files (`shared/content`).

2. **Strict Import Direction:**
   - A module in any FSD layer may ONLY import from layers strictly **below** it. Cross-imports between slices on the same layer are prohibited.

3. **Dual-Mode / No-Wall Philosophy:**
   - Never lock lessons, fretboard tools, or lore pages behind mandatory login walls or forced sequential gates.
   - Guest progress is persisted automatically via `zustand` (`persist` middleware in `localStorage`).

---

## Dependency & License Rule

> **IMPORTANT:** Before selecting or installing ANY npm package, font, icon set, audio sample, or 3D model, check its license (`npm view <pkg> license`) and document it in `.agents/rules/dependencies-and-licensing.md`:
> - **Tier 1 (Permissive — Auto-Approved):** `MIT`, `Apache-2.0`, `ISC`, `BSD`, `CC0`, `OFL-1.1`.
> - **Tier 2 (File-Level Copyleft — Allowed as unmodified package):** `MPL-2.0` (e.g., `@coderline/alphatab`), `LGPL`, `CC-BY-4.0`.
> - **Tier 3 (Strong Copyleft / Non-Commercial / Proprietary — Warn First, Do Not Block):** `GPL`, `AGPL`, `CC-BY-NC`, or paid/commercial licenses. Since RiffLore is not yet monetized, do not block installation automatically — **give a brief, clear warning before selection/implementation** about future commercial consequences so the user can decide.

---

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npx tsc --noEmit

# Lint & Format
npm run lint

# Production build check (must pass before completing multi-file tasks)
npm run build
```

---

## Working Guidelines for AI Agents

1. **Check Licenses First:** Always inspect the `license` field (`npm view <pkg> license`) before adding a dependency and warn on Tier 3 licenses.
2. **Never Hardcode Music Theory Tables:** Do not hardcode static arrays of scale notes for specific keys when `src/shared/lib/music/` + `@tonaljs/tonal` can compute them dynamically for any root note and tuning.
3. **Web Audio Lifecycle Safety:** Never instantiate `new Tone.PolySynth()` inside a React render loop or on every click. Initialize audio nodes lazily after a user gesture (`Tone.start()`) and reuse them cleanly.
4. **Data-Driven Components:** Keep interactive lesson blocks strictly prop-driven and validated by Zod schemas so they work identically with local MDX/JSON files now and PostgreSQL (Supabase) + Blob Storage (Cloudflare R2) later.
5. **Quality Verification:** Run `npx tsc --noEmit` (and `npm run build` for structural changes) before declaring a task complete.
6. **Communication Style:** Keep explanations concise, practical, and direct. Highlight architectural trade-offs clearly when multiple paths exist.
