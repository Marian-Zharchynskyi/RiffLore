'use client';

import * as React from 'react';
import {
  ArrowLeft,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { Note } from '@tonaljs/tonal';
import type { InteractiveLesson, LessonStep } from '@/entities/course';
import {
  formatNoteDisplay,
  getDictionary,
  useLocaleStore,
} from '@/shared/i18n';
import { useProgressStore } from '@/shared/store/use-progress-store';
import { synthEngine } from '@/shared/lib/audio/synth-engine';
import { Button } from '@/shared/ui/button';

interface LessonStagePlayerProps {
  lesson: InteractiveLesson;
  onExit: () => void;
}

const STANDARD_OPEN_MIDI = [64, 59, 55, 50, 45, 40]; // Strings 1 to 6
const INLAY_FRETS = new Set([3, 5, 7, 9, 12]);

export function LessonStagePlayer({ lesson, onExit }: LessonStagePlayerProps) {
  const { locale, noteNaming } = useLocaleStore();
  const dict = getDictionary(locale);
  const { completeLesson, recordFretAttempt } = useProgressStore();

  const [stepIdx, setStepIdx] = React.useState(0);
  const [stepSolved, setStepSolved] = React.useState(false);
  const [feedbackState, setFeedbackState] = React.useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedWrongId, setSelectedWrongId] = React.useState<string | null>(null);
  const [tappedCorrectCoord, setTappedCorrectCoord] = React.useState<{
    string: number;
    fret: number;
  } | null>(null);
  const [isFinishedModal, setIsFinishedModal] = React.useState(false);
  const stepStartRef = React.useRef<number>(Date.now());

  const currentStep: LessonStep = lesson.steps[stepIdx] ?? lesson.steps[0];
  const isQuizStep =
    currentStep.type === 'quiz-multiple-choice' ||
    currentStep.type === 'quiz-tap-fret';
  const canProceed = !isQuizStep || stepSolved;

  React.useEffect(() => {
    setStepSolved(false);
    setFeedbackState('idle');
    setSelectedWrongId(null);
    setTappedCorrectCoord(null);
    stepStartRef.current = Date.now();
  }, [stepIdx, lesson.id]);

  const handleNextStep = () => {
    if (stepIdx + 1 < lesson.steps.length) {
      setStepIdx((i) => i + 1);
    } else {
      completeLesson(lesson.id, lesson.reviewRewards);
      synthEngine.playChordOrInterval(['E3', 'G#3', 'B3', 'E4'], 90);
      setIsFinishedModal(true);
    }
  };

  const handleOptionSelect = async (opt: {
    id: string;
    isCorrect: boolean;
    audioNote?: string;
  }) => {
    if (opt.isCorrect) {
      setStepSolved(true);
      setFeedbackState('correct');
      await synthEngine.playNote(opt.audioNote ?? 'E4', '4n');
    } else {
      setSelectedWrongId(opt.id);
      setFeedbackState('wrong');
      await synthEngine.playNote('Bb1', '16n');
    }
  };

  const handleFretClick = async (stringNumber: number, fret: number) => {
    const openMidi = STANDARD_OPEN_MIDI[stringNumber - 1] ?? 64;
    const noteName = Note.fromMidi(openMidi + fret);

    if (currentStep.type === 'quiz-tap-fret' && currentStep.targetFretCoord) {
      const target = currentStep.targetFretCoord;
      const reactionMs = Date.now() - stepStartRef.current;
      const isMatch =
        target.string === stringNumber && target.fret === fret;

      recordFretAttempt(
        target.string,
        target.fret,
        target.note.replace(/\d+$/, ''),
        isMatch,
        reactionMs
      );

      if (isMatch) {
        setTappedCorrectCoord({ string: stringNumber, fret });
        setStepSolved(true);
        setFeedbackState('correct');
        await synthEngine.playNote(noteName, '2n');
      } else {
        setFeedbackState('wrong');
        await synthEngine.playNote(noteName, '16n');
      }
      return;
    }

    await synthEngine.playNote(noteName, '4n');
  };

  // Fretboard SVG constants
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

  if (isFinishedModal) {
    return (
      <div className="mx-auto flex min-h-[78vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <div className="w-full rounded-2xl border border-[#CEA15A]/40 bg-[#181716] p-8 shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#CEA15A]/20 text-[#CEA15A]">
            <Trophy className="h-8 w-8" />
          </div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#CEA15A]">
            {lesson.code} · {dict.learn.completed}
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-zinc-100 sm:text-3xl">
            {dict.lessonPlayer.lessonCompletedTitle}
          </h2>
          <p className="mt-2 text-sm text-zinc-300">
            {dict.lessonPlayer.lessonCompletedSub}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {lesson.reviewRewards.map((item) => (
              <span
                key={item.id}
                className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 font-mono text-xs font-semibold text-emerald-300"
              >
                + Str {item.stringNumber}, Fret {item.fret} ({item.targetNote})
              </span>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={onExit} className="bg-[#CEA15A] text-zinc-950 hover:bg-[#d8ae6a]">
              <span>{dict.lessonPlayer.backToMap}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
      {/* 1. TOP GITORI-STYLE PROGRESS BAR & HEADER */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#181716] px-4 py-3">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{dict.lessonPlayer.backToMap}</span>
        </button>

        {/* Segmented Progress Bar */}
        <div className="flex flex-1 max-w-xl items-center gap-1.5">
          {lesson.steps.map((st, idx) => {
            const done = idx < stepIdx;
            const current = idx === stepIdx;
            return (
              <div
                key={st.id}
                className={`h-2.5 flex-1 rounded-full transition-all ${
                  done
                    ? 'bg-emerald-500'
                    : current
                    ? 'bg-[#CEA15A] shadow-[0_0_10px_rgba(206,161,90,0.6)]'
                    : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>

        <span className="font-mono text-xs font-semibold text-zinc-400">
          {dict.lessonPlayer.stepOf} {stepIdx + 1} / {lesson.steps.length}
        </span>
      </div>

      {/* 2. MIDDLE INTERACTIVE STAGE */}
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#181716] p-5 shadow-xl">
        <div className="mb-3 flex w-full items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#CEA15A]">
              {lesson.code} · {lesson.title[locale]}
            </span>
            <h3 className="font-display text-lg font-bold text-zinc-100 sm:text-xl">
              {currentStep.sectionTitle[locale]}
            </h3>
          </div>
        </div>

        {currentStep.type === 'guitar-anatomy' ? (
          /* Interactive Acoustic vs Electric Guitar Comparison Stage (Stage 0.1) */
          <div className="grid w-full grid-cols-1 gap-4 py-2 md:grid-cols-2">
            {/* Acoustic Guitar Blueprint Card */}
            <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#121211] p-5">
              <div>
                <span className="rounded bg-amber-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-300">
                  ACOUSTIC GUITAR · АКУСТИКА
                </span>
                <svg viewBox="0 0 380 120" className="my-4 w-full">
                  {/* Acoustic Body Silhouette */}
                  <ellipse cx="75" cy="60" rx="55" ry="48" fill="#5C3A21" stroke="#CEA15A" strokeWidth="2" />
                  <ellipse cx="122" cy="60" rx="40" ry="36" fill="#5C3A21" stroke="#CEA15A" strokeWidth="2" />
                  {/* Soundhole */}
                  <circle cx="110" cy="60" r="18" fill="#09090B" stroke="#F59E0B" strokeWidth="2.5" />
                  {/* Bridge */}
                  <rect x="62" y="42" width="8" height="36" rx="2" fill="#1C1917" />
                  {/* Neck */}
                  <rect x="155" y="47" width="180" height="26" fill="#292524" stroke="#78716C" strokeWidth="1.5" />
                  {/* Headstock */}
                  <rect x="335" y="43" width="35" height="34" rx="4" fill="#44403C" stroke="#CEA15A" strokeWidth="1.5" />
                  {/* Strings */}
                  {[49, 53, 57, 61, 65, 69].map((y, i) => (
                    <line key={i} x1="66" y1={y} x2="335" y2={y} stroke="#E4E4E7" strokeWidth="1" />
                  ))}
                </svg>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                <li>• <strong>Резонаторний отвір (Soundhole) і порожниста дека:</strong> підсилюють звук природним шляхом.</li>
                <li>• <strong>Бридж (Підставка):</strong> передає коливання струн прямо на верхню дерев’яну деку.</li>
              </ul>
            </div>

            {/* Electric Guitar Blueprint Card */}
            <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#121211] p-5">
              <div>
                <span className="rounded bg-red-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-red-300">
                  ELECTRIC GUITAR · ЕЛЕКТРОГІТАРА
                </span>
                <svg viewBox="0 0 380 120" className="my-4 w-full">
                  {/* Solid Body Silhouette */}
                  <path
                    d="M 40 30 Q 25 60 40 90 L 125 95 Q 155 95 145 70 L 155 50 Q 165 25 125 25 Z"
                    fill="#1F1E1C"
                    stroke="#EF4444"
                    strokeWidth="2"
                  />
                  {/* Humbucker & Single-Coil Pickups */}
                  <rect x="88" y="42" width="16" height="36" rx="2" fill="#27272A" stroke="#CEA15A" strokeWidth="1.5" />
                  <rect x="118" y="42" width="14" height="36" rx="2" fill="#27272A" stroke="#CEA15A" strokeWidth="1.5" />
                  {/* Bridge */}
                  <rect x="62" y="41" width="10" height="38" rx="2" fill="#A1A1AA" />
                  {/* Neck */}
                  <rect x="150" y="47" width="185" height="26" fill="#292524" stroke="#78716C" strokeWidth="1.5" />
                  {/* Headstock */}
                  <polygon points="335,44 374,36 374,80 335,74" fill="#1F1E1C" stroke="#EF4444" strokeWidth="1.5" />
                  {/* Strings */}
                  {[49, 53, 57, 61, 65, 69].map((y, i) => (
                    <line key={i} x1="66" y1={y} x2="335" y2={y} stroke="#E4E4E7" strokeWidth="1" />
                  ))}
                </svg>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                <li>• <strong>Магнітні звукознімачі (Pickups):</strong> зчитують вібрацію сталевої струни та перетворюють її на електросигнал.</li>
                <li>• <strong>Підсилювач (Amp):</strong> формує чистий тембр (Clean) або рок-перегруз (Overdrive / Distortion).</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Gitori-Style Focused Fretboard Stage */
          <div className="w-full overflow-x-auto py-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full min-w-[840px] select-none"
            >
              {/* Fingerboard Background */}
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

              {/* Brass Nut */}
              <rect
                x={nutWidth - 6}
                y={topPadding - 14}
                width={6}
                height={boardHeight + 28}
                fill="#CEA15A"
                rx={2}
              />

              {/* Frets & Numbers */}
              {Array.from({ length: maxFret }, (_, idx) => {
                const fretNum = idx + 1;
                const xPos = nutWidth + fretNum * fretWidth;
                const centerX = xPos - fretWidth / 2;
                const isInlay = INLAY_FRETS.has(fretNum);

                return (
                  <g key={`lesson-fret-${fretNum}`}>
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
                    {fretNum === 12 && (
                      <>
                        <circle
                          cx={centerX}
                          cy={topPadding + stringSpacing * 1.5}
                          r={5.5}
                          fill="rgba(206, 161, 90, 0.22)"
                        />
                        <circle
                          cx={centerX}
                          cy={topPadding + stringSpacing * 3.5}
                          r={5.5}
                          fill="rgba(206, 161, 90, 0.22)"
                        />
                      </>
                    )}
                  </g>
                );
              })}

              {/* Open String Column Header "0" */}
              <text
                x={nutWidth / 2 - 2}
                y={topPadding - 20}
                textAnchor="middle"
                className="fill-zinc-400 font-mono text-[11px] font-bold"
              >
                0
              </text>

              {/* 6 Strings + Clickable Fret Cells */}
              {Array.from({ length: 6 }, (_, rowIdx) => {
                const stringNumber = rowIdx + 1;
                const yPos = getStringY(stringNumber);
                const strokeW = 1.15 + rowIdx * 0.45;

                return (
                  <g key={`lesson-str-${stringNumber}`}>
                    <line
                      x1={nutWidth - 6}
                      y1={yPos}
                      x2={nutWidth + maxFret * fretWidth}
                      y2={yPos}
                      stroke="#D4D4D8"
                      strokeWidth={strokeW}
                      strokeOpacity={0.75}
                    />

                    {/* Interactive click targets across all frets 0..12 */}
                    {Array.from({ length: maxFret + 1 }, (__, fret) => {
                      const cx = getFretX(fret);
                      return (
                        <circle
                          key={`hit-s${stringNumber}-f${fret}`}
                          cx={cx}
                          cy={yPos}
                          r={16}
                          fill="transparent"
                          onClick={() => handleFretClick(stringNumber, fret)}
                          className="cursor-pointer hover:fill-white/10"
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Vector Lines (Octave shapes, Triads, Interval connectors) */}
              {currentStep.vectorLines?.map((vec, idx) => (
                <line
                  key={`lvec-${idx}`}
                  x1={getFretX(vec.fromFret)}
                  y1={getStringY(vec.fromString)}
                  x2={getFretX(vec.toFret)}
                  y2={getStringY(vec.toString)}
                  stroke={vec.color ?? '#10B981'}
                  strokeWidth={3}
                  strokeDasharray="4 2"
                />
              ))}

              {/* Gitori-style Gems (GrayGem, RedGem, GreenGem, GoldGem, Question) */}
              {currentStep.gems?.map((gem, idx) => {
                const cx = getFretX(gem.fret);
                const cy = getStringY(gem.string);

                const palette = {
                  gray: { fill: '#3F3F46', stroke: '#A1A1AA' },
                  red: { fill: '#DC2626', stroke: '#FCA5A5' },
                  green: { fill: '#16A34A', stroke: '#86EFAC' },
                  gold: { fill: '#D97706', stroke: '#FDE68A' },
                  question: { fill: '#CEA15A', stroke: '#FFFFFF' },
                }[gem.variant];

                const displayLabel =
                  gem.label.length <= 2 && /^[A-G]/.test(gem.label)
                    ? formatNoteDisplay(gem.label, locale, noteNaming)
                    : gem.label;

                return (
                  <g
                    key={`gem-${idx}`}
                    onClick={() => handleFretClick(gem.string, gem.fret)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={14}
                      fill={palette.fill}
                      stroke={palette.stroke}
                      strokeWidth={2}
                    />
                    <text
                      x={cx}
                      y={gem.subLabel ? cy - 0.5 : cy + 4}
                      textAnchor="middle"
                      className="pointer-events-none fill-white font-mono text-[10px] font-bold"
                    >
                      {displayLabel}
                    </text>
                    {gem.subLabel && (
                      <text
                        x={cx}
                        y={cy + 8}
                        textAnchor="middle"
                        className="pointer-events-none fill-zinc-200 font-sans text-[7.5px]"
                      >
                        {gem.subLabel}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Green Gem when user taps the correct target fret in quiz-tap-fret */}
              {tappedCorrectCoord && (
                <g>
                  <circle
                    cx={getFretX(tappedCorrectCoord.fret)}
                    cy={getStringY(tappedCorrectCoord.string)}
                    r={15}
                    fill="#16A34A"
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                  />
                  <text
                    x={getFretX(tappedCorrectCoord.fret)}
                    y={getStringY(tappedCorrectCoord.string) + 4}
                    textAnchor="middle"
                    className="fill-white font-mono text-xs font-bold"
                  >
                    ✓
                  </text>
                </g>
              )}
            </svg>
          </div>
        )}
      </div>

      {/* 3. BOTTOM EXPLANATION, PRACTICAL EXAMPLE & INTERACTIVE QUIZ DOCK */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#181716] p-6 shadow-xl">
        {/* Rich 2-4 Sentence Explanation */}
        <p className="text-base text-zinc-100 leading-relaxed">
          {currentStep.explanation[locale]}
        </p>

        {/* Practical Musical Example Box with Audio Button */}
        {currentStep.exampleBox && (
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#CEA15A]/30 bg-[#121211] p-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-2.5 text-sm text-zinc-300">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#CEA15A]" />
              <span>{currentStep.exampleBox.text[locale]}</span>
            </div>
            {currentStep.exampleBox.audioNotes && (
              <Button
                size="sm"
                variant="studio"
                onClick={() =>
                  synthEngine.playChordOrInterval(
                    currentStep.exampleBox!.audioNotes!,
                    220
                  )
                }
                className="shrink-0 border-[#CEA15A]/40 text-[#CEA15A]"
              >
                <Volume2 className="h-4 w-4" />
                <span>{dict.lessonPlayer.playAudioHint}</span>
              </Button>
            )}
          </div>
        )}

        {/* Interactive Quiz Prompt & Answer Controls */}
        {isQuizStep && (
          <div className="rounded-xl border border-white/10 bg-[#121211] p-4">
            <p className="font-display text-base font-bold text-[#CEA15A]">
              {currentStep.quizPrompt?.[locale]}
            </p>

            {currentStep.type === 'quiz-multiple-choice' &&
              currentStep.quizOptions && (
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {currentStep.quizOptions.map((opt) => {
                    const isCorrectChosen = stepSolved && opt.isCorrect;
                    const isWrongChosen = selectedWrongId === opt.id && !opt.isCorrect;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleOptionSelect(opt)}
                        className={`rounded-lg border px-4 py-3 text-left font-sans text-sm font-semibold transition-all cursor-pointer ${
                          isCorrectChosen
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200'
                            : isWrongChosen
                            ? 'border-red-500 bg-red-500/20 text-red-200'
                            : 'border-white/10 bg-[#181716] text-zinc-200 hover:border-[#CEA15A]/60'
                        }`}
                      >
                        {opt.label[locale]}
                      </button>
                    );
                  })}
                </div>
              )}

            {feedbackState === 'correct' && (
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>{dict.lessonPlayer.correctTitle}</span>
              </div>
            )}
            {feedbackState === 'wrong' && (
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{dict.lessonPlayer.wrongTitle}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Continue CTA (Gitori Warm Gold Button) */}
        <div className="flex items-center justify-end border-t border-white/10 pt-3">
          <Button
            size="lg"
            disabled={!canProceed}
            onClick={handleNextStep}
            className="min-w-[11rem] bg-gradient-to-tl from-[#9d732f] to-[#d09a43] text-white font-bold shadow-md hover:brightness-110 disabled:opacity-40"
          >
            <span>
              {stepIdx + 1 === lesson.steps.length
                ? dict.lessonPlayer.finishLessonBtn
                : dict.lessonPlayer.continueBtn}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
