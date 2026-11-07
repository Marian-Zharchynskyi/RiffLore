'use client';

import * as React from 'react';
import { synthEngine } from '@/shared/lib/audio/synth-engine';
import { formatNoteDisplay, useLocaleStore } from '@/shared/i18n';
import { Note } from '@tonaljs/tonal';

interface GugoskiFretboardStageProps {
  scaleBadgeLabel: string;
  scaleBoxFretRange: [number, number];
  scaleBoxNotes: { string: number; fret: number; label: string }[];
  activePathNodes: { string: number; fret: number; label: string }[];
  neckWood: 'maple' | 'rosewood';
}

const STANDARD_OPEN_MIDI = [64, 59, 55, 50, 45, 40]; // Strings 1 to 6
const INLAY_FRETS = new Set([3, 5, 7, 9, 12]);

export function GugoskiFretboardStage({
  scaleBadgeLabel,
  scaleBoxFretRange,
  scaleBoxNotes,
  activePathNodes,
  neckWood,
}: GugoskiFretboardStageProps) {
  const { locale, noteNaming } = useLocaleStore();

  const maxFret = 12;
  const nutWidth = 44;
  const fretWidth = 74;
  const topPadding = 32;
  const stringSpacing = 34;
  const boardHeight = stringSpacing * 5;
  const svgWidth = nutWidth + maxFret * fretWidth + 28;
  const svgHeight = topPadding + boardHeight + 38;

  const getFretCenterX = (fret: number) =>
    fret === 0 ? nutWidth / 2 : nutWidth + fret * fretWidth - fretWidth / 2;

  const getStringY = (stringNumber: number) =>
    topPadding + (stringNumber - 1) * stringSpacing;

  const playFretSound = async (stringNum: number, fret: number) => {
    const openMidi = STANDARD_OPEN_MIDI[stringNum - 1] ?? 64;
    const noteName = Note.fromMidi(openMidi + fret);
    await synthEngine.playNote(noteName, '4n');
  };

  // Bounding coordinates for the Green Scale Box Frame [minFret, maxFret]
  const [minBoxFret, maxBoxFret] = scaleBoxFretRange;
  const boxLeftX = nutWidth + (minBoxFret - 1) * fretWidth + 4;
  const boxWidth = (maxBoxFret - minBoxFret + 1) * fretWidth - 8;

  // Set of active green path coordinates for quick lookup
  const activeKeySet = new Set(
    activePathNodes.map((n) => `s${n.string}f${n.fret}`)
  );

  return (
    <div className="relative rounded-xl border border-white/10 bg-[#141413] p-4 shadow-xl">
      <div className="overflow-x-auto pb-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[860px] select-none"
        >
          <defs>
            <linearGradient id="maple-neck" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E6B97E" />
              <stop offset="50%" stopColor="#D9A566" />
              <stop offset="100%" stopColor="#C68E4E" />
            </linearGradient>
            <linearGradient id="rosewood-neck" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#261E1B" />
              <stop offset="50%" stopColor="#1C1513" />
              <stop offset="100%" stopColor="#140F0D" />
            </linearGradient>
          </defs>

          {/* Fingerboard Wood Surface (Maple like Nikola Gugoski's Strat or Rosewood) */}
          <rect
            x={nutWidth}
            y={topPadding - 14}
            width={maxFret * fretWidth}
            height={boardHeight + 28}
            rx={5}
            fill={neckWood === 'maple' ? 'url(#maple-neck)' : 'url(#rosewood-neck)'}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1.5}
          />

          {/* Nut */}
          <rect
            x={nutWidth - 6}
            y={topPadding - 14}
            width={6}
            height={boardHeight + 28}
            fill="#F5F5F4"
            rx={2}
          />

          {/* Fret Wires, Inlay Dots & Fret Numbers */}
          {Array.from({ length: maxFret }, (_, idx) => {
            const fretNum = idx + 1;
            const xPos = nutWidth + fretNum * fretWidth;
            const centerX = xPos - fretWidth / 2;
            const isInlay = INLAY_FRETS.has(fretNum);
            const dotColor = neckWood === 'maple' ? '#18181B' : 'rgba(245, 158, 11, 0.3)';

            return (
              <g key={`gugoski-fret-${fretNum}`}>
                <line
                  x1={xPos}
                  y1={topPadding - 14}
                  x2={xPos}
                  y2={topPadding + boardHeight + 14}
                  stroke={neckWood === 'maple' ? '#71717A' : '#52525B'}
                  strokeWidth={2.2}
                />

                <text
                  x={centerX}
                  y={topPadding - 20}
                  textAnchor="middle"
                  className={`font-mono text-[11px] ${
                    fretNum >= minBoxFret && fretNum <= maxBoxFret
                      ? 'fill-emerald-400 font-bold'
                      : 'fill-zinc-400'
                  }`}
                >
                  {fretNum}
                </text>

                {isInlay && fretNum !== 12 && (
                  <circle
                    cx={centerX}
                    cy={topPadding + boardHeight / 2}
                    r={6.5}
                    fill={dotColor}
                  />
                )}

                {fretNum === 12 && (
                  <>
                    <circle
                      cx={centerX}
                      cy={topPadding + stringSpacing * 1.5}
                      r={6}
                      fill={dotColor}
                    />
                    <circle
                      cx={centerX}
                      cy={topPadding + stringSpacing * 3.5}
                      r={6}
                      fill={dotColor}
                    />
                  </>
                )}
              </g>
            );
          })}

          {/* 6 Guitar Strings */}
          {Array.from({ length: 6 }, (_, sIdx) => {
            const yPos = topPadding + sIdx * stringSpacing;
            const strokeW = 1.15 + sIdx * 0.45;
            return (
              <line
                key={`gugoski-str-${sIdx}`}
                x1={nutWidth - 6}
                y1={yPos}
                x2={nutWidth + maxFret * fretWidth}
                y2={yPos}
                stroke={neckWood === 'maple' ? '#3F3F46' : '#D4D4D8'}
                strokeWidth={strokeW}
                strokeOpacity={0.85}
              />
            );
          })}

          {/* GREEN SCALE BOX FRAME (Nikola Gugoski Signature Overlay) */}
          <rect
            x={boxLeftX}
            y={topPadding - 18}
            width={boxWidth}
            height={boardHeight + 36}
            fill="rgba(34, 197, 94, 0.06)"
            stroke="#22C55E"
            strokeWidth={3.5}
            rx={4}
          />

          {/* GREEN CONNECTED VECTOR PATH BETWEEN ACTIVE TARGET NOTES */}
          {activePathNodes.map((node, idx) => {
            if (idx === 0) return null;
            const prev = activePathNodes[idx - 1];
            const x1 = getFretCenterX(prev.fret);
            const y1 = getStringY(prev.string);
            const x2 = getFretCenterX(node.fret);
            const y2 = getStringY(node.string);

            return (
              <line
                key={`vec-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#22C55E"
                strokeWidth={3.5}
                strokeLinecap="round"
              />
            );
          })}

          {/* SCALE BOX NOTES: Red Dots for Reference Scale Notes, Bright Green Dots for Active Path Notes */}
          {scaleBoxNotes.map((noteItem) => {
            const cx = getFretCenterX(noteItem.fret);
            const cy = getStringY(noteItem.string);
            const isGreenActive = activeKeySet.has(
              `s${noteItem.string}f${noteItem.fret}`
            );
            const displayLabel = formatNoteDisplay(
              noteItem.label,
              locale,
              noteNaming
            );

            return (
              <g
                key={`box-note-s${noteItem.string}-f${noteItem.fret}`}
                onClick={() => playFretSound(noteItem.string, noteItem.fret)}
                className="cursor-pointer group"
              >
                <circle cx={cx} cy={cy} r={16} fill="transparent" />

                {isGreenActive && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={16}
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth={2}
                    strokeOpacity={0.85}
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isGreenActive ? 12.5 : 11}
                  fill={isGreenActive ? '#16A34A' : '#EF4444'}
                  stroke="#FFFFFF"
                  strokeWidth={1.8}
                  className="transition-transform duration-150 group-hover:scale-110"
                />

                <text
                  x={cx}
                  y={cy + 3.5}
                  textAnchor="middle"
                  className="pointer-events-none fill-white font-sans text-[9.5px] font-bold"
                >
                  {displayLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Scale Badge & Legend Bar (Matches Red Scale Card in Screenshots 3-5) */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-3">
        <div className="inline-flex items-center gap-3 rounded-lg border-2 border-white bg-[#EF4444] px-4 py-1.5 shadow-md">
          <span className="font-display text-sm font-extrabold tracking-tight text-white">
            {scaleBadgeLabel}
          </span>
          <span className="rounded bg-black/25 px-2 py-0.5 font-mono text-xs font-semibold text-white">
            Frets {minBoxFret}–{maxBoxFret}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border-2 border-emerald-500 bg-emerald-500/20" />
            <span>Активний бокс гами</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border border-white bg-[#EF4444]" />
            <span>Ноти гами в боксі</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border border-white bg-[#16A34A]" />
            <span>Цільові ноти акорду / фрази (з’єднані лінією)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
