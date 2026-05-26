import { TRPCError } from '@trpc/server';
import { eq, sql } from '@summit/db';
import { schema } from '@summit/db';

import { protectedProcedure, router } from '../trpc';

export const meRouter = router({
  /** Returns the calling user's profile + aggregate totals. */
  get: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const xpRow = await ctx.db
      .select({ total: sql<number>`coalesce(sum(${schema.xpEvent.amount}), 0)::int` })
      .from(schema.xpEvent)
      .where(eq(schema.xpEvent.userId, ctx.user.id));

    return {
      id: ctx.user.id,
      organizationId: ctx.user.organizationId,
      role: ctx.user.role,
      displayName: ctx.user.displayName,
      consentRequired: ctx.user.consentRequired,
      consentGrantedAt: ctx.user.consentGrantedAt?.toISOString() ?? null,
      totalXp: xpRow[0]?.total ?? 0,
    };
  }),
});
