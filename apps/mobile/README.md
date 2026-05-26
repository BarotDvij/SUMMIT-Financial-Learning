# @summit/mobile

Expo (React Native) app for SUMMIT. Single source of truth for native UI.
Games are loaded via `react-native-webview` from the web app's `/games/`
public directory, so the same Phaser/HTML bundle runs unchanged on both
platforms.

## Run locally

```bash
pnpm install
pnpm --filter @summit/mobile start
```

Open the Expo Go app on your phone and scan the QR. iOS requires a Mac with
Xcode if you want a native build; Android requires Android Studio. EAS Build
covers both in CI — see `docs/runbooks/EAS.md`.

## Env

The mobile app reads only `EXPO_PUBLIC_*` variables. Configure them at:
- local dev: `apps/mobile/.env.local`
- EAS builds: `eas env:create` per environment

Critical variables:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` — your Clerk publishable key
- `EXPO_PUBLIC_APP_URL` — the deployed web app origin (used for tRPC + game URLs)

## Notes

- Phase 1 mobile is a thin shell: sign in, dashboard, play a game. The
  full reading experience (Sanity-rendered lessons) lives on web only until
  Phase 2 brings it native.
- `app/play/[gameSlug].tsx` brokers `postMessage` to the WebView. The
  protocol is the same one used by the web `mountGameInIframe` helper.
