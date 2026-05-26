import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';

import { api } from '../../src/lib/trpc';

const APP_URL = process.env.EXPO_PUBLIC_APP_URL ?? 'http://localhost:3000';

export default function PlayScreen() {
  const { gameSlug } = useLocalSearchParams<{ gameSlug: string }>();
  const webRef = useRef<WebView>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState<null | { xp: number }>(null);

  const start = api.game.start.useMutation();
  const complete = api.game.complete.useMutation();
  const me = api.me.get.useQuery();

  const [session, setSession] = useState<{ sessionId: string; bundleUrl: string } | null>(null);

  useEffect(() => {
    if (!gameSlug) return;
    start
      .mutateAsync({ gameSlug })
      .then((s) => setSession({ sessionId: s.sessionId, bundleUrl: s.bundleUrl }))
      .catch((e) => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSlug]);

  function handleMessage(event: WebViewMessageEvent) {
    let data: unknown;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }
    if (!data || typeof data !== 'object') return;
    const msg = data as { kind: string; [k: string]: unknown };

    if (msg.kind === 'summit:ready' && session && me.data) {
      webRef.current?.postMessage(
        JSON.stringify({
          v: 1,
          id: Math.random().toString(36).slice(2),
          kind: 'summit:init',
          sessionId: session.sessionId,
          userId: me.data.id,
          classroomId: null,
          locale: 'en-CA',
          reducedMotion: false,
          soundEnabled: true,
        }),
      );
    } else if (msg.kind === 'summit:score' && typeof msg.score === 'number') {
      setScore(msg.score);
    } else if (msg.kind === 'summit:complete' && session) {
      complete
        .mutateAsync({
          sessionId: session.sessionId,
          score: Number(msg.score ?? 0),
          correctCount: Number(msg.correctCount ?? 0),
          totalCount: Number(msg.totalCount ?? 0),
          durationMs: Number(msg.durationMs ?? 0),
          metrics: (msg.metrics as Record<string, number | string | boolean>) ?? {},
        })
        .then((res) => setDone({ xp: res.xpAwarded }))
        .catch((e) => console.error(e));
    }
  }

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-summit-sand-50">
        <ActivityIndicator />
      </View>
    );
  }

  const uri = session.bundleUrl.startsWith('http')
    ? session.bundleUrl
    : `${APP_URL}${session.bundleUrl}`;

  return (
    <View className="flex-1 bg-summit-sand-50">
      <View className="flex-row justify-between p-3">
        <Text>Score: {score}</Text>
        {done ? <Text className="font-semibold text-summit-green-700">+{done.xp} XP</Text> : null}
      </View>
      <WebView
        ref={webRef}
        source={{ uri }}
        onMessage={handleMessage}
        originWhitelist={['*']}
        javaScriptEnabled
        allowsInlineMediaPlayback
        startInLoadingState
      />
    </View>
  );
}
