import type { XpEventKind } from '@summit/schema';
import { schema } from '@summit/db';

import type { Context } from '../context';

interface AwardArgs {
  kind: XpEventKind;
  amount: number;
  refType?: 'lesson' | 'game_session' | 'badge' | 'manual';
  refId?: string;
  classroomId?: string | null;
  reason?: string;
}

/**
 * Inserts a single row into `xp_event`. Never updates or deletes.
 * Callers should pre-cap `amount` against any per-game limit.
 */
export async function awardXp(ctx: Context, args: AwardArgs) {
  if (!ctx.user) throw new Error('awardXp requires an authenticated user');
  await ctx.db.insert(schema.xpEvent).values({
    userId: ctx.user.id,
    organizationId: ctx.user.organizationId,
    classroomId: args.classroomId ?? null,
    kind: args.kind,
    amount: args.amount,
    refType: args.refType ?? null,
    refId: args.refId ?? null,
    reason: args.reason ?? null,
  });
}
