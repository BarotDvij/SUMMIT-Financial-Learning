# @summit/studio

Sanity Studio for authoring lessons + modules. Hosted at `summit.sanity.studio`
or self-hosted alongside the web app.

## Local dev

```bash
pnpm --filter @summit/studio dev
# http://localhost:3333
```

Set `SANITY_STUDIO_PROJECT_ID` (and optionally `SANITY_STUDIO_DATASET`) in
`apps/studio/.env`. Use `sanity login` then `sanity init` from this directory
to bind to an existing project.

## Deploying

```bash
pnpm --filter @summit/studio deploy
```

## Schema overview

- `module` — top-level topic (e.g. Compound Interest)
- `lesson` — Portable Text body + `xpReward` + optional `gameSlug`

The Next.js webhook at `/api/webhooks/sanity` listens for publishes and
upserts `lesson_ref` rows so the API can join on lesson without round-tripping
to Sanity.
