import type { AppLocale, NoteNamingMode } from './store';
import type { IntervalDegree } from '@/shared/config/intervals';

const SYLLABIC_MAP_UK: Record<string, string> = {
  C: 'До',
  'C#': 'До♯',
  Db: 'Ре♭',
  D: 'Ре',
  'D#': 'Ре♯',
  Eb: 'Мі♭',
  E: 'Мі',
  F: 'Фа',
  'F#': 'Фа♯',
  Gb: 'Соль♭',
  G: 'Соль',
  'G#': 'Соль♯',
  Ab: 'Ля♭',
  A: 'Ля',
  'A#': 'Ля♯',
  Bb: 'Сі♭',
  B: 'Сі',
};

/**
 * Formats a note pitch class (e.g. "E", "F#", "Bb") according to current locale and note-naming mode.
 */
export function formatNoteDisplay(
  pitchClass: string,
  locale: AppLocale,
  noteNaming: NoteNamingMode
): string {
  const clean = pitchClass.replace(/\d+$/, '');
  if (locale === 'uk' && noteNaming === 'dual') {
    const syllabic = SYLLABIC_MAP_UK[clean];
    return syllabic ? `${clean} (${syllabic})` : clean;
  }
  return clean;
}

export function getSyllabicNameUk(pitchClass: string): string {
  const clean = pitchClass.replace(/\d+$/, '');
  return SYLLABIC_MAP_UK[clean] ?? clean;
}

export const INTERVAL_NAMES_I18N: Record<
  IntervalDegree,
  { uk: string; en: string; roleUk: string; roleEn: string }
> = {
  '1': {
    uk: 'Тоніка (Root)',
    en: 'Root (1)',
    roleUk: 'Головний дім і центр тяжіння тональності',
    roleEn: 'Home base and gravitational center of the key',
  },
  b2: {
    uk: 'Мала секунда (♭2)',
    en: 'Minor 2nd (♭2)',
    roleUk: 'Півтон від тоніки — темна фригійська та металева напруга',
    roleEn: 'Half-step above root — dark Phrygian & metal tension',
  },
  '2': {
    uk: 'Велика секунда (2)',
    en: 'Major 2nd (2)',
    roleUk: 'Цілий тон від тоніки — відкрита мелодійна сходинка (sus2)',
    roleEn: 'Whole-step above root — open melodic step (sus2)',
  },
  b3: {
    uk: 'Мала терція (♭3)',
    en: 'Minor 3rd (♭3)',
    roleUk: 'Визначає мінорний (меланхолійний, рок/блюзовий) характер',
    roleEn: 'Defines minor (melancholic, rock/blues) quality',
  },
  '3': {
    uk: 'Велика терція (3)',
    en: 'Major 3rd (3)',
    roleUk: 'Визначає світлий та відкритий мажорний характер',
    roleEn: 'Defines bright, warm major quality',
  },
  '4': {
    uk: 'Чиста кварта (4)',
    en: 'Perfect 4th (4)',
    roleUk: 'Стійкий інтервал рифів (Smoke on the Water) та sus4 акордів',
    roleEn: 'Classic rock fourths (Smoke on the Water) & sus4 suspension',
  },
  b5: {
    uk: 'Тритон / Блюзова нота (♭5)',
    en: 'Tritone / Blue Note (♭5)',
    roleUk: 'Гостра інтрига блюзу та «диявольський інтервал» у металі',
    roleEn: 'Bluesy grit and the tense "Devil’s interval" in heavy rock',
  },
  '5': {
    uk: 'Чиста квінта (5)',
    en: 'Perfect 5th (5)',
    roleUk: 'Монолітний фундамент павер-акордів (Power Chords)',
    roleEn: 'Rock-solid backbone of Power Chords and triads',
  },
  b6: {
    uk: 'Мала секста (♭6)',
    en: 'Minor 6th (♭6)',
    roleUk: 'Драматичний ступінь натурального мінору (Еолійський лад)',
    roleUk_short: '♭6',
    roleEn: 'Dramatic color note of the Natural Minor (Aeolian) scale',
  } as { uk: string; en: string; roleUk: string; roleEn: string },
  '6': {
    uk: 'Велика секста (6)',
    en: 'Major 6th (6)',
    roleUk: 'Фірмова світла фарба Дорійського ладу (Pink Floyd, Santana)',
    roleEn: 'Signature bright minor color of the Dorian mode',
  },
  b7: {
    uk: 'Мала септима (♭7)',
    en: 'Minor 7th (♭7)',
    roleUk: 'Драйвовий рок/блюзовий ступінь пентатоніки та Dom7 акордів',
    roleEn: 'Punchy rock/blues degree of pentatonic & Dominant 7th chords',
  },
  '7': {
    uk: 'Велика септима (7)',
    en: 'Major 7th (7)',
    roleUk: 'Мрійливий ступінь Maj7 та ввідний тон за півтону до тоніки',
    roleEn: 'Dreamy Maj7 color and leading tone a half-step below the root',
  },
};
