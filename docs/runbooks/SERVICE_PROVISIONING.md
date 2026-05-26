# Service Provisioning (Phase 0)

Run through this list to take the empty repo from "compiles" to "deploys".
Each step is independent — do them in any order.

## 1. Vercel project

```bash
npx vercel login
npx vercel link --project summit-web ./apps/web
```

Create the project via the dashboard or CLI. Then:

- Set the **Root Directory** to `apps/web`.
- Set the **Install Command** to `pnpm install --frozen-lockfile`.
- Set the **Build Command** to `pnpm --filter @summit/web build`.
- Use the **Output Directory** default (`.next`).
- Add an `ignored build step` matching `git diff HEAD^ HEAD --quiet -- apps/web packages`.

## 2. Neon Postgres

1. Vercel Marketplace → **Neon** → create a project.
2. Create branches `main`, `staging`, `preview`.
3. Copy the pooled and unpooled connection strings into Vercel env:
   - `DATABASE_URL` (pooled — used by the app)
   - `DATABASE_URL_UNPOOLED` (direct — used by migrations)
4. Run the first migration:

```bash
cp .env.example .env.local && edit
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

5. Plan the Canadian region migration (see
   `docs/runbooks/DATA_RESIDENCY.md`).

## 3. Clerk

1. Create a Clerk application.
2. Enable **Organizations** (under "Configure" → "Organizations").
3. In the JWT template, add:
   - `org_id` claim mapped to the active organization
   - `org_role` claim mapped to the active membership role
4. Copy the publishable key and secret key into Vercel env (`CLERK_*`).
5. Set up a webhook for `user.created` pointing to
   `${NEXT_PUBLIC_APP_URL}/api/webhooks/clerk`. Copy the signing secret
   into `CLERK_WEBHOOK_SECRET`.
6. For the mobile app, also set `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in EAS.

## 4. Sanity

```bash
cd apps/studio
npx sanity init
```

Choose `production` dataset. Copy the project id into:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `SANITY_STUDIO_PROJECT_ID`

Create read and write API tokens at
[manage.sanity.io](https://manage.sanity.io), set as `SANITY_API_READ_TOKEN`
and `SANITY_API_WRITE_TOKEN`.

## 5. PostHog

1. Sign up at posthog.com (pick the EU region for closer-to-Canada residency).
2. Create a project. Copy the project key.
3. Set:
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`
   - `EXPO_PUBLIC_POSTHOG_KEY`
   - `EXPO_PUBLIC_POSTHOG_HOST`

## 6. Sentry

1. Create projects `summit-web` and `summit-mobile`.
2. Copy DSNs:
   - `SENTRY_DSN` (server-side, web)
   - `NEXT_PUBLIC_SENTRY_DSN` (client, web)
   - `EXPO_PUBLIC_SENTRY_DSN` (mobile)
3. Create an auth token with `project:releases` scope: `SENTRY_AUTH_TOKEN`.

## 7. Resend

1. Verify `summitlearn.ca` domain in Resend.
2. Generate an API key. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.

## 8. Expo + EAS (mobile)

```bash
cd apps/mobile
npx eas-cli login
npx eas-cli init --id <pick>
```

Update the `extra.eas.projectId` in `app.json` with the returned id.

Add EAS secrets:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value ...
eas secret:create --scope project --name EXPO_PUBLIC_APP_URL --value https://app.summitlearn.ca
```

Create `eas.json`:

```json
{
  "build": {
    "preview": { "distribution": "internal", "channel": "preview" },
    "production": { "channel": "production" }
  },
  "submit": { "production": {} }
}
```

## 9. Stripe (defer to Phase 3)

When ready:

1. Create a Stripe account, enable Test mode.
2. Add products + prices: `summit-classroom-monthly`, `summit-classroom-yearly`.
3. Copy `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Create a webhook to `/api/webhooks/stripe` for `checkout.session.completed`,
   `customer.subscription.*`. Set `STRIPE_WEBHOOK_SECRET`.

## 10. AI Gateway (defer to Phase 3)

1. Provision via Vercel AI Gateway or Cloudflare AI Gateway.
2. Set `AI_GATEWAY_API_KEY` and `AI_GATEWAY_BASE_URL`.

## Validation

After everything's set:

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Visit http://localhost:3000, sign up, you should land on `/dashboard`.
