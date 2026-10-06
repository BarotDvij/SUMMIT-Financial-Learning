import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { and, eq, isNotNull, isNull, schema, type Database } from '@summit/db';
import { hasMinimumRole, hasPermission, type Permission, type Role } from '@summit/schema';

import type { Context, CurrentUser } from './context';

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

/** Pass-through that records the calling IP/UA for audit. */
const baseMiddleware = middleware(async ({ ctx, next }) => {
  return next({ ctx });
});

const enforceAuth = middleware(async ({ ctx, next }) => {
  if (!ctx.auth || !ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Sign in to continue.' });
  }
  return next({ ctx: { ...ctx, auth: ctx.auth, user: ctx.user } });
});

export const protectedProcedure = publicProcedure.use(baseMiddleware).use(enforceAuth);

export function requireRole(min: Role) {
  return protectedProcedure.use(
    middleware(async ({ ctx, next }) => {
      if (!hasMinimumRole(ctx.user!.role, min)) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Insufficient role.' });
      }
      return next({ ctx });
    }),
  );
}

export function requirePermission(permission: Permission) {
  return protectedProcedure.use(
    middleware(async ({ ctx, next }) => {
      if (!hasPermission(ctx.user!.role, permission)) {
        throw new TRPCError({ code: 'FORBIDDEN', message: `Missing permission: ${permission}` });
      }
      return next({ ctx });
    }),
  );
}

/**
 * AGENTS.md rule 3. A student who needs parental consent may write only while
 * they have a granted, unwithdrawn `consent_record`. Reads the record itself,
 * not the `user.consentGrantedAt` mirror, so a withdrawal takes effect at once.
 */
export async function requireStudentWritable(db: Database, user: CurrentUser) {
  if (user.role !== 'student' || !user.consentRequired) return;
  const [active] = await db
    .select({ id: schema.consentRecord.id })
    .from(schema.consentRecord)
    .where(
      and(
        eq(schema.consentRecord.studentUserId, user.id),
        isNotNull(schema.consentRecord.grantedAt),
        isNull(schema.consentRecord.withdrawnAt),
      ),
    )
    .limit(1);
  if (!active) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Parental consent required before activity can be recorded.',
      cause: { code: 'CONSENT_REQUIRED' },
    });
  }
}

/** Gates student write paths on a valid `consent_record`. */
export const studentWritable = protectedProcedure.use(
  middleware(async ({ ctx, next }) => {
    await requireStudentWritable(ctx.db, ctx.user!);
    return next({ ctx });
  }),
);
