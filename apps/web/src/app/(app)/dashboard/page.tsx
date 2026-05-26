import Link from 'next/link';

import { Button, Card, Stat } from '@summit/ui/web';

import { getApi } from '~/lib/trpc/server';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const api = await getApi();
  const me = await api.me.get();
  const games = await api.game.catalog();
  const lessons = await api.lesson.list();

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Hi, {me.displayName.split(' ')[0] ?? 'learner'}.</h1>
          <p className="text-summit-charcoal-500">
            Pick up where you left off, or try a new lesson.
          </p>
        </div>
        <Stat label="Total XP" value={me.totalXp.toLocaleString('en-CA')} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {lessons.slice(0, 4).map((lesson) => (
          <Card key={lesson.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-summit-charcoal-500">
                  {lesson.estimatedMinutes} min · {lesson.xpReward} XP
                </p>
                <h2 className="text-lg font-semibold">{lesson.title}</h2>
              </div>
            </div>
            <div className="mt-auto flex justify-end">
              <Link href={`/lessons/${lesson.id}`}>
                <Button size="sm">Open</Button>
              </Link>
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Games</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {games.map((g) => (
            <Card key={g.id} className="flex flex-col gap-2">
              <h3 className="font-semibold">{g.title}</h3>
              <p className="text-sm text-summit-charcoal-500">{g.summary}</p>
              <div className="mt-auto flex items-center justify-between text-xs text-summit-charcoal-500">
                <span>{g.estimatedMinutes} min</span>
                <Link href={`/play/${g.slug}`}>
                  <Button size="sm">Play</Button>
                </Link>
              </div>
            </Card>
          ))}
          {games.length === 0 ? (
            <p className="text-sm text-summit-charcoal-500">
              No games yet — run <code>pnpm db:seed</code>.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
