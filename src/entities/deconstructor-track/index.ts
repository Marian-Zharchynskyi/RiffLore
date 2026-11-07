import type { LocalizedText } from '@/entities/course';

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

export const DECONSTRUCTOR_TRACKS: DeconstructorTrack[] = [
  // ==========================================================================
  // TRACK 1: D NATURAL MINOR (Dm -> C -> Bb) - Matches Screenshots 3, 4, 5
  // ==========================================================================
  {
    id: 'd-natural-minor-box',
    title: {
      uk: 'D Natural Minor: Прогресія Dm – C – B♭ та цільові ноти соло',
      en: 'D Natural Minor: Dm – C – B♭ Progression & Target Phrase Vectors',
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
      // 1st string (high E)
      { string: 1, fret: 5, label: 'A' },
      { string: 1, fret: 6, label: 'Bb' },
      { string: 1, fret: 8, label: 'C' },
      // 2nd string (B)
      { string: 2, fret: 5, label: 'E' },
      { string: 2, fret: 6, label: 'F' },
      { string: 2, fret: 8, label: 'G' },
      // 3rd string (G)
      { string: 3, fret: 5, label: 'C' },
      { string: 3, fret: 7, label: 'D' },
      // 4th string (D)
      { string: 4, fret: 5, label: 'G' },
      { string: 4, fret: 7, label: 'A' },
      { string: 4, fret: 8, label: 'Bb' },
      // 5th string (A)
      { string: 5, fret: 5, label: 'D' },
      { string: 5, fret: 7, label: 'E' },
      { string: 5, fret: 8, label: 'F' },
      // 6th string (low E)
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
        harmonyCommentary: {
          uk: 'Перехід на акорд C Major (♭VII ступінь мінору). Зелений маршрут зміщується на горизонтальну мелодійну лінію G → F → E, яка плавно приземляється у велику терцію акорду C (ноту E)!',
          en: 'Shift to C Major (♭VII). The green phrase vector moves to the melodic line G → F → E, resolving directly into the Major 3rd (E) of the C chord!',
        },
        chordDiagram: {
          chordName: 'C',
          romanNumeral: '♭VII',
          baseFret: 5,
          frets: [-1, 7, 5, 5, 5, -1],
          barre: { fromString: 4, toString: 2, fret: 5 },
        },
        tabEvents: [
          { string: 4, fret: 5, noteName: 'G3', label: 'G', durationLabel: '|' },
          { string: 2, fret: 6, noteName: 'F4', label: 'F', durationLabel: '∏' },
          { string: 2, fret: 5, noteName: 'E4', label: 'E', durationLabel: '|' },
          { string: 3, fret: 5, noteName: 'C4', label: 'C', durationLabel: '|' },
        ],
        activePathNodes: [
          { string: 4, fret: 5, label: 'G' },
          { string: 2, fret: 6, label: 'F' },
          { string: 2, fret: 5, label: 'E' },
        ],
      },
      {
        id: 'bb-bar-3',
        barNumber: 3,
        chordName: 'Bb',
        circleActiveKey: 'Bb',
        circleRing: 'major',
        romanNumeral: '♭VI',
        harmonyCommentary: {
          uk: 'Субмедіанта B♭ Major (♭VI ступінь — класичний епічний хід у рок-баладах та металі). Зелений маршрут з’єднує ноти B♭ → D → F просто всередині того ж самого боксу!',
          en: 'B♭ Major (♭VI — the signature epic chord of rock and metal). The green vector connects B♭ → D → F without ever leaving the 5th-fret box!',
        },
        chordDiagram: {
          chordName: 'Bb',
          romanNumeral: '♭VI',
          baseFret: 5,
          frets: [6, 8, 8, 7, 6, 6],
          barre: { fromString: 6, toString: 1, fret: 6 },
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
  // TRACK 2: BORROWED MINOR IV (D -> Dm -> A) - Matches Screenshots 1 & 2
  // ==========================================================================
  {
    id: 'major-to-borrowed-minor-iv',
    title: {
      uk: 'Магія запозиченого акорду: Перехід IV → iv (D → Dm → A)',
      en: 'Borrowed Chord Magic: The IV → iv Shift (D → Dm → A)',
    },
    subtitle: {
      uk: 'Подивись на Квінтове коло ліворуч: як мажорна субдомінанта D (IV) перетворюється на запозичену мінорну Dm (iv) і розв’язується в A (I).',
      en: 'Watch the Circle of Fifths HUD: see how Major IV (D) transforms into borrowed Minor iv (Dm) before resolving home to A (I).',
    },
    scaleBadgeLabel: 'A Major / A Parallel Minor',
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
      { string: 2, fret: 6, label: 'F' },
      { string: 2, fret: 7, label: 'F#' },
      { string: 3, fret: 6, label: 'C#' },
      { string: 3, fret: 7, label: 'D' },
      { string: 3, fret: 9, label: 'E' },
      { string: 4, fret: 7, label: 'A' },
      { string: 4, fret: 9, label: 'B' },
      { string: 5, fret: 5, label: 'D' },
      { string: 5, fret: 7, label: 'E' },
      { string: 5, fret: 9, label: 'F#' },
    ],
    bars: [
      {
        id: 'd-maj-iv',
        barNumber: 4,
        chordName: 'D',
        circleActiveKey: 'D',
        circleRing: 'major',
        romanNumeral: 'IV',
        harmonyCommentary: {
          uk: 'Такт 4 (Перша половина): Звучить світлий діатонічний акорд D Major (IV ступінь у тональності A). На 1-й струні затиснутий 2-й лад (нота F♯).',
          en: 'Bar 4 (Part 1): Bright diatonic D Major chord (IV in the key of A). Note F♯ sits on the 1st string, 2nd fret.',
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
          { string: 5, fret: 5, label: 'D' },
          { string: 4, fret: 7, label: 'A' },
          { string: 2, fret: 7, label: 'F#' },
        ],
      },
      {
        id: 'dm-borrowed-iv',
        barNumber: 5,
        chordName: 'Dm',
        circleActiveKey: 'Dm',
        circleRing: 'minor',
        romanNumeral: 'iv',
        romanSub: '(min)',
        harmonyCommentary: {
          uk: 'Кульмінація! Нота F♯ опускається на півтону в F♮ (1 лад). Акорд D перетворюється на Dm (iv min у внутрішньому кільці Квінтового кола), створюючи щемливу ностальгійну напругу!',
          en: 'The magic moment! F♯ drops by a half-step to F♮. D Major becomes borrowed Dm (iv min on the inner ring of the Circle of Fifths), creating nostalgic tension!',
        },
        chordDiagram: {
          chordName: 'Dm',
          romanNumeral: 'iv',
          baseFret: 1,
          frets: [-1, -1, 0, 2, 3, 1],
        },
        tabEvents: [
          { string: 4, fret: 7, noteName: 'A3', label: 'A', durationLabel: '♬' },
          { string: 3, fret: 7, noteName: 'D4', label: 'D', durationLabel: '♬' },
          { string: 3, fret: 6, noteName: 'C#4', label: 'C#', durationLabel: '♬' },
          { string: 2, fret: 6, noteName: 'F4', label: 'F', durationLabel: '|' },
        ],
        activePathNodes: [
          { string: 5, fret: 5, label: 'D' },
          { string: 4, fret: 7, label: 'A' },
          { string: 2, fret: 6, label: 'F' },
          { string: 3, fret: 7, label: 'D' },
        ],
      },
      {
        id: 'a-home-i',
        barNumber: 6,
        chordName: 'A',
        circleActiveKey: 'A',
        circleRing: 'major',
        romanNumeral: 'I',
        harmonyCommentary: {
          uk: 'Розв’язання додому в Тоніку A Major (I). Нота F з мінорного акорду Dm тяжіє на півтону вниз прямо у квінту ноти E (5 лад, 2 струна) та терцію C♯ (6 лад, 3 струна)!',
          en: 'Resolution home to Tonic A Major (I). The F note from Dm resolves smoothly down a half-step into E (5th of A) and C♯ (Major 3rd of A)!',
        },
        chordDiagram: {
          chordName: 'A',
          romanNumeral: 'I',
          baseFret: 1,
          frets: [-1, 0, 2, 2, 2, 0],
        },
        tabEvents: [
          { string: 3, fret: 7, noteName: 'D4', label: 'D', durationLabel: '∏' },
          { string: 3, fret: 9, noteName: 'E4', label: 'E', durationLabel: '♬', technique: 'H' },
          { string: 3, fret: 6, noteName: 'C#4', label: 'C#', durationLabel: '∏' },
          { string: 4, fret: 7, noteName: 'A3', label: 'A', durationLabel: '|' },
        ],
        activePathNodes: [
          { string: 4, fret: 7, label: 'A' },
          { string: 3, fret: 6, label: 'C#' },
          { string: 2, fret: 5, label: 'E' },
          { string: 1, fret: 5, label: 'A' },
        ],
      },
    ],
  },
];
