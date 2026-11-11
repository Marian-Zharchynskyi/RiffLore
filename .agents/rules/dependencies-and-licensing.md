# Dependency & Licensing Policy

## 1. Pre-Implementation License Check

Before selecting or installing a new library, font, icon pack, audio soundfont, or 3D model, the agent **MUST** inspect its license (`npm view <package-name> license` or upstream repository `LICENSE` file) and record it.

Since the project is currently in its non-commercial development phase, any license is acceptable for rapid prototyping, **provided the user is clearly warned beforehand** if a dependency has future commercial restrictions.

## 2. License Tiers & Rules

### Tier 1: Permissive (Auto-Approved)
- **Licenses:** `MIT`, `Apache-2.0`, `ISC`, `BSD-2-Clause`, `BSD-3-Clause`, `0BSD`, `Unlicense`, `CC0-1.0`, `OFL-1.1` (for fonts).
- **Action:** Safe to install and use freely in both open-source and commercial builds without extra warnings.

### Tier 2: Weak Copyleft / File-Level Copyleft (Allowed with Documentation)
- **Licenses:** `MPL-2.0` (Mozilla Public License 2.0), `LGPL-2.1`, `LGPL-3.0`, `CC-BY-4.0`.
- **Action:**
  - Allowed when used as an unmodified external dependency (e.g., `@coderline/alphatab` is `MPL-2.0`).
  - Import the package via standard npm module imports rather than copying and modifying its internal source files directly.
  - For `CC-BY-4.0` assets (3D models, audio samples), document required attribution.

### Tier 3: Strong Copyleft / Non-Commercial / Proprietary (Warn Before Selection or Implementation)
- **Licenses:** `GPL-2.0`, `GPL-3.0`, `AGPL-3.0`, `CC-BY-NC` (Non-Commercial), `Commons Clause`, or custom commercial/paid licenses.
- **Action:**
  - **Do NOT block automatically**, as the project is not currently monetized.
  - **Give a clear, concise warning before selection or implementation** explaining the future commercial/distribution consequences (e.g., *"Note: This library/asset uses GPL-3.0 / CC-BY-NC — it works fine now while non-commercial, but will need replacement or licensing if RiffLore is monetized later"*).
  - Mention a permissive (`MIT`/`Apache-2.0`) alternative if one exists so the user can make an informed choice.

## 3. Core Dependency Registry

Keep this registry updated when adding major packages:

| Package | License | Tier | Notes |
| :--- | :--- | :--- | :--- |
| `next`, `react`, `react-dom` | MIT | Tier 1 | Core framework |
| `tailwindcss`, `@tailwindcss/postcss` | MIT | Tier 1 | Styling |
| `@radix-ui/*` (via `shadcn/ui`) | MIT | Tier 1 | Accessible UI primitives |
| `lucide-react` | ISC | Tier 1 | Icons |
| `framer-motion` / `motion` | MIT | Tier 1 | Animations |
| `zustand` | MIT | Tier 1 | State management |
| `zod` | MIT | Tier 1 | Schema validation |
| `@tonaljs/tonal` | MIT | Tier 1 | Music theory calculations |
| `tone` (Tone.js) | MIT | Tier 1 | Web Audio synthesizer & scheduling |
| `@coderline/alphatab` | MPL-2.0 | Tier 2 | Guitar tab rendering — import as unmodified package |
| `three`, `@react-three/fiber`, `@react-three/drei` | MIT | Tier 1 | 3D WebGL / Three.js rendering |
| `Space Grotesk`, `Plus Jakarta Sans`, `JetBrains Mono` | OFL-1.1 | Tier 1 | Google Fonts for "Tube Amp & Boutique Studio" theme |
| `expo`, `react-native`, `react-native-web`, `expo-status-bar` | MIT | Tier 1 | React Native mobile app (`mobile/`) & Expo Go / Web runtime |
| `react-native-svg`, `react-native-safe-area-context` | MIT | Tier 1 | Vector chord/fretboard diagrams & safe area layout on iOS/Android |
| `lucide-react-native` / `@expo/vector-icons` | ISC / MIT | Tier 1 | Mobile icons for React Native |
