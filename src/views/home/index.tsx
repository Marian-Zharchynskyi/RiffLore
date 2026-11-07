import Link from 'next/link';
import {
  Flame,
  Compass,
  BookOpen,
  Music,
  Clock,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui';
import { INTERVAL_META, type IntervalDegree } from '@/shared/config/intervals';
import { IntervalBadge } from '@/entities/music-note';
import type { TheoryModule } from '@/entities/lesson';
import type { RiffBreakdown } from '@/entities/riff';
import { AudioAbTest } from '@/features/audio-ab-test';
import { RiffAuditionButton } from '@/features/riff-audition';
import { InteractiveFretboard } from '@/widgets/interactive-fretboard';

interface HomeViewProps {
  modules: TheoryModule[];
  riffs: RiffBreakdown[];
}

const FEATURED_INTERVALS: IntervalDegree[] = ['1', 'b2', 'b3', '3', '4', 'b5', '5', '6', 'b7'];

export function HomeView({ modules, riffs }: HomeViewProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6">
      {/* 1. Hero Studio Banner (Dual-Mode Philosophy) */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#161920] via-[#111318] to-[#0B0C0E] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">DUAL-MODE STUDIO</Badge>
            <Badge variant="studio">NO-WALL OPEN ACCESS</Badge>
            <Badge variant="crimson">TUBE AMP &amp; BOUTIQUE DESIGN</Badge>
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-5xl lg:leading-[1.12]">
            Звільнися від «табозалежності».{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-red-500 bg-clip-text text-transparent">
              Зрозумій, як працює рок-музика.
            </span>
          </h1>

          <p className="text-base text-zinc-300 sm:text-lg leading-relaxed">
            <strong>RiffLore</strong> поєднує живий інтерактивний гриф зі звуковим синтезом{' '}
            <span className="font-mono text-amber-300">Tone.js</span>, глибоку теорію без нудної
            академічної води та розбір культових рифів. Усі інструменти відкриті з першої секунди.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild size="lg" variant="default">
              <Link href="/theory">
                <BookOpen className="h-4 w-4" />
                <span>Почати Програму Теорії (5 Модулів)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="studio">
              <Link href="/sandbox">
                <Compass className="h-4 w-4 text-amber-400" />
                <span>Відкрити Fretboard Sandbox</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Live Interactive Fretboard Stage */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
              <Flame className="h-4 w-4" />
              <span>Жива консоль грифу · Web Audio + Tonal.js</span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
              Інтерактивний Гриф (Fretboard Stage)
            </h2>
            <p className="text-sm text-zinc-400">
              Клікай по ладах щоб почути ноти, перемикай тоніку, гами та гітарні строї у реальному часі.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/sandbox">
              <span>Повноекранний режим Пісочниці</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <InteractiveFretboard initialRoot="E" initialScaleId="blues-scale" maxFret={15} />
      </section>

      {/* 3. Interactive A/B Sound Comparison Demo */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AudioAbTest
          heading="Урок 2.2 Прев’ю: Світло Мажору vs Холод Мінору"
          description="Різниця між мажорним і мінорним акордом — це зрушення лише однієї ноти (терції) на 1 лад."
          sampleA={{
            id: 'a-major-triad',
            title: 'A Major (Мажорний тризвук)',
            subtitle: 'Велика терція C# (4 півтони від A) створює яскравий, урочистий звук.',
            notes: ['A2', 'E3', 'A3', 'C#4', 'E4'],
            highlightedDegree: '3',
            formulaLabel: '1 · 3 · 5',
          }}
          sampleB={{
            id: 'a-minor-triad',
            title: 'A Minor (Мінорний тризвук)',
            subtitle: 'Мала терція C (3 півтони від A) миттєво додає меланхолії та глибини.',
            notes: ['A2', 'E3', 'A3', 'C4', 'E4'],
            highlightedDegree: 'b3',
            formulaLabel: '1 · b3 · 5',
          }}
        />

        <AudioAbTest
          heading="Урок 2.3 Прев’ю: Чиста Квінта vs Тритон (Black Sabbath)"
          description="Як зменшення квінти на півтону перетворює стабільний рок-акорд на зловісний саунд хеві-металу."
          sampleA={{
            id: 'e5-power-chord',
            title: 'E5 Power Chord (Чиста квінта)',
            subtitle: 'Консонантна опора рок-гітари, що звучить монолітно на будь-якому перегрузі.',
            notes: ['E2', 'B2', 'E3'],
            highlightedDegree: '5',
            formulaLabel: '1 · 5',
          }}
          sampleB={{
            id: 'e-tritone',
            title: 'Тритон E – Bb (The Devil’s Interval)',
            subtitle: 'Максимальна акустична напруга (6 півтонів), що вимагає розв’язання.',
            notes: ['E2', 'Bb2', 'E3'],
            highlightedDegree: 'b5',
            formulaLabel: '1 · b5',
          }}
        />
      </section>

      {/* 4. Semantic Interval Synesthesia System (Design System Showcase) */}
      <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#131519] p-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
            <Layers className="h-4 w-4" />
            <span>Фірмова фішка RiffLore · Семантична синестезія інтервалів</span>
          </div>
          <h2 className="mt-1 font-display text-xl font-bold text-zinc-100 sm:text-2xl">
            Колірний код ступенів по всій платформі
          </h2>
          <p className="text-sm text-zinc-400">
            Кожен інтервал зберігає свій незмінний колір на грифі, у формулах акордів та в аналізі рифів.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_INTERVALS.map((deg) => {
            const meta = INTERVAL_META[deg];
            return (
              <div
                key={deg}
                className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#0B0C0E] p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <IntervalBadge degree={deg} showName />
                  <span className="font-mono text-[11px] text-zinc-500">
                    {meta.semitones} півтон(ів)
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  {meta.roleDescription}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Song & Riff Theory Deconstructor Preview */}
      <section className="flex flex-col gap-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
            <Music className="h-4 w-4" />
            <span>Song Theory Deconstructor</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
            Розбір культових рифів через призму теорії
          </h2>
          <p className="text-sm text-zinc-400">
            Не просто «затисни 5-й лад», а детальне пояснення, які інтервали роблять кожен риф безсмертним.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {riffs.map((riff) => (
            <Card key={riff.id} className="flex flex-col justify-between hover:border-amber-500/40">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="studio">{riff.tuning}</Badge>
                  <span className="font-mono text-xs text-zinc-400">{riff.bpm} BPM</span>
                </div>
                <CardTitle className="mt-2 text-xl">{riff.title}</CardTitle>
                <CardDescription className="font-mono text-xs text-amber-400">
                  {riff.artist} ({riff.year}) · {riff.scaleName}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <p className="text-xs text-zinc-300 leading-relaxed">{riff.theoryInsight}</p>

                <div className="flex flex-wrap gap-1.5">
                  {riff.signatureIntervals.map((deg) => (
                    <IntervalBadge key={deg} degree={deg} />
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-mono text-[11px] text-zinc-400">
                    Ноти: {riff.previewNotes.slice(0, 5).join(' → ')}
                  </span>
                  <RiffAuditionButton notes={riff.previewNotes} label="Слухати" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. Guitar Theory Track (5 Modules Roadmap) */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
              <BookOpen className="h-4 w-4" />
              <span>Guitar Theory Track · 5 Модулів · 15 Інтерактивних Уроків</span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
              Фундаментальна програма вивчення теорії
            </h2>
          </div>
          <Button asChild variant="default" size="sm">
            <Link href="/theory">
              <span>Переглянути всі уроки</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Card key={mod.id} className="flex flex-col justify-between hover:border-white/25">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="default">Модуль {mod.number}</Badge>
                  <Badge variant="outline">{mod.accentTag}</Badge>
                </div>
                <CardTitle className="mt-2">{mod.title}</CardTitle>
                <CardDescription>{mod.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-2.5">
                {mod.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-lg border border-white/5 bg-[#0B0C0E] p-3 transition-colors hover:border-amber-500/30"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-amber-400">
                        Урок {lesson.code}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {lesson.durationMinutes} хв
                      </span>
                    </div>
                    <p className="mt-1 font-display text-sm font-semibold text-zinc-100">
                      {lesson.title}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lesson.keyIntervals.map((deg) => (
                        <IntervalBadge key={deg} degree={deg} />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
