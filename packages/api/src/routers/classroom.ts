import { TRPCError } from '@trpc/server';
import { and, eq, isNull } from '@summit/db';
import { schema } from '@summit/db';
import {
  createClassroomInput,
  joinClassroomInput,
  idSchema,
} from '@summit/schema';

import { protectedProcedure, requirePermission, router } from '../trpc';
import { recordAudit } from '../util/audit';
import { generateJoinCode } from '../util/join-code';

export const classroomRouter = router({
  /** Teacher view: my classrooms. */
  mine: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(schema.classroom)
      .where(
        and(
          eq(schema.classroom.organizationId, ctx.user!.organizationId),
          eq(schema.classroom.teacherUserId, ctx.user!.id),
          isNull(schema.classroom.archivedAt),
        ),
      )
      .orderBy(schema.classroom.createdAt);
  }),

  create: requirePermission('classroom.create')
    .input(createClassroomInput)
    .mutation(async ({ ctx, input }) => {
      const joinCode = await generateJoinCode(ctx.db);
      const [created] = await ctx.db
        .insert(schema.classroom)
        .values({
          organizationId: ctx.user!.organizationId,
          schoolId: input.schoolId,
          teacherUserId: ctx.user!.id,
          name: input.name,
          slug: input.slug,
          gradeLabel: input.gradeLabel,
          joinCode,
        })
        .returning();
      if (!created) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await recordAudit(ctx, {
        action: 'create',
        targetType: 'classroom',
        targetId: created.id,
      });

      return created;
    }),

  join: protectedProcedure.input(joinClassroomInput).mutation(async ({ ctx, input }) => {
    if (ctx.user!.role !== 'student') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Only students join via code.' });
    }
    const [cls] = await ctx.db
      .select()
      .from(schema.classroom)
      .where(eq(schema.classroom.joinCode, input.joinCode))
      .limit(1);
    if (!cls) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid join code.' });
    if (cls.organizationId !== ctx.user!.organizationId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Join code is for another district.' });
    }

    await ctx.db
      .insert(schema.enrollment)
      .values({ classroomId: cls.id, studentUserId: ctx.user!.id })
      .onConflictDoNothing();

    await recordAudit(ctx, {
      action: 'create',
      targetType: 'enrollment',
      targetId: cls.id,
    });

    return { classroomId: cls.id };
  }),

  /** Roster + progress summary for a teacher's classroom. */
  roster: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input: classroomId }) => {
      const [cls] = await ctx.db
        .select()
        .from(schema.classroom)
        .where(eq(schema.classroom.id, classroomId))
        .limit(1);
      if (!cls) throw new TRPCError({ code: 'NOT_FOUND' });
      if (cls.organizationId !== ctx.user!.organizationId) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      const isTeacher = cls.teacherUserId === ctx.user!.id;
      const isAdmin = ctx.user!.role === 'school_admin' ||
        ctx.user!.role === 'district_admin' ||
        ctx.user!.role === 'super_admin';
      if (!isTeacher && !isAdmin) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const rows = await ctx.db
        .select({
          studentId: schema.user.id,
          displayName: schema.user.displayName,
          avatarUrl: schema.user.avatarUrl,
          enrolledAt: schema.enrollment.enrolledAt,
        })
        .from(schema.enrollment)
        .innerJoin(schema.user, eq(schema.user.id, schema.enrollment.studentUserId))
        .where(eq(schema.enrollment.classroomId, classroomId));

      return { classroom: cls, students: rows };
    }),
});
