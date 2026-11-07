'use client';

import * as React from 'react';
import type { DeconstructorBar } from '@/entities/deconstructor-track';

interface ChordProgressionStripProps {
  bars: DeconstructorBar[];
  activeBarIndex: number;
  onSelectBar: (index: number) => void;
}

export function ChordProgressionStrip({
  bars,
  activeBarIndex,
  onSelectBar,
}: ChordProgressionStripProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#E5E5E3] p-4 text-zinc-900 shadow-md">
      <div className="mb-3 text-center font-display text-sm font-bold tracking-tight text-zinc-900">
        Chord Progression
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {bars.map((bar, idx) => {
          const isActive = idx === activeBarIndex;
          const diag = bar.chordDiagram;
          const baseFret = diag.baseFret;

          // SVG dimensions for vertical chord box (matches Nikola Gugoski screenshots 3-5)
          const width = 112;
          const height = 128;
          const leftPad = 24;
          const topPad = 22;
          const stringGap = 14;
          const fretGap = 19;
          const gridWidth = stringGap * 5;
          const gridHeight = fretGap * 5;

          return (
            <button
              key={bar.id}
              type="button"
              onClick={() => onSelectBar(idx)}
              className="group flex flex-col items-center focus:outline-none cursor-pointer"
            >
              {/* Chord Title Box with Red Highlight Frame when active */}
              <div
                className={`mb-1 min-w-[3.5rem] px-2.5 py-0.5 text-center font-display text-base font-extrabold transition-all ${
                  isActive
                    ? 'border-[2.5px] border-[#EF4444] bg-red-500/10 text-zinc-950 shadow-sm scale-105'
                    : 'border-[2.5px] border-transparent text-zinc-800 group-hover:border-zinc-400'
                }`}
              >
                {diag.chordName}
              </div>

              <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-28">
                {/* Base fret number on the left if > 1 */}
                {baseFret > 1 && (
                  <text
                    x={leftPad - 12}
                    y={topPad + fretGap * 0.75}
                    textAnchor="middle"
                    className="fill-zinc-900 font-serif text-sm font-bold"
                  >
                    {baseFret}
                  </text>
                )}

                {/* Top Nut (Thick Black Bar) */}
                <line
                  x1={leftPad}
                  y1={topPad}
                  x2={leftPad + gridWidth}
                  y2={topPad}
                  stroke="#09090B"
                  strokeWidth={4}
                />

                {/* 5 Fret Horizontal Lines */}
                {Array.from({ length: 5 }, (_, fIdx) => {
                  const y = topPad + (fIdx + 1) * fretGap;
                  return (
                    <line
                      key={fIdx}
                      x1={leftPad}
                      y1={y}
                      x2={leftPad + gridWidth}
                      y2={y}
                      stroke="#71717A"
                      strokeWidth={1}
                    />
                  );
                })}

                {/* 6 String Vertical Lines */}
                {Array.from({ length: 6 }, (_, sIdx) => {
                  const x = leftPad + sIdx * stringGap;
                  return (
                    <line
                      key={sIdx}
                      x1={x}
                      y1={topPad}
                      x2={x}
                      y2={topPad + gridHeight}
                      stroke="#52525B"
                      strokeWidth={1}
                    />
                  );
                })}

                {/* Muted (X) or Open (O) String Markers above Nut */}
                {diag.frets.map((fretVal, sIdx) => {
                  const x = leftPad + sIdx * stringGap;
                  if (fretVal === -1) {
                    return (
                      <text
                        key={`mute-${sIdx}`}
                        x={x}
                        y={topPad - 6}
                        textAnchor="middle"
                        className="fill-zinc-900 font-sans text-xs font-bold"
                      >
                        ✕
                      </text>
                    );
                  }
                  if (fretVal === 0) {
                    return (
                      <circle
                        key={`open-${sIdx}`}
                        cx={x}
                        cy={topPad - 9}
                        r={3.5}
                        fill="none"
                        stroke="#18181B"
                        strokeWidth={1.5}
                      />
                    );
                  }
                  return null;
                })}

                {/* Barre Bar if present */}
                {diag.barre && (
                  <rect
                    x={leftPad + (6 - diag.barre.fromString) * stringGap - 5}
                    y={
                      topPad +
                      (diag.barre.fret - baseFret + 0.5) * fretGap -
                      5
                    }
                    width={(diag.barre.fromString - diag.barre.toString) * stringGap + 10}
                    height={10}
                    rx={5}
                    fill="#09090B"
                  />
                )}

                {/* Individual Finger Dots */}
                {diag.frets.map((fretVal, sIdx) => {
                  if (fretVal <= 0) return null;
                  // Skip drawing duplicate dot if covered by barre fret
                  if (diag.barre && fretVal === diag.barre.fret) return null;

                  const relFret = fretVal - baseFret + 1;
                  const x = leftPad + sIdx * stringGap;
                  const y = topPad + (relFret - 0.5) * fretGap;

                  return (
                    <circle
                      key={`dot-${sIdx}`}
                      cx={x}
                      cy={y}
                      r={5.5}
                      fill="#09090B"
                    />
                  );
                })}
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
