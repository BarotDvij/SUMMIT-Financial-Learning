# ADR 0005 — Parental consent is enforced at the API layer

Status: accepted
Date: 2026-05-26

## Decision

Every API procedure that creates or mutates student data routes through
`studentWritable` in `packages/api/src/trpc.ts`. That middleware throws a
`FORBIDDEN` error with `code: 'CONSENT_REQUIRED'` when:

- `user.role === 'student'` AND
- `user.consent_required === true` AND
- `user.consent_granted_at IS NULL`.

A nightly job (Phase 2) revalidates `consent_granted_at` against the latest
non-withdrawn `consent_record` row so the column never lies.

## Why an explicit middleware

- Spreading the check across handlers guarantees we miss one.
- Routing through one middleware lets us add audit logging, rate limiting,
  and parental notifications uniformly.
- Tests can assert that no `student_user_id`-writing procedure exists
  without the middleware.

## See also

- `docs/legal/PARENTAL_CONSENT.md` — the user-facing flow.
- `consent_record` table in `packages/db/src/schema/consent.ts`.
