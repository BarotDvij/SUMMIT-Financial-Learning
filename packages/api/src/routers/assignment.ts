import { TRPCError } from '@trpc/server';
import { and, eq } from '@summit/db';
import { schema } from '@summit/db';
import { createAssignmentInput, idSchema } from '@summit/schema';

import { protectedProcedure, requirePermission, router } from '../trpc';
import { recordAudit } from '../util/audit';

export const assignmentRouter = router({
  forClassroom: protectedProcedure.input(idSchema).query(async ({ ctx, input: classroomId }) => {
    return ctx.db
      .select()
      .from(schema.assignment)
      .where(
        and(
          eq(schema.assignment.classroomId, classroomId),
          eq(schema.assignment.organizationId, ctx.user!.organizationId),
        ),
      )
      .orderBy(schema.assignment.dueAt);
  }),

  create: requirePermission('classroom.create')
    .input(createAssignmentInput)
    .mutation(async ({ ctx, input }) => {
      const targetRefId =
        input.target.kind === 'lesson' ? input.target.lessonId : input.target.gameId;
      const [created] = await ctx.db
        .insert(schema.assignment)
        .values({
          organizationId: ctx.user!.organizationId,
          classroomId: input.classroomId,
          teacherUserId: ctx.user!.id,
          title: input.title,
          instructions: input.instructions,
          targetKind: input.target.kind,
          targetRefId,
          dueAt: input.dueAt ? new Date(input.dueAt) : null,
          requiredMinScore: input.requiredMinScore,
        })
        .returning();
      if (!created) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await recordAudit(ctx, {
        action: 'create',
        targetType: 'assignment',
        targetId: created.id,
      });

      return created;
    }),
});
