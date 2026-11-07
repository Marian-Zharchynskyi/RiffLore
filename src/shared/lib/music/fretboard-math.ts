import { Note } from '@tonaljs/tonal';
import {
  INTERVAL_META,
  SEMITONE_TO_DEGREE,
  type IntervalDegree,
  type IntervalMeta,
} from '@/shared/config/intervals';

export interface ScaleDefinition {
  id: string;
  nameUk: string;
  nameEn: string;
  formulaDegrees: IntervalDegree[];
  vibe: string;
}

export const STUDIO_SCALES: ScaleDefinition[] = [
  {
    id: 'minor-pentatonic',
    nameUk: 'Мінорна пентатоніка',
    nameEn: 'Minor Pentatonic',
    formulaDegrees: ['1', 'b3', '4', '5', 'b7'],
    vibe: 'Головний фундамент рок- і блюз-соло (AC/DC, Led Zeppelin, Pink Floyd)',
  },
  {
    id: 'blues-scale',
    nameUk: 'Блюзова гама (Blues / Metal)',
    nameEn: 'Minor Blues Scale',
    formulaDegrees: ['1', 'b3', '4', 'b5', '5', 'b7'],
    vibe: 'Пентатоніка + гостра блюзова нота b5 (Black Sabbath, Metallica, Hendrix)',
  },
  {
    id: 'natural-minor',
    nameUk: 'Натуральний мінор (Еолійський)',
    nameEn: 'Natural Minor (Aeolian)',
    formulaDegrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    vibe: 'Епічний, драматичний звук класичного хеві-металу (Iron Maiden, Ozzy)',
  },
  {
    id: 'natural-major',
    nameUk: 'Натуральний мажор (Іонійський)',
    nameEn: 'Major (Ionian)',
    formulaDegrees: ['1', '2', '3', '4', '5', '6', '7'],
    vibe: 'Яскрава, світла мажорна основа та точка відліку всієї теорії',
  },
  {
    id: 'dorian',
    nameUk: 'Дорійський лад (Dorian)',
    nameEn: 'Dorian Mode',
    formulaDegrees: ['1', '2', 'b3', '4', '5', '6', 'b7'],
    vibe: 'Мінор із фірмовою мажорною секстою (6) — Santana, Pink Floyd, Tool',
  },
  {
    id: 'phrygian',
    nameUk: 'Фригійський лад (Phrygian)',
    nameEn: 'Phrygian Mode',
    formulaDegrees: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
    vibe: 'Темна мала секунда (b2) — треш-метал, фламенко та орієнтальний рифінг',
  },
  {
    id: 'power-chord',
    nameUk: 'Павер-акорд (Power Chord 5)',
    nameEn: 'Power Chord (1 + 5)',
    formulaDegrees: ['1', '5'],
    vibe: 'Чиста квінта без терції — щільна стіна звуку на хай-гейн перегрузі',
  },
  {
    id: 'chromatic',
    nameUk: 'Усі 12 нот (Хроматика)',
    nameEn: 'Chromatic (All 12 Semitones)',
    formulaDegrees: ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
    vibe: 'Повна карта грифу без фільтрації',
  },
];

export const ROOT_NOTES = [
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'Bb',
  'B',
  'C',
  'C#',
  'D',
  'Eb',
] as const;

export type RootNote = (typeof ROOT_NOTES)[number];

export interface FretNoteInfo {
  stringNumber: number; // 1 (high E) to 6 (low E)
  fret: number; // 0 to 24
  fullNote: string; // e.g. "E2"
  pitchClass: string; // e.g. "E"
  midi: number;
  degree: IntervalDegree;
  intervalMeta: IntervalMeta;
  isInActiveScale: boolean;
  isRoot: boolean;
}

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function formatNoteFromMidi(midi: number, preferFlats = false): { fullNote: string; pitchClass: string } {
  const chroma = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const pitchClass = preferFlats ? FLAT_NAMES[chroma] : SHARP_NAMES[chroma];
  return {
    pitchClass,
    fullNote: `${pitchClass}${octave}`,
  };
}

/**
 * Computes the complete matrix of fret notes for a 6-string guitar.
 * @param tuningNotes Array of 6 open string notes from 6th (lowest) to 1st (highest), e.g. ['E2','A2','D3','G3','B3','E4']
 * @param rootNote Selected key root pitch class (e.g. 'E', 'A', 'Bb')
 * @param activeDegrees Active interval degrees in the selected scale/chord
 * @param maxFret Number of frets to generate (default 15)
 */
export function buildFretboardMatrix(
  tuningNotes: [string, string, string, string, string, string],
  rootNote: string,
  activeDegrees: IntervalDegree[],
  maxFret = 15
): FretNoteInfo[][] {
  const rootChroma = Note.chroma(rootNote) ?? 4; // fallback E
  const preferFlats = rootNote.includes('b') || rootNote === 'F';
  const activeSet = new Set<IntervalDegree>(activeDegrees);

  // Render from 1st string (top visual row on tab/fretboard diagram) down to 6th string (bottom visual row)
  const stringsHighToLow = [...tuningNotes].reverse();

  return stringsHighToLow.map((openNote, rowIndex) => {
    const stringNumber = rowIndex + 1; // 1 = high E, 6 = low E
    const openMidi = Note.midi(openNote) ?? 64;
    const frets: FretNoteInfo[] = [];

    for (let fret = 0; fret <= maxFret; fret++) {
      const midi = openMidi + fret;
      const { fullNote, pitchClass } = formatNoteFromMidi(midi, preferFlats);
      const chroma = ((midi % 12) + 12) % 12;
      const semitoneDistance = ((chroma - rootChroma) % 12 + 12) % 12;
      const degree = SEMITONE_TO_DEGREE[semitoneDistance] ?? '1';
      const intervalMeta = INTERVAL_META[degree];

      frets.push({
        stringNumber,
        fret,
        fullNote,
        pitchClass,
        midi,
        degree,
        intervalMeta,
        isInActiveScale: activeSet.has(degree),
        isRoot: degree === '1',
      });
    }

    return frets;
  });
}
