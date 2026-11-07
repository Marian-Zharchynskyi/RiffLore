import { Note, Scale } from '@tonaljs/tonal';
import type {
  ChordDiagramSpec,
  DeconstructorBar,
  DeconstructorTrack,
  TabNoteEvent,
} from '../index';

const STANDARD_STRING_MIDI = [64, 59, 55, 50, 45, 40]; // Strings 1 (E4) to 6 (E2)

const CIRCLE_MAJORS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'Ab', 'Eb', 'Bb', 'F'];
const CIRCLE_MINORS = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Fm', 'Cm', 'Gm', 'Dm'];

/**
 * Guitar chord voicing dictionary + dynamic barre chord generator
 * so any song chord gets an authentic vertical chord diagram.
 */
const CHORD_VOICING_LIBRARY: Record<
  string,
  { baseFret: number; frets: [number, number, number, number, number, number]; barre?: { fromString: number; toString: number; fret: number } }
> = {
  Em: { baseFret: 1, frets: [0, 2, 2, 0, 0, 0] },
  E: { baseFret: 1, frets: [0, 2, 2, 1, 0, 0] },
  Am: { baseFret: 1, frets: [-1, 0, 2, 2, 1, 0] },
  A: { baseFret: 1, frets: [-1, 0, 2, 2, 2, 0] },
  Dm: {
    baseFret: 5,
    frets: [-1, 5, 7, 7, 6, 5],
    barre: { fromString: 5, toString: 1, fret: 5 },
  },
  D: { baseFret: 1, frets: [-1, -1, 0, 2, 3, 2] },
  C: { baseFret: 1, frets: [-1, 3, 2, 0, 1, 0] },
  G: { baseFret: 1, frets: [3, 2, 0, 0, 0, 3] },
  F: {
    baseFret: 1,
    frets: [1, 3, 3, 2, 1, 1],
    barre: { fromString: 6, toString: 1, fret: 1 },
  },
  Fm: {
    baseFret: 1,
    frets: [1, 3, 3, 1, 1, 1],
    barre: { fromString: 6, toString: 1, fret: 1 },
  },
  Bb: {
    baseFret: 1,
    frets: [-1, 1, 3, 3, 3, 1],
    barre: { fromString: 5, toString: 1, fret: 1 },
  },
  Bbm: {
    baseFret: 1,
    frets: [-1, 1, 3, 3, 2, 1],
    barre: { fromString: 5, toString: 1, fret: 1 },
  },
  Bm: {
    baseFret: 2,
    frets: [-1, 2, 4, 4, 3, 2],
    barre: { fromString: 5, toString: 1, fret: 2 },
  },
  B7: { baseFret: 1, frets: [-1, 2, 1, 2, 0, 2] },
  Gm: {
    baseFret: 3,
    frets: [3, 5, 5, 3, 3, 3],
    barre: { fromString: 6, toString: 1, fret: 3 },
  },
  Ab: {
    baseFret: 4,
    frets: [4, 6, 6, 5, 4, 4],
    barre: { fromString: 6, toString: 1, fret: 4 },
  },
  Db: {
    baseFret: 4,
    frets: [-1, 4, 6, 6, 6, 4],
    barre: { fromString: 5, toString: 1, fret: 4 },
  },
  Eb: {
    baseFret: 6,
    frets: [-1, 6, 8, 8, 8, 6],
    barre: { fromString: 5, toString: 1, fret: 6 },
  },
  Cm: {
    baseFret: 3,
    frets: [-1, 3, 5, 5, 4, 3],
    barre: { fromString: 5, toString: 1, fret: 3 },
  },
  'F#m': {
    baseFret: 2,
    frets: [2, 4, 4, 2, 2, 2],
    barre: { fromString: 6, toString: 1, fret: 2 },
  },
  'C#m': {
    baseFret: 4,
    frets: [-1, 4, 6, 6, 5, 4],
    barre: { fromString: 5, toString: 1, fret: 4 },
  },
};

function normalizeEnharmonicForCircle(pc: string, isMinor: boolean): string {
  const chroma = Note.chroma(pc);
  if (chroma === undefined) return isMinor ? 'Am' : 'C';
  const list = isMinor ? CIRCLE_MINORS : CIRCLE_MAJORS;
  for (const item of list) {
    const root = item.replace(/m$/, '');
    if (Note.chroma(root) === chroma) {
      return item;
    }
  }
  return list[0];
}

/**
 * Dynamically computes all scale notes inside [minFret, maxFret] across strings 1–6
 * using @tonaljs/tonal (no hardcoded note tables).
 */
export function computeScaleBoxNotes(
  rootNote: string,
  scaleName: string,
  fretRange: [number, number],
  useFlats = false
): { string: number; fret: number; label: string }[] {
  const scaleData = Scale.get(`${rootNote} ${scaleName}`);
  const scaleChromaSet = new Set(
    (scaleData.notes.length > 0 ? scaleData.notes : ['C', 'D', 'E', 'F', 'G', 'A', 'B'])
      .map((n) => Note.chroma(n))
      .filter((c): c is number => c !== undefined)
  );

  const [minFret, maxFret] = fretRange;
  const result: { string: number; fret: number; label: string }[] = [];

  for (let s = 1; s <= 6; s++) {
    const openMidi = STANDARD_STRING_MIDI[s - 1];
    for (let f = minFret; f <= maxFret; f++) {
      const midi = openMidi + f;
      const chroma = midi % 12;
      if (scaleChromaSet.has(chroma)) {
        const rawNote = Note.fromMidi(midi);
        const pc = Note.pitchClass(rawNote);
        const label = useFlats ? Note.enharmonic(pc) || pc : pc;
        result.push({ string: s, fret: f, label });
      }
    }
  }

  return result;
}

/**
 * Computes Roman Numeral function (e.g. i, bVI, bVII, iv, V, IV) of a chord
 * relative to a key root and mode ('minor' | 'major').
 */
export function computeRomanNumeral(
  keyRoot: string,
  keyMode: 'minor' | 'major',
  chordSymbol: string
): {
  romanNumeral: string;
  romanSub: string;
  circleActiveKey: string;
  circleRing: 'major' | 'minor';
} {
  const isChordMinor =
    /m(?!aj)/i.test(chordSymbol) && !chordSymbol.endsWith('dim');
  const chordRootMatch = chordSymbol.match(/^[A-G][#b]?/);
  const chordRoot = chordRootMatch ? chordRootMatch[0] : 'C';

  const keyChroma = Note.chroma(keyRoot) ?? 0;
  const chordChroma = Note.chroma(chordRoot) ?? 0;
  const semitones = (chordChroma - keyChroma + 12) % 12;

  const majorNumerals: Record<number, string> = {
    0: 'I',
    1: '♭II',
    2: 'II',
    3: '♭III',
    4: 'III',
    5: 'IV',
    6: '♭V',
    7: 'V',
    8: '♭VI',
    9: 'VI',
    10: '♭VII',
    11: 'VII',
  };

  const baseRoman = majorNumerals[semitones] ?? 'I';
  const formattedRoman = isChordMinor ? baseRoman.toLowerCase() : baseRoman;

  const circleActiveKey = normalizeEnharmonicForCircle(chordRoot, isChordMinor);

  return {
    romanNumeral: formattedRoman,
    romanSub: isChordMinor ? '(min)' : '(Maj)',
    circleActiveKey,
    circleRing: isChordMinor ? 'minor' : 'major',
  };
}

/**
 * Computes the diatonic neighbor wedges on the Circle of Fifths for any key.
 */
export function computeDiatonicCircleNeighbors(
  keyRoot: string,
  keyMode: 'minor' | 'major'
): { diatonicMajorNeighbors: string[]; diatonicMinorNeighbors: string[] } {
  // Find relative major if minor
  const rootChroma = Note.chroma(keyRoot) ?? 0;
  const relMajorChroma = keyMode === 'minor' ? (rootChroma + 3) % 12 : rootChroma;
  const relMajorNote = Note.pitchClass(Note.fromMidi(60 + relMajorChroma));
  const centerMajor = normalizeEnharmonicForCircle(relMajorNote, false);
  const centerIdx = CIRCLE_MAJORS.indexOf(centerMajor);

  if (centerIdx === -1) {
    return {
      diatonicMajorNeighbors: ['F', 'C', 'G'],
      diatonicMinorNeighbors: ['Dm', 'Am', 'Em'],
    };
  }

  const prevIdx = (centerIdx - 1 + 12) % 12;
  const nextIdx = (centerIdx + 1) % 12;

  return {
    diatonicMajorNeighbors: [
      CIRCLE_MAJORS[prevIdx],
      CIRCLE_MAJORS[centerIdx],
      CIRCLE_MAJORS[nextIdx],
    ],
    diatonicMinorNeighbors: [
      CIRCLE_MINORS[prevIdx],
      CIRCLE_MINORS[centerIdx],
      CIRCLE_MINORS[nextIdx],
    ],
  };
}

export function buildChordDiagram(
  chordName: string,
  romanNumeral: string
): ChordDiagramSpec {
  const clean = chordName.trim();
  const preset = CHORD_VOICING_LIBRARY[clean];
  if (preset) {
    return {
      chordName: clean,
      romanNumeral,
      baseFret: preset.baseFret,
      frets: preset.frets,
      barre: preset.barre,
    };
  }

  // Fallback dynamic E-shape barre chord from root pitch class
  const rootMatch = clean.match(/^[A-G][#b]?/);
  const root = rootMatch ? rootMatch[0] : 'E';
  const isMinor = /m(?!aj)/i.test(clean);
  const eChroma = Note.chroma('E') ?? 4;
  const rootChroma = Note.chroma(root) ?? 4;
  const fret = (rootChroma - eChroma + 12) % 12 || 1;

  return {
    chordName: clean,
    romanNumeral,
    baseFret: fret,
    frets: [
      fret,
      fret + 2,
      fret + 2,
      isMinor ? fret : fret + 1,
      fret,
      fret,
    ],
    barre: { fromString: 6, toString: 1, fret },
  };
}

export interface CompactSongSpec {
  id: string;
  title: { uk: string; en: string };
  subtitle: { uk: string; en: string };
  keyRoot: string;
  keyMode: 'minor' | 'major';
  scaleName: string;
  scaleBadgeLabel: string;
  bpm: number;
  scaleBoxFretRange: [number, number];
  useFlats?: boolean;
  bars: {
    chordName: string;
    commentary: { uk: string; en: string };
    notes: {
      string: number;
      fret: number;
      duration?: '|' | '∏' | '♬';
      technique?: 'H' | 'P' | 'S';
    }[];
  }[];
}

/**
 * Compiles a CompactSongSpec into a full DeconstructorTrack with
 * Circle of Fifths HUD, Chord Diagrams, Synced Tab, and Scale Box Vectors.
 */
export function compileSongToDeconstructorTrack(
  spec: CompactSongSpec
): DeconstructorTrack {
  const { diatonicMajorNeighbors, diatonicMinorNeighbors } =
    computeDiatonicCircleNeighbors(spec.keyRoot, spec.keyMode);

  const scaleBoxNotes = computeScaleBoxNotes(
    spec.keyRoot,
    spec.scaleName,
    spec.scaleBoxFretRange,
    spec.useFlats
  );

  const compiledBars: DeconstructorBar[] = spec.bars.map((barSpec, idx) => {
    const { romanNumeral, romanSub, circleActiveKey, circleRing } =
      computeRomanNumeral(spec.keyRoot, spec.keyMode, barSpec.chordName);

    const chordDiagram = buildChordDiagram(barSpec.chordName, romanNumeral);

    const tabEvents: TabNoteEvent[] = barSpec.notes.map((n) => {
      const midi = STANDARD_STRING_MIDI[n.string - 1] + n.fret;
      const fullNote = Note.fromMidi(midi);
      const pc = Note.pitchClass(fullNote);
      return {
        string: n.string,
        fret: n.fret,
        noteName: fullNote,
        label: pc,
        durationLabel: n.duration ?? '∏',
        technique: n.technique,
      };
    });

    // Extract unique sequential active nodes for the green vector trajectory on the neck
    const activePathNodes: { string: number; fret: number; label: string }[] = [];
    for (const ev of tabEvents) {
      const prev = activePathNodes[activePathNodes.length - 1];
      if (!prev || prev.string !== ev.string || prev.fret !== ev.fret) {
        activePathNodes.push({
          string: ev.string,
          fret: ev.fret,
          label: ev.label,
        });
      }
    }

    return {
      id: `${spec.id}-bar-${idx + 1}`,
      barNumber: idx + 1,
      chordName: barSpec.chordName,
      circleActiveKey,
      circleRing,
      romanNumeral,
      romanSub,
      harmonyCommentary: barSpec.commentary,
      chordDiagram,
      tabEvents,
      activePathNodes,
    };
  });

  return {
    id: spec.id,
    title: spec.title,
    subtitle: spec.subtitle,
    scaleBadgeLabel: spec.scaleBadgeLabel,
    keySignatureRoot:
      spec.keyMode === 'minor' ? `${spec.keyRoot}m` : spec.keyRoot,
    diatonicMajorNeighbors,
    diatonicMinorNeighbors,
    bpm: spec.bpm,
    scaleBoxFretRange: spec.scaleBoxFretRange,
    scaleBoxNotes,
    bars: compiledBars,
  };
}

/**
 * Parses a standard 6-line ASCII guitar tab + chord list into a live DeconstructorTrack!
 * Example ASCII input:
 * e|---5---8---|---3---5---|
 * B|---6---6---|---5---5---|
 * G|---7---7---|---5---5---|
 * D|-----------|-----------|
 * A|-----------|-----------|
 * E|-----------|-----------|
 */
export function parseAsciiTabToDeconstructorTrack(params: {
  title: string;
  keyRoot: string;
  keyMode: 'minor' | 'major';
  chordsCsv: string;
  boxRange: [number, number];
  asciiTab: string;
}): DeconstructorTrack {
  const { title, keyRoot, keyMode, chordsCsv, boxRange, asciiTab } = params;
  const chords = chordsCsv
    .split(/[,|\s]+/)
    .map((c) => c.trim())
    .filter(Boolean);

  // Extract the 6 string lines from ASCII tab
  const rawLines = asciiTab
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.includes('-') && l.includes('|'));

  const stringLines = rawLines.slice(0, 6);
  while (stringLines.length < 6) {
    stringLines.push('|-----------|');
  }

  // Split each string line into bars by '|'
  const perStringBars = stringLines.map((line) => {
    const cleaned = line.replace(/^[eBGDAE1-6]\s*/i, '');
    return cleaned
      .split('|')
      .map((seg) => seg.trim())
      .filter((seg) => seg.length > 0);
  });

  const barCount = Math.max(
    1,
    Math.min(
      8,
      Math.max(...perStringBars.map((b) => b.length), chords.length)
    )
  );

  const parsedBars: CompactSongSpec['bars'] = [];

  for (let b = 0; b < barCount; b++) {
    const chordName = chords[b % Math.max(1, chords.length)] || (keyMode === 'minor' ? `${keyRoot}m` : keyRoot);
    const colHits: { col: number; string: number; fret: number }[] = [];

    for (let sIdx = 0; sIdx < 6; sIdx++) {
      const seg = perStringBars[sIdx]?.[b] ?? '';
      const regex = /\d+/g;
      let match: RegExpExecArray | null = null;
      while ((match = regex.exec(seg)) !== null) {
        const fret = parseInt(match[0], 10);
        if (!Number.isNaN(fret) && fret >= 0 && fret <= 24) {
          colHits.push({
            col: match.index,
            string: sIdx + 1,
            fret,
          });
        }
      }
    }

    colHits.sort((a, bHit) => a.col - bHit.col || bHit.string - a.string);

    const notes =
      colHits.length > 0
        ? colHits.slice(0, 8).map((h) => ({
            string: h.string,
            fret: h.fret,
            duration: '∏' as const,
          }))
        : [
            {
              string: 3,
              fret: boxRange[0],
              duration: '|' as const,
            },
          ];

    parsedBars.push({
      chordName,
      commentary: {
        uk: `Авто-аналіз такту #${b + 1} (${chordName}): зелені вектори з'єднують ноти твоєї табулатури всередині боксу ${keyRoot} ${keyMode === 'minor' ? 'Natural Minor' : 'Major'}.`,
        en: `Auto-analysis of Bar #${b + 1} (${chordName}): green vectors connect your tab notes inside the ${keyRoot} ${keyMode === 'minor' ? 'Natural Minor' : 'Major'} box.`,
      },
      notes,
    });
  }

  return compileSongToDeconstructorTrack({
    id: `custom-${Date.now()}`,
    title: { uk: title, en: title },
    subtitle: {
      uk: `Імпортований розбір у тональності ${keyRoot} ${keyMode === 'minor' ? 'Minor' : 'Major'}`,
      en: `Imported breakdown in ${keyRoot} ${keyMode === 'minor' ? 'Minor' : 'Major'}`,
    },
    keyRoot,
    keyMode,
    scaleName: keyMode === 'minor' ? 'natural minor' : 'major',
    scaleBadgeLabel: `${keyRoot} ${keyMode === 'minor' ? 'Natural Minor' : 'Major'}`,
    bpm: 100,
    scaleBoxFretRange: boxRange,
    bars: parsedBars,
  });
}
