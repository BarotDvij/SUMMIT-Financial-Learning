import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';

import { getApi } from '~/lib/trpc/server';
import { ConsentBanner } from '~/components/consent-banner';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const a = await auth();
  if (!a.userId) redirect('/sign-in');

  let me: Awaited<ReturnType<Awaited<ReturnType<typeof getApi>>['me']['get']>> | null = null;
  try {
    const api = await getApi();
    me = await api.me.get();
  } catch {
    // Pre-provisioned user not in DB yet; show onboarding-ish state.
    me = null;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-summit-sand-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-7 w-7 rounded-full bg-summit-green-700" />
            <span className="font-semibold">SUMMIT</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="summit-link">Dashboard</Link>
            <Link href="/classes" className="summit-link">Classes</Link>
            <Link href="/leaderboard" className="summit-link">Leaderboard</Link>
            {me && (me.role === 'super_admin' || me.role === 'district_admin' || me.role === 'school_admin') ? (
              <Link href="/admin" className="summit-link">Admin</Link>
            ) : null}
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header>

      {me?.consentRequired && !me.consentGrantedAt ? <ConsentBanner /> : null}

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
