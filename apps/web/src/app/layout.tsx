import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';
import { TRPCProvider } from '~/lib/trpc/client';
import { PostHogProvider } from '~/lib/posthog';

export const metadata: Metadata = {
  title: {
    default: 'SUMMIT — Financial Learning',
    template: '%s · SUMMIT',
  },
  description:
    'Gamified financial literacy for Canadian classrooms. Built for the WRDSB pilot.',
  manifest: '/manifest.webmanifest',
  applicationName: 'SUMMIT',
  appleWebApp: {
    capable: true,
    title: 'SUMMIT',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e7c0d',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#1e7c0d',
          borderRadius: '12px',
        },
      }}
    >
      <html lang="en-CA">
        <body>
          <PostHogProvider>
            <TRPCProvider>{children}</TRPCProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
