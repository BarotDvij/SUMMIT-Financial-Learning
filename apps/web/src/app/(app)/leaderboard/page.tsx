import { Card } from '@summit/ui/web';

import { getApi } from '~/lib/trpc/server';

export const metadata = { title: 'Leaderboard' };

export default async function LeaderboardPage() {
  const api = await getApi();
  const me = await api.me.get();
  const board = await api.leaderboard.top({
    scope: { kind: 'organization', organizationId: me.organizationId },
    window: 'weekly',
    limit: 25,
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Weekly leaderboard</h1>
        <p className="text-sm text-summit-charcoal-500">
          Top 25 across your district. Resets every Monday.
        </p>
      </header>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-summit-sand-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">#</th>
              <th className="px-4 py-2 font-medium">Student</th>
              <th className="px-4 py-2 text-right font-medium">XP</th>
            </tr>
          </thead>
          <tbody>
            {board.entries.map((e) => (
              <tr
                key={e.userId}
                className={`border-t border-summit-sand-200 ${e.userId === me.id ? 'bg-summit-green-50' : ''}`}
              >
                <td className="px-4 py-2 tabular-nums">{e.rank}</td>
                <td className="px-4 py-2">{e.displayName}</td>
                <td className="px-4 py-2 text-right tabular-nums">{e.xp.toLocaleString('en-CA')}</td>
              </tr>
            ))}
            {board.entries.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-summit-charcoal-500">
                  No XP recorded in your district yet this week.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
