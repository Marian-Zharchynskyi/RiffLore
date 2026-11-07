'use client';

import { Compass, Sparkles } from 'lucide-react';
import { GUITAR_TUNINGS } from '@/shared/config/tunings';
import { InteractiveFretboard } from '@/widgets/interactive-fretboard';
import { AudioAbTest } from '@/features/audio-ab-test';
import { useLocaleStore } from '@/shared/i18n';

export function FretboardSandboxView() {
  const { locale } = useLocaleStore();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-[#2C2A28] pb-5">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#CEA15A]">
          <Compass className="h-4 w-4" />
          <span>OPEN FRETBOARD EXPLORER</span>
        </div>
        <h1 className="font-display text-2xl font-extrabold text-zinc-100 sm:text-3xl">
          {locale === 'uk'
            ? 'Вільна Пісочниця Гітарного Грифу'
            : 'Open Fretboard Sandbox Explorer'}
        </h1>
        <p className="max-w-3xl text-xs text-zinc-400 sm:text-sm">
          {locale === 'uk'
            ? 'Досліджуй будь-яку тональність, гаму, лад або гітарний стрій у реальному часі зі звуком Tone.js.'
            : 'Explore any key, scale, mode, or guitar tuning in real time with live Tone.js synthesis.'}
        </p>
      </div>

      {/* Full Interactive 15-Fret Stage */}
      <InteractiveFretboard initialRoot="E" initialScaleId="minor-pentatonic" maxFret={15} />

      {/* Reference: Guitar Tunings & Physics Guide */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#CEA15A]">
          <Sparkles className="h-4 w-4" />
          <span>
            {locale === 'uk' ? 'Довідник Гітарних Строїв' : 'Guitar Tunings Reference'}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {GUITAR_TUNINGS.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-xl border border-[#2C2A28] bg-[#181716] p-4"
            >
              <div>
                <h3 className="font-display text-base font-bold text-zinc-100">{t.name}</h3>
                <p className="mt-1 font-mono text-xs text-[#CEA15A]">
                  {t.notes.join(' · ')}
                </p>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{t.description}</p>
              </div>
              <div className="mt-4 border-t border-white/5 pt-2.5 text-[11px] text-zinc-500">
                <span className="text-zinc-400 font-medium">
                  {locale === 'uk' ? 'Гурти: ' : 'Artists: '}
                </span>
                {t.famousBands.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal & Harmonic A/B Lab */}
      <AudioAbTest
        heading={
          locale === 'uk'
            ? 'Лабораторія Ладів: Натуральний Мінор vs Дорійський Лад (Santana / Pink Floyd)'
            : 'Modal Lab: Natural Minor vs Dorian Mode (Santana / Pink Floyd)'
        }
        description={
          locale === 'uk'
            ? 'Послухай, як заміна малої сексти (b6) на велику сексту (6) прибирає трагізм і додає фірмовий рок-грув.'
            : 'Hear how raising the minor 6th (b6) to a major 6th (6) lifts the dark tragedy into a groovy rock feel.'
        }
        sampleA={{
          id: 'e-aeolian-color',
          title:
            locale === 'uk'
              ? 'E Натуральний мінор (Мала секста b6 = C)'
              : 'E Natural Minor (Minor 6th b6 = C)',
          subtitle:
            locale === 'uk'
              ? 'Темний, драматичний хеві-метал відтінок (Iron Maiden, Black Sabbath).'
              : 'Dark, dramatic heavy metal mood (Iron Maiden, Black Sabbath).',
          notes: ['E2', 'B2', 'E3', 'G3', 'C4', 'B3'],
          highlightedDegree: 'b6',
          formulaLabel: '1 · b3 · 5 · b6',
        }}
        sampleB={{
          id: 'e-dorian-color',
          title:
            locale === 'uk'
              ? 'E Дорійський лад (Велика секста 6 = C#)'
              : 'E Dorian Mode (Major 6th 6 = C#)',
          subtitle:
            locale === 'uk'
              ? 'Світлий мінор у стилі Another Brick in the Wall та Oye Como Va.'
              : 'Brighter minor groove heard in Another Brick in the Wall and Oye Como Va.',
          notes: ['E2', 'B2', 'E3', 'G3', 'C#4', 'B3'],
          highlightedDegree: '6',
          formulaLabel: '1 · b3 · 5 · 6',
        }}
      />
    </div>
  );
}
