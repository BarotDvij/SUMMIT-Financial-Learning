import { z } from 'zod';

import { idSchema, slugSchema, timestamps } from './primitives';
import { tierSchema } from './curriculum';

export const gameSchema = z
  .object({
    id: idSchema,
    slug: slugSchema,
    title: z.string().min(2).max(120),
    summary: z.string().min(2).max(500),
    tier: tierSchema,
    iconKey: z.string().min(1).max(64),
    /** URL of the embedded game bundle, relative to the public origin. */
    bundleUrl: z.string().min(1),
    /** Minimum supported version of the game-sdk protocol. */
    sdkVersion: z.number().int().min(1).default(1),
    /** Capabilities the game advertises (e.g. ["score", "xp"]). */
    capabilities: z.array(z.string()),
    estimatedMinutes: z.number().int().min(1).max(60),
    maxXpPerSession: z.number().int().min(0).max(10000),
    enabled: z.boolean().default(true),
  })
  .merge(timestamps);
export type Game = z.infer<typeof gameSchema>;

export const gameSessionSchema = z
  .object({
    id: idSchema,
    userId: idSchema,
    organizationId: idSchema,
    classroomId: idSchema.nullable(),
    gameId: idSchema,
    gameSlug: slugSchema,
    score: z.number().int().min(0),
    correctCount: z.number().int().min(0),
    totalCount: z.number().int().min(0),
    durationMs: z.number().int().min(0),
    startedAt: z.string().datetime({ offset: true }),
    completedAt: z.string().datetime({ offset: true }).nullable(),
    /** Free-form structured data emitted by the game via game-sdk. */
    metrics: z.record(z.string(), z.union([z.number(), z.string(), z.boolean()])),
  })
  .merge(timestamps);
export type GameSession = z.infer<typeof gameSessionSchema>;

export const startGameSessionInput = z.object({
  gameSlug: slugSchema,
  classroomId: idSchema.nullable().optional(),
});
export type StartGameSessionInput = z.infer<typeof startGameSessionInput>;

export const completeGameSessionInput = z.object({
  sessionId: idSchema,
  score: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  totalCount: z.number().int().min(0),
  durationMs: z.number().int().min(0),
  metrics: z
    .record(z.string(), z.union([z.number(), z.string(), z.boolean()]))
    .default(() => ({})),
});
export type CompleteGameSessionInput = z.infer<typeof completeGameSessionInput>;
