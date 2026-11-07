# Architecture & Engineering Patterns (Feature-Sliced Design)

## 1. Feature-Sliced Design (FSD) with Next.js App Router

The frontend strictly follows **Feature-Sliced Design (FSD)** adapted for Next.js App Router (using `src/views/` instead of `src/pages/` to prevent conflict with Next.js legacy Pages Router).

### Layer Hierarchy & Strict Import Rule
Layers are ordered from top to bottom. **A module may ONLY import from layers strictly below it:**
`app` → `views` → `widgets` → `features` → `entities` → `shared`

```text
src/
├── app/                  # 1. Next.js App Router (routing, layouts, providers, globals.css)
├── views/                # 2. Full page compositions (home, theory-lesson, sandbox, riff-detail, gear-lore)
├── widgets/              # 3. Autonomous composite blocks (studio-header, interactive-fretboard, tab-stage, gear-3d-viewer)
├── features/             # 4. User interactions & actions (scale-selector, tuning-switcher, audio-ab-test, fretboard-quiz)
├── entities/             # 5. Business domain models, Zod schemas, repositories & entity UI (lesson, riff, gear, music-note)
└── shared/               # 6. Reusable infrastructure & UI kit
    ├── ui/               # shadcn/ui primitives (Button, Select, Slider, Badge, Tabs...)
    ├── lib/
    │   ├── music/        # Pure music math wrappers around @tonaljs/tonal
    │   ├── audio/        # Singleton Web Audio / Tone.js synth engine
    │   ├── assets/       # getAssetUrl() helper (local /public now -> Cloudflare R2 CDN later)
    │   └── utils.ts      # cn() and shared helpers
    ├── config/           # Theme constants, tunings, navigation maps
    └── content/          # Local MDX/JSON data store (abstracted behind entity repositories)
```

### Public API Convention
- Every slice inside `views/*`, `widgets/*`, `features/*`, and `entities/*` must expose a public `index.ts` barrel file.
- Cross-imports between different slices on the same layer (e.g., `features/scale-selector` importing from `features/tuning-switcher`) are forbidden. Compose them at the `widgets` or `views` layer, or move shared domain logic down to `entities` / `shared`.

## 2. Next.js Server & Client Boundaries
- **Thin Route Files (`src/app/`):** Route `page.tsx` files only handle Next.js route params, metadata (`generateMetadata`), data fetching via entity repositories, and rendering the corresponding component from `src/views/`.
- **Client Boundaries (`"use client"`):** Keep layouts and views server-rendered where possible; attach `"use client"` to interactive widgets and features (`interactive-fretboard`, `audio-ab-test`, `tab-stage`, `gear-3d-viewer`).
- **Dynamic Imports for Browser Engines:** Always lazy-load heavy client-only libraries (`@coderline/alphatab`, `@react-three/fiber`) via `next/dynamic` (`{ ssr: false }`).

## 3. Cloud-Ready Content & Asset Abstraction (DB & Blob Storage Readiness)
To guarantee a painless future migration from local files to **PostgreSQL (Supabase)** and **Blob Storage (Cloudflare R2)**:
- **Schema-First Entities (`src/entities/*/model/schema.ts`):** Every lesson, riff breakdown, and 3D gear setup MUST be validated by a **Zod schema**.
- **Repository Functions (`src/entities/*/api/`):** Views and widgets must NEVER import `.json` or `.mdx` files from `src/shared/content/` directly. Always call async repository methods (`getLessonBySlug()`, `getModules()`, `getRiffBySlug()`).
- **Asset URL Helper (`src/shared/lib/assets/get-asset-url.ts`):** Never hardcode `/models/les-paul.glb` or `/tabs/paranoid.gp` inside components. Route all binary assets through `getAssetUrl(path)` which prefixes `NEXT_PUBLIC_ASSET_CDN_URL` when configured.
