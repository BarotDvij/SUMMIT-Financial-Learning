# Data Residency Plan (PIPEDA + MFIPPA)

WRDSB and most Ontario boards expect personal information about students
processed under MFIPPA to stay in Canada. We start in US-East for development
speed and move prod to a Canadian region before the pilot expands.

## Status today (Phase 0)

| Service | Default region | Holds student PII? | Migration plan |
| --- | --- | --- | --- |
| Vercel functions | Global edge / iad1 | No (no persistent PII) | Pin to a Canadian region pair when Vercel exposes one stable. Phase 2. |
| Neon Postgres | `aws-us-east-2` | Yes — primary store | Provision new project in `aws-ca-central-1`, replicate, switch endpoint. Phase 2. |
| Clerk | US | Yes — identifiers + emails | Clerk Enterprise offers data residency commitments; negotiate as part of board contracts. Phase 3. |
| Sanity | EU/US | No — only lesson content (no student PII) | Keep as is. |
| PostHog (EU) | EU | Pseudonymous events keyed by Clerk id | Acceptable today; revisit if a board objects. |
| Sentry | US | Stack traces scrubbed of PII | Acceptable; document in DPA. |
| Resend | US | Email metadata | Acceptable; emails to school accounts are not in scope of MFIPPA student PI. |
| Stripe (Phase 3) | US/IE | No — billing contacts only | Acceptable; districts pay by invoice anyway. |

## Migration steps for Neon (Phase 2)

1. Provision a new Neon project in `aws-ca-central-1`.
2. Run `pnpm db:generate && pnpm db:migrate` against the new project to
   produce an empty schema-matching DB.
3. Set up logical replication from the existing US project to the new
   Canadian project. Verify lag < 30s for an hour.
4. Schedule a 10-minute maintenance window.
5. Stop new writes (`Vercel pause`), switch `DATABASE_URL`/`DATABASE_URL_UNPOOLED`
   to the Canadian project, redeploy, re-enable.
6. Wait 24h, then delete the US project.

## Pre-pilot checklist

- [ ] Neon production in `aws-ca-central-1`
- [ ] Clerk DPA + sub-processor list shared with board
- [ ] All other vendors listed in [docs/legal/DPA_TEMPLATE.md Schedule B](../legal/DPA_TEMPLATE.md)
- [ ] Documented data-flow diagram for board legal review
- [ ] DPIA / PIA template completed for WRDSB (Phase 3)
