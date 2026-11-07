import { BookOpen, Clock, CheckCircle2, Guitar } from 'lucide-react';
import { Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui';
import { IntervalBadge } from '@/entities/music-note';
import type { TheoryModule } from '@/entities/lesson';
import { InteractiveFretboard } from '@/widgets/interactive-fretboard';

interface TheoryCurriculumViewProps {
  modules: TheoryModule[];
}

export function TheoryCurriculumView({ modules }: TheoryCurriculumViewProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <Badge variant="default">GUITAR THEORY TRACK</Badge>
          <Badge variant="studio">5 МОДУЛІВ · 15 УРОКІВ</Badge>
        </div>
        <h1 className="flex items-center gap-3 font-display text-3xl font-extrabold text-zinc-100 sm:text-4xl">
          <BookOpen className="h-8 w-8 text-amber-400" />
          <span>Інтерактивна Програма Музичної Теорії</span>
        </h1>
        <p className="max-w-3xl text-sm text-zinc-400 sm:text-base">
          Жодного зубріння сухих правил. Кожен модуль розкриває геометрію грифу через звук,
          порівняльні A/B тести та практичні завдання з реальною гітарою в руках.
        </p>
      </div>

      {/* Live Inline Lesson Preview (Module 1.1 & 2.3 Concept Demo) */}
      <section className="flex flex-col gap-4 rounded-2xl border border-amber-500/30 bg-[#131519] p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="default">ІНТЕРАКТИВНИЙ МОДУЛЬ У ДІЇ</Badge>
          <span className="font-mono text-xs text-zinc-400">
            Живий гриф прямо в тілі уроку
          </span>
        </div>
        <h2 className="font-display text-xl font-bold text-zinc-100 sm:text-2xl">
          Демонстрація: Натуральний мінор vs Блюзова гама на грифі
        </h2>
        <p className="text-sm text-zinc-300">
          Під час читання кожного уроку ти можеш прямо в тексті клікати на лади, слухати інтервали
          та бачити їхню роль у тональності:
        </p>

        <InteractiveFretboard
          initialRoot="A"
          initialScaleId="minor-pentatonic"
          maxFret={12}
          showControls={true}
        />
      </section>

      {/* All 5 Modules Detailed Breakdown */}
      <div className="flex flex-col gap-8">
        {modules.map((mod) => (
          <Card key={mod.id} className="overflow-hidden border-white/10">
            <CardHeader className="border-b border-white/10 bg-[#161920]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default">МОДУЛЬ {mod.number}</Badge>
                  <Badge variant="studio">{mod.accentTag}</Badge>
                </div>
                <span className="font-mono text-xs text-zinc-400">
                  {mod.lessons.length} інтерактивні уроки
                </span>
              </div>
              <CardTitle className="mt-2 text-2xl">{mod.title}</CardTitle>
              <CardDescription className="text-zinc-300">{mod.description}</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
              {mod.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0B0C0E] p-4 transition-all hover:border-amber-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        УРОК {lesson.code}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-xs text-zinc-500">
                        <Clock className="h-3.5 w-3.5" />
                        {lesson.durationMinutes} хв
                      </span>
                    </div>

                    <h4 className="mt-2 font-display text-base font-bold text-zinc-100">
                      {lesson.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                      {lesson.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] uppercase text-zinc-500">
                        Інтервали:
                      </span>
                      {lesson.keyIntervals.map((deg) => (
                        <IntervalBadge key={deg} degree={deg} />
                      ))}
                    </div>

                    <div className="flex items-start gap-2 rounded-md bg-[#131519] p-2.5 text-xs text-zinc-300">
                      <Guitar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                      <span>
                        <strong className="text-zinc-100">Практика:</strong> {lesson.practiceGoal}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Відкритий доступ (No-Wall)</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
