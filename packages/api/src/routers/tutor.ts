import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { studentWritable, router } from '../trpc';

/**
 * Phase 3+ AI tutor. This router exposes a stub today so the UI can wire up
 * to it without breaking. The real implementation will stream tokens via
 * Vercel AI SDK + AI Gateway and pull lesson context from Sanity.
 */
export const tutorRouter = router({
  ask: studentWritable
    .input(
      z.object({
        lessonId: z.string().uuid().optional(),
        prompt: z.string().min(1).max(500),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!process.env.AI_GATEWAY_API_KEY) {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          message: 'AI tutor is not enabled in this environment.',
        });
      }
      // Phase 3: stream via Vercel AI SDK. For now, echo so the client wiring works.
      return {
        ok: true,
        reply: `You asked: ${input.prompt}. (Tutor coming in Phase 3.)`,
        lessonId: input.lessonId ?? null,
        userId: ctx.user!.id,
      };
    }),
});
