import { TRPCError } from '@trpc/server';
import { and, eq } from '@summit/db';
import { schema } from '@summit/db';
import { completeGameSessionInput, startGameSessionInput } from '@summit/schema';

import { protectedProcedure, router, studentWritable } from '../trpc';
import { awardXp } from '../repositories/xp';

export const gameRouter = router({
  catalog: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(schema.game).where(eq(schema.game.enabled, true));
  }),

  start: studentWritable.input(startGameSessionInput).mutation(async ({ ctx, input }) => {
    const [game] = await ctx.db
      .select()
      .from(schema.game)
      .where(eq(schema.game.slug, input.gameSlug))
      .limit(1);
    if (!game) throw new TRPCError({ code: 'NOT_FOUND', message: 'Unknown game.' });
    if (!game.enabled) throw new TRPCError({ code: 'FORBIDDEN', message: 'Game disabled.' });

    const [session] = await ctx.db
      .insert(schema.gameSession)
      .values({
        userId: ctx.user!.id,
        organizationId: ctx.user!.organizationId,
        classroomId: input.classroomId ?? null,
        gameId: game.id,
        gameSlug: game.slug,
        startedAt: new Date(),
      })
      .returning();
    if (!session) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

    return { sessionId: session.id, sdkVersion: game.sdkVersion, bundleUrl: game.bundleUrl };
  }),

  complete: studentWritable.input(completeGameSessionInput).mutation(async ({ ctx, input }) => {
    const [session] = await ctx.db
      .select()
      .from(schema.gameSession)
      .where(
        and(
          eq(schema.gameSession.id, input.sessionId),
          eq(schema.gameSession.userId, ctx.user!.id),
        ),
      )
      .limit(1);
    if (!session) throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found.' });
    if (session.completedAt) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Session already completed.' });
    }

    const [game] = await ctx.db
      .select()
      .from(schema.game)
      .where(eq(schema.game.id, session.gameId))
      .limit(1);
    if (!game) throw new TRPCError({ code: 'NOT_FOUND' });

    const cappedXp = Math.min(input.score, game.maxXpPerSession);

    await ctx.db
      .update(schema.gameSession)
      .set({
        completedAt: new Date(),
        score: input.score,
        correctCount: input.correctCount,
        totalCount: input.totalCount,
        durationMs: input.durationMs,
        metrics: input.metrics,
        updatedAt: new Date(),
      })
      .where(eq(schema.gameSession.id, session.id));

    await awardXp(ctx, {
      kind: 'game_complete',
      amount: cappedXp,
      refType: 'game_session',
      refId: session.id,
      classroomId: session.classroomId,
      reason: `Completed game "${game.title}" (${input.score} pts)`,
    });

    return { xpAwarded: cappedXp };
  }),
});
