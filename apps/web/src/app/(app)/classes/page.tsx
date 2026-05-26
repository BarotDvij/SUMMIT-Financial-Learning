import Link from 'next/link';

import { Button, Card } from '@summit/ui/web';

import { getApi } from '~/lib/trpc/server';

export const metadata = { title: 'Classes' };

export default async function ClassesPage() {
  const api = await getApi();
  const me = await api.me.get();
  const classes = me.role === 'teacher' ? await api.classroom.mine() : [];

  if (me.role === 'student') {
    return (
      <div className="mx-auto max-w-md">
        <Card className="space-y-4">
          <h1 className="text-xl font-semibold">Join your class</h1>
          <p className="text-sm text-summit-charcoal-500">
            Enter the 6-character code your teacher gave you.
          </p>
          <JoinForm />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your classes</h1>
        <Link href="/classes/new">
          <Button>New class</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {classes.map((c) => (
          <Card key={c.id} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">{c.name}</h2>
              <code className="rounded bg-summit-sand-100 px-2 py-0.5 text-xs">{c.joinCode}</code>
            </div>
            <p className="text-sm text-summit-charcoal-500">{c.gradeLabel ?? 'Mixed grade'}</p>
            <div className="mt-auto flex justify-end">
              <Link href={`/classes/${c.id}`}>
                <Button size="sm" variant="secondary">
                  Open
                </Button>
              </Link>
            </div>
          </Card>
        ))}
        {classes.length === 0 ? (
          <Card>
            <p className="text-sm text-summit-charcoal-500">
              You don't have any classes yet. Create your first one to get a join code for your students.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

import { JoinForm } from './join-form';
