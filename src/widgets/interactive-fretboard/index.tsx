'use client';

import * as React from 'react';
import { Volume2, Info } from 'lucide-react';
import {
  buildFretboardMatrix,
  STUDIO_SCALES,
  type FretNoteInfo,
  type RootNote,
} from '@/shared/lib/music/fretboard-math';
import { GUITAR_TUNINGS } from '@/shared/config/tunings';
import { INTERVAL_META } from '@/shared/config/intervals';
import { synthEngine } from '@/shared/lib/audio/synth-engine';
import {
  FretboardControls,
  type FretboardLabelMode,
} from '@/features/fretboard-controls';
import { IntervalBadge } from '@/entities/music-note';

interface InteractiveFretboardProps {
  initialRoot?: RootNote;
  initialScaleId?: string;
  initialTuningId?: string;
  maxFret?: number;
  showControls?: boolean;
}

const INLAY_FRETS = new Set([3, 5, 7, 9, 12, 15]);

export function InteractiveFretboard({
  initialRoot = 'E',
  initialScaleId = 'blues-scale',
  initialTuningId = 'e-standard',
  maxFret = 15,
  showControls = true,
}: InteractiveFretboardProps) {
  const [rootNote, setRootNote] = React.useState<RootNote>(initialRoot);
  const [scaleId, setScaleId] = React.useState<string>(initialScaleId);
  const [tuningId, setTuningId] = React.useState<string>(initialTuningId);
  const [labelMode, setLabelMode] = React.useState<FretboardLabelMode>('both');
  const [lastClickedNote, setLastClickedNote] = React.useState<FretNoteInfo | null>(null);

  const activeScale = React.useMemo(
    () => STUDIO_SCALES.find((s) => s.id === scaleId) ?? STUDIO_SCALES[0],
    [scaleId]
  );

  const activeTuning = React.useMemo(
    () => GUITAR_TUNINGS.find((t) => t.id === tuningId) ?? GUITAR_TUNINGS[0],
    [tuningId]
  );

  const matrix = React.useMemo(
    () =>
      buildFretboardMatrix(
        activeTuning.notes,
        rootNote,
        activeScale.formulaDegrees,
        maxFret
      ),
    [activeTuning, rootNote, activeScale, maxFret]
  );

  const handleNoteClick = async (cell: FretNoteInfo) => {
    setLastClickedNote(cell);
    await synthEngine.playNote(cell.fullNote, '4n');
  };

  const handlePlayScalePreview = async () => {
    // Collect active notes on the 6th and 5th strings or first octave
    const previewNotes: string[] = [];
    for (let s = 5; s >= 0; s--) {
      for (const cell of matrix[s]) {
        if (cell.isInActiveScale && cell.fret <= 5 && previewNotes.length < 6) {
          previewNotes.push(cell.fullNote);
        }
      }
    }
    if (previewNotes.length > 0) {
      await synthEngine.playChordOrInterval(previewNotes, 130);
    }
  };

  // SVG coordinate constants
  const nutWidth = 56;
  const fretWidth = 68;
  const topPadding = 34;
  const bottomPadding = 38;
  const stringSpacing = 36;
  const boardHeight = stringSpacing * 5;
  const svgWidth = nutWidth + maxFret * fretWidth + 28;
  const svgHeight = topPadding + boardHeight + bottomPadding;

  return (
    <div className="flex flex-col gap-4">
      {showControls && (
        <FretboardControls
          rootNote={rootNote}
          onRootChange={setRootNote}
          scaleId={scaleId}
          onScaleChange={setScaleId}
          tuningId={tuningId}
          onTuningChange={setTuningId}
          labelMode={labelMode}
          onLabelModeChange={setLabelMode}
          onPlayRootChord={handlePlayScalePreview}
        />
      )}

      {/* Main Fretboard Stage Container */}
      <div className="rounded-xl border border-white/10 bg-[#131519] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        {/* Top Status Bar inside Fretboard Stage */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-sm font-bold text-zinc-100">
              {rootNote} — {activeScale.nameUk}
            </span>
            <span className="text-xs text-zinc-400">· {activeScale.vibe}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {activeScale.formulaDegrees.map((deg) => (
              <IntervalBadge key={deg} degree={deg} />
            ))}
          </div>
        </div>

        {/* Scrollable SVG Fretboard */}
        <div className="overflow-x-auto pb-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full min-w-[880px] select-none"
            role="region"
            aria-label="Інтерактивний гітарний гриф"
          >
            <defs>
              <linearGradient id="rosewood-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#211B18" />
                <stop offset="50%" stopColor="#1A1513" />
                <stop offset="100%" stopColor="#14100E" />
              </linearGradient>
              <linearGradient id="brass-nut" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
            </defs>

            {/* Fingerboard Wood Surface */}
            <rect
              x={nutWidth}
              y={topPadding - 14}
              width={maxFret * fretWidth}
              height={boardHeight + 28}
              rx={6}
              fill="url(#rosewood-grad)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1.5}
            />

            {/* Brass/Bone Nut at Fret 0 */}
            <rect
              x={nutWidth - 6}
              y={topPadding - 14}
              width={6}
              height={boardHeight + 28}
              fill="url(#brass-nut)"
              rx={2}
            />

            {/* Fret Wires & Fret Numbers */}
            {Array.from({ length: maxFret }, (_, idx) => {
              const fretNum = idx + 1;
              const xPos = nutWidth + fretNum * fretWidth;
              const centerX = xPos - fretWidth / 2;
              const isInlay = INLAY_FRETS.has(fretNum);

              return (
                <g key={`fret-${fretNum}`}>
                  {/* Fret Wire */}
                  <line
                    x1={xPos}
                    y1={topPadding - 14}
                    x2={xPos}
                    y2={topPadding + boardHeight + 14}
                    stroke="#52525B"
                    strokeWidth={fretNum === 12 ? 2.5 : 1.75}
                  />

                  {/* Top & Bottom Fret Number Labels */}
                  <text
                    x={centerX}
                    y={topPadding - 20}
                    textAnchor="middle"
                    className={`fill-zinc-400 font-mono text-[11px] ${
                      isInlay ? 'fill-amber-400 font-bold' : ''
                    }`}
                  >
                    {fretNum}
                  </text>

                  {/* Pearloid Fretboard Inlays */}
                  {isInlay && fretNum !== 12 && (
                    <circle
                      cx={centerX}
                      cy={topPadding + boardHeight / 2}
                      r={6}
                      fill="rgba(245, 158, 11, 0.16)"
                      stroke="rgba(245, 158, 11, 0.35)"
                      strokeWidth={1}
                    />
                  )}

                  {fretNum === 12 && (
                    <>
                      <circle
                        cx={centerX}
                        cy={topPadding + stringSpacing * 1.5}
                        r={5.5}
                        fill="rgba(245, 158, 11, 0.22)"
                        stroke="rgba(245, 158, 11, 0.45)"
                        strokeWidth={1}
                      />
                      <circle
                        cx={centerX}
                        cy={topPadding + stringSpacing * 3.5}
                        r={5.5}
                        fill="rgba(245, 158, 11, 0.22)"
                        stroke="rgba(245, 158, 11, 0.45)"
                        strokeWidth={1}
                      />
                    </>
                  )}
                </g>
              );
            })}

            {/* 6 Guitar Strings + Interactive Note Nodes */}
            {matrix.map((stringRow, rowIdx) => {
              const yPos = topPadding + rowIdx * stringSpacing;
              // Graduated string thickness from 1st string (top, thin) to 6th string (bottom, thick wound)
              const strokeWidth = 1.1 + rowIdx * 0.48;

              return (
                <g key={`string-row-${rowIdx}`}>
                  {/* String Line */}
                  <line
                    x1={nutWidth - 6}
                    y1={yPos}
                    x2={nutWidth + maxFret * fretWidth}
                    y2={yPos}
                    stroke={rowIdx >= 3 ? '#A1A1AA' : '#D4D4D8'}
                    strokeWidth={strokeWidth}
                    strokeOpacity={0.75}
                  />

                  {/* Notes on each fret (0 = open string to maxFret) */}
                  {stringRow.map((cell) => {
                    const cx =
                      cell.fret === 0
                        ? nutWidth / 2 - 4
                        : nutWidth + cell.fret * fretWidth - fretWidth / 2;

                    const isSelected =
                      lastClickedNote?.stringNumber === cell.stringNumber &&
                      lastClickedNote?.fret === cell.fret;

                    const primaryText =
                      labelMode === 'note'
                        ? cell.pitchClass
                        : labelMode === 'degree'
                        ? cell.intervalMeta.shortLabel
                        : `${cell.pitchClass}`;

                    const subText =
                      labelMode === 'both' ? cell.intervalMeta.shortLabel : null;

                    return (
                      <g
                        key={`cell-s${cell.stringNumber}-f${cell.fret}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`${cell.stringNumber} струна, ${cell.fret} лад, нота ${cell.fullNote}, інтервал ${cell.intervalMeta.nameUk}`}
                        onClick={() => handleNoteClick(cell)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleNoteClick(cell);
                          }
                        }}
                        className="cursor-pointer group"
                      >
                        {/* Invisible larger hit target */}
                        <circle cx={cx} cy={yPos} r={16} fill="transparent" />

                        {cell.isInActiveScale ? (
                          <>
                            {/* Outer pulse ring for Root note or recently clicked note */}
                            {(cell.isRoot || isSelected) && (
                              <circle
                                cx={cx}
                                cy={yPos}
                                r={isSelected ? 16.5 : 15}
                                fill="none"
                                stroke={isSelected ? '#F59E0B' : cell.intervalMeta.colorHex}
                                strokeWidth={isSelected ? 2 : 1.5}
                                strokeOpacity={0.75}
                              />
                            )}

                            {/* Active Note Circle */}
                            <circle
                              cx={cx}
                              cy={yPos}
                              r={cell.isRoot ? 13 : 11.5}
                              fill={cell.isRoot ? '#EF4444' : '#131519'}
                              stroke={cell.intervalMeta.colorHex}
                              strokeWidth={cell.isRoot ? 2.2 : 2}
                              className="transition-transform duration-150 group-hover:scale-110"
                            />

                            {/* Note Label */}
                            <text
                              x={cx}
                              y={subText ? yPos - 1 : yPos + 3.5}
                              textAnchor="middle"
                              className="fill-zinc-100 font-mono text-[10px] font-bold pointer-events-none"
                            >
                              {primaryText}
                            </text>

                            {subText && (
                              <text
                                x={cx}
                                y={yPos + 7.5}
                                textAnchor="middle"
                                className="fill-zinc-300 font-mono text-[7.5px] font-semibold opacity-90 pointer-events-none"
                              >
                                {subText}
                              </text>
                            )}
                          </>
                        ) : (
                          /* Ghost dot for non-scale chromatic notes (clickable to hear & inspect!) */
                          <circle
                            cx={cx}
                            cy={yPos}
                            r={5}
                            fill="#27272A"
                            fillOpacity={0.45}
                            stroke="rgba(255,255,255,0.12)"
                            strokeWidth={1}
                            className="transition-all duration-150 group-hover:r-[9px] group-hover:fill-zinc-700"
                          />
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Inspector Bar: Shows exact details of the clicked fret + Semantic Interval Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#0B0C0E] px-4 py-2.5">
          {lastClickedNote ? (
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-mono text-amber-400">
                <Volume2 className="h-4 w-4" />
                <strong>{lastClickedNote.fullNote}</strong>
              </span>
              <span className="text-zinc-500">|</span>
              <span className="font-mono text-zinc-300">
                {lastClickedNote.stringNumber}-та струна · Лад {lastClickedNote.fret}
              </span>
              <span className="text-zinc-500">|</span>
              <IntervalBadge degree={lastClickedNote.degree} showName />
              <span className="text-zinc-400 hidden sm:inline">
                — {lastClickedNote.intervalMeta.roleDescription}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Info className="h-4 w-4 text-amber-400" />
              <span>
                Натисни на будь-яку ноту чи лад на грифі, щоб почути її реальне звучання (Web Audio / Tone.js) та побачити роль інтервалу.
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: INTERVAL_META['1'].colorHex }}
              />
              R (Тоніка)
            </span>
            <span className="flex items-center gap-1">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: INTERVAL_META.b3.colorHex }}
              />
              b3 (Мінор)
            </span>
            <span className="flex items-center gap-1">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: INTERVAL_META['3'].colorHex }}
              />
              3 (Мажор)
            </span>
            <span className="flex items-center gap-1">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: INTERVAL_META['5'].colorHex }}
              />
              5 (Квінта)
            </span>
            <span className="flex items-center gap-1">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: INTERVAL_META.b5.colorHex }}
              />
              b5 (Тритон)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
