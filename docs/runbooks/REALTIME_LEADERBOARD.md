# Realtime Leaderboard (Phase 2)

The Phase 1 leaderboard polls the API. Phase 2 swaps to PartyKit so it
updates without a refresh.

## Why PartyKit (over Pusher)

- Durable per-classroom rooms ("party") with TypeScript-native handlers.
- Costs scale with active connections, not events.
- Co-locates with Cloudflare edge — Canadian edges available.

## Topology

```
api/server-action → "xp.granted" event
    └── PartyKit broadcaster (room = `lb:classroom:<id>`)
            └── subscribers (web + mobile)
```

## Implementation steps

1. Add `packages/realtime` (PartyKit server).
2. Define one room per leaderboard scope:
   - `lb:classroom:<id>`
   - `lb:school:<id>`
   - `lb:org:<id>`
3. After a successful `game.complete` (or `lesson.complete`) mutation, the
   server fans out the new aggregate to the room(s).
4. Client uses `usePartySocket` to subscribe.
5. Fall back to polling if PartyKit is down (treat realtime as enhancement
   only, never source-of-truth).

## Things to get right

- Throttle broadcasts to ≤ 5/sec per room to keep classroom UIs smooth.
- Identify subscribers by a Clerk-signed token; never trust the room id alone.
- Don't include student PII in the broadcast — send `userId` only and let
  the client resolve via its own cached profile.
- Document the new vendor in `docs/legal/DPA_TEMPLATE.md` Schedule B.
