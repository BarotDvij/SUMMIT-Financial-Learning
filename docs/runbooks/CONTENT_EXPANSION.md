# Content Expansion Plan (Phase 2)

We need 4 mini-games and 4 paired lessons covering all of Tier 1 plus the
first Tier 2 module. Each game must:

- Run inside the existing `@summit/game-sdk` protocol (no new host work).
- Take 3-6 minutes to play.
- Cap XP at 100 per session (server enforces).
- Score deterministically so teachers can trust the leaderboard.

## Tier 1 (fundamentals)

| Slug | Topic | Mechanic | Status |
| --- | --- | --- | --- |
| `compound-match` | Compound interest | Multiple-choice future value | Shipped |
| `budget-blitz` | Budgeting | Drag spend items into needs/wants/savings buckets within a budget | Planned |
| `credit-card-clash` | Credit + minimum payments | Pick the payment strategy that minimises interest paid | Planned |
| `tfsa-vs-rrsp` | Tax-advantaged accounts | Scenario comparison: which account fits a goal | Planned |

## Tier 2 (intermediate)

| Slug | Topic | Mechanic | Status |
| --- | --- | --- | --- |
| `mortgage-mountain` | Amortization | Pay-down race vs. interest rate scenarios | Planned |

## Authoring loop

1. PM/designer drafts a lesson in Sanity (`module → lesson`).
2. Sanity webhook (`/api/webhooks/sanity`) upserts a `lesson_ref` row.
3. Engineer adds the game under `packages/games/<slug>/` + adds a `game`
   table row via a seed update (or admin UI).
4. Lesson references the `gameSlug`; the "play" button on the lesson page
   wires up automatically.

## Quality bar before publish

- A teacher and a teen play through the lesson + game together.
- WCAG check: labels, contrast, keyboard-only path.
- Mobile WebView smoke test (iOS + Android).
- PostHog funnel for `lesson_open → game_complete` > 50% for the first
  cohort.
