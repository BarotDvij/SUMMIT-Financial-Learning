# Handoff — What's in the repo and what's left to do

This file maps each todo from `summit_platform_foundations_23bfd3b8.plan.md`
to the files now in the repo and the human follow-up steps.

## Phase 0

### p0-legal-brand — Legal & brand

**Shipped:**
- `docs/legal/COMPANY_FORMATION_CHECKLIST.md` — incorporation, domain, insurance.
- `docs/legal/COUNSEL_SHORTLIST.md` — privacy lawyer shortlist + ask.
- `docs/legal/PRIVACY_POLICY.md` — counsel-ready draft.
- `docs/legal/TERMS_OF_SERVICE.md` — counsel-ready draft.
- `docs/legal/DPA_TEMPLATE.md` — for board negotiation.
- `docs/legal/PARENTAL_CONSENT.md` — flow + verbatim notice text.
- `docs/brand/BRAND_TOKENS.md` + `docs/brand/README.md`.

**Human follow-up:**
- Incorporate, sign founders' agreement.
- Retain counsel; review the templates above.
- Move brand assets from `../Branding Kit/` into `apps/web/public/brand/`.

### p0-monorepo — Turborepo

**Shipped:** `package.json`, `pnpm-workspace.yaml`, `turbo.json`,
`tsconfig.base.json`, all `apps/*` and `packages/*` packages.

### p0-services — Service provisioning

**Shipped:**
- `.env.example` covers every key.
- `apps/web/vercel.json`.
- `apps/mobile/eas.json`.
- `apps/web/sentry.*.config.ts` + `instrumentation.ts`.
- `apps/web/src/lib/sanity.ts` and `apps/web/src/lib/posthog.tsx`.
- `docs/runbooks/SERVICE_PROVISIONING.md` walks every signup.

**Human follow-up:** create the accounts, paste the keys, deploy.

### p0-data-model — Drizzle schema

**Shipped:** full schema in `packages/db/src/schema/`, relations,
`packages/db/src/migrate.ts`, idempotent seed in
`packages/db/src/seed/index.ts`.

### p0-auth-rbac — Clerk + roles

**Shipped:**
- `apps/web/src/middleware.ts` (Clerk middleware).
- `apps/mobile/app/_layout.tsx` (Clerk provider + secure-store token cache).
- `packages/schema/src/roles.ts` (canonical role enum + permission matrix).
- `packages/api/src/trpc.ts` (`protectedProcedure`, `requireRole`,
  `requirePermission`, `studentWritable`).
- `apps/web/src/app/api/webhooks/clerk/route.ts` to provision SUMMIT users
  on Clerk sign-up.

### p0-ci-cd — CI

**Shipped:** `.github/workflows/ci.yml` (lint, typecheck, test),
`db-check.yml` (Postgres-in-CI drift check + migration smoke),
`eas-preview.yml` (PR preview builds when EXPO_TOKEN secret is set),
`sentry-release.yml` (source-map upload).

## Phase 1

### p1-classroom

**Shipped:**
- API: `classroom.create | mine | join | roster` in
  `packages/api/src/routers/classroom.ts`.
- 6-char join code generator in `packages/api/src/util/join-code.ts`.
- Pages: `/classes`, `/classes/new`, `/classes/[id]`, `/classes/join-form.tsx`.
- Audit log writes via `recordAudit`.

### p1-first-lesson-game

**Shipped:**
- Playable Compound Match game at
  `apps/web/public/games/compound-match/` (with source-of-truth copy under
  `packages/games/compound-match/src/`).
- Lesson page `/lessons/[id]` reads from Drizzle and (if configured) Sanity.
- Game host page `/play/[gameSlug]` mounts the game in an iframe via the
  game-sdk.
- Seed inserts the lesson, game, and 3 demo students with consent.
- Leaderboard page `/leaderboard` reads from `xp_event`.

### p1-pwa-mobile-shell

**Shipped:**
- `apps/web/src/app/manifest.webmanifest` + theme color + apple-web-app meta.
- `apps/mobile/app/play/[gameSlug].tsx` — WebView host running the same
  game bundle through the same protocol.
- `docs/runbooks/PWA.md` lists the icon files to generate before pilot.

**Human follow-up:** generate `/public/brand/icon-{192,512,maskable}.png`.

### p1-internal-alpha

**Shipped:**
- `docs/runbooks/INTERNAL_ALPHA.md` — outreach + retro plan.
- `apps/web/src/lib/analytics.ts` — typed PostHog event helpers.

**Human follow-up:** book the WRDSB teacher; define PostHog funnels in the
PostHog UI from the event names listed in `analytics.ts`.

## Phase 2

### p2-roster-consent

**Shipped:**
- `packages/db/src/schema/consent.ts` + `parent_student_link`.
- `studentWritable` middleware gates all student writes.
- `apps/web/src/app/(app)/consent/page.tsx` (placeholder UI).
- API stubs: `roster.importOneRosterCsv`, `roster.linkGoogleClassroom`.
- `docs/runbooks/GOOGLE_CLASSROOM.md` — OAuth + scopes.

### p2-content-expansion

**Shipped:** `docs/runbooks/CONTENT_EXPANSION.md` lists the next 4 games +
mechanics. Assignment schema + tRPC router already in place.

### p2-realtime-leaderboard

**Shipped:** `docs/runbooks/REALTIME_LEADERBOARD.md`. Leaderboard API
already returns the right shape; the swap to PartyKit is purely additive.

### p2-school-admin

**Shipped:** `docs/runbooks/SCHOOL_AND_DISTRICT_ADMIN.md`. Role enum +
`requirePermission('analytics.view.school')` already wired.

### p2-data-residency

**Shipped:** `docs/runbooks/DATA_RESIDENCY.md` — current state, migration
plan, pre-pilot checklist.

## Phase 3

### p3-district-admin

**Shipped:**
- `/admin/page.tsx` (existing district overview).
- `adminRouter.districtSummary` + `recentAuditLog`.
- Expansion plan in `docs/runbooks/SCHOOL_AND_DISTRICT_ADMIN.md`.

### p3-sso-sis

**Shipped:** `docs/runbooks/SSO_SIS.md` + `roster.importOneRosterCsv` stub.

### p3-billing

**Shipped:** `docs/runbooks/BILLING.md`, `billing` tRPC router (stub
returning Stripe checkout URL), `subscription` + `invoice` schema, Stripe
webhook route.

### p3-ai-tutor

**Shipped:** `docs/runbooks/AI_TUTOR.md`, `tutor` tRPC router stubbed
behind the `AI_GATEWAY_API_KEY` flag.

### p3-board-launch

**Shipped:** `docs/runbooks/BOARD_LAUNCH.md` — full pre-signing checklist.

---

## What to do next (recommended order)

1. **Clean up duplicate clone.** The workspace has both
   `SUMMIT-Financial-Learning/` (the real repo, everything is here) and
   `SUMMIT-Financial-Learning-1/` (empty duplicate). Delete the latter.
2. **Move the repo out of `/Applications/`.** Keeping a working git repo
   inside macOS' `/Applications` is unusual and the spaces in the parent
   path break some native toolchains (Xcode/EAS). Copy to e.g.
   `~/code/summit/`.
3. `pnpm install` then `pnpm typecheck`. Fix anything I missed.
4. Provision services per `docs/runbooks/SERVICE_PROVISIONING.md`.
5. `pnpm db:generate && pnpm db:migrate && pnpm db:seed`.
6. `pnpm dev` and sign up — the dashboard, classes, lesson, game should
   all work end-to-end.
7. Push the branch, open a PR, watch CI go green.
8. Engage privacy counsel (`docs/legal/COUNSEL_SHORTLIST.md`).
9. Book the WRDSB teacher (`docs/runbooks/INTERNAL_ALPHA.md`).
