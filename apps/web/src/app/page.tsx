import Link from 'next/link';

import { Button, Card } from '@summit/ui/web';

export default function MarketingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-block h-9 w-9 rounded-full bg-summit-green-700" />
          <span className="text-lg font-semibold">SUMMIT</span>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/for-teachers" className="summit-link">For teachers</Link>
          <Link href="/for-parents" className="summit-link">For parents</Link>
          <Link href="/sign-in" className="summit-link">Sign in</Link>
          <Link href="/sign-up">
            <Button size="sm">Create account</Button>
          </Link>
        </nav>
      </header>

      <section className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="space-y-5">
          <p className="inline-flex rounded-full bg-summit-green-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-summit-green-800">
            Pilot · WRDSB · 2026
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Financial literacy that students actually finish.
          </h1>
          <p className="text-lg text-summit-charcoal-500">
            A gamified curriculum built for Canadian classrooms. Teachers set up a class in 30 seconds.
            Students learn with mini-games, earn XP, and see real progress.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sign-up">
              <Button size="lg">Start a free classroom</Button>
            </Link>
            <Link href="/for-teachers">
              <Button size="lg" variant="secondary">
                See what teachers get
              </Button>
            </Link>
          </div>
        </div>
        <Card className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-summit-charcoal-500">
            Why teens stick around
          </p>
          <h2 className="text-xl font-semibold">Built like a game, taught like a course.</h2>
          <ul className="space-y-2 text-summit-charcoal-700">
            <li>· Real Canadian money concepts: TFSA, RRSP, credit, mortgages</li>
            <li>· Bite-sized lessons paired with mini-games</li>
            <li>· Teacher dashboards aligned to the Ontario business curriculum</li>
            <li>· Free for students, priced for schools</li>
          </ul>
        </Card>
      </section>

      <footer className="mt-auto border-t border-summit-sand-200 pt-6 text-sm text-summit-charcoal-500">
        © {new Date().getFullYear()} SUMMIT Financial Learning Inc. ·
        <Link href="/legal/privacy" className="summit-link ml-1">Privacy</Link> ·
        <Link href="/legal/terms" className="summit-link ml-1">Terms</Link>
      </footer>
    </main>
  );
}
