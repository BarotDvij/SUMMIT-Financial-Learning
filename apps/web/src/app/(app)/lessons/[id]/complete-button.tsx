'use client';

import { useState } from 'react';

import { Button } from '@summit/ui/web';

import { api } from '~/lib/trpc/client';

export function CompleteLessonButton({ lessonId }: { lessonId: string }) {
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const complete = api.lesson.complete.useMutation({
    onSuccess(data) {
      setXpAwarded(data.xpAwarded);
    },
  });

  if (xpAwarded !== null) {
    return (
      <p className="rounded-lg bg-summit-green-100 px-3 py-2 text-sm text-summit-green-800">
        +{xpAwarded} XP banked.
      </p>
    );
  }

  return (
    <Button
      variant="secondary"
      onClick={() => complete.mutate({ lessonId })}
      disabled={complete.isPending}
    >
      {complete.isPending ? 'Saving…' : 'Mark as done'}
    </Button>
  );
}
