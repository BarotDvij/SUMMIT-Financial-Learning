import { schema } from '@summit/db';

import type { Context } from '../context';

interface AuditArgs {
  action:
    | 'create'
    | 'update'
    | 'delete'
    | 'access'
    | 'export'
    | 'grant_consent'
    | 'withdraw_consent'
    | 'role_change';
  targetType: string;
  targetId?: string | null;
  diff?: Record<string, unknown>;
}

/** Best-effort audit write. Failures are logged but never thrown. */
export async function recordAudit(ctx: Context, args: AuditArgs) {
  try {
    await ctx.db.insert(schema.auditLog).values({
      organizationId: ctx.user?.organizationId ?? null,
      actorUserId: ctx.user?.id ?? null,
      action: args.action,
      targetType: args.targetType,
      targetId: args.targetId ?? null,
      diff: args.diff ?? null,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
  } catch (err) {
    // Audit failures should never block the action they describe.
    // eslint-disable-next-line no-console
    console.error('audit log write failed', err);
  }
}
