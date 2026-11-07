import { Compass, Sparkles } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { GUITAR_TUNINGS } from '@/shared/config/tunings';
import { InteractiveFretboard } from '@/widgets/interactive-fretboard';
import { AudioAbTest } from '@/features/audio-ab-test';

export function FretboardSandboxView() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <Badge variant="default">FRETBOARD SANDBOX</Badge>
          <Badge variant="studio">NO-WALL EXPLORER</Badge>
        </div>
        <h1 className="flex items-center gap-3 font-display text-3xl font-extrabold text-zinc-100 sm:text-4xl">
          <Compass className="h-8 w-8 text-amber-400" />
          <span>Вільна Пісочниця Гітарного Грифу</span>
        </h1>
        <p className="max-w-3xl text-sm text-zinc-400 sm:text-base">
          Досліджуй будь-яку тональність, гаму, лад або стрій. Кожна нота озвучена через{' '}
          <span className="font-mono text-amber-300">Tone.js</span> і розфарбована за системою
          семантичної синестезії інтервалів.
        </p>
      </div>

      {/* Full Interactive 15-Fret Stage */}
      <InteractiveFretboard initialRoot="E" initialScaleId="minor-pentatonic" maxFret={15} />

      {/* Reference: Guitar Tunings & Physics Guide */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
          <Sparkles className="h-4 w-4" />
          <span>Довідник Гітарних Строїв</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {GUITAR_TUNINGS.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#131519] p-4"
            >
              <div>
                <h3 className="font-display text-base font-bold text-zinc-100">{t.name}</h3>
                <p className="mt-1 font-mono text-xs text-amber-400">
                  {t.notes.join(' · ')}
                </p>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{t.description}</p>
              </div>
              <div className="mt-4 border-t border-white/5 pt-2.5 text-[11px] text-zinc-500">
                <span className="text-zinc-400 font-medium">Гурти: </span>
                {t.famousBands.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal & Harmonic A/B Lab */}
      <AudioAbTest
        heading="Лабораторія Ладів: Натуральний Мінор vs Дорійський Лад (Santana / Pink Floyd)"
        description="Послухай, як заміна малої сексти (b6) на велику сексту (6) прибирає трагізм і додає фірмовий рок-грув."
        sampleA={{
          id: 'e-aeolian-color',
          title: 'E Натуральний мінор (Мала секста b6 = C)',
          subtitle: 'Темний, драматичний хеві-метал відтінок (Iron Maiden, Black Sabbath).',
          notes: ['E2', 'B2', 'E3', 'G3', 'C4', 'B3'],
          highlightedDegree: 'b6',
          formulaLabel: '1 · b3 · 5 · b6',
        }}
        sampleB={{
          id: 'e-dorian-color',
          title: 'E Дорійський лад (Велика секста 6 = C#)',
          subtitle: 'Світлий мінор у стилі Another Brick in the Wall та Oye Como Va.',
          notes: ['E2', 'B2', 'E3', 'G3', 'C#4', 'B3'],
          highlightedDegree: '6',
          formulaLabel: '1 · b3 · 5 · 6',
        }}
      />
    </div>
  );
}
