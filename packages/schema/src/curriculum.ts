import { z } from 'zod';

import { idSchema, slugSchema, timestamps } from './primitives';

/** Three-tier curriculum from the SUMMIT business model. */
export const tierSchema = z.enum(['fundamentals', 'intermediate', 'advanced']);
export type Tier = z.infer<typeof tierSchema>;

/** Top-level topic groupings (e.g. "Budgeting", "Credit"). */
export const moduleSchema = z
  .object({
    id: idSchema,
    tier: tierSchema,
    slug: slugSchema,
    title: z.string().min(2).max(200),
    summary: z.string().min(2).max(500),
    order: z.number().int().min(0),
  })
  .merge(timestamps);
export type Module = z.infer<typeof moduleSchema>;

/**
 * Mirror of a Sanity lesson document. Held in the DB so we can join on
 * activity tables without round-tripping to Sanity on every query.
 */
export const lessonRefSchema = z
  .object({
    id: idSchema,
    sanityId: z.string().min(1),
    moduleId: idSchema,
    slug: slugSchema,
    title: z.string().min(2).max(200),
    estimatedMinutes: z.number().int().min(1).max(180),
    /** XP awarded on completion. */
    xpReward: z.number().int().min(0).max(10000),
    /** Optional game slug to play after the reading. */
    gameSlug: slugSchema.nullable(),
    publishedAt: z.string().datetime({ offset: true }).nullable(),
    order: z.number().int().min(0),
  })
  .merge(timestamps);
export type LessonRef = z.infer<typeof lessonRefSchema>;
