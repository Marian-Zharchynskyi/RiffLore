'use client';

import * as React from 'react';
import type { DeconstructorBar } from '@/entities/deconstructor-track';

interface SyncedTabPlayerProps {
  bars: DeconstructorBar[];
  activeBarIndex: number;
  activeNoteIndex: number;
  onSelectBar: (barIdx: number, noteIdx?: number) => void;
}

export function SyncedTabPlayer({
  bars,
  activeBarIndex,
  activeNoteIndex,
  onSelectBar,
}: SyncedTabPlayerProps) {
  const topPad = 38;
  const stringGap = 17;
  const barWidth = 240;
  const leftMargin = 28;
  const svgWidth = leftMargin + bars.length * barWidth + 24;
  const svgHeight = topPad + stringGap * 5 + 48;

  const stringLabels = ['e', 'B', 'G', 'D', 'A', 'E'];

  return (
    <div className="flex-1 overflow-x-auto rounded-xl border border-white/10 bg-[#0A0A0A] p-4 shadow-inner">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full min-w-[680px] select-none"
      >
        {/* 6 Horizontal Tab String Lines + Left String Names */}
        {Array.from({ length: 6 }, (_, sIdx) => {
          const y = topPad + sIdx * stringGap;
          return (
            <g key={`tab-str-${sIdx}`}>
              <text
                x={12}
                y={y + 4}
                textAnchor="middle"
                className="fill-zinc-500 font-mono text-[11px] font-bold"
              >
                {stringLabels[sIdx]}
              </text>
              <line
                x1={leftMargin}
                y1={y}
                x2={leftMargin + bars.length * barWidth}
                y2={y}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={1}
              />
            </g>
          );
        })}

        {/* Bars, Chords, Note-by-Note Playhead & Fret Numbers */}
        {bars.map((bar, bIdx) => {
          const barStartX = leftMargin + bIdx * barWidth;
          const isBarActive = bIdx === activeBarIndex;
          const eventCount = Math.max(1, bar.tabEvents.length);
          const stepGap = barWidth / (eventCount + 1);
          const safeNoteIdx = isBarActive
            ? Math.min(activeNoteIndex, eventCount - 1)
            : 0;
          const playheadX = barStartX + (safeNoteIdx + 1) * stepGap;

          return (
            <g key={bar.id}>
              {/* Active Bar Highlight Backdrop & Moving Note-by-Note Playhead Cursor */}
              {isBarActive && (
                <>
                  <rect
                    x={barStartX}
                    y={topPad - 24}
                    width={barWidth}
                    height={stringGap * 5 + 58}
                    fill="rgba(206, 161, 90, 0.06)"
                  />
                  <line
                    x1={playheadX}
                    y1={topPad - 20}
                    x2={playheadX}
                    y2={topPad + stringGap * 5 + 30}
                    stroke="#22C55E"
                    strokeWidth={2}
                    strokeOpacity={0.95}
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
                x={barStartX + 5}
                y={topPad - 6}
                className="fill-zinc-400 font-mono text-[10px]"
              >
                {bar.barNumber}
              </text>

              {/* Chord Symbol Above Bar */}
              <text
                x={barStartX + 22}
                y={topPad - 12}
                onClick={() => onSelectBar(bIdx, 0)}
                className={`cursor-pointer font-sans text-base font-bold transition-colors ${
                  isBarActive
                    ? 'fill-emerald-400'
                    : 'fill-zinc-100 hover:fill-amber-300'
                }`}
              >
                {bar.chordName}
              </text>

              {/* Tab Fret Numbers + Rhythm Stems Below */}
              {bar.tabEvents.map((ev, evIdx) => {
                const x = barStartX + (evIdx + 1) * stepGap;
                const y = topPad + (ev.string - 1) * stringGap;
                const stemBottomY = topPad + stringGap * 5 + 26;
                const isCurrentNote = isBarActive && evIdx === safeNoteIdx;

                return (
                  <g
                    key={`${bar.id}-ev-${evIdx}`}
                    onClick={() => onSelectBar(bIdx, evIdx)}
                    className="cursor-pointer group"
                  >
                    {/* Active Note Highlight Pill or Dark Mask behind Fret Number */}
                    {isCurrentNote ? (
                      <circle
                        cx={x}
                        cy={y}
                        r={10.5}
                        fill="#16A34A"
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <rect
                        x={x - 9}
                        y={y - 7}
                        width={18}
                        height={14}
                        fill="#0A0A0A"
                        rx={2}
                      />
                    )}

                    <text
                      x={x}
                      y={y + 4.5}
                      textAnchor="middle"
                      className={`font-mono text-[13px] font-bold transition-colors ${
                        isCurrentNote
                          ? 'fill-white'
                          : isBarActive
                            ? 'fill-zinc-100 group-hover:fill-amber-400'
                            : 'fill-zinc-300 group-hover:fill-white'
                      }`}
                    >
                      {ev.fret}
                    </text>

                    {/* Hammer-on / Pull-off / Slide Marker if present */}
                    {ev.technique && (
                      <text
                        x={x}
                        y={topPad - 8}
                        textAnchor="middle"
                        className="fill-amber-300 font-mono text-[10px] font-bold"
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
                      stroke={
                        isCurrentNote ? '#22C55E' : 'rgba(255,255,255,0.8)'
                      }
                      strokeWidth={isCurrentNote ? 2.2 : 1.5}
                    />
                    {ev.durationLabel !== '|' && (
                      <line
                        x1={x}
                        y1={stemBottomY}
                        x2={x + 12}
                        y2={stemBottomY}
                        stroke={
                          isCurrentNote ? '#22C55E' : 'rgba(255,255,255,0.85)'
                        }
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
