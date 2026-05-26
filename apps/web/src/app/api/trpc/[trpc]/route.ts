import { auth as clerkAuth } from '@clerk/nextjs/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter, createTRPCContext } from '@summit/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (req: Request) => {
  const a = await clerkAuth();
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () =>
      createTRPCContext({
        clerkUserId: a.userId,
        ipAddress:
          req.headers.get('x-forwarded-for')?.split(',')[0]?.slice(0, 45) ?? null,
        userAgent: req.headers.get('user-agent'),
      }),
    onError({ error, path }) {
      if (process.env.NODE_ENV !== 'production' || error.code === 'INTERNAL_SERVER_ERROR') {
        console.error(`tRPC error on ${path}:`, error);
      }
    },
  });
};

export { handler as GET, handler as POST };
