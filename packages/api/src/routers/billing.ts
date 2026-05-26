import { TRPCError } from '@trpc/server';
import { eq } from '@summit/db';
import { schema } from '@summit/db';
import { z } from 'zod';

import { requirePermission, router } from '../trpc';

/**
 * Stripe wiring is deferred to Phase 3. For now we expose read-only views
 * of the local `subscription` and `invoice` tables and a stub checkout that
 * returns a placeholder URL.
 */
export const billingRouter = router({
  currentSubscription: requirePermission('organization.manage').query(async ({ ctx }) => {
    const [sub] = await ctx.db
      .select()
      .from(schema.subscription)
      .where(eq(schema.subscription.organizationId, ctx.user!.organizationId))
      .limit(1);
    return sub ?? null;
  }),

  startCheckout: requirePermission('organization.manage')
    .input(z.object({ plan: z.string().min(1).max(64) }))
    .mutation(async () => {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          message: 'Stripe is not enabled in this environment.',
        });
      }
      // Phase 3: create Stripe Checkout Session and return URL.
      return { checkoutUrl: 'https://checkout.stripe.com/c/pay/placeholder' };
    }),
});
