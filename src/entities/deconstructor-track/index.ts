import type { LocalizedText } from '@/entities/course';
import {
  compileSongToDeconstructorTrack,
  parseAsciiTabToDeconstructorTrack,
  type CompactSongSpec,
} from './lib/auto-compiler';

export { compileSongToDeconstructorTrack, parseAsciiTabToDeconstructorTrack };
export type { CompactSongSpec };

export interface ChordDiagramSpec {
  chordName: string;
  romanNumeral: string;
  baseFret: number;
  /** 6 strings from 6th (left) to 1st (right): -1 = muted (X), 0 = open (O), >0 = fret number */
  frets: [number, number, number, number, number, number];
  barre?: { fromString: number; toString: number; fret: number };
}

export interface TabNoteEvent {
  string: number; // 1 to 6
  fret: number;
  noteName: string; // e.g. "D3"
  label: string; // e.g. "D"
  durationLabel: '|' | '∏' | '♬';
  technique?: 'H' | 'P' | 'S';
}

export interface DeconstructorBar {
  id: string;
  barNumber: number;
  chordName: string;
  /** Circle of Fifths active pitch class (e.g. 'D', 'Dm', 'C', 'Bb', 'A') */
  circleActiveKey: string;
  circleRing: 'major' | 'minor';
  romanNumeral: string;
  romanSub?: string;
  harmonyCommentary: LocalizedText;
  chordDiagram: ChordDiagramSpec;
  /** Tab notes played in this bar */
  tabEvents: TabNoteEvent[];
  /** Connected green target notes inside the fretboard scale box (Nikola Gugoski style) */
  activePathNodes: { string: number; fret: number; label: string }[];
}

export interface DeconstructorTrack {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  scaleBadgeLabel: string;
  keySignatureRoot: string;
  /** Keys highlighted as diatonic family on the Circle of Fifths */
  diatonicMajorNeighbors: string[];
  diatonicMinorNeighbors: string[];
  bpm: number;
  /** Green bounding rectangle on the fretboard [minFret, maxFret] */
  scaleBoxFretRange: [number, number];
  /** All scale notes inside the box rendered as Red Reference Dots */
  scaleBoxNotes: { string: number; fret: number; label: string }[];
  bars: DeconstructorBar[];
}

const POPULAR_SONG_SPECS: CompactSongSpec[] = [
  // 1. Metallica — Nothing Else Matters (Original 6/8 Open-String Intro + 7th Fret Melody)
  {
    id: 'metallica-nothing-else-matters',
    title: {
      uk: 'Metallica — Nothing Else Matters (Оригінальний Інтро-Таб 0–0–0–0 + Em – C – D – B7)',
      en: 'Metallica — Nothing Else Matters (Original Open-String Intro 0–0–0–0 + Em – C – D – B7)',
    },
    subtitle: {
      uk: 'Знамените інтро на відкритих струнах у розмірі 6/8 (E2 – G3 – B3 – E4 – B3 – G3) з виходом на 7-й лад та каденцією C → D → B7.',
      en: 'The iconic 6/8 open-string arpeggio (E2 – G3 – B3 – E4 – B3 – G3) moving up to the 7th fret and the C → D → B7 cadence.',
    },
    keyRoot: 'E',
    keyMode: 'minor',
    scaleName: 'natural minor',
    scaleBadgeLabel: 'E Natural Minor (Open + Pos 1)',
    bpm: 92,
    scaleBoxFretRange: [0, 7],
    bars: [
      {
        chordName: 'Em',
        commentary: {
          uk: 'Такт 1 (Відкриті струни 0–0–0–0–0–0): перебір відкритих струн 6 → 3 → 2 → 1 → 2 → 3 дає чистий мінорний тризвук Em (E – G – B – E – B – G)!',
          en: 'Bar 1 (Open Strings 0–0–0–0–0–0): plucking strings 6 → 3 → 2 → 1 → 2 → 3 forms a pure open Em triad (E – G – B – E – B – G)!',
        },
        notes: [
          { string: 6, fret: 0, duration: '∏' },
          { string: 3, fret: 0, duration: '∏' },
          { string: 2, fret: 0, duration: '∏' },
          { string: 1, fret: 0, duration: '∏' },
          { string: 2, fret: 0, duration: '∏' },
          { string: 3, fret: 0, duration: '∏' },
        ],
      },
      {
        chordName: 'Em',
        commentary: {
          uk: 'Такт 2 (Вихід на 7-й лад): після відкритих струн 6 → 3 → 2 палець летить на 7-й лад 1-ї струни (нота B — квінта Em) і зривається у відкриту E (0)!',
          en: 'Bar 2 (Jump to Fret 7): after open strings 6 → 3 → 2, the melody hits fret 7 on the high E string (note B — the 5th of Em) and pulls off to open E (0)!',
        },
        notes: [
          { string: 6, fret: 0, duration: '∏' },
          { string: 3, fret: 0, duration: '∏' },
          { string: 2, fret: 0, duration: '∏' },
          { string: 1, fret: 7, duration: '|' },
          { string: 1, fret: 0, duration: '∏', technique: 'P' },
          { string: 2, fret: 0, duration: '∏' },
        ],
      },
      {
        chordName: 'C',
        commentary: {
          uk: 'Такт 3 (Перехід C → D): басова нота C (5-та струна, 3-й лад) з відкритою 1-ю струною E переходить на 2 лади вище в акорд D (5-та струна, 5-й лад).',
          en: 'Bar 3 (C → D Walkup): bass note C (A3) with ringing open high E slides 2 frets up to D (A5 + G7 + B7).',
        },
        notes: [
          { string: 5, fret: 3, duration: '∏' },
          { string: 3, fret: 5, duration: '∏' },
          { string: 2, fret: 5, duration: '∏' },
          { string: 5, fret: 5, duration: '∏', technique: 'S' },
          { string: 3, fret: 7, duration: '∏' },
          { string: 2, fret: 7, duration: '∏' },
        ],
      },
      {
        chordName: 'B7',
        commentary: {
          uk: 'Такт 4 (Домінанта B7 у відкритій позиції): перебір акорду B7 (5-та струна 2-й лад B, 4-та струна 1-й лад D#, 3-тя струна 2-й лад A, 2-га відкрита B) тяжіє назад у відкритий Em!',
          en: 'Bar 4 (Open B7 Dominant): arpeggiating open B7 (A2=B, D1=D#, G2=A, B0=B) creates magnetic harmonic pull back to Bar 1’s open Em!',
        },
        notes: [
          { string: 5, fret: 2, duration: '∏' },
          { string: 4, fret: 1, duration: '∏' },
          { string: 3, fret: 2, duration: '∏' },
          { string: 2, fret: 0, duration: '∏' },
          { string: 3, fret: 2, duration: '∏' },
          { string: 4, fret: 1, duration: '∏' },
        ],
      },
    ],
  },

  // 2. Red Hot Chili Peppers — Californication (Exact Original Intro Tab)
  {
    id: 'rhcp-californication',
    title: {
      uk: 'RHCP — Californication (Оригінальний Інтро-Риф: Am – F – C – Dm)',
      en: 'RHCP — Californication (Original Intro Riff: Am – F – C – Dm)',
    },
    subtitle: {
      uk: 'Точний нота-в-ноту розбір вступу Джона Фрушанте у відкритій позиції (лади 0–3): як 2 ноти на кожен акорд створюють легендарну мелодію.',
      en: 'Note-for-note breakdown of John Frusciante’s open-position intro (frets 0–3): outlining Am, Fmaj7, C, and Dm with sparse, vocal intervals.',
    },
    keyRoot: 'A',
    keyMode: 'minor',
    scaleName: 'natural minor',
    scaleBadgeLabel: 'A Natural Minor (Open Pos 0–3)',
    bpm: 96,
    scaleBoxFretRange: [0, 3],
    bars: [
      {
        chordName: 'Am',
        commentary: {
          uk: 'Такт 1 (Am): Відкрита 5-та струна A (0) → 4-та струна E (2-й лад) → відкрита 2-га струна B (0) → 1-й лад C (H). Перехід B → C (9 → ♭3) дає весь фірмовий сум цього рифу!',
          en: 'Bar 1 (Am): Open 5th string A (0) → D2 (E) → open B (0) → hammer-on to B1 (C). That B → C (9th to minor 3rd) step is the emotional core of the riff!',
        },
        notes: [
          { string: 5, fret: 0, duration: '|' },
          { string: 4, fret: 2, duration: '∏' },
          { string: 2, fret: 0, duration: '∏' },
          { string: 2, fret: 1, duration: '|', technique: 'H' },
          { string: 3, fret: 2, duration: '∏' },
          { string: 4, fret: 2, duration: '∏' },
        ],
      },
      {
        chordName: 'F',
        commentary: {
          uk: 'Такт 2 (Fmaj7): Бас F (6-та струна, 1-й лад) → квінта C (5-та струна, 3-й лад) → велика терція A (3-тя струна, 2-й лад) → відкрита G (0).',
          en: 'Bar 2 (Fmaj7): Low F (E1) → 5th C (A3) → Major 3rd A (G2) → pull-off to open G (0).',
        },
        notes: [
          { string: 6, fret: 1, duration: '|' },
          { string: 5, fret: 3, duration: '∏' },
          { string: 3, fret: 2, duration: '∏' },
          { string: 3, fret: 0, duration: '|', technique: 'P' },
          { string: 4, fret: 3, duration: '∏' },
          { string: 5, fret: 3, duration: '∏' },
        ],
      },
      {
        chordName: 'C',
        commentary: {
          uk: 'Такт 3 (C Major): Арпеджіо відкритого акорду C (5-та струна 3-й лад C → 4-та струна 2-й лад E → відкрита G → 2-га струна 1-й лад C → відкрита E).',
          en: 'Bar 3 (C Major): Open C Major arpeggio climbing cleanly through C (A3) → E (D2) → G (G0) → C (B1) → E (e0).',
        },
        notes: [
          { string: 5, fret: 3, duration: '∏' },
          { string: 4, fret: 2, duration: '∏' },
          { string: 3, fret: 0, duration: '∏' },
          { string: 2, fret: 1, duration: '∏' },
          { string: 1, fret: 0, duration: '|' },
          { string: 2, fret: 1, duration: '∏' },
        ],
      },
      {
        chordName: 'Dm',
        commentary: {
          uk: 'Такт 4 (Dm): Відкритий акорд Dm (4-та струна 0 → 3-тя струна 2-й лад A → 2-га струна 3-й лад D → 1-ша струна 1-й лад F) повертає прогресію назад у Am.',
          en: 'Bar 4 (Dm): Open Dm arpeggio (D0 → G2 → B3 → e1) outlines the iv chord before looping back to Am.',
        },
        notes: [
          { string: 4, fret: 0, duration: '∏' },
          { string: 3, fret: 2, duration: '∏' },
          { string: 2, fret: 3, duration: '∏' },
          { string: 1, fret: 1, duration: '|' },
          { string: 2, fret: 3, duration: '∏' },
          { string: 3, fret: 2, duration: '∏' },
        ],
      },
    ],
  },

  // 3. Led Zeppelin — Stairway to Heaven (Exact Intro Arpeggio at Frets 5–8)
  {
    id: 'led-zeppelin-stairway-solo',
    title: {
      uk: 'Led Zeppelin — Stairway to Heaven (Оригінальний перебір вступу, лади 5–8)',
      en: 'Led Zeppelin — Stairway to Heaven (Original Intro Arpeggio, Frets 5–8)',
    },
    subtitle: {
      uk: 'Легендарний хроматичний спуск баса на 4-й струні (7 → 6 → 5 лади) поверх нерухомого баре на 5-му ладу (струни 3–2–1).',
      en: 'Jimmy Page’s legendary descending bass line on the 4th string (frets 7 → 6 → 5) under a barred 5th-fret treble triad.',
    },
    keyRoot: 'A',
    keyMode: 'minor',
    scaleName: 'natural minor',
    scaleBadgeLabel: 'A Natural Minor (Frets 5–8)',
    bpm: 82,
    scaleBoxFretRange: [5, 8],
    bars: [
      {
        chordName: 'Am',
        commentary: {
          uk: 'Такт 1 (Am на 5-му ладу): 4-та струна на 7-му ладу (A), а струни 3–2–1 затиснуті малим баре на 5-му ладу (C – E – A).',
          en: 'Bar 1 (Am at 5th fret): 4th string at fret 7 (root A) while strings 3–2–1 are barred at fret 5 (C – E – A).',
        },
        notes: [
          { string: 4, fret: 7, duration: '∏' },
          { string: 3, fret: 5, duration: '∏' },
          { string: 2, fret: 5, duration: '∏' },
          { string: 1, fret: 5, duration: '∏' },
          { string: 2, fret: 5, duration: '∏' },
          { string: 3, fret: 5, duration: '∏' },
        ],
      },
      {
        chordName: 'E',
        commentary: {
          uk: 'Такт 2 (Am/G#): Бас на 4-й струні спускається на 6-й лад (нота G#), а мізинець на 1-й струні бере 7-й лад (нота B).',
          en: 'Bar 2 (Am/G#): Bass on the 4th string steps down to fret 6 (G#) while the pinky reaches fret 7 on the 1st string (note B).',
        },
        notes: [
          { string: 4, fret: 6, duration: '∏' },
          { string: 3, fret: 5, duration: '∏' },
          { string: 2, fret: 5, duration: '∏' },
          { string: 1, fret: 7, duration: '∏' },
          { string: 2, fret: 5, duration: '∏' },
          { string: 3, fret: 5, duration: '∏' },
        ],
      },
      {
        chordName: 'C',
        commentary: {
          uk: 'Такт 3 (C/G): Тепер усі 4 струни тримає баре на 5-му ладу (4-та струна = G), а мізинець на 1-й струні піднімається на 8-й лад (висока нота C)!',
          en: 'Bar 3 (C/G): The index finger bars all 4 strings at fret 5 (bass = G) while the pinky hits fret 8 on the 1st string (high C)!',
        },
        notes: [
          { string: 4, fret: 5, duration: '∏' },
          { string: 3, fret: 5, duration: '∏' },
          { string: 2, fret: 5, duration: '∏' },
          { string: 1, fret: 8, duration: '∏' },
          { string: 2, fret: 5, duration: '∏' },
          { string: 3, fret: 5, duration: '∏' },
        ],
      },
      {
        chordName: 'F',
        commentary: {
          uk: 'Такт 4 (Каденція Fmaj7 → G → Am): Спуск до Fmaj7 і повернення в тоніку A на 7-му ладу 4-ї струни.',
          en: 'Bar 4 (Cadence to Fmaj7 → Am): Resolving through F (2nd string 6th fret, 3rd string 5th fret) back to root A (4th string 7th fret).',
        },
        notes: [
          { string: 2, fret: 6, duration: '∏' },
          { string: 3, fret: 5, duration: '∏' },
          { string: 4, fret: 7, duration: '∏' },
          { string: 3, fret: 5, duration: '∏' },
          { string: 4, fret: 7, duration: '|' },
        ],
      },
    ],
  },

  // 4. Pink Floyd — Comfortably Numb (Gilmour Solo in B Minor)
  {
    id: 'pink-floyd-comfortably-numb',
    title: {
      uk: 'Pink Floyd — Comfortably Numb (Соло Гілмора: Bm – A – G – Em)',
      en: 'Pink Floyd — Comfortably Numb (Gilmour Solo: Bm – A – G – Em)',
    },
    subtitle: {
      uk: 'Секрет співучого соло Девіда Гілмора: кожна довга нота влучає точно в терцію або квінту поточного акорду всередині боксу 7–10 ладів.',
      en: 'David Gilmour’s singing solo secret: every sustained note lands squarely on the 3rd or 5th of the underlying chord inside frets 7–10.',
    },
    keyRoot: 'B',
    keyMode: 'minor',
    scaleName: 'natural minor',
    scaleBadgeLabel: 'B Natural Minor',
    bpm: 88,
    scaleBoxFretRange: [7, 10],
    bars: [
      {
        chordName: 'Bm',
        commentary: {
          uk: 'Акорд Bm (i): Гілмор стартує з квінти F# (2-га струна, 7-й лад) і піднімається до тоніки B (1-ша струна, 7-й лад) та терції D (10-й лад).',
          en: 'Tonic Bm (i): Gilmour launches from the 5th F# (B7) up to root B (E7) and minor 3rd D (E10).',
        },
        notes: [
          { string: 4, fret: 9, duration: '∏' },
          { string: 3, fret: 7, duration: '∏' },
          { string: 2, fret: 7, duration: '|' },
          { string: 1, fret: 7, duration: '∏' },
          { string: 1, fret: 10, duration: '|' },
        ],
      },
      {
        chordName: 'A',
        commentary: {
          uk: 'Акорд A (♭VII): мелодія опускається на A (2-га струна 10-й лад) → G (8-й лад) → E (3-тя струна 9-й лад), ідеально підкреслюючи зміну гармонії.',
          en: 'Subtonic A (♭VII): the line targets A (B10) and E (G9), locking into the A Major harmony.',
        },
        notes: [
          { string: 2, fret: 10, duration: '|' },
          { string: 2, fret: 8, duration: '∏' },
          { string: 2, fret: 7, duration: '∏' },
          { string: 3, fret: 9, duration: '|' },
          { string: 3, fret: 7, duration: '∏' },
        ],
      },
      {
        chordName: 'G',
        commentary: {
          uk: 'Акорд G (♭VI): цільові ноти D (3-тя струна, 7-й лад) та B (4-та струна, 9-й лад) — це квінта і велика терція акорду G Major!',
          en: 'Submediant G (♭VI): target notes D (G7) and B (D9) are the exact 5th and Major 3rd of G Major!',
        },
        notes: [
          { string: 3, fret: 9, duration: '∏' },
          { string: 3, fret: 7, duration: '|' },
          { string: 4, fret: 9, duration: '|' },
          { string: 4, fret: 7, duration: '∏' },
          { string: 4, fret: 9, duration: '∏' },
        ],
      },
      {
        chordName: 'Em',
        commentary: {
          uk: 'Субдомінанта Em (iv): фраза завершується на G – E (2-га струна 8-й лад → 3-тя струна 9-й лад) перед поверненням у Bm.',
          en: 'Subdominant Em (iv): the phrase settles on G – E (B8 → G9), outlining the iv chord before resolving to Bm.',
        },
        notes: [
          { string: 2, fret: 8, duration: '|' },
          { string: 3, fret: 9, duration: '|' },
          { string: 3, fret: 7, duration: '∏' },
          { string: 4, fret: 9, duration: '|' },
        ],
      },
    ],
  },

  // 5. Nirvana — Smells Like Teen Spirit (Exact Vocal Melody Solo in F Minor)
  {
    id: 'nirvana-teen-spirit-solo',
    title: {
      uk: 'Nirvana — Smells Like Teen Spirit (Оригінальне Соло: Fm – B♭ – A♭ – D♭)',
      en: 'Nirvana — Smells Like Teen Spirit (Original Solo Tab: Fm – B♭ – A♭ – D♭)',
    },
    subtitle: {
      uk: 'Точний таб соло Курта Кобейна (3-тя струна 5-й лад → 2-га струна 6–8 лади → 3-тя струна 6–5–3 лади) у боксі F Minor.',
      en: 'Exact tab of Kurt Cobain’s solo (G5 → B6 → B8 → G6 → B6 → B4 → G6 → G5 → G3) inside F Minor.',
    },
    keyRoot: 'F',
    keyMode: 'minor',
    scaleName: 'natural minor',
    scaleBadgeLabel: 'F Natural Minor',
    bpm: 116,
    scaleBoxFretRange: [3, 8],
    useFlats: true,
    bars: [
      {
        chordName: 'Fm',
        commentary: {
          uk: 'Такт 1 (Fm): 3-тя струна 5-й лад (C) → 2-га струна 6-й лад (F) → 2-га струна 8-й лад (G) → 3-тя струна 6-й лад (Db). Точне відтворення вокальної лінії куплету!',
          en: 'Bar 1 (Fm): G5 (C) → B6 (F) → B8 (G) → G6 (Db). Exact note-for-note trace of the vocal melody!',
        },
        notes: [
          { string: 3, fret: 5, duration: '|' },
          { string: 2, fret: 6, duration: '|' },
          { string: 2, fret: 8, duration: '|' },
          { string: 3, fret: 6, duration: '|' },
        ],
      },
      {
        chordName: 'Bb',
        commentary: {
          uk: 'Такт 2 (B♭ → A♭): 2-га струна 6-й лад (F) → 4-й лад (Eb) → 3-тя струна 6-й лад (Db) → 5-й лад (C) → 3-й лад (Bb).',
          en: 'Bar 2 (B♭ → A♭): B6 (F) → B4 (Eb) → G6 (Db) → G5 (C) → G3 (Bb).',
        },
        notes: [
          { string: 2, fret: 6, duration: '|' },
          { string: 2, fret: 4, duration: '∏' },
          { string: 3, fret: 6, duration: '∏' },
          { string: 3, fret: 5, duration: '∏' },
          { string: 3, fret: 3, duration: '|' },
        ],
      },
      {
        chordName: 'Db',
        commentary: {
          uk: 'Такт 3 (D♭): Спуск на 4-й струні: 6-й лад (Ab) → 5-й лад (G) → 6-й лад (Ab) → 5-й лад (G) → 3-й лад (F).',
          en: 'Bar 3 (D♭): Resolving on the 4th string: D6 (Ab) → D5 (G) → D6 (Ab) → D5 (G) → D3 (F).',
        },
        notes: [
          { string: 4, fret: 6, duration: '|' },
          { string: 4, fret: 5, duration: '∏' },
          { string: 4, fret: 6, duration: '∏' },
          { string: 4, fret: 5, duration: '∏' },
          { string: 4, fret: 3, duration: '|' },
        ],
      },
    ],
  },
];

export const DECONSTRUCTOR_TRACKS: DeconstructorTrack[] = [
  // Put the Top-5 Iconic Songs first so the user can test them immediately, followed by the 2 Nikola Gugoski visual tutorials
  ...POPULAR_SONG_SPECS.map((spec) => compileSongToDeconstructorTrack(spec)),

  // ==========================================================================
  // TRACK 6: Nikola Gugoski #1 — D NATURAL MINOR (Dm -> C -> Bb) - Screenshots 3, 4, 5
  // ==========================================================================
  {
    id: 'd-natural-minor-box',
    title: {
      uk: 'Nikola Gugoski #1 — D Natural Minor (Прогресія Dm – C – B♭)',
      en: 'Nikola Gugoski #1 — D Natural Minor (Dm – C – B♭ Box Vectors)',
    },
    subtitle: {
      uk: 'Як у межах одного боксу гами (лади 5–8) обігрувати кожен акорд прогресії за допомогою зелених векторних маршрутів.',
      en: 'How to stay inside a single scale box (frets 5–8) while outlining each chord change with connected target-tone vectors.',
    },
    scaleBadgeLabel: 'D Natural Minor',
    keySignatureRoot: 'Dm',
    diatonicMajorNeighbors: ['Bb', 'F', 'C'],
    diatonicMinorNeighbors: ['Gm', 'Dm', 'Am'],
    bpm: 96,
    scaleBoxFretRange: [5, 8],
    scaleBoxNotes: [
      { string: 1, fret: 5, label: 'A' },
      { string: 1, fret: 6, label: 'Bb' },
      { string: 1, fret: 8, label: 'C' },
      { string: 2, fret: 5, label: 'E' },
      { string: 2, fret: 6, label: 'F' },
      { string: 2, fret: 8, label: 'G' },
      { string: 3, fret: 5, label: 'C' },
      { string: 3, fret: 7, label: 'D' },
      { string: 4, fret: 5, label: 'G' },
      { string: 4, fret: 7, label: 'A' },
      { string: 4, fret: 8, label: 'Bb' },
      { string: 5, fret: 5, label: 'D' },
      { string: 5, fret: 7, label: 'E' },
      { string: 5, fret: 8, label: 'F' },
      { string: 6, fret: 5, label: 'A' },
      { string: 6, fret: 6, label: 'Bb' },
      { string: 6, fret: 8, label: 'C' },
    ],
    bars: [
      {
        id: 'dm-bar-1',
        barNumber: 1,
        chordName: 'Dm',
        circleActiveKey: 'Dm',
        circleRing: 'minor',
        romanNumeral: 'i',
        romanSub: '(min)',
        harmonyCommentary: {
          uk: 'Тонічний акорд Dm (5-й лад). Поверх червоних точок боксу D Natural Minor зеленою лінією підсвічено акордові тони тризвуку Dm (D – F – A – D).',
          en: 'Tonic chord Dm (5th fret). Over the red scale box dots, the green vector highlights the exact Dm triad tones (D – F – A – D).',
        },
        chordDiagram: {
          chordName: 'Dm',
          romanNumeral: 'i',
          baseFret: 5,
          frets: [-1, 5, 7, 7, 6, 5],
          barre: { fromString: 5, toString: 1, fret: 5 },
        },
        tabEvents: [
          { string: 5, fret: 5, noteName: 'D3', label: 'D', durationLabel: '|' },
          { string: 4, fret: 7, noteName: 'A3', label: 'A', durationLabel: '∏' },
          { string: 3, fret: 7, noteName: 'D4', label: 'D', durationLabel: '∏' },
          { string: 2, fret: 6, noteName: 'F4', label: 'F', durationLabel: '|' },
        ],
        activePathNodes: [
          { string: 3, fret: 7, label: 'D' },
          { string: 2, fret: 6, label: 'F' },
          { string: 1, fret: 5, label: 'A' },
          { string: 5, fret: 5, label: 'D' },
        ],
      },
      {
        id: 'c-bar-2',
        barNumber: 2,
        chordName: 'C',
        circleActiveKey: 'C',
        circleRing: 'major',
        romanNumeral: '♭VII',
        romanSub: '(Maj)',
        harmonyCommentary: {
          uk: 'Перехід на акорд C Major (♭VII ступінь). Зелена векторна лінія зсувається на 3-тю струну та веде мелодію через G → F → E (лади 5–7–8), завершуючись на терції E акорду C!',
          en: 'Shift to C Major (♭VII). The green vector line moves to the 3rd string and guides the phrase through G → F → E, landing right on the Major 3rd (E) of the C chord!',
        },
        chordDiagram: {
          chordName: 'C',
          romanNumeral: '♭VII',
          baseFret: 1,
          frets: [-1, 3, 2, 0, 1, 0],
        },
        tabEvents: [
          { string: 4, fret: 5, noteName: 'G3', label: 'G', durationLabel: '∏' },
          { string: 4, fret: 7, noteName: 'A3', label: 'A', durationLabel: '∏', technique: 'H' },
          { string: 3, fret: 5, noteName: 'C4', label: 'C', durationLabel: '|' },
          { string: 2, fret: 5, noteName: 'E4', label: 'E', durationLabel: '|' },
        ],
        activePathNodes: [
          { string: 4, fret: 5, label: 'G' },
          { string: 5, fret: 8, label: 'F' },
          { string: 5, fret: 7, label: 'E' },
        ],
      },
      {
        id: 'bb-bar-3',
        barNumber: 3,
        chordName: 'Bb',
        circleActiveKey: 'Bb',
        circleRing: 'major',
        romanNumeral: '♭VI',
        romanSub: '(Maj)',
        harmonyCommentary: {
          uk: 'Субмедіанта B♭ Major (♭VI ступінь). Не змінюючи позиції руки (лади 5–8), ми виділяємо ноти B♭ – D – F всередині того ж самого боксу!',
          en: 'Submediant B♭ Major (♭VI). Without moving your hand out of frets 5–8, the green trajectory highlights B♭ – D – F right inside the same box!',
        },
        chordDiagram: {
          chordName: 'Bb',
          romanNumeral: '♭VI',
          baseFret: 1,
          frets: [-1, 1, 3, 3, 3, 1],
          barre: { fromString: 5, toString: 1, fret: 1 },
        },
        tabEvents: [
          { string: 6, fret: 6, noteName: 'Bb2', label: 'Bb', durationLabel: '|' },
          { string: 4, fret: 8, noteName: 'Bb3', label: 'Bb', durationLabel: '∏' },
          { string: 3, fret: 7, noteName: 'D4', label: 'D', durationLabel: '∏' },
          { string: 2, fret: 6, noteName: 'F4', label: 'F', durationLabel: '|' },
        ],
        activePathNodes: [
          { string: 6, fret: 6, label: 'Bb' },
          { string: 4, fret: 8, label: 'Bb' },
          { string: 3, fret: 7, label: 'D' },
          { string: 2, fret: 6, label: 'F' },
        ],
      },
    ],
  },

  // ==========================================================================
  // TRACK 7: Nikola Gugoski #2 — MODAL INTERCHANGE (IV -> iv min -> I in A Major)
  // ==========================================================================
  {
    id: 'major-to-borrowed-minor-iv',
    title: {
      uk: 'Nikola Gugoski #2 — Модальне запозичення D (IV) → Dm (iv) → A (I)',
      en: 'Nikola Gugoski #2 — Modal Interchange D (IV) → Dm (iv) → A (I)',
    },
    subtitle: {
      uk: 'Улюблений прийом The Beatles, Radiohead (Creep) та Oasis: як перетворення мажорної субдомінанти IV на мінорну iv min змінює Квінтове коло та табулатуру.',
      en: 'The signature harmonic move of The Beatles, Radiohead, and Oasis: watching the Circle of Fifths jump from outer ring D (IV) to inner ring Dm (iv min).',
    },
    scaleBadgeLabel: 'A Major / A Aeolian Borrowed',
    keySignatureRoot: 'A',
    diatonicMajorNeighbors: ['D', 'A', 'E'],
    diatonicMinorNeighbors: ['Bm', 'F#m', 'C#m'],
    bpm: 88,
    scaleBoxFretRange: [5, 9],
    scaleBoxNotes: [
      { string: 1, fret: 5, label: 'A' },
      { string: 1, fret: 7, label: 'B' },
      { string: 1, fret: 9, label: 'C#' },
      { string: 2, fret: 5, label: 'E' },
      { string: 2, fret: 7, label: 'F#' },
      { string: 2, fret: 9, label: 'G#' },
      { string: 3, fret: 6, label: 'C#' },
      { string: 3, fret: 7, label: 'D' },
      { string: 3, fret: 9, label: 'E' },
      { string: 4, fret: 7, label: 'A' },
      { string: 4, fret: 9, label: 'B' },
    ],
    bars: [
      {
        id: 'a-iv-major',
        barNumber: 1,
        chordName: 'D',
        circleActiveKey: 'D',
        circleRing: 'major',
        romanNumeral: 'IV',
        romanSub: '(Maj)',
        harmonyCommentary: {
          uk: 'Такт 4 (Скріншот 1): Звучить діатонічний мажорний акорд D (IV ступінь у тональності A Major). На 1-й струні затиснутий 2-й лад (нота F# — велика терція).',
          en: 'Bar 4 (Screenshot 1): Diatonic D Major (IV in A Major). Notice the 1st string plays fret 2 (note F# — Major 3rd) and the Circle of Fifths highlights outer D.',
        },
        chordDiagram: {
          chordName: 'D',
          romanNumeral: 'IV',
          baseFret: 1,
          frets: [-1, -1, 0, 2, 3, 2],
        },
        tabEvents: [
          { string: 4, fret: 0, noteName: 'D3', label: 'D', durationLabel: '|' },
          { string: 3, fret: 2, noteName: 'A3', label: 'A', durationLabel: '|' },
          { string: 2, fret: 3, noteName: 'D4', label: 'D', durationLabel: '|' },
          { string: 1, fret: 2, noteName: 'F#4', label: 'F#', durationLabel: '|' },
        ],
        activePathNodes: [
          { string: 3, fret: 7, label: 'D' },
          { string: 2, fret: 7, label: 'F#' },
          { string: 1, fret: 5, label: 'A' },
        ],
      },
      {
        id: 'a-iv-minor',
        barNumber: 2,
        chordName: 'Dm',
        circleActiveKey: 'Dm',
        circleRing: 'minor',
        romanNumeral: 'iv',
        romanSub: '(min)',
        harmonyCommentary: {
          uk: 'Такт 4.2 (Скріншот 2): Модальне запозичення! Нота F# спускається на півтону в F (1-й лад на 1-й струні або 6-й лад на 2-й струні). На Квінтовому колі зелений сектор перестрибує у внутрішнє кільце на Dm (iv min)!',
          en: 'Bar 4.2 (Screenshot 2): Modal Interchange! F# drops by 1 semitone to F natural (fret 6 on B string / fret 1 on E string). On the Circle of Fifths, the green indicator jumps to inner ring Dm (iv min)!',
        },
        chordDiagram: {
          chordName: 'Dm',
          romanNumeral: 'iv',
          baseFret: 1,
          frets: [-1, -1, 0, 2, 3, 1],
        },
        tabEvents: [
          { string: 4, fret: 5, noteName: 'G3', label: 'G', durationLabel: '♬' },
          { string: 3, fret: 7, noteName: 'D4', label: 'D', durationLabel: '♬' },
          { string: 2, fret: 6, noteName: 'F4', label: 'F', durationLabel: '♬', technique: 'H' },
          { string: 2, fret: 7, noteName: 'F#4', label: 'F#', durationLabel: '♬', technique: 'P' },
        ],
        activePathNodes: [
          { string: 3, fret: 7, label: 'D' },
          { string: 2, fret: 6, label: 'F' },
          { string: 1, fret: 5, label: 'A' },
        ],
      },
      {
        id: 'a-tonic-resolve',
        barNumber: 3,
        chordName: 'A',
        circleActiveKey: 'A',
        circleRing: 'major',
        romanNumeral: 'I',
        romanSub: '(Maj)',
        harmonyCommentary: {
          uk: 'Такт 5: Розв’язання ноти F (♭6 ступінь тональності A) на півтону вниз у квінту E (2-га струна, 5-й лад) та терцію C# (3-тя струна, 6-й лад) тонічного акорду A Major!',
          en: 'Bar 5: Smooth half-step resolution from borrowed F natural (♭6) down to the 5th E (B5) and Major 3rd C# (G6) of the home tonic A Major!',
        },
        chordDiagram: {
          chordName: 'A',
          romanNumeral: 'I',
          baseFret: 1,
          frets: [-1, 0, 2, 2, 2, 0],
        },
        tabEvents: [
          { string: 5, fret: 0, noteName: 'A2', label: 'A', durationLabel: '|' },
          { string: 4, fret: 7, noteName: 'A3', label: 'A', durationLabel: '∏' },
          { string: 3, fret: 6, noteName: 'C#4', label: 'C#', durationLabel: '∏' },
          { string: 2, fret: 5, noteName: 'E4', label: 'E', durationLabel: '|' },
        ],
        activePathNodes: [
          { string: 4, fret: 7, label: 'A' },
          { string: 3, fret: 6, label: 'C#' },
          { string: 2, fret: 5, label: 'E' },
        ],
      },
    ],
  },
];
