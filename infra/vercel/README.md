# Vercel infrastructure notes

The web app deploys from `apps/web/` with `vercel.json` (see below). For
Phase 0 we run the default Node.js + Edge runtime on Vercel's global edge
network. Phase 2 pins the function regions to a Canadian region pair
once the Vercel platform exposes one; see `docs/runbooks/DATA_RESIDENCY.md`.

## First-time provisioning

```bash
# From the repo root:
npx vercel login
npx vercel link --project summit-web ./apps/web
```

Then add the env vars from `.env.example` via the Vercel dashboard or:

```bash
npx vercel env add CLERK_SECRET_KEY production
npx vercel env add DATABASE_URL production
# ...
```

The Neon, Clerk, Sanity, and Stripe integrations are also available via
the Vercel Marketplace and will auto-populate the relevant env vars.

## Domains

- Production: `app.summitlearn.ca`
- Marketing alias: `summitlearn.ca`, `www.summitlearn.ca`
- Studio: `studio.summitlearn.ca` (CNAME to Sanity)

## Preview deploys

Every PR opens a preview URL. Add the URL as a comment on the PR for the
team to test. Previews share a "preview" Neon branch so we never write
preview data into prod.
