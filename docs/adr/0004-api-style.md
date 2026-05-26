# ADR 0004 — API style: tRPC

Status: accepted (revisit at Phase 2)
Date: 2026-05-26

## Decision

Phase 0–2 use **tRPC** as the only API surface between web/mobile clients
and the server.

## Why

- One team across web + mobile + server; type-sharing without code-gen.
- Server Components in Next.js 16 + tRPC `createCaller` lets pages render
  with zero client-side fetch boilerplate.
- Cheap to migrate later: tRPC routers can be exposed as OpenAPI via
  `trpc-openapi` if we contract external integrators.

## Revisit triggers

- A district IT team asks for a documented REST API → add OpenAPI export.
- We add a public partner integration → migrate that surface to REST.
- A non-Node consumer (e.g. a Python data import) needs the API → REST.
