import { TRPCError } from '@trpc/server';
import { and, eq, isNotNull } from '@summit/db';
import { schema } from '@summit/db';
import { idSchema } from '@summit/schema';
import { z } from 'zod';

import { protectedProcedure, router, studentWritable } from '../trpc';
import { awardXp } from '../repositories/xp';

export const lessonRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(schema.lessonRef)
      .where(isNotNull(schema.lessonRef.publishedAt))
      .orderBy(schema.lessonRef.order);
  }),

  byId: protectedProcedure.input(idSchema).query(async ({ ctx, input: id }) => {
    const [row] = await ctx.db
      .select()
      .from(schema.lessonRef)
      .where(eq(schema.lessonRef.id, id))
      .limit(1);
    if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
    return row;
  }),

  complete: studentWritable
    .input(z.object({ lessonId: idSchema }))
    .mutation(async ({ ctx, input }) => {
      const [lesson] = await ctx.db
        .select()
        .from(schema.lessonRef)
        .where(eq(schema.lessonRef.id, input.lessonId))
        .limit(1);
      if (!lesson) throw new TRPCError({ code: 'NOT_FOUND' });

      await awardXp(ctx, {
        kind: 'lesson_complete',
        amount: lesson.xpReward,
        refType: 'lesson',
        refId: lesson.id,
        reason: `Completed lesson "${lesson.title}"`,
      });

      return { xpAwarded: lesson.xpReward };
    }),
});
