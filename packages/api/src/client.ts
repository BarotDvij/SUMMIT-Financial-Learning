import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import superjson from 'superjson';

import type { AppRouter } from './router';

export interface CreateClientOptions {
  url: string;
  /** Headers callback so React clients can attach the Clerk session token. */
  headers?: () => Promise<Record<string, string>> | Record<string, string>;
}

export function createApiClient(opts: CreateClientOptions) {
  return createTRPCProxyClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (op) => process.env.NODE_ENV !== 'production' || op.direction === 'down',
      }),
      httpBatchLink({
        url: opts.url,
        transformer: superjson,
        async headers() {
          if (!opts.headers) return {};
          return await opts.headers();
        },
      }),
    ],
  });
}
