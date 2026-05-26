import 'server-only';

import { headers } from 'next/headers';
import { auth as clerkAuth } from '@clerk/nextjs/server';

import { createCaller, createTRPCContext } from '@summit/api';

/**
 * Build a tRPC caller for the current request. Use this in Server Components
 * and Server Actions; never import from a Client Component.
 */
export async function getApi() {
  const a = await clerkAuth();
  const h = await headers();
  const ctx = await createTRPCContext({
    clerkUserId: a.userId,
    ipAddress: (h.get('x-forwarded-for')?.split(',')[0] ?? null)?.slice(0, 45) ?? null,
    userAgent: h.get('user-agent'),
  });
  return createCaller(ctx);
}
