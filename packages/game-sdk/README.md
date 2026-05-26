# @summit/game-sdk

The contract that lets one game bundle run unchanged inside the web app's
`<iframe>` and the mobile app's `WebView`.

## Protocol overview

```
host -> game           game -> host
-----------------      ---------------------
summit:init            summit:ready
summit:pause           summit:progress (0-100)
summit:resume          summit:score
summit:end             summit:complete
                       summit:error
```

All messages are JSON, validated by Zod (`protocol.ts`), and tagged with
`v: 1` so we can ship `v: 2` without breaking older deployed bundles.

## Host (consumed by `apps/web`)

```ts
import { mountGameInIframe } from '@summit/game-sdk';

const unmount = mountGameInIframe({
  container: document.getElementById('game')!,
  bundleUrl: '/games/compound-match/index.html',
  sessionId,
  userId,
  classroomId,
  onComplete: ({ score, correctCount, totalCount, durationMs, metrics }) =>
    api.game.complete.mutate({ sessionId, score, correctCount, totalCount, durationMs, metrics }),
});
```

The mobile app's WebView calls the equivalent helper that swaps `postMessage`
for `window.ReactNativeWebView.postMessage`. Games don't need to know which
host they're running in — `createGameClient()` figures it out.

## Game (consumed by every game bundle)

```ts
import { createGameClient } from '@summit/game-sdk/game';

const client = createGameClient();
client.onInit(({ userId, locale, reducedMotion }) => {
  // start the round
});
client.ready(['score', 'xp']);
// later:
client.complete({ score: 80, correctCount: 8, totalCount: 10, durationMs: 110_000 });
```

## Hard rules

1. **Never** trust score values on the client. The API caps XP by
   `game.max_xp_per_session`.
2. The host validates `origin` (for iframes) and discards malformed messages.
3. Games must emit `summit:ready` exactly once. Failing to do so blocks `init`.
4. Versions are monotonically increasing. Bumping `v` is a breaking change.
