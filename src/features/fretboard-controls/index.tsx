'use client';

import * as React from 'react';
import { Sliders, Volume2 } from 'lucide-react';
import {
  ROOT_NOTES,
  STUDIO_SCALES,
  type RootNote,
} from '@/shared/lib/music/fretboard-math';
import { GUITAR_TUNINGS } from '@/shared/config/tunings';
import { Button } from '@/shared/ui/button';

export type FretboardLabelMode = 'note' | 'degree' | 'both';

interface FretboardControlsProps {
  rootNote: RootNote;
  onRootChange: (root: RootNote) => void;
  scaleId: string;
  onScaleChange: (scaleId: string) => void;
  tuningId: string;
  onTuningChange: (tuningId: string) => void;
  labelMode: FretboardLabelMode;
  onLabelModeChange: (mode: FretboardLabelMode) => void;
  onPlayRootChord?: () => void;
}

export function FretboardControls({
  rootNote,
  onRootChange,
  scaleId,
  onScaleChange,
  tuningId,
  onTuningChange,
  labelMode,
  onLabelModeChange,
  onPlayRootChord,
}: FretboardControlsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#131519] p-4 shadow-lg">
      {/* Row 1: Root Note Selector (Boutique Amp Footswitch Strip) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-amber-400" />
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            Тоніка (Root Key):
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ROOT_NOTES.map((note) => {
            const active = note === rootNote;
            return (
              <button
                key={note}
                type="button"
                onClick={() => onRootChange(note)}
                className={`h-8 min-w-[2.25rem] rounded-md px-2 font-mono text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-red-600 text-white shadow-[0_0_14px_rgba(239,68,68,0.5)] ring-1 ring-amber-400/60'
                    : 'bg-[#0B0C0E] text-zinc-400 border border-white/10 hover:border-white/25 hover:text-zinc-100'
                }`}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Scale / Mode, Guitar Tuning, and Display Mode */}
      <div className="grid grid-cols-1 gap-3 border-t border-white/10 pt-3 md:grid-cols-12">
        {/* Scale / Mode selector */}
        <div className="flex flex-col gap-1 md:col-span-5">
          <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            Гама / Лад / Акорд
          </label>
          <select
            value={scaleId}
            onChange={(e) => onScaleChange(e.target.value)}
            className="h-9 rounded-md border border-white/15 bg-[#0B0C0E] px-3 font-sans text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
          >
            {STUDIO_SCALES.map((scale) => (
              <option key={scale.id} value={scale.id} className="bg-[#0B0C0E] text-zinc-100">
                {scale.nameUk} ({scale.formulaDegrees.join(' · ')})
              </option>
            ))}
          </select>
        </div>

        {/* Guitar Tuning selector */}
        <div className="flex flex-col gap-1 md:col-span-4">
          <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            Гітарний стрій (Tuning)
          </label>
          <select
            value={tuningId}
            onChange={(e) => onTuningChange(e.target.value)}
            className="h-9 rounded-md border border-white/15 bg-[#0B0C0E] px-3 font-mono text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
          >
            {GUITAR_TUNINGS.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#0B0C0E] text-zinc-100">
                {t.name} [{t.notes.map((n) => n.replace(/\d/, '')).join(' ')}]
              </option>
            ))}
          </select>
        </div>

        {/* Label mode toggle + Audition button */}
        <div className="flex flex-col justify-end gap-1 md:col-span-3">
          <label className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            Маркування ладів
          </label>
          <div className="flex items-center gap-1.5">
            <div className="grid flex-1 grid-cols-3 rounded-md border border-white/10 bg-[#0B0C0E] p-0.5">
              {(
                [
                  { id: 'note', label: 'Ноти' },
                  { id: 'degree', label: 'Ступені' },
                  { id: 'both', label: 'Обидва' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onLabelModeChange(item.id)}
                  className={`rounded py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                    labelMode === item.id
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {onPlayRootChord && (
              <Button
                size="sm"
                variant="studio"
                onClick={onPlayRootChord}
                title="Прослухати опорний акорд тональності"
              >
                <Volume2 className="h-3.5 w-3.5 text-amber-400" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
