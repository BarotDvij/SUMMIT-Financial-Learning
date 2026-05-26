# @summit/game-compound-match

The first SUMMIT mini-game. Plain HTML + ES modules so it ships unchanged
inside both the web iframe and the mobile WebView.

## Layout

```
packages/games/compound-match/
  manifest.ts              metadata consumed by the seed script
  src/                     game source (HTML, CSS, TS via ESM)
  scripts/copy-to-web.mjs  copies src/ to apps/web/public/games/compound-match/

apps/web/public/games/compound-match/
  index.html               played at https://app/games/compound-match/index.html
  game.js
  game.css
```

For Phase 0 the source files live at both locations so the game runs
without a build step. Once we add a second game, the build script becomes
the source of truth and we delete the duplicates under `apps/web/public/`.

## Game design (Phase 1)

- 4 rounds, 25 points each, 100 points total.
- Each round shows a starting amount, an annual rate, and a time horizon.
  The player picks the correct future value out of 4 options.
- Penalty-free: incorrect picks are revealed and the round moves on without
  deducting score, so students see the right answer.
- Emits `summit:ready` on load, `summit:score` after each round, and
  `summit:complete` with `score`, `correctCount`, `totalCount`, `durationMs`.

## Building / hosting

The static files are served by `apps/web` from its `public/` directory.
There is no bundler in Phase 0; the game uses native ES modules. When we
add a bundler later, replace the manual copy with `tsup --format=esm`.
