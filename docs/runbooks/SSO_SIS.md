# SAML SSO + SIS Integration (Phase 3)

The board purchasing motion requires single sign-on and roster sync. Two
deliverables.

## 1. Clerk Enterprise SAML SSO

Clerk handles the heavy lifting; we configure per-organization.

Per board:
1. Board IT provides their IdP metadata (Microsoft Entra ID for most
   Ontario boards, occasionally Google Workspace).
2. In Clerk Dashboard → Organizations → the board's org → **Enterprise SSO**,
   upload the metadata and copy the ACS URL back to the IdP team.
3. Map JIT-provisioning attributes:
   - `email` → primary email
   - `firstName`, `lastName`
   - `groups` → role (teacher / school_admin / district_admin)
4. Update the org's domain claims so any matching email auto-routes to SSO.
5. Smoke test with a board test user.

Risks:
- IdP attribute mappings drift. We require a quarterly verification.
- Clerk Enterprise tier is required ($-cost). Build it into the contract.

## 2. OneRoster v1.2 CSV import

OneRoster is the lowest-common-denominator format every Canadian SIS can
export (Aspen, PowerSchool, etc.). We accept a zipped CSV bundle and upsert
schools/classes/users/enrollments.

API: `roster.importOneRosterCsv` (stub already present in
`packages/api/src/routers/roster.ts`).

Bundle layout (per OneRoster):
- `manifest.csv`
- `orgs.csv`
- `users.csv`
- `classes.csv`
- `enrollments.csv`
- `academicSessions.csv`

Implementation outline:
1. Validate manifest version + presence of required files.
2. Within a transaction:
   - Upsert `organization` and `school` from `orgs.csv`.
   - Upsert `user` rows with `external_id` mirroring `users.csv.sourcedId`.
   - Upsert `classroom` rows from `classes.csv`.
   - Upsert `enrollment` rows; never delete — flip `left_at` when an
     enrollment goes missing on a subsequent import.
3. Emit one `audit_log` row per upsert.
4. Return a per-entity summary (created / updated / unchanged / skipped).

## 3. Real-time SIS connectors (deferred)

Aspen and PowerSchool have webhook + REST APIs. We add direct connectors
after we've gone through at least three OneRoster imports and understand
the messy edges (mid-year transfers, name changes, deactivation policies).
