import { z } from 'zod';

/**
 * Bidirectional postMessage protocol between a host (web app or RN WebView)
 * and an embedded game canvas. Versioned so we can ship breaking changes
 * later without breaking older bundles.
 */
export const SDK_VERSION = 1 as const;

const baseMessage = z.object({
  v: z.literal(SDK_VERSION),
  /** Correlation id so async replies can be matched. */
  id: z.string().min(1),
  /** Direction is implicit in the payload kind. */
});

/* ---------- host -> game ---------- */

export const initMessage = baseMessage.extend({
  kind: z.literal('summit:init'),
  sessionId: z.string().uuid(),
  userId: z.string().uuid(),
  classroomId: z.string().uuid().nullable(),
  locale: z.string().min(2).max(8).default('en-CA'),
  reducedMotion: z.boolean().default(false),
  soundEnabled: z.boolean().default(true),
});

export const pauseMessage = baseMessage.extend({ kind: z.literal('summit:pause') });
export const resumeMessage = baseMessage.extend({ kind: z.literal('summit:resume') });
export const endMessage = baseMessage.extend({ kind: z.literal('summit:end') });

export const hostToGameMessage = z.discriminatedUnion('kind', [
  initMessage,
  pauseMessage,
  resumeMessage,
  endMessage,
]);
export type HostToGameMessage = z.infer<typeof hostToGameMessage>;

/* ---------- game -> host ---------- */

export const readyMessage = baseMessage.extend({
  kind: z.literal('summit:ready'),
  sdkVersion: z.literal(SDK_VERSION),
  capabilities: z.array(z.string()).default(() => []),
});

export const progressMessage = baseMessage.extend({
  kind: z.literal('summit:progress'),
  /** 0-100 progress signal for the host loading bar. */
  percent: z.number().min(0).max(100),
});

export const scoreUpdateMessage = baseMessage.extend({
  kind: z.literal('summit:score'),
  score: z.number().int().min(0),
});

export const completeMessage = baseMessage.extend({
  kind: z.literal('summit:complete'),
  score: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  totalCount: z.number().int().min(0),
  durationMs: z.number().int().min(0),
  metrics: z
    .record(z.string(), z.union([z.number(), z.string(), z.boolean()]))
    .default(() => ({})),
});

export const errorMessage = baseMessage.extend({
  kind: z.literal('summit:error'),
  code: z.string().min(1),
  message: z.string().min(1),
});

export const gameToHostMessage = z.discriminatedUnion('kind', [
  readyMessage,
  progressMessage,
  scoreUpdateMessage,
  completeMessage,
  errorMessage,
]);
export type GameToHostMessage = z.infer<typeof gameToHostMessage>;
