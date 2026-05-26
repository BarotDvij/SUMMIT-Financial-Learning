import { Card, Stat } from '@summit/ui/web';

import { getApi } from '~/lib/trpc/server';

export const metadata = { title: 'Admin' };

export default async function AdminPage() {
  const api = await getApi();
  const me = await api.me.get();

  if (me.role !== 'school_admin' && me.role !== 'district_admin' && me.role !== 'super_admin') {
    return <p>You do not have access to this page.</p>;
  }

  const summary = await api.admin.districtSummary();
  const audits = await api.admin.recentAuditLog();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">District overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Classrooms" value={summary.classroomCount} />
        <Stat label="Students" value={summary.studentCount} />
        <Stat label="XP this week" value={summary.xpThisWeek.toLocaleString('en-CA')} />
      </div>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-summit-sand-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">When</th>
              <th className="px-4 py-2 font-medium">Action</th>
              <th className="px-4 py-2 font-medium">Target</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((a) => (
              <tr key={a.id} className="border-t border-summit-sand-200">
                <td className="px-4 py-2 text-summit-charcoal-500">
                  {new Date(a.createdAt).toLocaleString('en-CA')}
                </td>
                <td className="px-4 py-2">{a.action}</td>
                <td className="px-4 py-2">
                  {a.targetType}
                  {a.targetId ? <span className="text-summit-charcoal-500"> · {a.targetId.slice(0, 8)}</span> : null}
                </td>
              </tr>
            ))}
            {audits.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-summit-charcoal-500">
                  No audit events yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
