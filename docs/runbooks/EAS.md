# EAS Build & Submit (Phase 1+)

`apps/mobile/eas.json` declares three profiles:

- `development` — a dev client build, for local debugging.
- `preview` — internal distribution; PRs auto-build via
  `.github/workflows/eas-preview.yml`.
- `production` — store-bound builds.

## First-time setup

```bash
cd apps/mobile
npx eas-cli login
npx eas-cli init   # binds an Expo project id; paste into app.json
```

Set the GitHub repo secret `EXPO_TOKEN` so the preview workflow can build.
Get it from [Expo → Access Tokens](https://expo.dev/accounts/_/settings/access-tokens).

## Channels

| Channel | Purpose | Promotion |
| --- | --- | --- |
| `development` | Local dev clients | n/a |
| `preview` | Per-PR previews | Manual via `eas update --branch pr-<n>` |
| `production` | Store users | Promoted from `preview` after QA |

## Submit

```bash
eas submit -p ios --profile production
eas submit -p android --profile production
```

Apple: prerequisite is a paid Apple Developer Program seat ($99/yr) under
`ca.summitlearn.app` and an App Store Connect listing.
Google: Play Console listing under `ca.summitlearn.app` and an internal
testing track.
