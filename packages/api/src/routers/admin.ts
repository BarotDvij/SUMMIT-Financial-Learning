import { and, desc, eq, gte, sql } from '@summit/db';
import { schema } from '@summit/db';
import { z } from 'zod';

import { requirePermission, router } from '../trpc';

/** District/school admin dashboards. */
export const adminRouter = router({
  districtSummary: requirePermission('analytics.view.district').query(async ({ ctx }) => {
    const [classes] = await ctx.db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.classroom)
      .where(eq(schema.classroom.organizationId, ctx.user!.organizationId));
    const [students] = await ctx.db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.user)
      .where(
        and(
          eq(schema.user.organizationId, ctx.user!.organizationId),
          eq(schema.user.role, 'student'),
        ),
      );
    const sinceWeek = new Date();
    sinceWeek.setDate(sinceWeek.getDate() - 7);
    const [xpWeek] = await ctx.db
      .select({ xp: sql<number>`coalesce(sum(${schema.xpEvent.amount}),0)::int` })
      .from(schema.xpEvent)
      .where(
        and(
          eq(schema.xpEvent.organizationId, ctx.user!.organizationId),
          gte(schema.xpEvent.createdAt, sinceWeek),
        ),
      );
    return {
      classroomCount: classes?.n ?? 0,
      studentCount: students?.n ?? 0,
      xpThisWeek: xpWeek?.xp ?? 0,
    };
  }),

  schoolSummary: requirePermission('analytics.view.school')
    .input(z.object({ schoolId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [classes] = await ctx.db
        .select({ n: sql<number>`count(*)::int` })
        .from(schema.classroom)
        .where(eq(schema.classroom.schoolId, input.schoolId));
      return { schoolId: input.schoolId, classroomCount: classes?.n ?? 0 };
    }),

  recentAuditLog: requirePermission('analytics.view.district').query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(schema.auditLog)
      .where(eq(schema.auditLog.organizationId, ctx.user!.organizationId))
      .orderBy(desc(schema.auditLog.createdAt))
      .limit(50);
  }),
});
