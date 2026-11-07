'use client';

import * as React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { synthEngine } from '@/shared/lib/audio/synth-engine';
import { Button } from '@/shared/ui/button';
import { IntervalBadge } from '@/entities/music-note';
import type { IntervalDegree } from '@/shared/config/intervals';

export interface AudioSampleOption {
  id: string;
  title: string;
  subtitle: string;
  notes: string[];
  highlightedDegree: IntervalDegree;
  formulaLabel: string;
}

interface AudioAbTestProps {
  heading?: string;
  description?: string;
  sampleA: AudioSampleOption;
  sampleB: AudioSampleOption;
}

export function AudioAbTest({
  heading = 'Аудіо A/B Тест: Почуй різницю в 1 клік',
  description = 'Натисни на кожну картку, щоб порівняти як зміна лише одного інтервалу трансформує настрій акорду чи рифу.',
  sampleA,
  sampleB,
}: AudioAbTestProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const handlePlay = async (sample: AudioSampleOption) => {
    setActiveId(sample.id);
    await synthEngine.playChordOrInterval(sample.notes, 75);
    setTimeout(() => {
      setActiveId((prev) => (prev === sample.id ? null : prev));
    }, 1100);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#131519] p-5 shadow-lg">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tone.js Studio Comparator</span>
          </div>
          <h4 className="mt-1 font-display text-base font-bold text-zinc-100">{heading}</h4>
          <p className="text-xs text-zinc-400">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { tag: 'КАНАЛ A', sample: sampleA },
          { tag: 'КАНАЛ B', sample: sampleB },
        ].map(({ tag, sample }) => {
          const isPlaying = activeId === sample.id;
          return (
            <div
              key={sample.id}
              className={`flex flex-col justify-between rounded-lg border p-4 transition-all ${
                isPlaying
                  ? 'border-amber-500/80 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                  : 'border-white/10 bg-[#0B0C0E]/80 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold tracking-widest text-zinc-500">
                    {tag}
                  </span>
                  <IntervalBadge degree={sample.highlightedDegree} showName />
                </div>
                <h5 className="mt-2 font-display text-base font-bold text-zinc-100">
                  {sample.title}
                </h5>
                <p className="mt-1 text-xs text-zinc-400">{sample.subtitle}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <div className="font-mono text-xs text-zinc-300">
                  <span className="text-zinc-500">Формула: </span>
                  <span className="text-amber-300">{sample.formulaLabel}</span>
                  <span className="ml-2 text-zinc-500">({sample.notes.join(' · ')})</span>
                </div>
                <Button
                  size="sm"
                  variant={isPlaying ? 'default' : 'studio'}
                  onClick={() => handlePlay(sample)}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>{isPlaying ? 'Звучить...' : 'Слухати'}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
