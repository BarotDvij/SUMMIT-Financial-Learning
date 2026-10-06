# Spec: Parental consent flow + service setup

Status: **draft, awaiting review**. Date: 2026-10-06.

## Capability map

| Module id | Responsibility | Depends on |
|---|---|---|
| `consent` | Student-initiated, parent-confirmed double opt-in; withdrawal; consent gate | — (emails log to console until Resend exists) |
| `service-setup` | Clerk, Neon, Resend wired locally and on Vercel; migrations + webhooks live | — |

Build order: both can proceed in parallel. `consent` is built and tested against local
Postgres now. `service-setup` waits on you creating accounts. The Phase 1 alpha needs both.

---

## Module `consent`

### Objective

A student who signs up directly can't record any activity until a parent or guardian
has consented by email, twice. A parent can withdraw at any time from a link in any
consent email, and that blocks the student's writes at once. This implements the
direct-signup flow in `docs/legal/PARENTAL_CONSENT.md`, starting from the student
rather than the parent (decided 2026-10-06).

### Flow

```
Student (signed in)            SUMMIT                         Parent (no account)
───────────────────            ──────                         ───────────────────
/consent: enter parent email ─▶ consent_record (pending)
                                email #1 "Review consent" ──▶ /guardian/review/<token>
                                                               reads Notice of Collection,
                                                               ticks 2 boxes (not pre-ticked),
                                                               submits ─▶ granted_at set
                                email #2 "Confirm" ─────────▶ /guardian/confirm/<token>
                                                               presses Confirm ─▶ confirmed_at set
Student writes unlocked  ◀──── gate passes
                                (every email has a withdraw link)
                                                              /guardian/withdraw/<token>
                                                               presses Withdraw ─▶ withdrawn_at set
Student writes blocked   ◀──── gate fails
```

### Acceptance criteria

1. **Gate.** `requireStudentWritable` passes only when the student has a `consent_record`
   with `granted_at` **and** `confirmed_at` set and `withdrawn_at` null. Today it checks
   `granted_at` only, so the gate changes to also require `confirmed_at`. Students with
   `consent_required = false` are unaffected.
2. **Request.** A signed-in student submits a parent email on `/consent`. This creates a
   pending `consent_record` (`method: 'direct_signup'`) and sends email #1. If a pending
   request already exists, re-submitting resends the email to the new address and reuses
   the request, at most once every 10 minutes. A student who already has active consent
   can't submit a new request.
3. **Review page** (`/guardian/review/<token>`, public). It shows the student's first
   name, the Notice of Collection exactly as written in `PARENTAL_CONSENT.md`, and links
   to the Privacy Policy and Terms. It has two unticked checkboxes, and submit is disabled
   until both are ticked. Submitting sets `granted_at`, stores the truncated IP and the
   user agent, and sends email #2. The link expires after 24 hours and stops working
   once used.
4. **Confirm page** (`/guardian/confirm/<token>`, public). It shows one Confirm button.
   Pressing it sets `confirmed_at` and updates the `user.consent_granted_at` mirror. The
   link expires after 24 hours and stops working once used. Page loads change nothing;
   only the button press does, so email link scanners can't confirm by accident.
5. **Withdraw page** (`/guardian/withdraw/<token>`, public). It shows one Withdraw button.
   Pressing it sets `withdrawn_at` and clears the mirror. The link has no expiry and
   works until consent is withdrawn.
6. **Version pinning.** Every record stores `policy_version`, `terms_version`, and the
   SHA-256 of the exact notice text rendered. The text and versions live in one constant
   that both the page and the hash read.
7. **Audit.** Grant, confirm and withdraw each write `audit_log` rows (`grant_consent`
   or `withdraw_consent`) with the student's `organization_id`.
8. **Student status.** `/consent` shows one of: not requested, awaiting the parent's
   review, awaiting the parent's confirmation, active, or withdrawn.
9. **Email.** Emails go through Resend's HTTP API using `fetch`, with no new
   dependency. Without `RESEND_API_KEY`, the email and its links are logged to the
   server console instead. That is dev mode; production refuses to start without the key.
10. **Tenant fix.** Clerk `user.created` puts direct signups in a `direct-consumers`
    organization (`kind: 'direct_consumer'`), created on first use, instead of the first
    organization the database returns.
11. **Accessibility.** The guardian pages meet WCAG 2.1 AA: labelled checkboxes, keyboard
    operable, visible focus, and errors announced to screen readers.

### Design

- **Links** are `HMAC-SHA256(CONSENT_LINK_SECRET, recordId.purpose.expiry)` signatures
  made with `node:crypto`. Nothing new is stored. "Single use" comes from record state: a
  review link is dead once `granted_at` is set, and a confirm link is dead once
  `confirmed_at` is set. Signatures are compared with `timingSafeEqual`.
- **Schema change:** add `consent_record.parent_email varchar(320)`. It's needed for
  email #2 and for withdrawal confirmations. Migration `0002`.
- **API:** a `consent` tRPC router in `packages/api`.
  - `request` and `status` use `protectedProcedure` (student).
  - `view`, `grant`, `confirm` and `withdraw` use `publicProcedure` and take a token.
    The token's signature is the authorisation.
  - Inputs are Zod schemas in `@summit/schema`.
  - Pages call it through the server caller. No raw SQL in `apps/web`.
- **Routes:** add `/guardian/(.*)` to the public routes in `apps/web/src/proxy.ts`.
- **Docs:** update ADR 0005 to describe a gate that reads `consent_record` and requires
  `confirmed_at`.

### Out of scope (tracked)

- **Deletion 30 days after withdrawal:** before the pilot holds real data (Phase 2).
- **Parent accounts and dashboard; parent-first signup.**
- **Age check:** not collecting age at signup, so every direct signup still requires
  consent. The doc's threshold of 16 needs a birth-year field (open question 2).
- **Mobile consent screen:** mobile students see the "consent required" error and finish
  the flow on the web.

---

## Module `service-setup`

### Objective

Take the app from "builds" to "runs end to end on Vercel with real auth, data and email",
following `docs/runbooks/SERVICE_PROVISIONING.md`.

### Who does what

| Step | You | Me |
|---|---|---|
| Clerk app | Create the app and copy the keys | Register the `user.created` webhook URL; test sign-up → `user` row |
| Neon project | Create via the Vercel Marketplace (pick `aws-ca-central-1` if offered, which makes the Phase 2 residency migration unnecessary) | `pnpm db:migrate`, seed staging only, confirm with `/api/health` |
| Resend | Sign up and verify `summitlearn.ca` (DNS) | Wire `RESEND_API_KEY` / `RESEND_FROM_EMAIL`; send a test consent email |
| Vercel | Authorise the Vercel connector, or run `vercel login` | Link `apps/web`, add env vars per environment, deploy a preview |
| Sanity | (have it) | Set the project id and dataset; check the lesson fetch |
| Secrets | Paste keys into `.env.local` yourself, not into chat | Read only key names (never values) when verifying |

### Acceptance criteria

1. `pnpm dev` with `.env.local`: sign up in Clerk → a `user` row appears in Neon in the
   `direct-consumers` organization → the consent email arrives through Resend.
2. A Vercel preview deploy builds, `/api/health` returns 200, and sign-in works.
3. `.env.example` lists every key the code reads, including the new `CONSENT_LINK_SECRET`,
   and no unused ones.

---

## Commands

```
pnpm typecheck          pnpm lint          pnpm test
DATABASE_URL=postgres://postgres:postgres@localhost:54329/postgres pnpm test   # with DB suites
pnpm db:generate        pnpm db:migrate    pnpm dev
```

## Testing strategy

- **Integration, in `packages/api/src/consent.test.ts`, against Postgres:** the full
  happy path; an expired link; a reused link; a tampered signature; withdraw then gate
  fails; a resend within 10 minutes is rejected; a request when consent is already
  active is rejected; another student's token can't be used to read a different
  student's record.
- **Gate:** the existing house-rule tests, plus a case where `granted_at` is set but
  `confirmed_at` isn't, which must be blocked.
- **Static:** extend the rule 8 check to the guardian pages.
- **Manual:** run the flow in the browser with emails logged to the console; tab through
  the pages with the keyboard only.

## Boundaries

- **Always:**
  - run lint, typecheck and tests before each commit
  - validate every token and input with Zod plus the signature check
  - write `audit_log` rows for consent changes
- **Ask first:**
  - any schema change beyond `parent_email`
  - adding dependencies
  - changing the wording in `PARENTAL_CONSENT.md` (the copy needs legal review)
- **Never:**
  - log or commit secrets
  - pre-tick consent boxes
  - let a GET request change consent state
  - update or delete `xp_event` or `audit_log` rows

## Open questions

1. **Legal:** `PARENTAL_CONSENT.md` is marked "template — not legal advice". Can the
   alpha (one WRDSB teacher) use it before counsel reviews it, or is the alpha
   school-provisioned only?
2. **Age:** keep requiring consent for every direct signup, or add birth year now and
   skip consent at 16 and over?
3. **Sender:** is `no-reply@summitlearn.ca` the right sender, and do you control DNS for
   that domain?
