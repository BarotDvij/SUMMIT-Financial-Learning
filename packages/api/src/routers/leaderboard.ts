import { TRPCError } from '@trpc/server';
import { and, desc, eq, gte, sql } from '@summit/db';
import { schema } from '@summit/db';
import {
  leaderboardScopeSchema,
  leaderboardWindowSchema,
  type LeaderboardEntry,
} from '@summit/schema';
import { z } from 'zod';

import { protectedProcedure, router } from '../trpc';

const windowToDate = (w: 'daily' | 'weekly' | 'all_time'): Date | null => {
  if (w === 'all_time') return null;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (w === 'weekly') d.setDate(d.getDate() - 7);
  return d;
};

export const leaderboardRouter = router({
  top: protectedProcedure
    .input(
      z.object({
        scope: leaderboardScopeSchema,
        window: leaderboardWindowSchema.default('weekly'),
        limit: z.number().int().min(5).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const since = windowToDate(input.window);

      const tenantOk =
        (input.scope.kind === 'classroom' || input.scope.kind === 'school') ||
        (input.scope.kind === 'organization' &&
          input.scope.organizationId === ctx.user!.organizationId);
      if (!tenantOk) throw new TRPCError({ code: 'FORBIDDEN' });

      let scopeFilter;
      if (input.scope.kind === 'classroom') {
        scopeFilter = eq(schema.xpEvent.classroomId, input.scope.classroomId);
      } else if (input.scope.kind === 'organization') {
        scopeFilter = eq(schema.xpEvent.organizationId, input.scope.organizationId);
      } else {
        // school scope — derived via classroom join in a follow-up; placeholder for now
        scopeFilter = eq(schema.xpEvent.organizationId, ctx.user!.organizationId);
      }

      const filters = since ? and(scopeFilter, gte(schema.xpEvent.createdAt, since)) : scopeFilter;

      const rows = await ctx.db
        .select({
          userId: schema.xpEvent.userId,
          displayName: schema.user.displayName,
          avatarUrl: schema.user.avatarUrl,
          xp: sql<number>`sum(${schema.xpEvent.amount})::int`,
        })
        .from(schema.xpEvent)
        .innerJoin(schema.user, eq(schema.user.id, schema.xpEvent.userId))
        .where(filters)
        .groupBy(schema.xpEvent.userId, schema.user.displayName, schema.user.avatarUrl)
        .orderBy(desc(sql`sum(${schema.xpEvent.amount})`))
        .limit(input.limit);

      const entries: LeaderboardEntry[] = rows.map((r, i) => ({
        userId: r.userId,
        displayName: r.displayName,
        avatarUrl: r.avatarUrl,
        xp: r.xp,
        rank: i + 1,
      }));

      const me = entries.find((e) => e.userId === ctx.user!.id) ?? null;

      return {
        scope: input.scope,
        window: input.window,
        generatedAt: new Date().toISOString(),
        entries,
        me,
      };
    }),
});
