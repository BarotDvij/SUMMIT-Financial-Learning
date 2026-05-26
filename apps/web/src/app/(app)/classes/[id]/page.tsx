import { notFound } from 'next/navigation';

import { Card } from '@summit/ui/web';

import { getApi } from '~/lib/trpc/server';

export const metadata = { title: 'Class' };

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const api = await getApi();
  let data;
  try {
    data = await api.classroom.roster(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{data.classroom.name}</h1>
          <p className="text-sm text-summit-charcoal-500">
            {data.students.length} students · code{' '}
            <code className="rounded bg-summit-sand-100 px-1.5 py-0.5">
              {data.classroom.joinCode}
            </code>
          </p>
        </div>
      </header>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-summit-sand-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Student</th>
              <th className="px-4 py-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {data.students.map((s) => (
              <tr key={s.studentId} className="border-t border-summit-sand-200">
                <td className="px-4 py-2">{s.displayName}</td>
                <td className="px-4 py-2 text-summit-charcoal-500">
                  {new Date(s.enrolledAt).toLocaleDateString('en-CA')}
                </td>
              </tr>
            ))}
            {data.students.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-4 text-summit-charcoal-500">
                  Share the join code so students can self-enroll.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
