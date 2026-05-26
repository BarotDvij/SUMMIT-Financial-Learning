# AGENTS.md

Project-wide guidance for AI coding agents (Cursor, Claude Code, Codex, etc.).

## Project shape

- Turborepo + pnpm. Always `pnpm install` after pulling — never `npm install`.
- Apps live in `apps/`, libraries in `packages/`. Internal packages are referenced as `@summit/<name>` via `workspace:*`.
- The web app is Next.js 16 App Router. **Do not** use the Pages Router patterns (`getServerSideProps`, `_app.tsx`, etc.).
- The mobile app is Expo with Expo Router (file-system routing under `apps/mobile/app/`).
- The database layer is Drizzle. Never write raw SQL queries in feature code; always go through `packages/db` or `packages/api`.

## House rules

1. **Multi-tenant from day one.** Every DB row that holds user-generated content must carry `organization_id`. Every API procedure must enforce the caller's tenant. Never trust client-supplied `organization_id`.
2. **Roles are sacred.** The role enum is `super_admin | district_admin | school_admin | teacher | student | parent`. New roles need an ADR.
3. **Student writes are gated by consent.** Anything that creates or updates `xp_event`, `game_session`, `attempt`, or `assignment_submission` for a student must pass through `requireStudentWritable(userId)` in `packages/api`, which checks the `consent_record` state.
4. **Append-only event tables.** `xp_event` and `audit_log` are never updated or deleted. Build derived views/snapshots instead.
5. **TypeScript strict everywhere.** No `any`. Use `unknown` and narrow.
6. **Schemas first.** All API inputs/outputs use Zod schemas from `@summit/schema`. Server actions and tRPC procedures must validate.
7. **Server Components by default.** Mark Client Components explicitly. Data fetching prefers Server Components + `use cache` over client-side fetching.
8. **No secrets in the client.** Only `NEXT_PUBLIC_*` and `EXPO_PUBLIC_*` may be exposed.
9. **Games are framework-agnostic.** Each game lives in `packages/games/<slug>` and communicates with the host via `@summit/game-sdk`. They must build to both a web `<iframe>` target and a `WebView` target with the same bundle.
10. **Accessibility is non-negotiable.** Target WCAG 2.1 AA. Every interactive element needs a label and keyboard path. Run `pnpm lint` (includes `eslint-plugin-jsx-a11y`) before pushing.

## Commands

```bash
pnpm dev               # everything in parallel
pnpm web               # web only
pnpm mobile            # mobile only
pnpm studio            # Sanity only
pnpm typecheck         # all packages
pnpm lint              # all packages
pnpm test              # all packages
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## When in doubt

- Read the ADR for the area you're touching (`docs/adr/`).
- If no ADR exists for a meaningful decision, create one before you build.
- Compliance questions: check `docs/legal/`. When unsure, escalate rather than guess.
