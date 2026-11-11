export type SkillTier = 'beginner' | 'intermediate' | 'pro';

export interface ChordDiagramData {
  name: string;
  subtitle: string;
  baseFret?: number;
  /** 6 strings from 6th (Low E) to 1st (High E): -1 = X (mute), 0 = open, 1..5 = fret relative to baseFret */
  frets: [number, number, number, number, number, number];
  /** Finger numbers: 0 = none, 1 = index, 2 = middle, 3 = ring, 4 = pinky */
  fingers: [number, number, number, number, number, number];
}

export interface StrumBeat {
  count: string;
  direction: 'D' | 'U' | 'miss-D' | 'miss-U';
  accent?: boolean;
}

export interface CurriculumLesson {
  id: string;
  code: string;
  moduleId: string;
  title: string;
  subtitle: string;
  durationMin: number;
  xpReward: number;
  sourceBook: 'Next Level Guitar (D. Taub)' | 'Learn & Master Guitar (S. Krenz)' | 'Обидві книги (Taub + Krenz)';
  sourceRef: string;
  status: 'completed' | 'current' | 'unlocked' | 'locked';
  tags: string[];
  keyTakeaways: string[];
  practiceTask: string;
  chordPreview?: ChordDiagramData[];
  strumPattern?: {
    name: string;
    beats: StrumBeat[];
  };
  tabSnippet?: {
    title: string;
    lines: string[];
  };
  quizQuestion?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CurriculumModule {
  id: string;
  number: number;
  tier: SkillTier;
  tierLabel: string;
  title: string;
  subtitle: string;
  sourceSummary: string;
  estimatedWeeks: string;
  progressPercent: number;
  badgeTitle: string;
  badgeIcon: string;
  accentColor: string;
  lessons: CurriculumLesson[];
}

export const ZERO_TO_PRO_MODULES: CurriculumModule[] = [
  // ==========================================================================
  // МОДУЛЬ 1: АБСОЛЮТНИЙ НУЛЬ — АНАТОМІЯ, СТРІЙ ТА ПОСТАНОВКА РУК
  // ==========================================================================
  {
    id: 'mod-1',
    number: 1,
    tier: 'beginner',
    tierLabel: 'Новачок · База',
    title: 'Старт з нуля: Анатомія, Стрій та Постановка рук',
    subtitle: 'Знайомство з інструментом, 6 відкритих струн, правильний хват медіатора та ергономіка лівої руки без болю.',
    sourceSummary: 'Next Level Guitar (стор. 4–12) + Learn & Master Guitar (Session 1)',
    estimatedWeeks: '1 тиждень',
    progressPercent: 100,
    badgeTitle: 'Перший Дотик',
    badgeIcon: '🎸',
    accentColor: '#F59E0B',
    lessons: [
      {
        id: 'les-1-1',
        code: '1.1',
        moduleId: 'mod-1',
        title: 'Акустика vs Електро: Анатомія та 10 правил гітариста',
        subtitle: 'Будова гітари, як народжується звук та головні принципи ефективного тренування.',
        durationMin: 6,
        xpReward: 40,
        sourceBook: 'Обидві книги (Taub + Krenz)',
        sourceRef: 'Taub p. 4–6 · Krenz Session 1 p. 2',
        status: 'completed',
        tags: ['Анатомія', 'База', 'Mindset'],
        keyTakeaways: [
          'Гриф, 6 струн і розташування нот на акустичній та електрогітарі на 100% однакові.',
          'Акустика посилює звук через порожнисту деку (Soundhole), а електрогітара — через магнітні звукознімачі (Pickups).',
          'Нігті на лівій (притискній) руці мають бути коротко підстрижені, щоб палець ставав вертикально на подушечку.',
          'Краще займатися по 15 хвилин щодня, ніж 2 години раз на тиждень — так формується м’язова пам’ять.',
        ],
        practiceTask: 'Знайди на своїй гітарі поріжок (Nut), 3-й, 5-й, 7-й та 12-й лади з точками-маркерами, бридж та кілки.',
        quizQuestion: {
          prompt: 'Як перевірити, чи достатньо короткі нігті на лівій руці для гри на гітарі (тест Девіда Тауба)?',
          options: [
            'Притиснути палець вертикально до твердої поверхні столу: якщо першим торкається ніготь, а не подушечка — треба підстригти',
            'Подивитися на долоню з тильного боку',
            'Довжина нігтів не має значення для акордів',
          ],
          correctIndex: 0,
          explanation: 'Якщо ніготь впирається в накладку грифу раніше за кінчик пальця, струна буде деренчати або глушитися.',
        },
      },
      {
        id: 'les-1-2',
        code: '1.2',
        moduleId: 'mod-1',
        title: '6 Відкритих струн (E–A–D–G–B–E) та Налаштування',
        subtitle: 'Чому 1-ша струна найтонша, мнемоніка "Eddie Ate Dynamite" та налаштування за 5-м ладом.',
        durationMin: 8,
        xpReward: 50,
        sourceBook: 'Обидві книги (Taub + Krenz)',
        sourceRef: 'Taub p. 8 · Krenz Session 1 p. 2–3',
        status: 'completed',
        tags: ['Стрій E Standard', 'Струни', 'Слух'],
        keyTakeaways: [
          'Струни рахуються знизу вгору: 1-ша струна — найтонша (висока E), а 6-та струна — найтовстіша басова (низька E).',
          'Мнемоніка від 6-ї до 1-ї струни: "Eddie Ate Dynamite, Good Bye Eddie" → E – A – D – G – B – E.',
          'Налаштування на слух (Relative Tuning): 5-й лад 6-ї струни звучить як відкрита 5-та (A). Єдиний виняток — 2-га струна (B) налаштовується по 4-му ладу 3-ї струни!',
        ],
        practiceTask: 'Зіграй кожну відкриту струну від 6-ї до 1-ї, називаючи її букву вголос, і перевір унісон на 5-му ладу сусідніх струн.',
        quizQuestion: {
          prompt: 'На якому ладу потрібно затиснути 3-тю струну (G), щоб налаштувати відкриту 2-гу струну (B)?',
          options: ['На 5-му ладу', 'На 4-му ладу (єдиний виняток на грифі)', 'На 3-му ладу'],
          correctIndex: 1,
          explanation: 'Між струнами G (3) та B (2) інтервал у велику терцію (4 півтони), тому унісон знаходиться на 4-му ладу, а не на 5-му.',
        },
      },
      {
        id: 'les-1-3',
        code: '1.3',
        moduleId: 'mod-1',
        title: 'Хват медіатора та 8 золотих правил лівої руки',
        subtitle: 'Як тримати медіатор, щоб він не випадав, і як ставити пальці на лади без глушіння сусідніх струн.',
        durationMin: 10,
        xpReward: 50,
        sourceBook: 'Обидві книги (Taub + Krenz)',
        sourceRef: 'Taub p. 7, 11–12 · Krenz Session 1 p. 2',
        status: 'completed',
        tags: ['Техніка рук', 'Медіатор', 'Ергономіка'],
        keyTakeaways: [
          'Медіатор затискається між великим і вказівним пальцем так, щоб виступав лише кінчик (6–10 мм).',
          'Пальці лівої руки нумеруються: 1 — вказівний, 2 — середній, 3 — безіменний, 4 — мізинець.',
          'Притискай струну одразу позаду металевого поріжка ладу (не посередині між ладами!).',
          'Тримай пальці компактним кластером ("Tight Cluster") близько до струн, а зап’ястя опущеним униз.',
        ],
        practiceTask: 'Потренуй постановку пальців "куполом" на 2-му ладу, перевіряючи, щоб між долонею та шийкою грифу залишався простір.',
      },
      {
        id: 'les-1-4',
        code: '1.4',
        moduleId: 'mod-1',
        title: 'Як читати діаграми акордів, Таби (TAB) та Вправа "Павучок"',
        subtitle: 'Розшифровка Chord Blocks, 6 ліній табулатури та перші 5 хроматичних вправ для пальців 1-2-3-4.',
        durationMin: 12,
        xpReward: 60,
        sourceBook: 'Обидві книги (Taub + Krenz)',
        sourceRef: 'Taub p. 10 · Krenz Session 1 p. 4–5',
        status: 'completed',
        tags: ['Табулатури', 'Chord Charts', 'Координація'],
        keyTakeaways: [
          'На діаграмі акорду вертикальні лінії — це струни (зліва 6-та басова, справа 1-ша тонка), горизонтальні — лади.',
          '"0" означає грати відкриту струну, "X" — не грати (або глушити) струну.',
          'У табах (TAB) верхня лінія — це 1-ша струна, нижня — 6-та. Цифра на лінії показує номер ладу.',
        ],
        practiceTask: 'Зіграй хроматичну вправу 1-2-3-4 по черзі на кожній струні від 1-ї до 6-ї перемінним штрихом (Down-Up).',
        tabSnippet: {
          title: 'Хроматична розминка Krenz #1 (Alternate Picking D-U-D-U)',
          lines: [
            'e|---1-2-3-4---4-3-2-1---|',
            'B|---1-2-3-4---4-3-2-1---|',
            'G|---1-2-3-4---4-3-2-1---|',
          ],
        },
      },
    ],
  },

  // ==========================================================================
  // МОДУЛЬ 2: ПЕРШІ АКОРДИ ТА СЕКРЕТИ РИТМУ Й БОЮ
  // ==========================================================================
  {
    id: 'mod-2',
    number: 2,
    tier: 'beginner',
    tierLabel: 'Новачок · Перші пісні',
    title: 'Перші 3 Акорди та Механіка Бою (Strumming)',
    subtitle: 'Швидкий старт за методикою Девіда Тауба: 3 круті акорди однією формою пальців та 2 універсальні бої.',
    sourceSummary: 'Next Level Guitar (стор. 13–24) + Learn & Master Guitar (Sessions 1, 6, 9)',
    estimatedWeeks: '1–2 тижні',
    progressPercent: 64,
    badgeTitle: 'Майстер Ритму',
    badgeIcon: '🔥',
    accentColor: '#EAB308',
    lessons: [
      {
        id: 'les-2-1',
        code: '2.1',
        moduleId: 'mod-2',
        title: 'Перші 3 акорди однією формою: Em → Asus2 → Am9',
        subtitle: 'Як вивчити одну аплікатуру з 2 пальців і миттєво заграти красиву прогресію.',
        durationMin: 10,
        xpReward: 60,
        sourceBook: 'Next Level Guitar (D. Taub)',
        sourceRef: 'Taub p. 13–16',
        status: 'current',
        tags: ['Акорди Em / Asus2 / Am9', 'Кластер пальців', 'Хіт-старт'],
        keyTakeaways: [
          'Маленька літера "m" біля назви акорду завжди означає мінор (Em = Мі мінор). Якщо літери немає — це мажор.',
          'Акорд Em береться 1-м та 2-м пальцями на 2-му ладу 5-ї та 4-ї струн (всі 6 струн звучать!).',
          'Опусти обидва пальці на одну струну нижче (на 4-ту і 3-тю струни, не граючи 6-ту) — і ти отримаєш Asus2!',
          'Ковзни цією ж формою Asus2 вгору на 5-й лад — і зазвучить глибокий атмосферний акорд Am9.',
        ],
        practiceTask: 'Вправа "Hover Cluster": затисни Em, проведи по струнах, підніми пальці на 5 мм над струнами (не розриваючи їх форму!) і постав назад. Потім змінюй Em ↔ Asus2 ↔ Am9.',
        chordPreview: [
          {
            name: 'Em',
            subtitle: 'Мі мінор (всі 6 струн)',
            frets: [0, 2, 2, 0, 0, 0],
            fingers: [0, 1, 2, 0, 0, 0],
          },
          {
            name: 'Asus2',
            subtitle: 'Опусти форму на 1 струну',
            frets: [-1, 0, 2, 2, 0, 0],
            fingers: [0, 0, 1, 2, 0, 0],
          },
          {
            name: 'Am9',
            subtitle: 'Слайд на 5-й лад',
            baseFret: 4,
            frets: [-1, 0, 2, 2, 0, 0],
            fingers: [0, 0, 1, 2, 0, 0],
          },
        ],
        quizQuestion: {
          prompt: 'Як утворити акорд Asus2 із форми акорду Em за методом Девіда Тауба?',
          options: [
            'Опустити 1-й та 2-й пальці рівно на одну струну нижче (на 4-ту і 3-тю струни) і не грати 6-ту струну',
            'Додати мізинець на 1-шу струну',
            'Перемістити пальці на 1-й лад',
          ],
          correctIndex: 0,
          explanation: 'Em та Asus2 мають ідентичну форму пальців — достатньо перенести кластер на струну нижче!',
        },
      },
      {
        id: 'les-2-2',
        code: '2.2',
        moduleId: 'mod-2',
        title: 'Механіка бою: Маятник руки та рахунок 1 & 2 & 3 & 4 &',
        subtitle: 'Чому рука має рухатися від ліктя і як перейти від чвертних до восьмих нот.',
        durationMin: 10,
        xpReward: 50,
        sourceBook: 'Обидві книги (Taub + Krenz)',
        sourceRef: 'Taub p. 20–21 · Krenz Session 2 p. 7 & Session 9 p. 52',
        status: 'unlocked',
        tags: ['Strumming', 'Ритм 4/4', 'Восьмі ноти'],
        keyTakeaways: [
          'Бій виконується вільним рухом передпліччя від ліктя з розслабленим зап’ястям — ніколи не затискай кисть!',
          'Чвертні ноти (Quarter Notes): 4 удари вниз на рахунок "1 – 2 – 3 – 4" (D / D / D / D).',
          'Восьмі ноти (Eighth Notes): додаємо удари вгору (Upstrum) на кожне "і" ("&"): 1 & 2 & 3 & 4 & (D U D U D U D U).',
          'На ударі вгору (Upstrum) не потрібно зачіпати всі 6 струн — достатньо легко вдарити по 2–3 тонких струнах!',
        ],
        practiceTask: 'Зіграй по 1 такту (1 & 2 & 3 & 4 &) на акордах Em → Asus2 → Am9 → Asus2 без зупинки правої руки.',
      },
      {
        id: 'les-2-3',
        code: '2.3',
        moduleId: 'mod-2',
        title: '2 Культові паттерни бою для сотень хітів (D-D-U-U-D-U)',
        subtitle: 'Як пропуски ударів (паузи та ліги) перетворюють механічну вправу на справжній грув.',
        durationMin: 12,
        xpReward: 75,
        sourceBook: 'Обидві книги (Taub + Krenz)',
        sourceRef: 'Taub p. 22–23 · Krenz Session 6 p. 38',
        status: 'unlocked',
        tags: ['Бій #1: D-D-U-U-D-U', 'Бій #2: D-U-D-U-U-D-U', 'Грув'],
        keyTakeaways: [
          'Паттерн №1 (Універсальний хіт-бій): Down – Down – Up – Up – Down – Up (рахунок: 1, 2, & [пропуск 3], &, 4, &).',
          'Паттерн №2 (Драйвовий рок/фолк бій): Down – Up – Down – Up – Up – Down – Up (пропускаємо лише удар вниз на долю "3").',
          'Секрет рівного ритму: коли на долю "3" немає удару вниз, рука ВСЕ ОДНО опускається вниз у повітрі повз струни!',
        ],
        practiceTask: 'Заглуши струни лівою рукою і відпрацюй бій D – D – U – U – D – U по колу, поки рука не почне грати його на автопілоті. Потім додай Em → Asus2.',
        strumPattern: {
          name: 'Паттерн №1: Down / Down / Up / Up / Down / Up',
          beats: [
            { count: '1', direction: 'D', accent: true },
            { count: '&', direction: 'miss-U' },
            { count: '2', direction: 'D', accent: true },
            { count: '&', direction: 'U' },
            { count: '3', direction: 'miss-D' },
            { count: '&', direction: 'U', accent: true },
            { count: '4', direction: 'D' },
            { count: '&', direction: 'U' },
          ],
        },
      },
    ],
  },

  // ==========================================================================
  // МОДУЛЬ 3: 12 ВІДКРИТИХ АКОРДІВ ТА 3 ПРИНЦИПИ ШВИДКИХ ПЕРЕХОДІВ
  // ==========================================================================
  {
    id: 'mod-3',
    number: 3,
    tier: 'beginner',
    tierLabel: 'Новачок+ · Акордова база',
    title: '12 Відкритих Акордів та 3 Принципи Швидкої Зміни',
    subtitle: 'Усі головні мажорні, мінорні й септакорди у 1-й позиції, акорд F та професійні техніки переходів.',
    sourceSummary: 'Next Level Guitar (стор. 25–35) + Learn & Master Guitar (Session 5)',
    estimatedWeeks: '2–3 тижні',
    progressPercent: 25,
    badgeTitle: 'Володар Ковбойських Акордів',
    badgeIcon: '🤠',
    accentColor: '#10B981',
    lessons: [
      {
        id: 'les-3-1',
        code: '3.1',
        moduleId: 'mod-3',
        title: 'Сімейства відкритих акордів: E & Am, D & Dm, A & C',
        subtitle: 'Вчимо акорди парами за схожістю форм та вчимося глушити зайву 6-ту струну.',
        durationMin: 14,
        xpReward: 70,
        sourceBook: 'Обидві книги (Taub + Krenz)',
        sourceRef: 'Taub p. 25–26 · Krenz Session 4 p. 27 & Session 5 p. 31',
        status: 'completed',
        tags: ['E / Am', 'D / Dm', 'A / C', 'М’ют струн'],
        keyTakeaways: [
          'E major та A minor мають абсолютно однакову форму з 3 пальців — просто перенеси кластер E на одну струну нижче для Am!',
          'Акорди D та Dm звучать лише на 4 тонких струнах (6-та і 5-та струни не граються).',
          'В акорді C кінчик 3-го пальця (на 5-й струні) злегка торкається 6-ї струни знизу — це автоматично глушить її під час широкого бою!',
        ],
        practiceTask: 'Зіграй пари E ↔ Am та D ↔ Dm, перевіряючи чистоту кожної струни окремо (арпеджіо) перед ударом боєм.',
        chordPreview: [
          {
            name: 'E',
            subtitle: 'Мі мажор (6 струн)',
            frets: [0, 2, 2, 1, 0, 0],
            fingers: [0, 2, 3, 1, 0, 0],
          },
          {
            name: 'Am',
            subtitle: 'Та сама форма нижче',
            frets: [-1, 0, 2, 2, 1, 0],
            fingers: [0, 0, 2, 3, 1, 0],
          },
          {
            name: 'C',
            subtitle: 'До мажор (5 струн)',
            frets: [-1, 3, 2, 0, 1, 0],
            fingers: [0, 3, 2, 0, 1, 0],
          },
        ],
      },
      {
        id: 'les-3-2',
        code: '3.2',
        moduleId: 'mod-3',
        title: '4-пальцеві G і Cadd9 та Відкриті Септакорди (G7, C7, D7, E7, A7, B7)',
        subtitle: 'Рок-баладна пара G ↔ Cadd9 з фіксованими пальцями 3 і 4 та блюзові домінантсептакорди.',
        durationMin: 14,
        xpReward: 70,
        sourceBook: 'Обидві книги (Taub + Krenz)',
        sourceRef: 'Taub p. 26 · Krenz Session 1 p. 6 & Session 5 p. 31–36',
        status: 'unlocked',
        tags: ['G / Cadd9', 'Dominant 7th', 'Пісні'],
        keyTakeaways: [
          'Чотирипальцевий G major (3-й і 4-й пальці на 3-му ладу 2-ї та 1-ї струн) дає щільне рок-звучання і переходить у Cadd9 простим зміщенням 1-го і 2-го пальців на струну нижче.',
          'Домінантсептакорди (G7, C7, D7, E7, A7, B7) створюють гармонічне тяжіння і є основою блюзу, року та кантрі.',
        ],
        practiceTask: 'Відпрацюй послідовність C → Am → Dm → G7 (вправа Krenz 5.1) та G → Cadd9 → D.',
      },
      {
        id: 'les-3-3',
        code: '3.3',
        moduleId: 'mod-3',
        title: 'Як приборкати акорд F major через Fmaj7 (Метод 7-го ладу)',
        subtitle: 'Безболісний перехід до міні-баре на 1-му ладу без перенапруження кисті.',
        durationMin: 12,
        xpReward: 80,
        sourceBook: 'Next Level Guitar (D. Taub)',
        sourceRef: 'Taub p. 27',
        status: 'unlocked',
        tags: ['F Major', 'Fmaj7', 'Міні-баре'],
        keyTakeaways: [
          'Почни з Fmaj7 (X-X-3-2-1-0 з відкритою 1-ю струною) — він одразу замінює F у більшості пісень і тренує розтяжку 2-го і 3-го пальців.',
          'Для класичного 4-струнного F (X-X-3-2-1-1) затисни 1-м пальцем одразу дві тонкі струни (1-шу і 2-гу), злегка нахиливши палець на бік.',
          'Лайфхак Тауба: якщо на 1-му ладу важко тягнутися, потренуй цю форму на 7-му ладу (де лади вужчі), а потім поступово спускайся до 1-го ладу!',
        ],
        practiceTask: 'Зіграй по черзі C → Am → Fmaj7 → G, а потім заміни Fmaj7 на повноцінний F (X-X-3-2-1-1).',
      },
      {
        id: 'les-3-4',
        code: '3.4',
        moduleId: 'mod-3',
        title: '3 Про-техніки зміни акордів: Shared Fingers, Cluster & Slide',
        subtitle: 'Як назавжди позбутися пауз між акордами та заграти хіт-прогресію G – Em – C – D.',
        durationMin: 15,
        xpReward: 100,
        sourceBook: 'Next Level Guitar (D. Taub)',
        sourceRef: 'Taub p. 29–35',
        status: 'unlocked',
        tags: ['Shared Fingers', 'Cluster', 'Slide', 'G-Em-C-D'],
        keyTakeaways: [
          'Принцип №1 — Shared Fingers (Спільний палець-якір): ніколи не відривай палець, якщо в наступному акорді він стоїть на тій самій ноті! (C ↔ Am: пальці 1 і 2 залишаються; D ↔ G: 3-й палець на 2-й струні залишається).',
          'Принцип №2 — Cluster (Збереження форми в повітрі): рухай пальці єдиним блоком одночасно (E ↔ Am, Em ↔ Am).',
          'Принцип №3 — Slide (Палець-рейка): ковзай спільним пальцем уздовж струни на сусідній лад як по рейці (A ↔ D: 3-й палець ковзає по 2-й струні з 2-го на 3-й лад; E ↔ D: 1-й палець по 3-й струні з 1-го на 2-й лад).',
        ],
        practiceTask: 'З’єднай 4 акорди у вічну хіт-прогресію G → Em → C → D боєм D-D-U-U-D-U, використовуючи якірні пальці на кожному переході!',
      },
    ],
  },

  // ==========================================================================
  // МОДУЛЬ 4: КАРТА НОТ НА ГРИФІ, ОКТАВИ ТА АКОРДИ M7 / SUS
  // ==========================================================================
  {
    id: 'mod-4',
    number: 4,
    tier: 'intermediate',
    tierLabel: 'Середній · Навігація грифу',
    title: 'Карта Нот на Грифі, Октавні Шорткати та Акорди m7 / sus',
    subtitle: 'Всі ноти у 1-й позиції, хроматичне правило E–F / B–C, миттєвий пошук октав та атмосферні акорди.',
    sourceSummary: 'Next Level Guitar (стор. 36) + Learn & Master Guitar (Sessions 2, 3, 4, 6)',
    estimatedWeeks: '2–3 тижні',
    progressPercent: 0,
    badgeTitle: 'Штурман Грифу',
    badgeIcon: '🧭',
    accentColor: '#3B82F6',
    lessons: [
      {
        id: 'les-4-1',
        code: '4.1',
        moduleId: 'mod-4',
        title: 'Ноти у 1-й позиції на всіх 6 струнах (Лади 0–3)',
        subtitle: 'Вивчаємо розташування чистих нот від високої E до басової E на перших трьох ладах.',
        durationMin: 15,
        xpReward: 80,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Sessions 2, 3 & 4 (p. 7–30)',
        status: 'unlocked',
        tags: ['Ноти 1–6 струн', 'Таби мелодій', 'C Major Scale'],
        keyTakeaways: [
          '1-ша та 6-та струни (E): лад 0 = E, лад 1 = F, лад 3 = G.',
          '2-га струна (B): лад 0 = B, лад 1 = C, лад 3 = D. 3-тя струна (G): лад 0 = G, лад 2 = A.',
          '4-та струна (D): лад 0 = D, лад 2 = E, лад 3 = F. 5-та струна (A): лад 0 = A, лад 2 = B, лад 3 = C.',
          'Зігравши ці ноти підряд від 5-ї струни (3 лад C) до 1-ї струни, ми отримуємо відкриту гаму До мажор (C Major).',
        ],
        practiceTask: 'Зіграй по табах мелодії Ode to Joy та Minuet in G, називаючи кожну ноту під час гри.',
        tabSnippet: {
          title: 'Гама C Major у першій позиції (Krenz Session 4, p. 25)',
          lines: [
            'e|-------------------------0-1-3-|',
            'B|-------------------0-1-3-------|',
            'G|---------------0-2-------------|',
            'D|---------0-2-3-----------------|',
            'A|---0-2-3-----------------------|',
            'E|-0-1-3-------------------------|',
          ],
        },
      },
      {
        id: 'les-4-2',
        code: '4.2',
        moduleId: 'mod-4',
        title: '12 нот хроматичної гами, правило E–F / B–C та Октави',
        subtitle: 'Як розблокувати весь гриф до 12-го ладу за допомогою 2 візуальних трикутників.',
        durationMin: 12,
        xpReward: 85,
        sourceBook: 'Обидві книги (Taub + Krenz)',
        sourceRef: 'Taub p. 36 · Krenz Session 4 p. 26 & Session 7 p. 43',
        status: 'unlocked',
        tags: ['E-F / B-C', 'Дієзи та Бемолі', 'Октавні трикутники'],
        keyTakeaways: [
          'Між усіма сусідніми літерами алфавіту 2 лади (цілий тон із #/b посередині), ОКРІМ пар E–F та B–C — між ними завжди 1 лад!',
          'Крайні струни (6-та і 1-ша) мають однакові ноти на кожному ладу (різниця у 2 октави).',
          'Октавний шорткат Девіда Тауба: від будь-якої ноти на 6-й (або 5-й) струні спустися на 2 струни вниз (на 4-ту або 3-тю) і змістися на +2 лади вправо — це та сама нота на октаву вище!',
        ],
        practiceTask: 'Знайди ноту A на 6-й (5 лад), 5-й (0 і 12 лад), 4-й (7 лад) та 3-й (2 лад) струнах за допомогою октавних форм.',
      },
      {
        id: 'les-4-3',
        code: '4.3',
        moduleId: 'mod-4',
        title: 'Акорди Minor 7th (Am7, Dm7, Em7) та Suspended (Asus, Dsus, Esus)',
        subtitle: 'Секрет живого акустичного аранжування в тональностях C, G та D.',
        durationMin: 14,
        xpReward: 80,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 6 (p. 37–42)',
        status: 'unlocked',
        tags: ['Am7 / Dm7 / Em7', 'Asus / Dsus / Esus', 'Аранжування'],
        keyTakeaways: [
          'Мінорні септакорди (Am7, Dm7, Em7) звучать м’якше й об’ємніше за звичайні мінорні тризвуки.',
          'Suspended-акорди (Asus4, Dsus4, Esus4) замінюють 3-й ступінь на 4-й, створюючи приємне зависання, яке хочеться розв’язати назад у D, A або E.',
        ],
        practiceTask: 'Зіграй вправу D → Dsus → D та прогресію Scarborough Fair і Greensleeves.',
      },
    ],
  },

  // ==========================================================================
  // МОДУЛЬ 5: БАРЕ-АКОРДИ, ТОНАЛЬНОСТІ ТА ІНТЕРВАЛИ
  // ==========================================================================
  {
    id: 'mod-5',
    number: 5,
    tier: 'intermediate',
    tierLabel: 'Середній · Свобода на грифі',
    title: 'Баре-акорди (6-та і 5-та струни), Мажорна Гама та Інтервали',
    subtitle: 'Переміщувані форми баре для будь-якої тональності, ключові знаки, паралельний мінор та теорія інтервалів.',
    sourceSummary: 'Learn & Master Guitar (Sessions 7, 8, 9 — стор. 43–56)',
    estimatedWeeks: '3–4 тижні',
    progressPercent: 0,
    badgeTitle: 'Титан Баре',
    badgeIcon: '⚡',
    accentColor: '#8B5CF6',
    lessons: [
      {
        id: 'les-5-1',
        code: '5.1',
        moduleId: 'mod-5',
        title: 'Баре-акорди від 6-ї струни (Форми F, Fm, F7, Fm7, Fsus)',
        subtitle: 'Як перетворити відкриті форми сімейства E на універсальні акорди для всіх 12 тональностей.',
        durationMin: 16,
        xpReward: 100,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 7 (p. 43–44, 47)',
        status: 'unlocked',
        tags: ['6th String Barre', 'Moveable Chords', 'Root на 6-й струні'],
        keyTakeaways: [
          'Нота під 1-м пальцем на 6-й струні (позначена ромбом) є Тонікою (Root) і дає ім’я всьому баре-акорду.',
          'Форма F на 1-му ладу → на 3-му ладу стає G → на 5-му ладу стає A → на 8-му ладу стає C!',
          'Прибери 2-й палець із мажорної форми баре — і отримаєш мінорний баре-акорд (Fm, Gm, Am, Bm).',
        ],
        practiceTask: 'Зіграй баре-прогресію G → Bm → C → Am виключно переміщуваними формами від 6-ї струни (лади 3, 7, 8, 5).',
      },
      {
        id: 'les-5-2',
        code: '5.2',
        moduleId: 'mod-5',
        title: 'Формула Мажорної Гами (W-W-H-W-W-W-H) та Ключові Знаки',
        subtitle: 'Математика побудови будь-якої тональності та миттєве визначення ключа за дієзами/бемолями.',
        durationMin: 14,
        xpReward: 90,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 7 (p. 45–46) & Session 8 (p. 49–50)',
        status: 'unlocked',
        tags: ['Major Scale Formula', 'Key Signatures', 'Теорія'],
        keyTakeaways: [
          'Універсальна формула мажорної гами: Тон – Тон – Півтон – Тон – Тон – Тон – Півтон (2 – 2 – 1 – 2 – 2 – 2 – 1 ладів).',
          'Порядок появи дієзів: F# – C# – G# – D# – A# – E#. Порядок бемолів: Bb – Eb – Ab – Db – Gb – Cb.',
          'Секрет Krenz: у дієзних тональностях назва мажорного ключа лежить на півтону (1 лад) вище від останнього дієза!',
        ],
        practiceTask: 'Побудуй ноти гами G major (1 дієз F#) та D major (2 дієзи F#, C#) прямо на одній струні за формулою Т-Т-пТ-Т-Т-Т-пТ.',
      },
      {
        id: 'les-5-3',
        code: '5.3',
        moduleId: 'mod-5',
        title: 'Баре-акорди від 5-ї струни (B, Bm, B7, Bm7) та Паралельний Мінор',
        subtitle: 'Другий стовп баре-акордів та закон Relative Major / Minor (6-й ступінь гами).',
        durationMin: 16,
        xpReward: 100,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 8 (p. 48–51)',
        status: 'unlocked',
        tags: ['5th String Barre', 'Bm / Cm / Dm', 'Relative Minor'],
        keyTakeaways: [
          'Баре від 5-ї струни бере за основу відкриті форми A, Am, A7. Тоніка (Root) лежить на 5-й струні (6-та струна не грається!).',
          'Комбінуючи баре від 6-ї та 5-ї струн, ти можеш зіграти цілу пісню (напр. F → Bb → C7), майже не зміщуючи руку вздовж грифу.',
          'Кожна мажорна тональність має близнюка — паралельний мінор (Relative Minor) на 6-му ступені (або на 3 лади нижче від мажорної тоніки: C major ↔ A minor, G major ↔ E minor).',
        ],
        practiceTask: 'Відпрацюй перехід Bm (2 лад) → Cm (3 лад) → Dm (5 лад) та пісню Jamaica Farewell комбінацією баре 6-ї та 5-ї струн.',
      },
      {
        id: 'les-5-4',
        code: '5.4',
        moduleId: 'mod-5',
        title: 'Діатонічні та Гармонічні Інтервали (Major, Minor, Perfect, Dim, Aug)',
        subtitle: 'Як вимірюється відстань між нотами та як інтервали керують емоцією музики.',
        durationMin: 15,
        xpReward: 95,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 9 (p. 52–56)',
        status: 'unlocked',
        tags: ['Інтервали', 'b3 vs 3', 'b5 Тритон', 'La Bamba'],
        keyTakeaways: [
          'Ступені 1, 4, 5, 8 називаються Чистими (Perfect). Якщо знизити їх на півтону — вони стають Зменшеними (Diminished, напр. b5).',
          'Ступені 2, 3, 6, 7 у мажорній гамі є Великими (Major). Якщо знизити їх на півтону — вони стають Малими (Minor: b2, b3, b6, b7).',
          'Підвищення будь-якого мажорного або чистого інтервалу на півтону робить його Збільшеним (Augmented, напр. #5).',
        ],
        practiceTask: 'Зіграй на грифі всі інтервали від ноти C (5 струна, 3 лад) та виконай драйвові ритми La Bamba (A–D–E) і Blues in E.',
      },
    ],
  },

  // ==========================================================================
  // МОДУЛЬ 6: FINGERSTYLE, ПЕНТАТОНІКА, БЛЮЗ ТА РОК-РИФИ
  // ==========================================================================
  {
    id: 'mod-6',
    number: 6,
    tier: 'intermediate',
    tierLabel: 'Середній+ · Стилі та Соло',
    title: 'Fingerstyle, 5 Боксів Пентатоніки, Блюз та Рок-Гітара',
    subtitle: 'Пальцевий стиль та Travis Picking, всі 5 форм пентатоніки для імпровізації, 12-тактовий блюз та Power Chords.',
    sourceSummary: 'Learn & Master Guitar (Sessions 10, 11, 13, 15 — стор. 57–84)',
    estimatedWeeks: '4–5 тижнів',
    progressPercent: 0,
    badgeTitle: 'Герой Сцени',
    badgeIcon: '🎸',
    accentColor: '#EC4899',
    lessons: [
      {
        id: 'les-6-1',
        code: '6.1',
        moduleId: 'mod-6',
        title: 'Fingerstyle-гітара та техніка Merle Travis (T-1-2-3)',
        subtitle: 'Перебір пальцями правої руки, незалежний бас великим пальцем та класичні хіти.',
        durationMin: 18,
        xpReward: 110,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 10 (p. 57–62)',
        status: 'unlocked',
        tags: ['Fingerstyle', 'Travis Picking', 'House of the Rising Sun', 'Canon in D'],
        keyTakeaways: [
          'У фінгерстайлі великий палець (T) відповідає за басові струни (6, 5, 4), а пальці 1 (вказівний), 2 (середній) та 3 (безіменний) — за струни 3, 2 та 1.',
          'Три базові патерни арпеджіо: Pattern 1 (T–1–2–3), Pattern 2 (T–3–2–1) та Pattern 3 (T–2–1–3).',
          'Merle Travis Picking: великий палець тримає чіткий пульс چвертними на басових струнах (чергуючи 5–4 або 6–4), поки пальці 1 і 2 грають синкоповану мелодію.',
        ],
        practiceTask: 'Розучи арпеджіо House of the Rising Sun (Am–C–D–F) у розмірі 6/8 та першу частину Canon in D Пахельбеля.',
      },
      {
        id: 'les-6-2',
        code: '6.2',
        moduleId: 'mod-6',
        title: 'Пентатоніка — Фундамент Соло (5 Боксів по всьому грифу)',
        subtitle: 'Як з’єднати 5 форм пентатоніки мов деталі пазла і грати соло в будь-якій тональності.',
        durationMin: 20,
        xpReward: 125,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 11 (p. 63–66)',
        status: 'unlocked',
        tags: ['5 Pentatonic Forms', 'A Minor / C Major', 'Секвенції соло'],
        keyTakeaways: [
          'Пентатоніка складається з 5 нот (ступені 1, 2, 3, 5, 6 мажорної гами — без півтонових конфліктів 4 та 7 ступенів).',
          '5 форм (Forms 1–5) накладаються одна на одну вздовж усього грифу: наприклад, для A minor / C major бокси стартують з 5-го, 7-го, 9-го, 12-го та 2-го ладів.',
          'Секвенції для швидкості: Групи по 4 ноти (Pattern #1), Групи по 3 ноти (Pattern #2) та Пари струн (Pattern #3).',
        ],
        practiceTask: 'Зіграй 1-шу форму ля-мінорної пентатоніки (5–8 лади) секвенцією "по 4 ноти" та поімпровізуй під A Minor Blues.',
        tabSnippet: {
          title: 'Pentatonic Form #1 (A Minor / C Major — 5th Position)',
          lines: [
            'e|---------------------------------5-8-|',
            'B|-----------------------------5-8-----|',
            'G|-------------------------5-7---------|',
            'D|---------------------5-7-------------|',
            'A|-----------------5-7-----------------|',
            'E|-------------5-8---------------------|',
          ],
        },
      },
      {
        id: 'les-6-3',
        code: '6.3',
        moduleId: 'mod-6',
        title: 'Блюзова Гама (Blue Note b5), 12-Bar Blues та Формули Тризвуків',
        subtitle: 'Додаємо характерну блюзову ноту b5 у всі 5 боксів та вчимо формули Major/Minor/Aug/Dim тризвуків.',
        durationMin: 18,
        xpReward: 115,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 13 (p. 71–75)',
        status: 'unlocked',
        tags: ['Blues Scale', '12-Bar Blues I-IV-V', 'Тризвуки 1-3-5'],
        keyTakeaways: [
          'Блюзова гама = Мінорна пентатоніка (1, b3, 4, 5, b7) + додана знижена квінта (b5 — "Blue Note").',
          'Класичний 12-тактовий блюз будується на акордах I, IV та V ступенів (4 такти I → 2 такти IV → 2 такти I → V – IV – I – I).',
          '4 типи тризвуків (Triads): Major (1–3–5), Minor (1–b3–5), Augmented (1–3–#5), Diminished (1–b3–b5).',
        ],
        practiceTask: 'Зіграй шафл-риф Johnny’s E Blues та виконай соло мінорною пентатонікою з прохідною блюзовою нотою b5.',
      },
      {
        id: 'les-6-4',
        code: '6.4',
        moduleId: 'mod-6',
        title: 'Серце Рок-н-Ролу: Power Chords (5), Рифи та Гармонізація Гами',
        subtitle: 'Потужні квінтакорди, дабл-стопи кварт, кантрі-пікінг та формула акордів тональності (I–ii–iii–IV–V–vi–vii°).',
        durationMin: 18,
        xpReward: 120,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 15 (p. 80–84)',
        status: 'unlocked',
        tags: ['Power Chords', 'Rock Riffs', 'Harmonized Major Scale'],
        keyTakeaways: [
          'Power Chord (C5, F5, E5) містить лише Тоніку (1) та Квінту (5) (+ октаву), тому потужно звучить на перегрузі (Distortion) і пасує як до мажору, так і до мінору.',
          'Закон гармонізації мажорної гами в БУДЬ-ЯКІЙ тональності: ступені I, IV, V — завжди Мажорні; ступені ii, iii, vi — завжди Мінорні; ступінь vii° — Зменшений (напр. у C: C – Dm – Em – F – G – Am – Bdim).',
        ],
        practiceTask: 'Зіграй драйвовий трек Power Chord Rock (G5–D5–Em–C5) та визнач усі 7 акордів тональності G major.',
      },
    ],
  },

  // ==========================================================================
  // МОДУЛЬ 7: ВІРТУОЗНІ ПРИЙОМИ, ФАНК-ГРУВ ТА ПРОСУНУТІ АКОРДИ
  // ==========================================================================
  {
    id: 'mod-7',
    number: 7,
    tier: 'pro',
    tierLabel: 'Просунутий · Віртуозність',
    title: 'Соло-Артикуляція (Bends, Legato, Tapping), 16-ті Ноти та 3NPS Гами',
    subtitle: 'Модернові акорди (2, Maj7, m11), бенди, легато, теппінг, фанкове глушіння та 7 швидкісних форм гам.',
    sourceSummary: 'Learn & Master Guitar (Sessions 12, 14, 16, 17 — стор. 67–92)',
    estimatedWeeks: '5–6 тижнів',
    progressPercent: 0,
    badgeTitle: 'Віртуоз Грифу',
    badgeIcon: '🚀',
    accentColor: '#EF4444',
    lessons: [
      {
        id: 'les-7-1',
        code: '7.1',
        moduleId: 'mod-7',
        title: 'Просунуті акорди (2, Maj7, m11) та Мистецтво Заміни Акордів',
        subtitle: 'Як замінити звичайні тризвуки на фірмові студійні войсинги по всьому грифу.',
        durationMin: 16,
        xpReward: 120,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 12 (p. 67–70)',
        status: 'unlocked',
        tags: ['Chord Substitution', '2 / Maj7 / m11', 'Moveable Voicings'],
        keyTakeaways: [
          'Правило заміни Krenz для Мажору: будь-який мажорний акорд можна прикрасити, замінивши його на Two-chord (C2, F2, G2) або Major 7th (Cmaj7, Fmaj7).',
          'Правило заміни для Мінору: будь-який мінорний акорд звучить значно глибше, якщо замінити його на Minor 11th (Am11, Dm11, F#m11, Bm11).',
        ],
        practiceTask: 'Перетвори стандартну прогресію A – E – F#m – D на студійну A2 – E2 – F#m11 – D2 (вправа Krenz p. 69).',
      },
      {
        id: 'les-7-2',
        code: '7.2',
        moduleId: 'mod-7',
        title: 'Стиль у грі: Bends, Slides, Hammer-On, Pull-Off, Tapping & Harmonics',
        subtitle: 'Всі техніки живої електро- та акустичної соло-гітари, Palm Muting і джазові октави.',
        durationMin: 20,
        xpReward: 140,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 14 (p. 76–79)',
        status: 'unlocked',
        tags: ['String Bending', 'Hammer-On / Pull-Off', 'Tapping', 'Palm Muting'],
        keyTakeaways: [
          'Bends (Підтяжки): завжди підтягуй струну точно у висоту цільової ноти (на півтону або цілий тон), підтримуючи 3-й палець 1-м та 2-м пальцями.',
          'Hammer-On (H) та Pull-Off (P) дозволяють грати швидкі легатні пасажі однією лівою рукою без удару медіатора на кожну ноту.',
          'Tapping додає удар пальцем правої руки по високих ладах (напр. 10–5–8 на 1-й струні).',
        ],
        practiceTask: 'Відпрацюй легатний теппінг-патерн (H&P 5-8-10), флажолети на 12/7/5 ладах та трек Bending the Blues.',
      },
      {
        id: 'les-7-3',
        code: '7.3',
        moduleId: 'mod-7',
        title: 'Просунутий бій 16-ми нотами, Акценти та Electric Funk',
        subtitle: 'Чотири удари на кожну долю (1 e & a), зміщені акценти та фанкова ритм-гітара.',
        durationMin: 16,
        xpReward: 125,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 16 (p. 85–88)',
        status: 'unlocked',
        tags: ['16th Notes', 'Accent Strumming', 'Funk Groove'],
        keyTakeaways: [
          'Шістнадцяті ноти ділять кожну долю на 4 рівні частини (рахунок: 1 e & a 2 e & a), де рука безперервно рухається Down-Up-Down-Up вдвічі швидше.',
          'Виділення акцентів (>) на окремих 16-х частках створює фірмовий грув фанку та акустичного року.',
        ],
        practiceTask: 'Зіграй вправи на зміщення акцентів (Krenz p. 86) та фанковий риф Electric Funk (G5–F2).',
      },
      {
        id: 'les-7-4',
        code: '7.4',
        moduleId: 'mod-7',
        title: '7 Форм Гам по 3 Ноти на Струні (3NPS) та 6 Формул Септакордів',
        subtitle: 'Система 7 позицій мажорної гами через увесь гриф для швидкісних тріольних пасажів.',
        durationMin: 22,
        xpReward: 150,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 17 (p. 89–92)',
        status: 'unlocked',
        tags: ['3 Notes Per String', '7 Scale Forms', 'Seventh Chords Formulas'],
        keyTakeaways: [
          'Система 3-Notes-Per-String (3NPS) розміщує рівно по 3 ноти на кожній струні у 7 позиціях, що ідеально підходить для тріолей та швидкого легато.',
          '6 головних септакордів та їхні формули: Major 7th (1-3-5-7), Minor 7th (1-b3-5-b7), Dominant 7th (1-3-5-b7), Augmented 7th (1-3-#5-b7), Diminished 7th (1-b3-b5-bb7), Half-Diminished m7b5 (1-b3-b5-b7).',
        ],
        practiceTask: 'Пройди всі 7 форм гами F major тріолями з легато (Triplet Scale Practice) та розбери ZZ Shuffle.',
      },
    ],
  },

  // ==========================================================================
  // МОДУЛЬ 8: РІВЕНЬ ПРО — ДЖАЗ, МИСТЕЦТВО ІМПРОВІЗАЦІЇ ТА ІНВЕРСІЇ
  // ==========================================================================
  {
    id: 'mod-8',
    number: 8,
    tier: 'pro',
    tierLabel: 'Рівень ПРО · Майстерність',
    title: 'Джазова Гармонія, Chord-Tone Soloing та Повна Енциклопедія Акордів',
    subtitle: 'Гра Chord Melody, прогресія ii–V–I, соло по акордових тонах, розвиток слуху та інверсії (Slash Chords).',
    sourceSummary: 'Learn & Master Guitar (Sessions 18, 19, 20 — стор. 93–106)',
    estimatedWeeks: '6+ тижнів',
    progressPercent: 0,
    badgeTitle: 'Магістр RiffLore',
    badgeIcon: '👑',
    accentColor: '#F59E0B',
    lessons: [
      {
        id: 'les-8-1',
        code: '8.1',
        moduleId: 'mod-8',
        title: 'Джазова Гітара: Chord Melody, ii–V–I та Color Tones (9, 11, 13)',
        subtitle: 'Як одночасно грати мелодію і гармонію, будувати джазові звороти та альтерувати домінанти.',
        durationMin: 20,
        xpReward: 160,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 18 (p. 93–97)',
        status: 'unlocked',
        tags: ['Chord Melody', 'ii-V-I Progression', '9th / 13th Chords', 'Jazz Blues'],
        keyTakeaways: [
          'Chord Melody — вищий пілотаж гітариста, коли мелодія звучить на найвищій струні акорду, а решта нот підтримують гармонію знизу.',
          'Зворот ii – V – I (напр. Dm7 → G7 → Cmaj7) — основа джазової гармонії, якою можна підійти до будь-якого цільового акорду.',
          'Color Tones (9 = 2 ступінь, 11 = 4 ступінь, 13 = 6 ступінь) перетворюють прості септакорди на насичені джазові Cm9, F13, Bbmaj13, G+7.',
        ],
        practiceTask: 'Зіграй етюд Chord Melody (Cmaj7–Bmaj7–Em7–Fmaj7) та джазовий стандарт Swingin.',
      },
      {
        id: 'les-8-2',
        code: '8.2',
        moduleId: 'mod-8',
        title: 'Мистецтво Соло (Chord-Tone Soloing) та Тренування Слуху',
        subtitle: '5 законів осмисленої імпровізації, опора на ноти акорду в реальному часі та Ear Training.',
        durationMin: 20,
        xpReward: 175,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 19 (p. 98–101)',
        status: 'unlocked',
        tags: ['Chord-Tone Soloing', 'Ear Training', 'Імпровізація', 'Stevie’s Groove'],
        keyTakeaways: [
          'Секрет мелодійного соло: гама дає алфавіт, але саме Акордові Тони (Chord Tones поточного акорду в такті) є цільовими нотами фрази!',
          'Адаптуй мову під стиль: Рок — бенди й пентатоніка; Блюз — blue notes b3/b5; Джаз — арпеджіо септакордів та хроматичні підходи.',
          'Хороше соло має Мелодію, Баланс та Розвиток ідеї (не "бурмочи" гами механічно вгору-вниз).',
        ],
        practiceTask: 'Пройди вправи Call & Response на слух (Ear Training) та зіграй блюз-рок трек Stevie’s Groove.',
      },
      {
        id: 'les-8-3',
        code: '8.3',
        moduleId: 'mod-8',
        title: 'Усі Акорди, Які Тобі Потрібні: Формули, Інверсії (Slash Chords) та Дрони',
        subtitle: 'Як самостійно сконструювати будь-який акорд на грифі, читати G/B, D/F# та відкриті дрон-форми.',
        durationMin: 22,
        xpReward: 200,
        sourceBook: 'Learn & Master Guitar (S. Krenz)',
        sourceRef: 'Krenz Session 20 (p. 102–105)',
        status: 'unlocked',
        tags: ['Slash Chords / Inversions', 'Altered Chords', 'Drone Chords', 'Pro Master'],
        keyTakeaways: [
          'Інверсії (Slash Chords: G/B, D/F#, E/G#) ставлять у бас іншу ноту акорду (часто терцію), створюючи плавну крокуючу лінію баса між акордами.',
          'Alternate Bass Chords (F/G, Bb/C — акорд IV поверх баса V) дають фірмове госпел/поп/нео-соул звучання.',
          'Open E-B Drone Chords (A2 → Bsus → Cmaj7 → C#m11 → D6/9 → E5 вздовж грифу з відкритими 1 і 2 струнами) створюють неймовірний відкритий простір.',
        ],
        practiceTask: 'Зіграй прогресію з басовою лінією G → D/F# → Em → C2 → G/B та фінальні треки Friend і Funky Groove!',
      },
    ],
  },
];

export const CURRICULUM_STATS = {
  totalModules: ZERO_TO_PRO_MODULES.length,
  totalLessons: ZERO_TO_PRO_MODULES.reduce((acc, m) => acc + m.lessons.length, 0),
  totalXp: ZERO_TO_PRO_MODULES.reduce(
    (acc, m) => acc + m.lessons.reduce((sum, l) => sum + l.xpReward, 0),
    0
  ),
};
