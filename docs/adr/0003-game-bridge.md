# ADR 0003 — Game bridge protocol

Status: accepted
Date: 2026-05-26

## Decision

One game bundle, two hosts (web iframe + RN WebView), brokered by a versioned
`postMessage` protocol in `@summit/game-sdk`.

## Why

- Writing games once cuts cost by ~2× vs. building separate web and native
  game runtimes.
- iframes are well-understood, sandbox-friendly, and let Phaser/PixiJS/etc.
  do their own rendering.
- `react-native-webview` accepts the same `postMessage` semantics, with a
  trivial shim for the message channel.

## What we trade

- Slightly worse "feel" than a fully-native game (still 60 FPS for 2D).
- Score values must be validated server-side (we already cap by
  `game.max_xp_per_session`).

## Versioning

Messages carry a `v` field. Bump only with an ADR; old bundles must keep
working until they're retired.

See `packages/game-sdk/README.md` for the message schema.
