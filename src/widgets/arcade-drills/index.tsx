'use client';

import * as React from 'react';
import {
  Flame,
  Zap,
  Target,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Note } from '@tonaljs/tonal';
import {
  formatNoteDisplay,
  getDictionary,
  useLocaleStore,
} from '@/shared/i18n';
import { useProgressStore } from '@/shared/store/use-progress-store';
import { synthEngine } from '@/shared/lib/audio/synth-engine';
import { Button } from '@/shared/ui/button';

type DrillMode = 'find-notes' | 'name-notes' | 'review-queue';

const STANDARD_OPEN_MIDI = [64, 59, 55, 50, 45, 40]; // Strings 1 to 6
const NATURAL_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const INLAY_FRETS = new Set([3, 5, 7, 9, 12]);

interface DrillQuestion {
  stringNumber: number;
  fret: number;
  pitchClass: string;
  fullNote: string;
  reviewId?: string;
}

function generateNaturalNoteQuestion(): DrillQuestion {
  const candidates: DrillQuestion[] = [];
  for (let s = 1; s <= 6; s++) {
    const openMidi = STANDARD_OPEN_MIDI[s - 1];
    for (let f = 0; f <= 12; f++) {
      const fullNote = Note.fromMidi(openMidi + f);
      const pitchClass = fullNote.replace(/\d+$/, '');
      if (NATURAL_NOTES.includes(pitchClass)) {
        candidates.push({ stringNumber: s, fret: f, pitchClass, fullNote });
      }
    }
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function ArcadeDrillsWidget() {
  const { locale, noteNaming } = useLocaleStore();
  const dict = getDictionary(locale);
  const {
    reviewQueue,
    fretStats,
    highScores,
    recordFretAttempt,
    clearReviewItem,
    recordHighScore,
  } = useProgressStore();

  const [mode, setMode] = React.useState<DrillMode>('find-notes');
  const [question, setQuestion] = React.useState<DrillQuestion>(() =>
    generateNaturalNoteQuestion()
  );
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [lastResult, setLastResult] = React.useState<'correct' | 'wrong' | null>(null);
  const questionStartRef = React.useRef<number>(Date.now());

  const nextQuestion = React.useCallback(
    (activeMode: DrillMode) => {
      questionStartRef.current = Date.now();
      setLastResult(null);

      if (activeMode === 'review-queue' && reviewQueue.length > 0) {
        const item = reviewQueue[0];
        const openMidi = STANDARD_OPEN_MIDI[item.stringNumber - 1] ?? 40;
        const fullNote = Note.fromMidi(openMidi + item.fret);
        setQuestion({
          stringNumber: item.stringNumber,
          fret: item.fret,
          pitchClass: item.targetNote,
          fullNote,
          reviewId: item.id,
        });
        return;
      }

      setQuestion(generateNaturalNoteQuestion());
    },
    [reviewQueue]
  );

  const handleModeSwitch = (nextMode: DrillMode) => {
    setMode(nextMode);
    setScore(0);
    setStreak(0);
    nextQuestion(nextMode);
  };

  const handleFretTap = async (stringNumber: number, fret: number) => {
    const openMidi = STANDARD_OPEN_MIDI[stringNumber - 1] ?? 64;
    const tappedFull = Note.fromMidi(openMidi + fret);
    const tappedPitch = tappedFull.replace(/\d+$/, '');
    const reactionMs = Date.now() - questionStartRef.current;

    await synthEngine.playNote(tappedFull, '8n');

    if (mode === 'name-notes') return;

    const isCorrect =
      stringNumber === question.stringNumber &&
      tappedPitch === question.pitchClass;

    recordFretAttempt(
      question.stringNumber,
      question.fret,
      question.pitchClass,
      isCorrect,
      reactionMs
    );

    if (isCorrect) {
      const speedBonus = Math.max(20, Math.round(150 - reactionMs / 30));
      const nextScore = score + speedBonus;
      setScore(nextScore);
      setStreak((s) => s + 1);
      setLastResult('correct');
      recordHighScore(mode, nextScore);

      if (question.reviewId) {
        clearReviewItem(question.reviewId);
      }

      setTimeout(() => nextQuestion(mode), 550);
    } else {
      setStreak(0);
      setLastResult('wrong');
    }
  };

  const handleNoteButtonPick = async (pickedPitch: string) => {
    const reactionMs = Date.now() - questionStartRef.current;
    const isCorrect = pickedPitch === question.pitchClass;

    recordFretAttempt(
      question.stringNumber,
      question.fret,
      question.pitchClass,
      isCorrect,
      reactionMs
    );

    if (isCorrect) {
      await synthEngine.playNote(question.fullNote, '4n');
      const speedBonus = Math.max(20, Math.round(150 - reactionMs / 30));
      const nextScore = score + speedBonus;
      setScore(nextScore);
      setStreak((s) => s + 1);
      setLastResult('correct');
      recordHighScore('name-notes', nextScore);
      setTimeout(() => nextQuestion(mode), 550);
    } else {
      await synthEngine.playNote('Bb1', '16n');
      setStreak(0);
      setLastResult('wrong');
    }
  };

  // Fretboard dimensions
  const maxFret = 12;
  const nutWidth = 52;
  const fretWidth = 70;
  const topPadding = 34;
  const stringSpacing = 36;
  const boardHeight = stringSpacing * 5;
  const svgWidth = nutWidth + maxFret * fretWidth + 28;
  const svgHeight = topPadding + boardHeight + 36;

  const getFretX = (fret: number) =>
    fret === 0 ? nutWidth / 2 - 2 : nutWidth + fret * fretWidth - fretWidth / 2;
  const getStringY = (stringNum: number) =>
    topPadding + (stringNum - 1) * stringSpacing;

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Top Row: Daily Spaced-Repetition Queue + Drill Mode Switcher */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Spaced Repetition Queue Card (Gitori Review Queue) */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#CEA15A]/35 bg-[#181716] p-5 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#CEA15A]">
                SPACED REPETITION
              </span>
              <span className="rounded-full bg-[#9f3a23] px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                {reviewQueue.length} due
              </span>
            </div>
            <h3 className="mt-2 font-display text-lg font-bold text-zinc-100">
              {dict.play.reviewQueueTitle}
            </h3>
            <p className="mt-1 text-xs text-zinc-400">
              {reviewQueue.length > 0
                ? reviewQueue
                    .slice(0, 5)
                    .map((r) => `Str ${r.stringNumber} · Fret ${r.fret} (${r.targetNote})`)
                    .join('  •  ')
                : dict.play.reviewEmpty}
            </p>
          </div>

          <div className="mt-4 pt-2">
            <Button
              size="sm"
              disabled={reviewQueue.length === 0}
              onClick={() => handleModeSwitch('review-queue')}
              className="w-full bg-gradient-to-tl from-[#9d732f] to-[#d09a43] text-white font-bold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>
                {dict.play.startReviewBtn} ({reviewQueue.length})
              </span>
            </Button>
          </div>
        </div>

        {/* Arcade Drill Mode Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
          {(
            [
              {
                id: 'find-notes',
                code: 'FBG-101',
                titleUk: 'Find the Notes (Пошук нот на грифі)',
                titleEn: 'Find the Notes on Fretboard',
                descUk: 'Тобі дається струна та нота — натисни потрібний лад якомога швидше.',
                descEn: 'Given a target string and note name, tap the right fret as fast as you can.',
              },
              {
                id: 'name-notes',
                code: 'FBG-103',
                titleUk: 'Name the Notes (Вгадай ноту на ладу)',
                titleEn: 'Name the Highlighted Fret Note',
                descUk: 'На грифі загоряється маркер [?] — обери правильну назву ноти знизу.',
                descEn: 'A marker lights up on the neck — pick its correct note name from the dock.',
              },
            ] as const
          ).map((game) => {
            const active = mode === game.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => handleModeSwitch(game.id)}
                className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                  active
                    ? 'border-[#CEA15A] bg-[#1F1E1C] shadow-lg'
                    : 'border-white/10 bg-[#181716] hover:border-white/25'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[#CEA15A] font-bold">{game.code}</span>
                    <span className="text-zinc-400">
                      Best: {highScores[game.id] ?? 0} pts
                    </span>
                  </div>
                  <h4 className="mt-2 font-display text-base font-bold text-zinc-100">
                    {locale === 'uk' ? game.titleUk : game.titleEn}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    {locale === 'uk' ? game.descUk : game.descEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ACTIVE DRILL STAGE */}
      <div className="rounded-2xl border border-white/10 bg-[#181716] p-6 shadow-xl">
        {/* Prompt & Live Score Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-[#CEA15A]" />
            {mode === 'name-notes' ? (
              <div className="font-display text-lg font-bold text-zinc-100 sm:text-xl">
                {dict.play.promptNameNote}{' '}
                <span className="font-mono text-[#CEA15A]">
                  (Str {question.stringNumber}, Fret {question.fret})
                </span>
              </div>
            ) : (
              <div className="font-display text-lg font-bold text-zinc-100 sm:text-xl">
                {dict.play.promptFindNote}{' '}
                <span className="ml-1 rounded-lg bg-[#DC2626] px-3 py-1 font-mono text-white shadow">
                  {formatNoteDisplay(question.pitchClass, locale, noteNaming)}
                </span>{' '}
                <span className="ml-2 font-mono text-sm text-[#CEA15A]">
                  → {locale === 'uk' ? `${question.stringNumber}-та струна` : `String ${question.stringNumber}`}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#121211] px-3 py-1.5 text-zinc-200">
              <Zap className="h-4 w-4 text-[#CEA15A]" />
              {dict.play.scoreLabel}: <strong>{score}</strong>
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#121211] px-3 py-1.5 text-zinc-200">
              <Flame className="h-4 w-4 text-orange-400" />
              {dict.play.streakLabel}: <strong>{streak}</strong>
            </span>
          </div>
        </div>

        {/* Interactive Drill Fretboard */}
        <div className="overflow-x-auto py-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full min-w-[840px] select-none"
          >
            <rect
              x={nutWidth}
              y={topPadding - 14}
              width={maxFret * fretWidth}
              height={boardHeight + 28}
              rx={6}
              fill="#1E1916"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth={1.5}
            />
            <rect
              x={nutWidth - 6}
              y={topPadding - 14}
              width={6}
              height={boardHeight + 28}
              fill="#CEA15A"
              rx={2}
            />

            {Array.from({ length: maxFret }, (_, idx) => {
              const fretNum = idx + 1;
              const xPos = nutWidth + fretNum * fretWidth;
              const centerX = xPos - fretWidth / 2;
              const isInlay = INLAY_FRETS.has(fretNum);
              return (
                <g key={`drill-fret-${fretNum}`}>
                  <line
                    x1={xPos}
                    y1={topPadding - 14}
                    x2={xPos}
                    y2={topPadding + boardHeight + 14}
                    stroke="#52525B"
                    strokeWidth={fretNum === 12 ? 2.5 : 1.7}
                  />
                  <text
                    x={centerX}
                    y={topPadding - 20}
                    textAnchor="middle"
                    className={`font-mono text-[11px] ${
                      isInlay ? 'fill-[#CEA15A] font-bold' : 'fill-zinc-500'
                    }`}
                  >
                    {fretNum}
                  </text>
                  {isInlay && fretNum !== 12 && (
                    <circle
                      cx={centerX}
                      cy={topPadding + boardHeight / 2}
                      r={6}
                      fill="rgba(206, 161, 90, 0.18)"
                    />
                  )}
                </g>
              );
            })}

            {/* Highlight Target String Row in find-notes mode */}
            {mode !== 'name-notes' && (
              <rect
                x={0}
                y={getStringY(question.stringNumber) - 14}
                width={svgWidth}
                height={28}
                fill="rgba(206, 161, 90, 0.12)"
                rx={4}
              />
            )}

            {/* Strings & Interactive Fret Targets */}
            {Array.from({ length: 6 }, (_, rowIdx) => {
              const stringNum = rowIdx + 1;
              const yPos = getStringY(stringNum);
              const isTargetStr = stringNum === question.stringNumber;

              return (
                <g key={`drill-str-${stringNum}`}>
                  <line
                    x1={nutWidth - 6}
                    y1={yPos}
                    x2={nutWidth + maxFret * fretWidth}
                    y2={yPos}
                    stroke={isTargetStr ? '#CEA15A' : '#D4D4D8'}
                    strokeWidth={1.15 + rowIdx * 0.45}
                    strokeOpacity={isTargetStr ? 1 : 0.65}
                  />

                  {Array.from({ length: maxFret + 1 }, (__, fret) => {
                    const cx = getFretX(fret);
                    const isQuestionSpot =
                      stringNum === question.stringNumber &&
                      fret === question.fret;

                    return (
                      <g
                        key={`drill-cell-s${stringNum}-f${fret}`}
                        onClick={() => handleFretTap(stringNum, fret)}
                        className="cursor-pointer group"
                      >
                        <circle
                          cx={cx}
                          cy={yPos}
                          r={16}
                          fill="transparent"
                          className="group-hover:fill-white/10"
                        />

                        {mode === 'name-notes' && isQuestionSpot && (
                          <>
                            <circle
                              cx={cx}
                              cy={yPos}
                              r={14}
                              fill={lastResult === 'correct' ? '#16A34A' : '#DC2626'}
                              stroke="#FFFFFF"
                              strokeWidth={2}
                            />
                            <text
                              x={cx}
                              y={yPos + 4}
                              textAnchor="middle"
                              className="fill-white font-mono text-xs font-bold"
                            >
                              {lastResult === 'correct' ? question.pitchClass : '?'}
                            </text>
                          </>
                        )}

                        {mode !== 'name-notes' &&
                          lastResult === 'correct' &&
                          isQuestionSpot && (
                            <>
                              <circle
                                cx={cx}
                                cy={yPos}
                                r={14}
                                fill="#16A34A"
                                stroke="#FFFFFF"
                                strokeWidth={2}
                              />
                              <text
                                x={cx}
                                y={yPos + 4}
                                textAnchor="middle"
                                className="fill-white font-mono text-xs font-bold"
                              >
                                {question.pitchClass}
                              </text>
                            </>
                          )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Answer Buttons for "Name the Notes" Mode */}
        {mode === 'name-notes' && (
          <div className="mt-4 flex flex-wrap justify-center gap-2 border-t border-white/10 pt-4">
            {NATURAL_NOTES.map((note) => (
              <button
                key={note}
                type="button"
                onClick={() => handleNoteButtonPick(note)}
                className="min-w-[4.5rem] rounded-xl border border-white/15 bg-[#121211] px-4 py-2.5 font-mono text-sm font-bold text-zinc-100 hover:border-[#CEA15A] hover:bg-[#CEA15A]/15 cursor-pointer"
              >
                {formatNoteDisplay(note, locale, noteNaming)}
              </button>
            ))}
          </div>
        )}

        {lastResult === 'correct' && (
          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>{dict.lessonPlayer.correctTitle}</span>
          </div>
        )}
      </div>

      {/* 3. FRETONOMY-STYLE 78-NOTE FRETBOARD MASTERY HEATMAP */}
      <div className="rounded-2xl border border-white/10 bg-[#181716] p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-base font-bold text-zinc-100">
            {dict.play.heatmapTitle}
          </h3>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-zinc-800 border border-white/10" />
              {dict.play.heatmapLegendUntested}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-500/50" />
              {dict.play.heatmapLegendLearning}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-500" />
              {dict.play.heatmapLegendMastered}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[680px] space-y-1.5">
            {Array.from({ length: 6 }, (_, sIdx) => {
              const stringNum = sIdx + 1;
              return (
                <div key={`hm-s${stringNum}`} className="grid grid-cols-14 gap-1.5 items-center">
                  <span className="font-mono text-[11px] text-zinc-500">
                    Str {stringNum}
                  </span>
                  {Array.from({ length: 13 }, (__, fret) => {
                    const key = `s${stringNum}f${fret}`;
                    const stat = fretStats[key];
                    const openMidi = STANDARD_OPEN_MIDI[stringNum - 1];
                    const pitch = Note.fromMidi(openMidi + fret).replace(/\d+$/, '');

                    let colorClass = 'bg-[#121211] text-zinc-500 border-white/5';
                    if (stat && stat.attempts > 0) {
                      const ratio = stat.correct / stat.attempts;
                      if (ratio >= 0.8 && stat.avgReactionMs <= 1600) {
                        colorClass = 'bg-emerald-600/80 text-white border-emerald-400/50 font-bold';
                      } else {
                        colorClass = 'bg-amber-500/30 text-amber-200 border-amber-500/40';
                      }
                    }

                    return (
                      <div
                        key={key}
                        title={
                          stat
                            ? `${pitch} (Fret ${fret}): ${stat.correct}/${stat.attempts}, avg ${stat.avgReactionMs}ms`
                            : `${pitch} (Fret ${fret})`
                        }
                        className={`flex h-7 items-center justify-center rounded border font-mono text-[10px] ${colorClass}`}
                      >
                        {pitch}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
