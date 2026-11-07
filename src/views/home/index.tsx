'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Disc3,
  Flame,
  Gamepad2,
  Layers,
  Play,
  RotateCcw,
  ArrowRight,
  Guitar,
} from 'lucide-react';
import {
  LEARNING_STAGES,
  findLessonById,
  type InteractiveLesson,
} from '@/entities/course';
import { useLocaleStore, getDictionary } from '@/shared/i18n';
import { useProgressStore } from '@/shared/store/use-progress-store';
import { LessonStagePlayer } from '@/widgets/lesson-stage-player';
import { Button } from '@/shared/ui/button';

export function HomeView() {
  const { locale } = useLocaleStore();
  const dict = getDictionary(locale);
  const { completedLessons, xp, streakDays, reviewQueue } = useProgressStore();

  const [activeLessonId, setActiveLessonId] = React.useState<string | null>(null);

  const allLessons = React.useMemo(
    () => LEARNING_STAGES.flatMap((stage) => stage.lessons),
    []
  );

  const activeLesson: InteractiveLesson | undefined = React.useMemo(
    () => (activeLessonId ? findLessonById(activeLessonId) : undefined),
    [activeLessonId]
  );

  // Recommend first uncompleted lesson, or first lesson if all done
  const recommendedLesson = React.useMemo(() => {
    return (
      allLessons.find((l) => !completedLessons.includes(l.id)) ?? allLessons[0]
    );
  }, [allLessons, completedLessons]);

  // If a user launched an interactive lesson, show the focused Gitori-style Stage Player
  if (activeLesson) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <LessonStagePlayer
          key={activeLesson.id}
          lesson={activeLesson}
          onExit={() => setActiveLessonId(null)}
        />
      </div>
    );
  }

  const completedCount = completedLessons.length;
  const totalCount = allLessons.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6">
      {/* 1. App-First Studio Dashboard Header (Gitori / Fretonomy Cohesive Style) */}
      <section className="rounded-2xl border border-[#2C2A28] bg-[#181716] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#CEA15A]/30 bg-[#CEA15A]/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#CEA15A]">
              <Guitar className="h-3.5 w-3.5" />
              <span>
                {locale === 'uk'
                  ? 'Акустика & Електро · Навчання з нуля'
                  : 'Acoustic & Electric · From Zero to Mastery'}
              </span>
            </div>

            <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl">
              {dict.learn.pageTitle}
            </h1>

            <p className="mt-2.5 text-sm text-zinc-300 sm:text-base leading-relaxed">
              {dict.learn.pageSub}
            </p>
          </div>

          {/* Right Quick-Start Lesson Card */}
          {recommendedLesson && (
            <div className="flex shrink-0 flex-col justify-between rounded-xl border border-[#CEA15A]/40 bg-[#121211] p-5 lg:w-80">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#CEA15A]">
                    {completedCount === 0
                      ? locale === 'uk'
                        ? 'Почни з нуля'
                        : 'Start Here'
                      : locale === 'uk'
                        ? 'Наступний крок'
                        : 'Up Next'}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">
                    {recommendedLesson.code} · {recommendedLesson.durationMinutes}{' '}
                    {dict.learn.minutes}
                  </span>
                </div>
                <h2 className="mt-1.5 font-display text-lg font-bold text-zinc-100">
                  {recommendedLesson.title[locale]}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                  {recommendedLesson.subtitle[locale]}
                </p>
              </div>

              <Button
                variant="default"
                className="mt-4 w-full justify-between"
                onClick={() => setActiveLessonId(recommendedLesson.id)}
              >
                <span className="flex items-center gap-2">
                  <Play className="h-4 w-4 fill-current" />
                  <span>
                    {completedLessons.includes(recommendedLesson.id)
                      ? dict.learn.reviewLesson
                      : dict.learn.startLesson}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Progress & Stats Strip */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#2C2A28] pt-5 sm:grid-cols-3">
          {/* Course Progress Bar */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-400">
                {dict.learn.progressLabel}
              </span>
              <span className="font-mono font-bold text-[#CEA15A]">
                {completedCount}/{totalCount} ({progressPct}%)
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#121211]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#CEA15A] to-[#22C55E] transition-all duration-300"
                style={{ width: `${Math.max(progressPct, 4)}%` }}
              />
            </div>
          </div>

          {/* Spaced Repetition Review Status */}
          <Link
            href="/play"
            className="flex items-center justify-between rounded-xl border border-[#2C2A28] bg-[#121211] px-4 py-2.5 transition-colors hover:border-[#CEA15A]/40"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="h-4 w-4 text-[#CEA15A]" />
              <div>
                <div className="text-xs font-bold text-zinc-200">
                  {dict.header.reviewDue}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {reviewQueue.length > 0
                    ? locale === 'uk'
                      ? `${reviewQueue.length} позицій чекають на закріплення`
                      : `${reviewQueue.length} items ready for review`
                    : locale === 'uk'
                      ? 'Інтервальне повторення + 78-нотний Heatmap'
                      : 'Spaced repetition & 78-note Heatmap'}
                </div>
              </div>
            </div>
            <span className="rounded-full bg-[#9F3A23] px-2 py-0.5 font-mono text-xs font-bold text-white">
              {reviewQueue.length}
            </span>
          </Link>

          {/* Streak & XP */}
          <div className="flex items-center justify-between rounded-xl border border-[#2C2A28] bg-[#121211] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-[#CEA15A]" />
              <span className="text-xs font-semibold text-zinc-300">
                {dict.header.streak}:{' '}
                <strong className="font-mono text-[#CEA15A]">{streakDays}d</strong>
              </span>
            </div>
            <div className="font-mono text-xs font-bold text-emerald-400">
              {xp} XP
            </div>
          </div>
        </div>
      </section>

      {/* 2. Two Signature Standalone Features (Gugoski Deconstructor + Gitori Arcade Drills) */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Card A: Nikola Gugoski Riff & Solo Deconstructor */}
        <Link
          href="/deconstructor"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2C2A28] bg-[#181716] p-6 transition-all hover:border-[#22C55E]/50"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#22C55E]">
                <Disc3 className="h-3.5 w-3.5" />
                <span>VISUAL RIFF &amp; SOLO HUD</span>
              </span>
              <span className="font-mono text-xs text-zinc-400 group-hover:text-zinc-200">
                Circle of 5ths + Tab + Box →
              </span>
            </div>
            <h2 className="mt-3 font-display text-xl font-bold text-zinc-100">
              {dict.deconstructor.title}
            </h2>
            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
              {dict.deconstructor.subtitle}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
            <span className="rounded bg-[#121211] px-2 py-1 font-mono text-[10px] text-emerald-400 border border-[#2C2A28]">
              Circle of Fifths (IV → iv min)
            </span>
            <span className="rounded bg-[#121211] px-2 py-1 font-mono text-[10px] text-red-400 border border-[#2C2A28]">
              Chord Diagrams Strip
            </span>
            <span className="rounded bg-[#121211] px-2 py-1 font-mono text-[10px] text-amber-300 border border-[#2C2A28]">
              Green Scale Box + Vector Line
            </span>
          </div>
        </Link>

        {/* Card B: Gitori-Style Arcade Drills & 78-Note Heatmap */}
        <Link
          href="/play"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2C2A28] bg-[#181716] p-6 transition-all hover:border-[#CEA15A]/50"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#CEA15A]/30 bg-[#CEA15A]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#CEA15A]">
                <Gamepad2 className="h-3.5 w-3.5" />
                <span>FRETBOARD ARCADE &amp; SRS</span>
              </span>
              <span className="font-mono text-xs text-zinc-400 group-hover:text-zinc-200">
                60s Drills + Heatmap →
              </span>
            </div>
            <h2 className="mt-3 font-display text-xl font-bold text-zinc-100">
              {dict.play.title}
            </h2>
            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
              {dict.play.subtitle}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
            <span className="rounded bg-[#121211] px-2 py-1 font-mono text-[10px] text-[#CEA15A] border border-[#2C2A28]">
              Find the Note (60s)
            </span>
            <span className="rounded bg-[#121211] px-2 py-1 font-mono text-[10px] text-sky-400 border border-[#2C2A28]">
              Name the Note
            </span>
            <span className="rounded bg-[#121211] px-2 py-1 font-mono text-[10px] text-emerald-400 border border-[#2C2A28]">
              78-Note Mastery Heatmap
            </span>
          </div>
        </Link>
      </section>

      {/* 3. Structured Step-by-Step Curriculum Map (Stage 0 -> Stage 3) */}
      <section className="flex flex-col gap-8">
        {LEARNING_STAGES.map((stage) => {
          const stageDoneCount = stage.lessons.filter((l) =>
            completedLessons.includes(l.id)
          ).length;

          return (
            <div
              key={stage.id}
              className="rounded-2xl border border-[#2C2A28] bg-[#181716] p-5 sm:p-7"
            >
              {/* Stage Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#2C2A28] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#CEA15A]/15 px-2.5 py-0.5 font-mono text-xs font-bold text-[#CEA15A] border border-[#CEA15A]/30">
                      {dict.learn.stagePrefix} {stage.stageNumber} · {stage.code}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      {stageDoneCount}/{stage.lessons.length}{' '}
                      {locale === 'uk' ? 'уроків пройдено' : 'lessons completed'}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-xl font-extrabold text-zinc-100 sm:text-2xl">
                    {stage.title[locale]}
                  </h2>
                  <p className="mt-1 max-w-3xl text-xs text-zinc-400 sm:text-sm">
                    {stage.description[locale]}
                  </p>
                </div>
              </div>

              {/* Stage Lessons Grid */}
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stage.lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isRecommended = recommendedLesson?.id === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveLessonId(lesson.id);
                        }
                      }}
                      className={`group flex flex-col justify-between rounded-xl border p-5 transition-all cursor-pointer ${
                        isCompleted
                          ? 'border-emerald-500/30 bg-[#141916] hover:border-emerald-500/60'
                          : isRecommended
                            ? 'border-[#CEA15A]/60 bg-[#1D1B18] shadow-[0_0_25px_rgba(206,161,90,0.12)]'
                            : 'border-[#2C2A28] bg-[#121211] hover:border-[#CEA15A]/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-[#CEA15A]">
                            {locale === 'uk' ? 'Урок' : 'Lesson'} {lesson.code}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                              <Clock className="h-3 w-3" />
                              {lesson.durationMinutes} {dict.learn.minutes}
                            </span>
                            {isCompleted && (
                              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                                <CheckCircle2 className="h-3 w-3" />
                                {dict.learn.completed}
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="mt-2.5 font-display text-base font-bold text-zinc-100 group-hover:text-[#CEA15A] transition-colors">
                          {lesson.title[locale]}
                        </h3>

                        <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                          {lesson.subtitle[locale]}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                          <Layers className="h-3.5 w-3.5 text-[#CEA15A]" />
                          {lesson.steps.length} {dict.learn.stepsCount}
                        </span>

                        <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#CEA15A] group-hover:translate-x-0.5 transition-transform">
                          <span>
                            {isCompleted
                              ? dict.learn.reviewLesson
                              : dict.learn.startLesson}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
