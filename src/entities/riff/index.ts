import { z } from 'zod';

export const RiffBreakdownSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  artist: z.string(),
  year: z.number(),
  keyRoot: z.string(),
  scaleName: z.string(),
  tuning: z.string(),
  bpm: z.number(),
  signatureIntervals: z.array(
    z.enum(['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'])
  ),
  theoryInsight: z.string(),
  previewNotes: z.array(z.string()),
});

export type RiffBreakdown = z.infer<typeof RiffBreakdownSchema>;

const ICONIC_RIFFS: RiffBreakdown[] = [
  {
    id: 'enter-sandman',
    slug: 'enter-sandman',
    title: 'Enter Sandman',
    artist: 'Metallica',
    year: 1991,
    keyRoot: 'E',
    scaleName: 'E Blues / Phrygian Hybrid',
    tuning: 'E Standard',
    bpm: 123,
    signatureIntervals: ['1', 'b2', 'b5', '5'],
    theoryInsight:
      'Стрибок від відкритої струни E через октаву одразу в тритон Bb (b5) і повернення через чисту квінту B (5) та фригійську малу секунду F (b2).',
    previewNotes: ['E2', 'E3', 'G3', 'Bb2', 'A2', 'E2'],
  },
  {
    id: 'paranoid',
    slug: 'paranoid',
    title: 'Paranoid',
    artist: 'Black Sabbath',
    year: 1970,
    keyRoot: 'E',
    scaleName: 'E Minor Pentatonic (Box 4 / 12th Fret)',
    tuning: 'E Standard',
    bpm: 164,
    signatureIntervals: ['1', 'b3', '4', '5', 'b7'],
    theoryInsight:
      'Атакуючі павер-акорди на 12-му ладу з хаммер-онами між малою септимою (b7 → 1) та квартою (4 → 5) прямо всередині боксу мінорної пентатоніки.',
    previewNotes: ['E3', 'B3', 'D3', 'E3', 'G3', 'A3'],
  },
  {
    id: 'smoke-on-the-water',
    slug: 'smoke-on-the-water',
    title: 'Smoke on the Water',
    artist: 'Deep Purple',
    year: 1972,
    keyRoot: 'G',
    scaleName: 'G Minor Blues (Double-Stop Fourths)',
    tuning: 'E Standard',
    bpm: 114,
    signatureIntervals: ['1', 'b3', '4', 'b5'],
    theoryInsight:
      'Замість звичайних квінт Річі Блекмор грає паралельні кварти (інвертовані павер-акорди) на 4-й та 3-й струнах пальцями, підкреслюючи гостру ноту Db (b5).',
    previewNotes: ['G3', 'Bb3', 'C4', 'G3', 'Bb3', 'Db4', 'C4'],
  },
];

export async function getIconicRiffs(): Promise<RiffBreakdown[]> {
  return ICONIC_RIFFS.map((r) => RiffBreakdownSchema.parse(r));
}
