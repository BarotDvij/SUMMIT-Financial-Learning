import { z } from 'zod';

import { idSchema, slugSchema, timestamps } from './primitives';

/**
 * Append-only XP ledger. Aggregated views (total XP, streaks, leaderboards)
 * are derived; never mutate or delete rows here.
 */
export const xpEventKindSchema = z.enum([
  'lesson_complete',
  'game_complete',
  'streak_bonus',
  'badge_unlocked',
  'manual_adjust',
]);
export type XpEventKind = z.infer<typeof xpEventKindSchema>;

export const xpEventSchema = z.object({
  id: idSchema,
  userId: idSchema,
  organizationId: idSchema,
  classroomId: idSchema.nullable(),
  kind: xpEventKindSchema,
  amount: z.number().int(),
  /** Optional reference to the entity that triggered the XP (e.g. game session id). */
  refType: z.enum(['lesson', 'game_session', 'badge', 'manual']).nullable(),
  refId: idSchema.nullable(),
  reason: z.string().max(280).nullable(),
  createdAt: z.string().datetime({ offset: true }),
});
export type XpEvent = z.infer<typeof xpEventSchema>;

export const badgeSchema = z
  .object({
    id: idSchema,
    slug: slugSchema,
    title: z.string().min(2).max(120),
    description: z.string().min(2).max(500),
    iconKey: z.string().min(1).max(64),
    xpReward: z.number().int().min(0).max(10000),
  })
  .merge(timestamps);
export type Badge = z.infer<typeof badgeSchema>;

export const achievementSchema = z
  .object({
    id: idSchema,
    userId: idSchema,
    badgeId: idSchema,
    unlockedAt: z.string().datetime({ offset: true }),
  })
  .merge(timestamps);
export type Achievement = z.infer<typeof achievementSchema>;
