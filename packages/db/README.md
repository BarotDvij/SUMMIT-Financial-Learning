# @summit/db

Drizzle schema + migrations + seeds for the SUMMIT platform.

## Files

```
src/
  client.ts         Postgres + Drizzle connection
  index.ts          public exports
  migrate.ts        runs pending migrations
  seed/index.ts     loads demo data (WRDSB sample district, 1 teacher, 3 students, 1 lesson, 1 game)
  schema/
    enums.ts        pg enums (role, tier, xp_event_kind, ...)
    organization.ts organization, school
    user.ts         user, parent_student_link
    classroom.ts    classroom, enrollment
    consent.ts      consent_record
    curriculum.ts   module, lesson_ref (mirror of Sanity docs)
    game.ts         game (catalog), game_session
    progress.ts     xp_event (append-only), badge, achievement
    assignment.ts   assignment, assignment_submission
    billing.ts      subscription, invoice
    audit.ts        audit_log (append-only)
    relations.ts    Drizzle relations for typed joins
drizzle/            generated SQL migrations (created by `pnpm db:generate`)
```

## Commands

From the repo root:

```bash
pnpm db:generate        # diff schema → write SQL into ./drizzle
pnpm db:migrate         # apply pending migrations to DATABASE_URL_UNPOOLED
pnpm db:push            # dev-only: drizzle-kit push (skip migration files)
pnpm db:seed            # load demo data
pnpm db:studio          # browse the DB at https://local.drizzle.studio
```

## Multi-tenant guardrails

Every domain table that holds tenant-scoped data carries an explicit `organization_id` (and most also reference `classroom_id`). API code MUST always filter by tenant. A future migration will install a row-level security policy as a defense-in-depth layer for the `student.write` paths.

## Append-only tables

- `xp_event`
- `audit_log`

These are written through repository functions in `packages/api/src/repositories/` only. Direct `UPDATE` or `DELETE` is a bug.
