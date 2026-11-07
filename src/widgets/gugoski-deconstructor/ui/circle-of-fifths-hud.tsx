'use client';

import * as React from 'react';

const CIRCLE_MAJORS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'Ab', 'Eb', 'Bb', 'F'];
const CIRCLE_MINORS = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];

interface CircleOfFifthsHudProps {
  activeKey: string;
  activeRing: 'major' | 'minor';
  romanNumeral: string;
  romanSub?: string;
  diatonicMajors: string[];
  diatonicMinors: string[];
  onSelectChord?: (chordName: string) => void;
}

function roundCoord(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: roundCoord(cx + r * Math.cos(rad)),
    y: roundCoord(cy + r * Math.sin(rad)),
  };
}

function describeAnnularSector(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
) {
  const p1 = polarToCartesian(cx, cy, outerR, endAngle);
  const p2 = polarToCartesian(cx, cy, outerR, startAngle);
  const p3 = polarToCartesian(cx, cy, innerR, startAngle);
  const p4 = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 0 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 1 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

export function CircleOfFifthsHud({
  activeKey,
  activeRing,
  romanNumeral,
  romanSub,
  diatonicMajors,
  diatonicMinors,
  onSelectChord,
}: CircleOfFifthsHudProps) {
  const cx = 110;
  const cy = 110;
  const outerR = 102;
  const midR = 72;
  const innerR = 42;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#181716] p-3 shadow-inner">
      <svg viewBox="0 0 220 220" className="h-48 w-48 sm:h-52 sm:w-52 select-none">
        <defs>
          <radialGradient id="wood-medallion" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5A2B" />
            <stop offset="70%" stopColor="#6B4226" />
            <stop offset="100%" stopColor="#3E2723" />
          </radialGradient>
        </defs>

        {/* Background Base Circle */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="url(#wood-medallion)"
          stroke="#27272A"
          strokeWidth={2}
        />

        {CIRCLE_MAJORS.map((majKey, idx) => {
          const minKey = CIRCLE_MINORS[idx];
          const centerAngle = idx * 30;
          const startAngle = centerAngle - 15;
          const endAngle = centerAngle + 15;

          const isMajActive = activeRing === 'major' && activeKey === majKey;
          const isMinActive = activeRing === 'minor' && activeKey === minKey;

          const isMajNeighbor = diatonicMajors.includes(majKey);
          const isMinNeighbor = diatonicMinors.includes(minKey);

          const majFill = isMajActive
            ? '#16A34A'
            : isMajNeighbor
            ? 'rgba(226, 232, 240, 0.25)'
            : 'rgba(24, 23, 22, 0.35)';

          const minFill = isMinActive
            ? '#16A34A'
            : isMinNeighbor
            ? 'rgba(226, 232, 240, 0.22)'
            : 'rgba(24, 23, 22, 0.48)';

          const majLabelPos = polarToCartesian(cx, cy, (outerR + midR) / 2, centerAngle);
          const minLabelPos = polarToCartesian(cx, cy, (midR + innerR) / 2, centerAngle);

          return (
            <g key={majKey}>
              {/* Outer Ring Sector (Major) */}
              <path
                d={describeAnnularSector(cx, cy, midR, outerR, startAngle, endAngle)}
                fill={majFill}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={1}
                onClick={() => onSelectChord?.(majKey)}
                className="cursor-pointer transition-colors duration-200 hover:opacity-90"
              />
              <text
                x={roundCoord(majLabelPos.x)}
                y={roundCoord(majLabelPos.y + 4)}
                textAnchor="middle"
                className={`pointer-events-none font-display text-[12px] font-bold ${
                  isMajActive
                    ? 'fill-white'
                    : isMajNeighbor
                    ? 'fill-zinc-100'
                    : 'fill-zinc-300/80'
                }`}
              >
                {majKey}
              </text>

              {/* Inner Ring Sector (Relative Minor) */}
              <path
                d={describeAnnularSector(cx, cy, innerR, midR, startAngle, endAngle)}
                fill={minFill}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={1}
                onClick={() => onSelectChord?.(minKey)}
                className="cursor-pointer transition-colors duration-200 hover:opacity-90"
              />
              <text
                x={roundCoord(minLabelPos.x)}
                y={roundCoord(minLabelPos.y + 3.5)}
                textAnchor="middle"
                className={`pointer-events-none font-sans text-[9.5px] font-semibold ${
                  isMinActive
                    ? 'fill-white font-bold'
                    : isMinNeighbor
                    ? 'fill-zinc-100'
                    : 'fill-zinc-300/75'
                }`}
              >
                {minKey}
              </text>
            </g>
          );
        })}

        {/* Center Roman Numeral Medallion */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="#5C3A21"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={1.5}
        />
        <text
          x={cx}
          y={romanSub ? cy + 3 : cy + 8}
          textAnchor="middle"
          className="fill-zinc-100 font-serif text-2xl font-bold tracking-tight"
        >
          {romanNumeral}
        </text>
        {romanSub && (
          <text
            x={cx}
            y={cy + 17}
            textAnchor="middle"
            className="fill-zinc-300 font-mono text-[9px]"
          >
            {romanSub}
          </text>
        )}
      </svg>
    </div>
  );
}
