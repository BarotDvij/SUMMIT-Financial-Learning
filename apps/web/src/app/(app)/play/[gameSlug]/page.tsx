import { notFound } from 'next/navigation';

import { getApi } from '~/lib/trpc/server';
import { GameHost } from './game-host';

export const metadata = { title: 'Play' };

export default async function PlayPage({
  params,
}: {
  params: Promise<{ gameSlug: string }>;
}) {
  const { gameSlug } = await params;
  const api = await getApi();
  const catalog = await api.game.catalog();
  const game = catalog.find((g) => g.slug === gameSlug);
  if (!game) notFound();

  // Server-side start so the session id and bundle URL are fixed before
  // the client renders the iframe.
  const session = await api.game.start({ gameSlug: game.slug });

  return (
    <div className="space-y-4">
      <header className="flex items-baseline justify-between">
        <h1 className="text-xl font-semibold">{game.title}</h1>
        <p className="text-sm text-summit-charcoal-500">{game.summary}</p>
      </header>
      <GameHost
        sessionId={session.sessionId}
        bundleUrl={session.bundleUrl}
        gameSlug={game.slug}
      />
    </div>
  );
}
