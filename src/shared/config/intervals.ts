export type IntervalDegree =
  | '1'
  | 'b2'
  | '2'
  | 'b3'
  | '3'
  | '4'
  | 'b5'
  | '5'
  | 'b6'
  | '6'
  | 'b7'
  | '7';

export interface IntervalMeta {
  degree: IntervalDegree;
  semitones: number;
  nameUk: string;
  shortLabel: string;
  roleDescription: string;
  colorHex: string;
  badgeClass: string;
}

export const INTERVAL_META: Record<IntervalDegree, IntervalMeta> = {
  '1': {
    degree: '1',
    semitones: 0,
    nameUk: 'Тоніка (Root)',
    shortLabel: 'R',
    roleDescription: 'Головний центр тяжіння та фундамент тональності',
    colorHex: '#EF4444',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.35)]',
  },
  b2: {
    degree: 'b2',
    semitones: 1,
    nameUk: 'Мала секунда',
    shortLabel: 'b2',
    roleDescription: 'Фригійська темрява та екстремальна металева напруга',
    colorHex: '#FB7185',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  },
  '2': {
    degree: '2',
    semitones: 2,
    nameUk: 'Велика секунда',
    shortLabel: '2',
    roleDescription: 'Прохідна мелодійна сходинка та основа sus2 акордів',
    colorHex: '#64748B',
    badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  },
  b3: {
    degree: 'b3',
    semitones: 3,
    nameUk: 'Мала терція',
    shortLabel: 'b3',
    roleDescription: 'Холодний, меланхолійний характер мінору та року',
    colorHex: '#38BDF8',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-400/50',
  },
  '3': {
    degree: '3',
    semitones: 4,
    nameUk: 'Велика терція',
    shortLabel: '3',
    roleDescription: 'Теплий, яскравий та відкритий мажорний характер',
    colorHex: '#F59E0B',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
  },
  '4': {
    degree: '4',
    semitones: 5,
    nameUk: 'Чиста кварта',
    shortLabel: '4',
    roleDescription: 'Підвішена інтрига (sus4) та класичні рифи у стилі Smoke on the Water',
    colorHex: '#64748B',
    badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  },
  b5: {
    degree: 'b5',
    semitones: 6,
    nameUk: 'Тритон (Blue Note)',
    shortLabel: 'b5',
    roleDescription: '«Диявольський інтервал» (Black Sabbath) і гостра блюзова нота',
    colorHex: '#D946EF',
    badgeClass: 'bg-fuchsia-500/25 text-fuchsia-300 border-fuchsia-400/60 shadow-[0_0_10px_rgba(217,70,239,0.3)]',
  },
  '5': {
    degree: '5',
    semitones: 7,
    nameUk: 'Чиста квінта',
    shortLabel: '5',
    roleDescription: 'Залізобетонна опора Power Chord та важкого перегрузу',
    colorHex: '#10B981',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
  },
  b6: {
    degree: 'b6',
    semitones: 8,
    nameUk: 'Мала секста',
    shortLabel: 'b6',
    roleDescription: 'Драматичний відтінок натурального мінору (Еолійський лад)',
    colorHex: '#64748B',
    badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  },
  '6': {
    degree: '6',
    semitones: 9,
    nameUk: 'Велика секста',
    shortLabel: '6',
    roleDescription: 'Фанкова та прогресивна фарба Дорійського ладу (Santana, Pink Floyd)',
    colorHex: '#2DD4BF',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
  },
  b7: {
    degree: 'b7',
    semitones: 10,
    nameUk: 'Мала септима',
    shortLabel: 'b7',
    roleDescription: 'Блюзовий драйв і класичний рок-н-рольний напір',
    colorHex: '#A78BFA',
    badgeClass: 'bg-violet-500/20 text-violet-300 border-violet-400/50',
  },
  '7': {
    degree: '7',
    semitones: 11,
    nameUk: 'Велика септима',
    shortLabel: '7',
    roleDescription: 'Мрійлива джазова гармонія або гостре тяжіння в тоніку',
    colorHex: '#C084FC',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-400/50',
  },
};

export const SEMITONE_TO_DEGREE: Record<number, IntervalDegree> = {
  0: '1',
  1: 'b2',
  2: '2',
  3: 'b3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: 'b6',
  9: '6',
  10: 'b7',
  11: '7',
};
