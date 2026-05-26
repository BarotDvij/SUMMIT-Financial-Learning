# ADR 0002 — Multi-tenant from day one

Status: accepted
Date: 2026-05-26

## Decision

Every domain table holds an explicit `organization_id`. A single Postgres
database hosts all tenants. We deliberately do **not** start with
single-tenant + later migrate.

## Rationale

- Migrating a single-tenant schema to multi-tenant after launch is
  catastrophically expensive once classrooms are live.
- Per-district isolation is offered as a *future* tier (separate Neon project
  or read-replica) when a board requires it; the schema already supports it.

## Enforcement

1. Every tRPC procedure that touches tenant data must filter by
   `ctx.user.organizationId` from the server-derived context. The client
   never sends `organizationId`.
2. A planned Postgres RLS policy (Phase 2) is added as defense-in-depth on
   all "writes by student" paths.
3. Code review checklist includes a tenant filter check.
4. CODEOWNERS routes DB changes through a privacy-aware reviewer.
