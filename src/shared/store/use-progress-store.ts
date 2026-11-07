'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReviewQueueItem {
  id: string; // e.g. "s6f1" or "s5f3"
  stringNumber: number;
  fret: number;
  targetNote: string;
  addedAt: number;
  mistakesCount: number;
}

export interface FretStat {
  attempts: number;
  correct: number;
  avgReactionMs: number;
}

interface ProgressState {
  completedLessons: string[];
  xp: number;
  streakDays: number;
  reviewQueue: ReviewQueueItem[];
  fretStats: Record<string, FretStat>;
  highScores: Record<string, number>;
  completeLesson: (lessonId: string, newReviewItems?: Omit<ReviewQueueItem, 'addedAt' | 'mistakesCount'>[]) => void;
  recordFretAttempt: (
    stringNumber: number,
    fret: number,
    targetNote: string,
    isCorrect: boolean,
    reactionMs: number
  ) => void;
  clearReviewItem: (id: string) => void;
  recordHighScore: (gameId: string, score: number) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      xp: 120,
      streakDays: 1,
      reviewQueue: [
        { id: 's6f1', stringNumber: 6, fret: 1, targetNote: 'F', addedAt: 1700000000000, mistakesCount: 1 },
        { id: 's5f3', stringNumber: 5, fret: 3, targetNote: 'C', addedAt: 1700000000000, mistakesCount: 1 },
        { id: 's3f2', stringNumber: 3, fret: 2, targetNote: 'A', addedAt: 1700000000000, mistakesCount: 1 },
      ],
      fretStats: {
        s6f0: { attempts: 4, correct: 4, avgReactionMs: 950 },
        s5f0: { attempts: 3, correct: 3, avgReactionMs: 1100 },
        s6f3: { attempts: 3, correct: 3, avgReactionMs: 1250 },
        s6f5: { attempts: 5, correct: 5, avgReactionMs: 890 },
        s5f3: { attempts: 4, correct: 2, avgReactionMs: 2400 },
      },
      highScores: {
        'find-notes': 850,
        'name-notes': 720,
        'scale-degrees': 640,
      },

      completeLesson: (lessonId, newReviewItems = []) =>
        set((state) => {
          const alreadyDone = state.completedLessons.includes(lessonId);
          const existingIds = new Set(state.reviewQueue.map((r) => r.id));
          const addedQueue: ReviewQueueItem[] = [...state.reviewQueue];

          for (const item of newReviewItems) {
            if (!existingIds.has(item.id)) {
              addedQueue.push({
                ...item,
                addedAt: Date.now(),
                mistakesCount: 0,
              });
            }
          }

          return {
            completedLessons: alreadyDone
              ? state.completedLessons
              : [...state.completedLessons, lessonId],
            xp: alreadyDone ? state.xp + 25 : state.xp + 100,
            reviewQueue: addedQueue,
          };
        }),

      recordFretAttempt: (stringNumber, fret, targetNote, isCorrect, reactionMs) =>
        set((state) => {
          const key = `s${stringNumber}f${fret}`;
          const prev = state.fretStats[key] ?? {
            attempts: 0,
            correct: 0,
            avgReactionMs: reactionMs,
          };
          const attempts = prev.attempts + 1;
          const correct = prev.correct + (isCorrect ? 1 : 0);
          const avgReactionMs = Math.round(
            (prev.avgReactionMs * prev.attempts + reactionMs) / attempts
          );

          let nextQueue = [...state.reviewQueue];
          if (!isCorrect || reactionMs > 3000) {
            const existingIdx = nextQueue.findIndex((r) => r.id === key);
            if (existingIdx >= 0) {
              nextQueue[existingIdx] = {
                ...nextQueue[existingIdx],
                mistakesCount: nextQueue[existingIdx].mistakesCount + 1,
              };
            } else {
              nextQueue.push({
                id: key,
                stringNumber,
                fret,
                targetNote,
                addedAt: Date.now(),
                mistakesCount: 1,
              });
            }
          } else if (isCorrect && reactionMs < 2000) {
            nextQueue = nextQueue.filter((r) => r.id !== key);
          }

          return {
            xp: isCorrect ? state.xp + 10 : state.xp,
            fretStats: {
              ...state.fretStats,
              [key]: { attempts, correct, avgReactionMs },
            },
            reviewQueue: nextQueue,
          };
        }),

      clearReviewItem: (id) =>
        set((state) => ({
          reviewQueue: state.reviewQueue.filter((r) => r.id !== id),
          xp: state.xp + 15,
        })),

      recordHighScore: (gameId, score) =>
        set((state) => ({
          highScores: {
            ...state.highScores,
            [gameId]: Math.max(state.highScores[gameId] ?? 0, score),
          },
        })),
    }),
    {
      name: 'rifflore-user-progress-v1',
    }
  )
);
