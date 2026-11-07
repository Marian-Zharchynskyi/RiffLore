export interface LocalizedText {
  uk: string;
  en: string;
}

export interface FretGemMarker {
  string: number; // 1 (high E) to 6 (low E)
  fret: number; // 0 to 15
  variant: 'gray' | 'red' | 'green' | 'gold' | 'question';
  label: string;
  subLabel?: string;
}

export interface FretVectorLine {
  fromString: number;
  fromFret: number;
  toString: number;
  toFret: number;
  color?: string;
}

export interface QuizOption {
  id: string;
  label: LocalizedText;
  isCorrect: boolean;
  audioNote?: string;
}

export interface LessonStep {
  id: string;
  type:
    | 'guitar-anatomy'
    | 'fretboard-explain'
    | 'quiz-multiple-choice'
    | 'quiz-tap-fret';
  sectionTitle: LocalizedText;
  explanation: LocalizedText;
  exampleBox?: {
    text: LocalizedText;
    audioNotes?: string[];
  };
  anatomyFocus?: 'acoustic-vs-electric' | 'pickups-and-bridge' | 'neck-and-frets';
  gems?: FretGemMarker[];
  vectorLines?: FretVectorLine[];
  highlightFretRange?: [number, number];
  quizPrompt?: LocalizedText;
  quizOptions?: QuizOption[];
  targetFretCoord?: { string: number; fret: number; note: string };
}

export interface InteractiveLesson {
  id: string;
  code: string;
  stageNumber: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  durationMinutes: number;
  steps: LessonStep[];
  reviewRewards: { id: string; stringNumber: number; fret: number; targetNote: string }[];
}

export interface LearningStage {
  id: string;
  stageNumber: number;
  code: string;
  title: LocalizedText;
  description: LocalizedText;
  lessons: InteractiveLesson[];
}

export const LEARNING_STAGES: LearningStage[] = [
  // ============================================================================
  // STAGE 0: MEET THE GUITAR (ACOUSTIC & ELECTRIC FROM SCRATCH)
  // ============================================================================
  {
    id: 'stage-0',
    stageNumber: 0,
    code: 'GTR-000',
    title: {
      uk: 'Знайомство з гітарою: Акустика та Електро',
      en: 'Meet the Guitar: Acoustic & Electric Foundations',
    },
    description: {
      uk: 'Будова акустичної та електрогітари, фізика народження звуку, нумерація струн і ладів та перші кроки на грифі для абсолютних новачків.',
      en: 'Anatomy of acoustic and electric guitars, how sound is produced, string and fret coordinates, and your very first steps on the neck.',
    },
    lessons: [
      {
        id: 'gtr-001',
        code: '0.1',
        stageNumber: 0,
        title: {
          uk: 'Акустична vs Електрогітара: Будова та Звук',
          en: 'Acoustic vs Electric Guitar: Anatomy & Sound',
        },
        subtitle: {
          uk: 'Як порожнистий дерев’яний корпус та магнітні звукознімачі перетворюють коливання струни на музику.',
          en: 'How hollow wooden bodies and magnetic pickups transform string vibrations into music.',
        },
        durationMinutes: 5,
        reviewRewards: [{ id: 's6f0', stringNumber: 6, fret: 0, targetNote: 'E' }],
        steps: [
          {
            id: 'gtr-001-s1',
            type: 'guitar-anatomy',
            anatomyFocus: 'acoustic-vs-electric',
            sectionTitle: {
              uk: 'Два інструменти — одна мова грифу',
              en: 'Two Instruments — One Shared Fretboard Language',
            },
            explanation: {
              uk: 'Акустична та електрогітара мають абсолютно однакову будову грифу, 6 струн і однакові ноти на кожному ладу. Усе, що ти вивчиш на одній із них, на 100% працює на іншій. Головна різниця полягає лише в тому, як саме посилюється звук коливання струни.',
              en: 'Acoustic and electric guitars share the exact same 6-string fretboard layout and note positions. Everything you learn on one transfers 100% to the other. Their only core difference lies in how the vibrating string is amplified.',
            },
            exampleBox: {
              text: {
                uk: 'Послухай звучання відкритого акорду E minor (Мі мінор): ті самі струни однаково звучать і на акустиці біля вогнища, і на стадіонній електрогітарі.',
                en: 'Listen to an open E minor chord: the exact same strings work on both an acoustic guitar and a stadium electric rig.',
              },
              audioNotes: ['E2', 'B2', 'E3', 'G3', 'B3', 'E4'],
            },
          },
          {
            id: 'gtr-001-s2',
            type: 'guitar-anatomy',
            anatomyFocus: 'pickups-and-bridge',
            sectionTitle: {
              uk: 'Резонаторна дека проти Магнітних звукознімачів',
              en: 'Acoustic Soundhole vs Magnetic Pickups',
            },
            explanation: {
              uk: 'В акустичній гітарі струна передає вібрацію через підставку (бридж) на тонку верхню дерев’яну деку, а порожнистий корпус працює як природний гучномовець. В електрогітарі корпус суцільний дерев’яний: під струнами стоять магнітні звукознімачі (Single-Coil або подвійні Humbucker), які вловлюють коливання сталевої струни і передають сигнал кабелем у підсилювач.',
              en: 'On an acoustic guitar, string vibrations travel through the bridge into a hollow wooden soundboard that projects sound naturally. An electric guitar uses a solid wooden body with magnetic pickups (Single-Coil or Humbucker) under the steel strings to send an electrical signal to an amplifier.',
            },
            exampleBox: {
              text: {
                uk: 'Сингл (Single-Coil, як на Fender Stratocaster) дає дзвінкий, прозорий звук, а Хамбакер (Humbucker, як на Gibson Les Paul) — густий, потужний рок-саунд без фонового шуму.',
                en: 'Single-coil pickups (Fender style) deliver bright, glassy articulation, while Humbuckers (Gibson style) produce thick, noise-free rock and metal punch.',
              },
              audioNotes: ['E2', 'B2', 'E3'],
            },
          },
          {
            id: 'gtr-001-s3',
            type: 'guitar-anatomy',
            anatomyFocus: 'neck-and-frets',
            sectionTitle: {
              uk: 'Поріжок (Nut), Лади (Frets) та Висота тону',
              en: 'The Nut, Frets & Pitch Physics',
            },
            explanation: {
              uk: 'Уздовж грифу вбиті металеві порожки — лади. Коли ти притискаєш струну пальцем одразу позаду металевого ладу, робоча частина струни стає коротшою, і звук стає вищим. Рух у бік корпусу гітари (від 1-го ладу до 12-го) завжди підвищує ноту.',
              en: 'Metal strips embedded along the neck are called frets. Pressing a string down just behind a metal fret wire shortens the vibrating length of the string, making the pitch higher. Moving toward the guitar body (from fret 1 toward fret 12) always raises the pitch.',
            },
            exampleBox: {
              text: {
                uk: 'Послухай, як звук підвищується при русі по 6-й струні від відкритої струни (0) до 3-го, 5-го та 7-го ладів:',
                en: 'Hear the pitch climb as we move up the 6th string from open (0) to frets 3, 5, and 7:',
              },
              audioNotes: ['E2', 'G2', 'A2', 'B2'],
            },
          },
          {
            id: 'gtr-001-s4',
            type: 'quiz-multiple-choice',
            anatomyFocus: 'neck-and-frets',
            sectionTitle: {
              uk: 'Перевірка розуміння',
              en: 'Quick Knowledge Check',
            },
            explanation: {
              uk: 'Давай закріпимо фізику гітарного грифу перед тим, як перейти до координат струн і ладів.',
              en: 'Let’s verify how pitch works on the guitar neck before moving to string and fret coordinates.',
            },
            quizPrompt: {
              uk: 'Що відбувається зі звуком струни, коли ти переміщуєш палець від 1-го ладу вгору до 12-го ладу (ближче до корпусу гітари)?',
              en: 'What happens to the pitch when you move your finger from fret 1 up toward fret 12 (closer to the guitar body)?',
            },
            quizOptions: [
              {
                id: 'opt-1',
                label: {
                  uk: 'Звук стає вищим (коротша робоча довжина струни)',
                  en: 'The pitch gets higher (shorter vibrating string length)',
                },
                isCorrect: true,
                audioNote: 'E3',
              },
              {
                id: 'opt-2',
                label: {
                  uk: 'Звук стає нижчим (басовішим)',
                  en: 'The pitch gets lower (deeper)',
                },
                isCorrect: false,
              },
              {
                id: 'opt-3',
                label: {
                  uk: 'Висота ноти не змінюється, змінюється лише гучність',
                  en: 'Pitch stays the same, only volume changes',
                },
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 'gtr-002',
        code: '0.2',
        stageNumber: 0,
        title: {
          uk: 'Координати Грифу: Струни 1–6 та Лади 0–12',
          en: 'Fretboard Coordinates: Strings 1–6 & Frets 0–12',
        },
        subtitle: {
          uk: 'Чому 1-ша струна фізично знизу, а на всіх схемах і табулатурах малюється зверху.',
          en: 'Why the 1st string is physically at the bottom, yet drawn at the top of every diagram and tab.',
        },
        durationMinutes: 6,
        reviewRewards: [
          { id: 's1f0', stringNumber: 1, fret: 0, targetNote: 'E' },
          { id: 's6f3', stringNumber: 6, fret: 3, targetNote: 'G' },
        ],
        steps: [
          {
            id: 'gtr-002-s1',
            type: 'fretboard-explain',
            sectionTitle: {
              uk: 'Головний секрет нумерації струн (1-ша — найтонша!)',
              en: 'The #1 Rule of String Numbering (String 1 is the Thinnest!)',
            },
            explanation: {
              uk: 'Новачки часто плутають порядок струн. Запам’ятай раз і назавжди: струни рахуються від найтоншої (1-ша струна, найвищий звук) до найтовстішої басової (6-та струна). На всіх діаграмах і в табулатурах гриф зображується так, ніби ти нахилив голову і дивишся на гітару у себе в руках зверху вниз — тому 1-ша струна на екрані зверху, а товста 6-та струна — внизу!',
              en: 'Beginners often mix up string numbers. Always remember: strings are numbered from the thinnest, highest-pitched string (String 1) to the thickest bass string (String 6). On diagrams and tabs, the neck is drawn from the player’s perspective looking down at the guitar in your lap — placing String 1 at the top line and thick String 6 at the bottom line!',
            },
            gems: [
              { string: 1, fret: 0, variant: 'gold', label: '1', subLabel: 'High' },
              { string: 2, fret: 0, variant: 'gray', label: '2' },
              { string: 3, fret: 0, variant: 'gray', label: '3' },
              { string: 4, fret: 0, variant: 'gray', label: '4' },
              { string: 5, fret: 0, variant: 'gray', label: '5' },
              { string: 6, fret: 0, variant: 'red', label: '6', subLabel: 'Bass' },
            ],
            exampleBox: {
              text: {
                uk: 'Клікни на золотий маркер [1] (верхня лінія) та червоний маркер [6] (нижня лінія) на грифі вище, щоб почути різницю у 2 октави між 1-ю та 6-ю струнами.',
                en: 'Click the gold [1] marker (top line) and red [6] marker (bottom line) on the fretboard above to hear the two-octave difference between String 1 and String 6.',
              },
              audioNotes: ['E2', 'E4'],
            },
          },
          {
            id: 'gtr-002-s2',
            type: 'fretboard-explain',
            sectionTitle: {
              uk: 'Відкриті струни (Лад 0) та Точки-орієнтири (3, 5, 7, 9, 12)',
              en: 'Open Strings (Fret 0) & Fretboard Inlay Landmarks (3, 5, 7, 9, 12)',
            },
            explanation: {
              uk: 'Коли ти смикаєш струну правою рукою і взагалі не торкаєшся її лівою рукою на грифі, це називається «відкрита струна» і позначається цифрою 0 (ліворуч від латунного поріжка). А щоб ти не рахував лади по одному під час гри, на ладах 3, 5, 7, 9 та 12 (подвійна точка) зроблені перламутрові мітки.',
              en: 'Plucking a string without pressing any fret is called an "open string" and is written as Fret 0 (to the left of the nut). So you never have to count frets one-by-one while playing, guitars feature inlay dots at frets 3, 5, 7, 9, and double dots at fret 12.',
            },
            gems: [
              { string: 6, fret: 0, variant: 'gray', label: '0' },
              { string: 6, fret: 3, variant: 'red', label: '3' },
              { string: 6, fret: 5, variant: 'red', label: '5' },
              { string: 6, fret: 7, variant: 'red', label: '7' },
              { string: 6, fret: 9, variant: 'red', label: '9' },
              { string: 6, fret: 12, variant: 'gold', label: '12' },
            ],
          },
          {
            id: 'gtr-002-s3',
            type: 'quiz-tap-fret',
            sectionTitle: {
              uk: 'Практика на грифі: Знайди координату',
              en: 'Hands-On Check: Tap the Fret Coordinate',
            },
            explanation: {
              uk: 'Пам’ятай: 6-та струна — найтовстіша (нижня лінія на схемі), а 3-й лад позначений першою точкою-інкрустацією.',
              en: 'Remember: String 6 is the thickest bass string (bottom line on the diagram), and Fret 3 is the first inlay dot.',
            },
            quizPrompt: {
              uk: 'Натисни прямо на грифі: 6-та струна, 3-й лад (нота G)',
              en: 'Tap directly on the fretboard: 6th String, 3rd Fret (Note G)',
            },
            targetFretCoord: { string: 6, fret: 3, note: 'G2' },
          },
          {
            id: 'gtr-002-s4',
            type: 'quiz-tap-fret',
            sectionTitle: {
              uk: 'Практика на грифі: 12-й лад (Октава)',
              en: 'Hands-On Check: The 12th Fret Double-Dot',
            },
            explanation: {
              uk: '12-й лад ділить струну рівно навпіл і позначається подвійною точкою. Натисни на 1-шу струну (найтоншу, верхня лінія) на 12-му ладу.',
              en: 'Fret 12 divides the string exactly in half and is marked with double dots. Tap the 1st String (thinnest, top line) at the 12th Fret.',
            },
            quizPrompt: {
              uk: 'Натисни на грифі: 1-ша струна, 12-й лад (нота E)',
              en: 'Tap on the fretboard: 1st String, 12th Fret (Note E)',
            },
            targetFretCoord: { string: 1, fret: 12, note: 'E5' },
          },
        ],
      },
      {
        id: 'gtr-003',
        code: '0.3',
        stageNumber: 0,
        title: {
          uk: '6 Відкритих Струн: E – A – D – G – B – E',
          en: 'The 6 Open Strings: E – A – D – G – B – E',
        },
        subtitle: {
          uk: 'Як миттєво вивчити імена всіх 6 відкритих струн у класичному строї E Standard.',
          en: 'How to instantly memorize all 6 open string names in Standard Tuning.',
        },
        durationMinutes: 7,
        reviewRewards: [
          { id: 's6f0', stringNumber: 6, fret: 0, targetNote: 'E' },
          { id: 's5f0', stringNumber: 5, fret: 0, targetNote: 'A' },
          { id: 's4f0', stringNumber: 4, fret: 0, targetNote: 'D' },
          { id: 's3f0', stringNumber: 3, fret: 0, targetNote: 'G' },
          { id: 's2f0', stringNumber: 2, fret: 0, targetNote: 'B' },
          { id: 's1f0', stringNumber: 1, fret: 0, targetNote: 'E' },
        ],
        steps: [
          {
            id: 'gtr-003-s1',
            type: 'fretboard-explain',
            sectionTitle: {
              uk: 'Стандартний стрій (E Standard) та крайні струни E',
              en: 'Standard Tuning & Matching Outer E Strings',
            },
            explanation: {
              uk: 'У стандартному строї від найтовстішої 6-ї до найтоншої 1-ї струни гітара настроєна на ноти: E – A – D – G – B – E (українською: Мі – Ля – Ре – Соль – Сі – Мі). Зверни увагу на приємний бонус: і 6-та, і 1-ша струни мають однакову назву — нота E (Мі)! Тобто замість 6 різних назв тобі потрібно запам’ятати лише 5.',
              en: 'In standard tuning from the thickest 6th string to the thinnest 1st string, the notes are E – A – D – G – B – E. Notice a great shortcut right away: both outer strings (String 6 and String 1) are the note E! That means you only need to memorize 5 unique open string names.',
            },
            gems: [
              { string: 1, fret: 0, variant: 'red', label: 'E', subLabel: 'Мі' },
              { string: 2, fret: 0, variant: 'gray', label: 'B', subLabel: 'Сі' },
              { string: 3, fret: 0, variant: 'gray', label: 'G', subLabel: 'Соль' },
              { string: 4, fret: 0, variant: 'gray', label: 'D', subLabel: 'Ре' },
              { string: 5, fret: 0, variant: 'gray', label: 'A', subLabel: 'Ля' },
              { string: 6, fret: 0, variant: 'red', label: 'E', subLabel: 'Мі' },
            ],
            exampleBox: {
              text: {
                uk: 'Мнемоніка для швидкого запам’ятовування знизу вгору (від 6-ї до 1-ї струни): «Eddy Ate Dynamite, Good Bye Eddy» (E – A – D – G – B – E).',
                en: 'Classic mnemonic from thickest (6th) to thinnest (1st) string: "Eddy Ate Dynamite, Good Bye Eddy" (E – A – D – G – B – E).',
              },
              audioNotes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
            },
          },
          {
            id: 'gtr-003-s2',
            type: 'quiz-multiple-choice',
            sectionTitle: {
              uk: 'Перевірка: 5-та відкрита струна',
              en: 'Check: 5th Open String',
            },
            explanation: {
              uk: 'Згадай мнемоніку «Eddy Ate Dynamite...» від 6-ї струни E.',
              en: 'Recall "Eddy Ate Dynamite..." starting from the 6th string E.',
            },
            gems: [
              { string: 6, fret: 0, variant: 'gray', label: 'E' },
              { string: 5, fret: 0, variant: 'question', label: '?' },
            ],
            quizPrompt: {
              uk: 'Яка нота звучить на відкритій 5-й струні (другій за товщиною)?',
              en: 'Which note is played on the open 5th string?',
            },
            quizOptions: [
              { id: 'a', label: { uk: 'A (Ля)', en: 'A' }, isCorrect: true, audioNote: 'A2' },
              { id: 'd', label: { uk: 'D (Ре)', en: 'D' }, isCorrect: false },
              { id: 'g', label: { uk: 'G (Соль)', en: 'G' }, isCorrect: false },
            ],
          },
          {
            id: 'gtr-003-s3',
            type: 'quiz-multiple-choice',
            sectionTitle: {
              uk: 'Перевірка: 2-га відкрита струна',
              en: 'Check: 2nd Open String',
            },
            explanation: {
              uk: '2-га струна знаходиться одразу під найтоншою 1-ю струною E («...Good Bye Eddy»).',
              en: 'String 2 sits right below the thinnest 1st string E ("...Good Bye Eddy").',
            },
            gems: [
              { string: 1, fret: 0, variant: 'gray', label: 'E' },
              { string: 2, fret: 0, variant: 'question', label: '?' },
              { string: 3, fret: 0, variant: 'gray', label: 'G' },
            ],
            quizPrompt: {
              uk: 'Яка нота звучить на відкритій 2-й струні?',
              en: 'Which note is played on the open 2nd string?',
            },
            quizOptions: [
              { id: 'b', label: { uk: 'B (Сі)', en: 'B' }, isCorrect: true, audioNote: 'B3' },
              { id: 'c', label: { uk: 'C (До)', en: 'C' }, isCorrect: false },
              { id: 'f', label: { uk: 'F (Фа)', en: 'F' }, isCorrect: false },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================================
  // STAGE 1: FRETBOARD NOTE MASTERY (FBG-101)
  // ============================================================================
  {
    id: 'stage-1',
    stageNumber: 1,
    code: 'FBG-101',
    title: {
      uk: 'Карта Нот на Грифі (Fretboard Notes)',
      en: 'Fretboard Note Mastery (FBG-101)',
    },
    description: {
      uk: 'На 12 ладах гітари 78 нот, але завдяки правилу півтонів E–F / B–C та октавним трикутникам тобі достатньо знати лише кілька ключів.',
      en: 'There are 78 notes across 12 frets, but with the E–F / B–C rule and octave triangles you only need a fraction of the effort.',
    },
    lessons: [
      {
        id: 'fbg-101-1',
        code: '1.1',
        stageNumber: 1,
        title: {
          uk: 'Хроматичний ряд і правило E–F та B–C',
          en: 'The Chromatic Scale & The E–F / B–C Rule',
        },
        subtitle: {
          uk: 'Чому між більшістю нот 2 лади (тон), а між E–F та B–C — лише 1 сусідній лад (півтон).',
          en: 'Why most natural notes are 2 frets apart, while E–F and B–C sit right next to each other (1 fret).',
        },
        durationMinutes: 8,
        reviewRewards: [
          { id: 's6f1', stringNumber: 6, fret: 1, targetNote: 'F' },
          { id: 's5f2', stringNumber: 5, fret: 2, targetNote: 'B' },
          { id: 's5f3', stringNumber: 5, fret: 3, targetNote: 'C' },
        ],
        steps: [
          {
            id: 'fbg-101-1-s1',
            type: 'fretboard-explain',
            sectionTitle: {
              uk: '7 природних нот і два природні півтони: E–F та B–C',
              en: '7 Natural Notes & The Two Natural Half-Steps: E–F and B–C',
            },
            explanation: {
              uk: 'Музичний алфавіт складається з 7 букв по колу: A – B – C – D – E – F – G (і знову A). Головне правило гітариста: між УСІМА сусідніми буквами відстань дорівнює 2 ладам (цілий тон, бо посередині лежить дієз/бемоль), ОКРІМ двох пар — між E та F і між B та C відстань становить лише 1 лад (півтон)!',
              en: 'The musical alphabet loops through 7 letters: A – B – C – D – E – F – G. The golden rule for guitarists: EVERY pair of adjacent letters is 2 frets apart (a whole step, with a sharp/flat in between), EXCEPT two pairs — E to F and B to C are only 1 fret apart (a half step)!',
            },
            gems: [
              { string: 6, fret: 0, variant: 'gray', label: 'E' },
              { string: 6, fret: 1, variant: 'red', label: 'F', subLabel: '1 лад!' },
              { string: 6, fret: 3, variant: 'gray', label: 'G' },
              { string: 6, fret: 5, variant: 'gray', label: 'A' },
              { string: 6, fret: 7, variant: 'gray', label: 'B' },
              { string: 6, fret: 8, variant: 'red', label: 'C', subLabel: '1 лад!' },
            ],
            exampleBox: {
              text: {
                uk: 'Подивись на 6-ту струну: від відкритої E (0 лад) до F — всього 1 крок (1 лад). А від F (1 лад) до G (3 лад) та A (5 лад) — вже через один лад (+2 лади)!',
                en: 'Look at the 6th string: from open E (fret 0) to F is just 1 fret (fret 1). Then from F (1) to G (3) and A (5) we jump 2 frets each time!',
              },
              audioNotes: ['E2', 'F2', 'G2', 'A2', 'B2', 'C3'],
            },
          },
          {
            id: 'fbg-101-1-s2',
            type: 'fretboard-explain',
            sectionTitle: {
              uk: 'Натуральні ноти на ладах 1–3 (Перша позиція)',
              en: 'Natural Notes on Frets 1–3 (First Position)',
            },
            explanation: {
              uk: 'Застосуймо правило тонів і півтонів до перших трьох ладів! На 6-й та 1-й струнах (відкрита E): одразу на 1-му ладу лежить F (півтон E–F), а через лад на 3-му — G. На 2-й струні (відкрита B): одразу на 1-му ладу лежить C (півтон B–C), а на 3-му ладу — D.',
              en: 'Let’s apply this rule to frets 1–3! On Strings 6 and 1 (open E): Fret 1 is immediately F (E–F half step), and Fret 3 is G. On String 2 (open B): Fret 1 is immediately C (B–C half step), and Fret 3 is D.',
            },
            gems: [
              { string: 1, fret: 0, variant: 'gray', label: 'E' },
              { string: 1, fret: 1, variant: 'red', label: 'F' },
              { string: 1, fret: 3, variant: 'red', label: 'G' },
              { string: 2, fret: 0, variant: 'gray', label: 'B' },
              { string: 2, fret: 1, variant: 'red', label: 'C' },
              { string: 2, fret: 3, variant: 'red', label: 'D' },
              { string: 6, fret: 0, variant: 'gray', label: 'E' },
              { string: 6, fret: 1, variant: 'red', label: 'F' },
              { string: 6, fret: 3, variant: 'red', label: 'G' },
            ],
          },
          {
            id: 'fbg-101-1-s3',
            type: 'quiz-tap-fret',
            sectionTitle: {
              uk: 'Тест на грифі: Де живе нота F на 6-й струні?',
              en: 'Fretboard Test: Locate Note F on the 6th String',
            },
            explanation: {
              uk: 'Відкрита 6-та струна — це E. Оскільки між E та F немає дієзів (природний півтон), нота F лежить безпосередньо на сусідньому ладу.',
              en: 'Open String 6 is E. Because E to F is a natural half-step, F sits immediately on the very next fret.',
            },
            gems: [{ string: 6, fret: 0, variant: 'gray', label: 'E' }],
            quizPrompt: {
              uk: 'Натисни на ноту F (Фа) на 6-й струні:',
              en: 'Tap the note F on the 6th string:',
            },
            targetFretCoord: { string: 6, fret: 1, note: 'F2' },
          },
          {
            id: 'fbg-101-1-s4',
            type: 'quiz-tap-fret',
            sectionTitle: {
              uk: 'Тест на грифі: Знайди ноту C на 5-й струні',
              en: 'Fretboard Test: Locate Note C on the 5th String',
            },
            explanation: {
              uk: 'Відкрита 5-та струна — це A (0 лад). Додаємо 2 лади (цілий тон) і отримуємо B на 2-му ладу. А між B та C — лише 1 лад!',
              en: 'Open String 5 is A (fret 0). Add 2 frets to reach B at fret 2. And remember: B to C is just 1 fret!',
            },
            gems: [
              { string: 5, fret: 0, variant: 'gray', label: 'A' },
              { string: 5, fret: 2, variant: 'gray', label: 'B' },
            ],
            quizPrompt: {
              uk: 'Натисни на ноту C (До) на 5-й струні:',
              en: 'Tap the note C on the 5th string:',
            },
            targetFretCoord: { string: 5, fret: 3, note: 'C3' },
          },
        ],
      },
      {
        id: 'fbg-101-2',
        code: '1.2',
        stageNumber: 1,
        title: {
          uk: 'Октавні Шорткати (Octave Shortcuts)',
          en: 'Octave Shortcuts Across the Neck',
        },
        subtitle: {
          uk: 'Як за 1 секунду знаходити ту саму ноту через струну за допомогою візуальних трикутників.',
          en: 'How to instantly mirror any note across strings using visual octave shapes.',
        },
        durationMinutes: 8,
        reviewRewards: [
          { id: 's4f5', stringNumber: 4, fret: 5, targetNote: 'G' },
          { id: 's3f5', stringNumber: 3, fret: 5, targetNote: 'C' },
        ],
        steps: [
          {
            id: 'fbg-101-2-s1',
            type: 'fretboard-explain',
            sectionTitle: {
              uk: 'Шорткат №1: «2 струни вище, 2 лади вправо» (Струни 6→4 та 5→3)',
              en: 'Shortcut #1: "Up 2 Strings, Right 2 Frets" (Strings 6→4 & 5→3)',
            },
            explanation: {
              uk: 'Якщо ти знаєш ноту на басовій 6-й або 5-й струні, ти автоматично знаєш ноти на 4-й та 3-й струнах! Просто перестрибни через одну струну (на 2 струни тонше) і змістися на 2 лади вправо. Наприклад, G на 6-й струні (3 лад) дає ту саму ноту G на октаву вище на 4-й струні (5 лад).',
              en: 'Once you know the notes on Strings 6 and 5, you automatically unlock Strings 4 and 3! Simply skip one string and move 2 frets to the right. For example, G on String 6 (Fret 3) mirrors to G one octave higher on String 4 (Fret 5).',
            },
            gems: [
              { string: 6, fret: 3, variant: 'gray', label: 'G', subLabel: 'Root' },
              { string: 4, fret: 5, variant: 'green', label: 'G', subLabel: '+1 Oct' },
              { string: 5, fret: 3, variant: 'gray', label: 'C', subLabel: 'Root' },
              { string: 3, fret: 5, variant: 'green', label: 'C', subLabel: '+1 Oct' },
            ],
            vectorLines: [
              { fromString: 6, fromFret: 3, toString: 4, toFret: 5, color: '#10B981' },
              { fromString: 5, fromFret: 3, toString: 3, toFret: 5, color: '#10B981' },
            ],
            exampleBox: {
              text: {
                uk: 'Цей самий октавний інтервал використовують Jimi Hendrix, Muse, Green Day та Korn для гри широких мелодійних октавних рифів!',
                en: 'This exact two-string octave shape is used by Jimi Hendrix, Muse, and Green Day for fat melodic octave riffs!',
              },
              audioNotes: ['G2', 'G3', 'C3', 'C4'],
            },
          },
          {
            id: 'fbg-101-2-s2',
            type: 'quiz-tap-fret',
            sectionTitle: {
              uk: 'Практика: Знайди октаву від ноти A (6-та струна, 5-й лад)',
              en: 'Practice: Tap the Octave of Note A (6th String, 5th Fret)',
            },
            explanation: {
              uk: 'Використай правило «через струну (з 6-ї на 4-ту) і +2 лади вправо».',
              en: 'Apply the rule: skip from String 6 to String 4, and shift +2 frets to the right.',
            },
            gems: [{ string: 6, fret: 5, variant: 'gray', label: 'A' }],
            quizPrompt: {
              uk: 'Натисни на октавну ноту A на 4-й струні:',
              en: 'Tap the octave A note on the 4th string:',
            },
            targetFretCoord: { string: 4, fret: 7, note: 'A3' },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // STAGE 2: SCALE DEGREES & INTERVALS (FBG-201 & MT-112)
  // ============================================================================
  {
    id: 'stage-2',
    stageNumber: 2,
    code: 'FBG-201',
    title: {
      uk: 'Ступені Гами та Інтервали (Scale Degrees & Intervals)',
      en: 'Scale Degrees & Intervals (FBG-201)',
    },
    description: {
      uk: 'Перехід від окремих букв до музичного сенсу: як бачити та чути відстані від Тоніки (R, ♭3, 3, 4, ♭5, 5, ♭7).',
      en: 'Moving from isolated note letters to musical meaning: visualizing and hearing distances from the Root (R, ♭3, 3, 4, ♭5, 5, ♭7).',
    },
    lessons: [
      {
        id: 'fbg-201-1',
        code: '2.1',
        stageNumber: 2,
        title: {
          uk: 'Мажорна vs Мінорна терція (3 vs ♭3) та Чиста квінта (5)',
          en: 'Major vs Minor 3rd (3 vs ♭3) & The Perfect 5th (5)',
        },
        subtitle: {
          uk: 'Геометрія найважливіших інтервалів на сусідніх струнах, які формують будь-який акорд або риф.',
          en: 'The fretboard geometry of the three core intervals that build every chord and rock riff.',
        },
        durationMinutes: 9,
        reviewRewards: [
          { id: 's5f7', stringNumber: 5, fret: 7, targetNote: 'E' },
          { id: 's5f6', stringNumber: 5, fret: 6, targetNote: 'Eb' },
        ],
        steps: [
          {
            id: 'fbg-201-1-s1',
            type: 'fretboard-explain',
            sectionTitle: {
              uk: 'Чиста квінта (5) — фундамент Power Chord',
              en: 'The Perfect 5th (5) — The Power Chord Backbone',
            },
            explanation: {
              uk: 'Візьмімо за Тоніку (R) ноту A на 6-й струні, 5-му ладу (сірий маркер). Якщо ми спустимося на одну струну тонше (5-та струна) і змістимося на 2 лади вправо (7-й лад, нота E), ми отримаємо Чисту Квінту (ступінь 5). Саме ця пара нот (R + 5) утворює легендарний Power Chord (A5), який лежить в основі 90% рок- і метал-рифів.',
              en: 'Place your Root (R) at A on String 6, Fret 5 (gray gem). Moving one string higher in pitch (String 5) and +2 frets to the right (Fret 7, note E) gives you the Perfect 5th (degree 5). Together, R + 5 form the iconic Power Chord (A5) that drives 90% of rock and metal.',
            },
            gems: [
              { string: 6, fret: 5, variant: 'gray', label: 'R', subLabel: 'A' },
              { string: 5, fret: 7, variant: 'green', label: '5', subLabel: 'E' },
              { string: 5, fret: 6, variant: 'red', label: '♭5', subLabel: 'E♭' },
            ],
            vectorLines: [
              { fromString: 6, fromFret: 5, toString: 5, toFret: 7, color: '#10B981' },
            ],
            exampleBox: {
              text: {
                uk: 'А на 1 лад лівіше від квінти (6-й лад, червоний маркер ♭5) живе Тритон — гострий і зловісний інтервал Black Sabbath та Metallica!',
                en: 'One fret below the 5th (Fret 6, red gem ♭5) sits the Tritone — the tense, unmistakable signature of Black Sabbath and Metallica!',
              },
              audioNotes: ['A2', 'E3', 'A2', 'Eb3'],
            },
          },
          {
            id: 'fbg-201-1-s2',
            type: 'fretboard-explain',
            sectionTitle: {
              uk: 'Велика терція (3) проти Малої терції (♭3)',
              en: 'Major 3rd (3) vs Minor 3rd (♭3)',
            },
            explanation: {
              uk: 'Квінта дає потужність, але не визначає настрій (мажор чи мінор). Настрій задає Терція! Від Тоніки A (6 струна, 5 лад) Велика терція (3) лежить на сусідній 5-й струні на 1 лад лівіше (4 лад, нота C♯) — вона звучить світло й мажорно. А Мала терція (♭3) лежить ще на 1 лад лівіше (3 лад, нота C) і миттєво робить звучання мінорним.',
              en: 'While the 5th provides power, the 3rd controls emotion! From Root A (String 6, Fret 5), the Major 3rd (3) sits on String 5 one fret to the left (Fret 4, C♯) for a bright major sound. Lower it by 1 fret to Fret 3 (note C) and you get the Minor 3rd (♭3) for a dark minor mood.',
            },
            gems: [
              { string: 6, fret: 5, variant: 'gray', label: 'R', subLabel: 'A' },
              { string: 5, fret: 4, variant: 'gold', label: '3', subLabel: 'C♯ Maj' },
              { string: 5, fret: 3, variant: 'red', label: '♭3', subLabel: 'C Min' },
              { string: 5, fret: 7, variant: 'green', label: '5', subLabel: 'E' },
            ],
            exampleBox: {
              text: {
                uk: 'Прослухай по черзі мажорний тризвук A Major (R–3–5) та мінорний A Minor (R–♭3–5):',
                en: 'Listen back-to-back to A Major (R–3–5) followed by A Minor (R–♭3–5):',
              },
              audioNotes: ['A2', 'C#3', 'E3', 'A2', 'C3', 'E3'],
            },
          },
          {
            id: 'fbg-201-1-s3',
            type: 'quiz-tap-fret',
            sectionTitle: {
              uk: 'Тест на грифі: Знайди Чисту Квінту (5) від ноти G',
              en: 'Fretboard Test: Find the Perfect 5th (5) of Root G',
            },
            explanation: {
              uk: 'Тоніка R стоїть на 6-й струні, 3-му ладу (нота G). Згадай форму павер-акорду: +1 струна вниз (5-та струна) і +2 лади вправо.',
              en: 'The Root (R) is at String 6, Fret 3 (note G). Use the Power Chord shape: move to String 5 and +2 frets to the right.',
            },
            gems: [{ string: 6, fret: 3, variant: 'gray', label: 'R', subLabel: 'G' }],
            quizPrompt: {
              uk: 'Натисни на Чисту Квінту (5) на 5-й струні:',
              en: 'Tap the Perfect 5th (5) on the 5th string:',
            },
            targetFretCoord: { string: 5, fret: 5, note: 'D3' },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // STAGE 3: TRIADS, CAGED & CHORD PROGRESSIONS (FBG-221 / FBG-251)
  // ============================================================================
  {
    id: 'stage-3',
    stageNumber: 3,
    code: 'FBG-221',
    title: {
      uk: 'Тризвуки, Обернення та Система CAGED',
      en: 'Triads, Inversions & The CAGED System',
    },
    description: {
      uk: 'Як бачити компактні тризвуки (1–3–5) на верхніх струнах, з’єднувати 5 форм CAGED і обігрувати будь-яку акордну прогресію.',
      en: 'Spot compact triads (1–3–5) across string sets, connect all 5 CAGED shapes, and target chord tones effortlessly.',
    },
    lessons: [
      {
        id: 'fbg-221-1',
        code: '3.1',
        stageNumber: 3,
        title: {
          uk: 'Тісні Тризвуки (Closed Triads) та Зміна Акорду Одним Пальцем',
          en: 'Closed Triads & Single-Fret Major/Minor Switching',
        },
        subtitle: {
          uk: 'Як зіграти D Major та D Minor на струнах 4–3–2 у 5-й позиції, зсунувши лише терцію.',
          en: 'How to play D Major and D Minor on strings 4–3–2 by shifting only the 3rd.',
        },
        durationMinutes: 10,
        reviewRewards: [
          { id: 's4f7', stringNumber: 4, fret: 7, targetNote: 'A' },
          { id: 's3f7', stringNumber: 3, fret: 7, targetNote: 'D' },
          { id: 's2f6', stringNumber: 2, fret: 6, targetNote: 'F' },
        ],
        steps: [
          {
            id: 'fbg-221-1-s1',
            type: 'fretboard-explain',
            sectionTitle: {
              uk: 'Анатомія мінорного тризвуку Dm (D – F – A) на ладах 5–7',
              en: 'Anatomy of the Dm Triad (D – F – A) at Frets 5–7',
            },
            explanation: {
              uk: 'Тризвук — це ядро будь-якого акорду з трьох звуків: Тоніка (1), Терція (3 або ♭3) та Квінта (5). Подивись на зелену лінію тризвуку D Minor (Ре мінор): Тоніка D лежить на 5-й струні (5 лад) і повторюється октавою на 3-й струні (7 лад), Квінта A — на 4-й струні (7 лад), а Мала терція F (♭3) — на 2-й струні (6 лад). Саме цю форму ти бачиш у багатьох соло та рифах!',
              en: 'A triad is the 3-note core of any chord: Root (1), Third (3 or ♭3), and Fifth (5). Look at the green path for D Minor: Root D sits at String 5 (Fret 5) and String 3 (Fret 7), Fifth A is on String 4 (Fret 7), and Minor 3rd F (♭3) is on String 2 (Fret 6).',
            },
            gems: [
              { string: 5, fret: 5, variant: 'green', label: 'D', subLabel: 'R' },
              { string: 4, fret: 7, variant: 'green', label: 'A', subLabel: '5' },
              { string: 3, fret: 7, variant: 'green', label: 'D', subLabel: 'R' },
              { string: 2, fret: 6, variant: 'red', label: 'F', subLabel: '♭3' },
            ],
            vectorLines: [
              { fromString: 5, fromFret: 5, toString: 4, toFret: 7, color: '#10B981' },
              { fromString: 4, fromFret: 7, toString: 3, toFret: 7, color: '#10B981' },
              { fromString: 3, fromFret: 7, toString: 2, toFret: 6, color: '#10B981' },
            ],
            exampleBox: {
              text: {
                uk: 'Якщо підняти ноту F (6 лад, 2 струна) на 1 лад вправо до F♯ (7 лад), мінорний акорд Dm миттєво перетвориться на мажорний акорд D Major!',
                en: 'Raise note F (String 2, Fret 6) by 1 fret to F♯ (Fret 7) and Dm instantly transforms into a bright D Major triad!',
              },
              audioNotes: ['D3', 'A3', 'D4', 'F4', 'D3', 'A3', 'D4', 'F#4'],
            },
          },
          {
            id: 'fbg-221-1-s2',
            type: 'quiz-tap-fret',
            sectionTitle: {
              uk: 'Тест на грифі: Перетвори D Major на D Minor (Dm)',
              en: 'Fretboard Test: Turn D Major into D Minor (Dm)',
            },
            explanation: {
              uk: 'На грифі стоять Тоніка D (3 струна, 7 лад) та Квінта A (4 струна, 7 лад). Де на 2-й струні розташована Мала терція F (♭3) для акорду Dm?',
              en: 'Root D (String 3, Fret 7) and Fifth A (String 4, Fret 7) are shown. Tap the Minor 3rd F (♭3) on String 2 to complete the Dm triad:',
            },
            gems: [
              { string: 4, fret: 7, variant: 'gray', label: 'A', subLabel: '5' },
              { string: 3, fret: 7, variant: 'gray', label: 'D', subLabel: 'R' },
            ],
            quizPrompt: {
              uk: 'Натисни на ноту F (♭3) на 2-й струні (6-й лад):',
              en: 'Tap note F (♭3) on the 2nd string (Fret 6):',
            },
            targetFretCoord: { string: 2, fret: 6, note: 'F4' },
          },
        ],
      },
    ],
  },
];

export function findLessonById(lessonId: string): InteractiveLesson | undefined {
  for (const stage of LEARNING_STAGES) {
    const found = stage.lessons.find((l) => l.id === lessonId);
    if (found) return found;
  }
  return undefined;
}
