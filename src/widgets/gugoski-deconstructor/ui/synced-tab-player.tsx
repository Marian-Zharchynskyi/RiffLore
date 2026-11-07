'use client';

import * as React from 'react';
import type { DeconstructorBar } from '@/entities/deconstructor-track';
import { synthEngine } from '@/shared/lib/audio/synth-engine';

interface SyncedTabPlayerProps {
  bars: DeconstructorBar[];
  activeBarIndex: number;
  onSelectBar: (idx: number) => void;
}

export function SyncedTabPlayer({
  bars,
  activeBarIndex,
  onSelectBar,
}: SyncedTabPlayerProps) {
  const topPad = 36;
  const stringGap = 17;
  const barWidth = 220;
  const leftMargin = 28;
  const svgWidth = leftMargin + bars.length * barWidth + 24;
  const svgHeight = topPad + stringGap * 5 + 48;

  const handleNoteClick = async (barIdx: number, noteName: string) => {
    onSelectBar(barIdx);
    await synthEngine.playNote(noteName, '4n');
  };

  return (
    <div className="flex-1 overflow-x-auto rounded-xl border border-white/10 bg-[#0A0A0A] p-4 shadow-inner">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full min-w-[640px] select-none"
      >
        {/* 6 Horizontal Tab String Lines */}
        {Array.from({ length: 6 }, (_, sIdx) => {
          const y = topPad + sIdx * stringGap;
          return (
            <line
              key={`tab-str-${sIdx}`}
              x1={leftMargin}
              y1={y}
              x2={leftMargin + bars.length * barWidth}
              y2={y}
              stroke="rgba(255,255,255,0.28)"
              strokeWidth={1}
            />
          );
        })}

        {/* Bars, Chords, Playhead & Fret Numbers */}
        {bars.map((bar, bIdx) => {
          const barStartX = leftMargin + bIdx * barWidth;
          const isBarActive = bIdx === activeBarIndex;
          const stepGap = barWidth / (bar.tabEvents.length + 1);

          return (
            <g key={bar.id}>
              {/* Active Bar Highlight Backdrop & Playhead Line */}
              {isBarActive && (
                <>
                  <rect
                    x={barStartX}
                    y={topPad - 24}
                    width={barWidth}
                    height={stringGap * 5 + 58}
                    fill="rgba(206, 161, 90, 0.07)"
                  />
                  <line
                    x1={barStartX + 26}
                    y1={topPad - 22}
                    x2={barStartX + 26}
                    y2={topPad + stringGap * 5 + 30}
                    stroke="#CEA15A"
                    strokeWidth={1.8}
                    strokeOpacity={0.85}
                  />
                </>
              )}

              {/* Left Barline */}
              <line
                x1={barStartX}
                y1={topPad}
                x2={barStartX}
                y2={topPad + stringGap * 5}
                stroke="rgba(255,255,255,0.75)"
                strokeWidth={1.5}
              />

              {/* Bar Number */}
              <text
                x={barStartX + 4}
                y={topPad - 6}
                className="fill-zinc-400 font-mono text-[10px]"
              >
                {bar.barNumber}
              </text>

              {/* Chord Symbol Above Bar */}
              <text
                x={barStartX + 24}
                y={topPad - 12}
                onClick={() => onSelectBar(bIdx)}
                className={`cursor-pointer font-sans text-base font-bold transition-colors ${
                  isBarActive ? 'fill-emerald-400' : 'fill-zinc-100 hover:fill-amber-300'
                }`}
              >
                {bar.chordName}
              </text>

              {/* Tab Fret Numbers + Rhythm Stems Below */}
              {bar.tabEvents.map((ev, evIdx) => {
                const x = barStartX + (evIdx + 1) * stepGap;
                const y = topPad + (ev.string - 1) * stringGap;
                const stemBottomY = topPad + stringGap * 5 + 26;

                return (
                  <g
                    key={`${bar.id}-ev-${evIdx}`}
                    onClick={() => handleNoteClick(bIdx, ev.noteName)}
                    className="cursor-pointer group"
                  >
                    {/* Small black mask behind fret number so string line doesn't cut through text */}
                    <rect
                      x={x - 9}
                      y={y - 7}
                      width={18}
                      height={14}
                      fill="#0A0A0A"
                      rx={2}
                    />
                    <text
                      x={x}
                      y={y + 4.5}
                      textAnchor="middle"
                      className={`font-sans text-[13px] font-semibold transition-colors ${
                        isBarActive
                          ? 'fill-white group-hover:fill-amber-400'
                          : 'fill-zinc-300 group-hover:fill-white'
                      }`}
                    >
                      {ev.fret}
                    </text>

                    {/* Hammer-on / Pull-off Arc if present */}
                    {ev.technique && (
                      <text
                        x={x}
                        y={topPad - 8}
                        textAnchor="middle"
                        className="fill-zinc-300 font-serif text-[10px]"
                      >
                        {ev.technique}
                      </text>
                    )}

                    {/* Rhythmic Stem Below Tab */}
                    <line
                      x1={x}
                      y1={topPad + stringGap * 5 + 8}
                      x2={x}
                      y2={stemBottomY}
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth={1.6}
                    />
                    {ev.durationLabel !== '|' && (
                      <line
                        x1={x}
                        y1={stemBottomY}
                        x2={x + 14}
                        y2={stemBottomY}
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth={ev.durationLabel === '♬' ? 4 : 2.5}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Final Right Barline */}
        <line
          x1={leftMargin + bars.length * barWidth}
          y1={topPad}
          x2={leftMargin + bars.length * barWidth}
          y2={topPad + stringGap * 5}
          stroke="rgba(255,255,255,0.75)"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}
