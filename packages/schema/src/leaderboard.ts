import { z } from 'zod';

import { idSchema } from './primitives';

export const leaderboardScopeSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('classroom'), classroomId: idSchema }),
  z.object({ kind: z.literal('school'), schoolId: idSchema }),
  z.object({ kind: z.literal('organization'), organizationId: idSchema }),
]);
export type LeaderboardScope = z.infer<typeof leaderboardScopeSchema>;

export const leaderboardWindowSchema = z.enum(['daily', 'weekly', 'all_time']);
export type LeaderboardWindow = z.infer<typeof leaderboardWindowSchema>;

export const leaderboardEntrySchema = z.object({
  userId: idSchema,
  displayName: z.string().min(1).max(120),
  avatarUrl: z.string().url().nullable(),
  xp: z.number().int().min(0),
  rank: z.number().int().min(1),
});
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

export const leaderboardResult = z.object({
  scope: leaderboardScopeSchema,
  window: leaderboardWindowSchema,
  generatedAt: z.string().datetime({ offset: true }),
  entries: z.array(leaderboardEntrySchema),
  /** The current user's position even if outside the top N. */
  me: leaderboardEntrySchema.nullable(),
});
export type LeaderboardResult = z.infer<typeof leaderboardResult>;
