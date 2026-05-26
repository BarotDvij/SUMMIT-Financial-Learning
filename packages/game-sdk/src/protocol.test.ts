import { describe, expect, it } from 'vitest';

import { gameToHostMessage, hostToGameMessage, SDK_VERSION } from './protocol';

describe('game-sdk protocol', () => {
  it('accepts a valid init message', () => {
    const parsed = hostToGameMessage.safeParse({
      v: SDK_VERSION,
      id: 'abc',
      kind: 'summit:init',
      sessionId: '00000000-0000-0000-0000-000000000000',
      userId: '00000000-0000-0000-0000-000000000001',
      classroomId: null,
      locale: 'en-CA',
      reducedMotion: false,
      soundEnabled: true,
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects an init message with the wrong version', () => {
    const parsed = hostToGameMessage.safeParse({
      v: 999,
      id: 'abc',
      kind: 'summit:init',
      sessionId: '00000000-0000-0000-0000-000000000000',
      userId: '00000000-0000-0000-0000-000000000001',
      classroomId: null,
    });
    expect(parsed.success).toBe(false);
  });

  it('accepts a complete message', () => {
    const parsed = gameToHostMessage.safeParse({
      v: SDK_VERSION,
      id: 'xyz',
      kind: 'summit:complete',
      score: 75,
      correctCount: 3,
      totalCount: 4,
      durationMs: 120_000,
      metrics: { roundsPlayed: 4 },
    });
    expect(parsed.success).toBe(true);
  });
});
