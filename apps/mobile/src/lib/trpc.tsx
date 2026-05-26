import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useAuth } from '@clerk/clerk-expo';
import superjson from 'superjson';

import type { AppRouter } from '@summit/api';

export const api = createTRPCReact<AppRouter>();

const APP_URL = process.env.EXPO_PUBLIC_APP_URL ?? 'http://localhost:3000';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());
  const [client] = useState(() =>
    api.createClient({
      links: [
        loggerLink({ enabled: (op) => __DEV__ || op.direction === 'down' }),
        httpBatchLink({
          url: `${APP_URL}/api/trpc`,
          transformer: superjson,
          async headers() {
            const token = await getToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    }),
  );

  return (
    <api.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
