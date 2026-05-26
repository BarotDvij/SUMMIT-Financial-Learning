'use client';

import { useEffect, useRef, useState } from 'react';

import { mountGameInIframe } from '@summit/game-sdk';

import { api } from '~/lib/trpc/client';

export function GameHost({
  sessionId,
  bundleUrl,
  gameSlug,
}: {
  sessionId: string;
  bundleUrl: string;
  gameSlug: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<null | { xpAwarded: number; correct: number; total: number }>(null);

  const me = api.me.get.useQuery();
  const complete = api.game.complete.useMutation();

  useEffect(() => {
    if (!containerRef.current) return;
    if (!me.data) return;
    const unmount = mountGameInIframe({
      container: containerRef.current,
      bundleUrl,
      sessionId,
      userId: me.data.id,
      classroomId: null,
      reducedMotion: matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
      onProgress: setProgress,
      onScore: setScore,
      async onComplete(payload) {
        const res = await complete.mutateAsync({
          sessionId,
          score: payload.score,
          correctCount: payload.correctCount,
          totalCount: payload.totalCount,
          durationMs: payload.durationMs,
          metrics: payload.metrics,
        });
        setResult({ xpAwarded: res.xpAwarded, correct: payload.correctCount, total: payload.totalCount });
      },
      onError(code, message) {
        console.error('game error', code, message);
      },
    });
    return unmount;
  }, [bundleUrl, sessionId, me.data, complete]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-summit-charcoal-500">
        <span>Game: {gameSlug}</span>
        <span className="tabular-nums">Score: {score}</span>
      </div>
      <div
        ref={containerRef}
        className="aspect-[3/5] w-full overflow-hidden rounded-2xl border border-summit-sand-200 bg-white sm:aspect-[16/10]"
      />
      {progress !== null && progress < 100 ? (
        <p className="text-xs text-summit-charcoal-500">Loading… {progress}%</p>
      ) : null}
      {result ? (
        <div className="rounded-xl bg-summit-green-100 px-4 py-3 text-summit-green-900">
          <p className="font-semibold">+{result.xpAwarded} XP</p>
          <p className="text-sm">
            {result.correct} of {result.total} correct.
          </p>
        </div>
      ) : null}
    </div>
  );
}
