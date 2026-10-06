import { eq, type schema } from '@summit/db';
import { TRPCError } from '@trpc/server';

import type { Context } from '../context';

/**
 * Throws NOT_FOUND unless the row belongs to the caller's tenant. Use on every
 * client-supplied id before reading or writing through it. NOT_FOUND (rather
 * than FORBIDDEN) avoids confirming that another tenant's id exists.
 */
export async function assertInTenant(
  ctx: Context,
  table: typeof schema.classroom | typeof schema.school,
  id: string,
) {
  const [row] = await ctx.db
    .select({ organizationId: table.organizationId })
    .from(table)
    .where(eq(table.id, id))
    .limit(1);
  if (!row || row.organizationId !== ctx.user!.organizationId) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
}
