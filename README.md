# SUMMIT Financial Learning — Platform

A gamified financial-literacy platform for Canadian 6-12 students, starting with the Waterloo Region District School Board (WRDSB). Web + native mobile, multi-tenant, designed to scale into district-wide deployments.

## Stack

| Layer | Choice |
| --- | --- |
| Monorepo | Turborepo + pnpm workspaces |
| Web | Next.js 16 (App Router, Cache Components) on Vercel |
| Mobile | Expo (React Native) with Expo Router, distributed via EAS |
| Auth + Orgs | Clerk |
| Database | Postgres on Neon, Drizzle ORM |
| Lesson CMS | Sanity |
| Realtime | PartyKit (Phase 2+) |
| Payments | Stripe Billing (Phase 3+) |
| AI tutor | Vercel AI SDK + AI Gateway (Phase 3+) |
| Analytics | PostHog |
| Errors | Sentry |
| Email | Resend |
| CI/CD | GitHub Actions + Vercel previews + EAS Build |

See [docs/adr/](./docs/adr/) for the per-layer rationale.

## Repo layout

```
apps/
  web/            Next.js 16 (PWA, App Router)
  mobile/         Expo app (Expo Router)
  studio/         Sanity Studio
packages/
  ui/             Cross-platform UI primitives (Tailwind + NativeWind)
  game-sdk/       postMessage/WebView bridge for embedded games
  games/
    compound-match/   First mini-game (Phaser 3)
  schema/         Zod schemas + shared types
  db/             Drizzle schema + migrations + seeds
  api/            tRPC routers consumed by web and mobile
  config/         eslint, tsconfig, tailwind presets
infra/
  vercel/         project.json + region config
  github/         workflow templates
docs/
  adr/            architecture decision records
  brand/          brand tokens
  legal/          privacy policy, ToS, DPA, parental consent templates
  runbooks/       operational runbooks
.github/
  workflows/      CI pipelines
```

## Getting started

```bash
# Use Node 22 (the .nvmrc is honoured by nvm/fnm/Volta)
nvm use

# Enable pnpm via Corepack (ships with Node 22)
corepack enable
corepack prepare pnpm@9.15.0 --activate

# Install
pnpm install

# Copy env template
cp .env.example .env.local

# Start everything in dev
pnpm dev
```

Individual apps:

```bash
pnpm web      # Next.js on http://localhost:3000
pnpm mobile   # Expo dev server, scan QR with Expo Go
pnpm studio   # Sanity Studio on http://localhost:3333
```

Database:

```bash
pnpm db:generate   # generate SQL from Drizzle schema
pnpm db:migrate    # apply migrations
pnpm db:seed       # seed demo data (1 district, 1 school, 1 teacher, 1 class, 3 students)
pnpm db:studio     # Drizzle Studio
```

## Branches and PR flow

- `main` — protected, deploys to production on Vercel + EAS production channel.
- `dev` — long-lived integration branch, deploys to a staging environment.
- Feature branches: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- Every PR triggers Vercel preview + EAS preview channel (`pr-<number>`).

## Compliance posture

This platform processes Canadian student personal information and is built to meet PIPEDA + MFIPPA obligations from day one. See [docs/legal/](./docs/legal/). Do not ship student-facing features without confirming the consent path in [PARENTAL_CONSENT.md](./docs/legal/PARENTAL_CONSENT.md).

## Roadmap

- **Phase 0 (current)** — foundations: monorepo, services, schema, auth, CI.
- **Phase 1** — classroom-pilot loop: 1 lesson + 1 game + XP + leaderboard, on web and mobile, internally tested with a WRDSB teacher.
- **Phase 2** — school pilot: Google Classroom roster import, parental consent, 4 games, real-time leaderboard, school-admin role, Canadian DB region.
- **Phase 3** — board-ready: district admin, SAML SSO, OneRoster/SIS, Stripe billing, AI tutor, DPA signed with WRDSB.

See [docs/runbooks/PHASED_ROADMAP.md](./docs/runbooks/PHASED_ROADMAP.md) for the per-week breakdown.

## License

MIT for code (see [LICENSE](./LICENSE)). Brand assets, lesson content, and game art are proprietary and not licensed for redistribution.
