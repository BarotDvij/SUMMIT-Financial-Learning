# ADR 0001 — Tech stack

Status: accepted
Date: 2026-05-26
Owners: founders

## Context

We chose a board-ready + web + native target on day one. We need a stack
that:

1. Scales from a single-classroom pilot to a multi-district deployment without
   a rewrite.
2. Lets one or two engineers ship across web and mobile without doubling work.
3. Has first-class Canadian privacy/residency story.
4. Lets non-engineers (eventually) author lessons.

## Decision

| Layer | Choice | Why |
| --- | --- | --- |
| Monorepo | Turborepo + pnpm workspaces | Cheapest path to share code between web + mobile + games. |
| Web | Next.js 16 (App Router, Cache Components) on Vercel | Best-in-class DX, Server Components let us pull DB data without separate API hops. |
| Mobile | Expo + Expo Router, distributed via EAS | One codebase for iOS/Android, OTA updates, friendly to small teams. |
| Auth + orgs | Clerk | Organizations, roles, MFA, SAML SSO on enterprise tier (board requirement). |
| Database | Postgres on Neon, Drizzle ORM | Strong typing, schema-first migrations, ca-central region path. |
| CMS | Sanity | Non-engineers author lessons; Portable Text renders cleanly on web + mobile. |
| Realtime | PartyKit (Phase 2+) | Ergonomic for live leaderboards; switchable to Pusher if reliability bites. |
| Payments | Stripe (self-serve) + manual invoicing (district) | Standard for SaaS; districts need POs anyway. |
| Analytics | PostHog | Self-hostable, EU region available, product-focused. |
| Errors | Sentry | Universal default. |
| Email | Resend | Modern, fits the stack. |
| AI | Vercel AI SDK + AI Gateway (Phase 3) | Avoids vendor lock-in. |

## Consequences

- We're betting on Next.js App Router specifics (Cache Components, Server
  Actions). If those change shape, we update.
- Clerk is paid. The trade-off is engineering hours we don't spend on auth.
  Plan to revisit at $5k+ MRR.
- Drizzle is younger than Prisma but gives us SQL transparency. Migrations
  must be reviewed before merge.

## Alternatives considered

- **Firebase + Flutter** (the original brainstorm). Rejected: Flutter's web
  story is rough, Firestore isn't a great fit for relational classroom data,
  and we'd be locked to Google for auth + DB.
- **Next + Supabase**. Reasonable. Supabase RLS is attractive. Rejected on
  cost predictability and lack of an established Canadian-region story.
- **SvelteKit**. Better DX in some ways, weaker hiring market, weaker
  integration story with the rest of the planned stack.
