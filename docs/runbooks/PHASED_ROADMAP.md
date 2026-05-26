# Phased Roadmap

Detail under each phase mirrors `summit_platform_foundations_23bfd3b8.plan.md`.
Use this file to track week-by-week execution.

## Phase 0 — Foundations (Weeks 1-3)

- [x] Repo + Turborepo wiring
- [x] Drizzle schema + first migration
- [x] Clerk middleware + tRPC role gating
- [x] @summit/game-sdk + Compound Match playable bundle
- [x] CI workflows
- [ ] Real Vercel + Neon + Clerk + Sanity provisioned (follow
      `SERVICE_PROVISIONING.md`)
- [ ] Privacy policy + ToS + DPA reviewed by counsel
- [ ] Legal entity formed (`COMPANY_FORMATION_CHECKLIST.md`)

## Phase 1 — Classroom Loop (Weeks 4-10)

- [ ] Teacher creates classroom, gets join code (UI + API done; needs Clerk roles wired in production)
- [ ] Student joins classroom (UI + API done)
- [ ] Lesson + Compound Match end-to-end on web (done, depends on Sanity content)
- [ ] Lesson + Compound Match end-to-end on mobile (game runs via WebView; lesson view to ship)
- [ ] Simple leaderboard (done, polling)
- [ ] PWA install on Chromebooks/iPads (manifest + icons present, ship icons)
- [ ] Internal alpha with 1 WRDSB teacher (outreach + PostHog funnels)

## Phase 2 — School Pilot (Weeks 11-20)

- [ ] Google Classroom OAuth + roster import
- [ ] Parental consent flow (double opt-in)
- [ ] 3 more mini-games + 1 Tier 2 game
- [ ] Assignments + due dates
- [ ] PartyKit realtime leaderboards
- [ ] School-admin role + console
- [ ] WCAG 2.1 AA audit + fixes
- [ ] Migrate prod DB to Canadian region

## Phase 3 — Board-Ready (Months 6-12)

- [ ] District-admin dashboard
- [ ] SAML SSO via Clerk Enterprise
- [ ] OneRoster CSV + SIS connectors
- [ ] Stripe Billing + manual invoicing
- [ ] AI tutor (Vercel AI SDK + AI Gateway)
- [ ] DPA signed with WRDSB
- [ ] Security baseline + audit logging end-to-end
