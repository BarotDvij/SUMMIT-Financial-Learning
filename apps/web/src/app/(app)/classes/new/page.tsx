'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Card } from '@summit/ui/web';

import { api } from '~/lib/trpc/client';

export default function NewClassPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [gradeLabel, setGradeLabel] = useState('');
  // Phase 0: hardcoded to the seed school; Phase 2 swaps to a real picker.
  const [schoolId, setSchoolId] = useState('');
  const create = api.classroom.create.useMutation({
    onSuccess(c) {
      router.push(`/classes/${c.id}`);
    },
  });

  return (
    <div className="mx-auto max-w-lg">
      <Card className="space-y-4">
        <h1 className="text-xl font-semibold">New class</h1>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            create.mutate({
              schoolId,
              name,
              slug,
              gradeLabel: gradeLabel || null,
            });
          }}
        >
          <Field label="School id">
            <input
              required
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              placeholder="paste from /admin"
              className="w-full rounded-xl border border-summit-sand-200 px-3 py-2"
            />
          </Field>
          <Field label="Class name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-summit-sand-200 px-3 py-2"
            />
          </Field>
          <Field label="Grade (optional)">
            <input
              value={gradeLabel}
              onChange={(e) => setGradeLabel(e.target.value)}
              className="w-full rounded-xl border border-summit-sand-200 px-3 py-2"
            />
          </Field>
          {create.error ? (
            <p className="text-sm text-red-600">{create.error.message}</p>
          ) : null}
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Creating…' : 'Create class'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
