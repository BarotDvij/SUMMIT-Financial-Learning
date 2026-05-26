import type { Database } from '@summit/db';
import { getDb, schema, eq } from '@summit/db';
import type { Role } from '@summit/schema';

export interface AuthState {
  /** Clerk user id. Always present once `requireAuth` passes. */
  clerkUserId: string;
}

export interface CurrentUser {
  id: string;
  clerkUserId: string;
  organizationId: string;
  role: Role;
  displayName: string;
  consentRequired: boolean;
  consentGrantedAt: Date | null;
}

export interface Context {
  db: Database;
  auth: AuthState | null;
  /** Lazily-loaded; call `requireCurrentUser(ctx)`. */
  user: CurrentUser | null;
  /** Truncated IP for audit logging. */
  ipAddress: string | null;
  userAgent: string | null;
}

export interface CreateContextOptions {
  clerkUserId: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function createTRPCContext(opts: CreateContextOptions): Promise<Context> {
  const db = getDb();
  const auth = opts.clerkUserId ? { clerkUserId: opts.clerkUserId } : null;

  let user: CurrentUser | null = null;
  if (auth) {
    const rows = await db
      .select({
        id: schema.user.id,
        clerkUserId: schema.user.clerkUserId,
        organizationId: schema.user.organizationId,
        role: schema.user.role,
        displayName: schema.user.displayName,
        consentRequired: schema.user.consentRequired,
        consentGrantedAt: schema.user.consentGrantedAt,
      })
      .from(schema.user)
      .where(eq(schema.user.clerkUserId, auth.clerkUserId))
      .limit(1);
    const row = rows[0];
    if (row) {
      user = {
        id: row.id,
        clerkUserId: row.clerkUserId,
        organizationId: row.organizationId,
        role: row.role,
        displayName: row.displayName,
        consentRequired: row.consentRequired,
        consentGrantedAt: row.consentGrantedAt,
      };
    }
  }

  return {
    db,
    auth,
    user,
    ipAddress: opts.ipAddress ?? null,
    userAgent: opts.userAgent ?? null,
  };
}
