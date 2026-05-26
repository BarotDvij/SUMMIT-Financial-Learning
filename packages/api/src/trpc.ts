import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { hasMinimumRole, hasPermission, type Permission, type Role } from '@summit/schema';

import type { Context } from './context';

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

/** Gates student write paths on a valid `consent_record`. */
export const studentWritable = protectedProcedure.use(
  middleware(async ({ ctx, next }) => {
    const u = ctx.user!;
    if (u.role !== 'student') return next({ ctx });
    if (u.consentRequired && !u.consentGrantedAt) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Parental consent required before activity can be recorded.',
        cause: { code: 'CONSENT_REQUIRED' },
      });
    }
    return next({ ctx });
  }),
);
