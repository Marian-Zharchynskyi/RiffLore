import { z } from 'zod';

export const LessonSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  code: z.string(),
  title: z.string(),
  subtitle: z.string(),
  durationMinutes: z.number(),
  keyIntervals: z.array(
    z.enum(['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'])
  ),
  practiceGoal: z.string(),
});

export const TheoryModuleSchema = z.object({
  id: z.string(),
  number: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  accentTag: z.string(),
  lessons: z.array(LessonSummarySchema),
});

export type LessonSummary = z.infer<typeof LessonSummarySchema>;
export type TheoryModule = z.infer<typeof TheoryModuleSchema>;
