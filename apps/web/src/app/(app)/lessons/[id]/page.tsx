import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button, Card } from '@summit/ui/web';

import { getApi } from '~/lib/trpc/server';
import { fetchLessonBody } from '~/lib/sanity';
import { CompleteLessonButton } from './complete-button';

export const metadata = { title: 'Lesson' };

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const api = await getApi();
  let lesson;
  try {
    lesson = await api.lesson.byId(id);
  } catch {
    notFound();
  }

  const body = await fetchLessonBody(lesson.sanityId);

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <article className="space-y-4 leading-relaxed">
        <p className="text-xs uppercase tracking-wide text-summit-charcoal-500">
          {lesson.estimatedMinutes} min · {lesson.xpReward} XP
        </p>
        <h1 className="text-3xl font-semibold">{lesson.title}</h1>
        {body ? (
          <pre className="overflow-x-auto rounded-xl bg-summit-sand-100 p-4 text-xs">
            {JSON.stringify(body, null, 2)}
          </pre>
        ) : (
          <p className="text-summit-charcoal-500">
            Lesson body lives in Sanity. Once Sanity is configured the rich content renders here.
            For Phase 0 the seed inserts a placeholder lesson so you can wire up the loop.
          </p>
        )}
      </article>

      <aside className="space-y-4">
        <Card className="space-y-3">
          <h2 className="font-semibold">Apply what you learned</h2>
          {lesson.gameSlug ? (
            <Link href={`/play/${lesson.gameSlug}`}>
              <Button>Play the matching mini-game</Button>
            </Link>
          ) : (
            <p className="text-sm text-summit-charcoal-500">
              No game attached to this lesson yet.
            </p>
          )}
          <CompleteLessonButton lessonId={lesson.id} />
        </Card>
      </aside>
    </div>
  );
}
