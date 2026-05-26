'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@summit/ui/web';

import { api } from '~/lib/trpc/client';

export function JoinForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const join = api.classroom.join.useMutation({
    onSuccess(data) {
      router.push(`/classes/${data.classroomId}`);
    },
    onError(e) {
      setError(e.message);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        join.mutate({ joinCode: code.toUpperCase() });
      }}
      className="flex flex-col gap-3"
    >
      <label htmlFor="join-code" className="text-sm font-medium">
        Class code
      </label>
      <input
        id="join-code"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        maxLength={6}
        pattern="[A-Z0-9]{6}"
        required
        className="rounded-xl border border-summit-sand-200 px-3 py-2 text-lg tracking-widest uppercase focus:border-summit-green-600 focus:outline-none focus:ring-2 focus:ring-summit-green-500"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={join.isPending}>
        {join.isPending ? 'Joining…' : 'Join class'}
      </Button>
    </form>
  );
}
