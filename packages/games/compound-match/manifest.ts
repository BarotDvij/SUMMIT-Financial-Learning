/**
 * Static metadata describing the game. Imported by the seed script so the
 * DB row in `game` is in lockstep with the bundle on disk.
 */
export const compoundMatchManifest = {
  slug: 'compound-match' as const,
  title: 'Compound Match',
  summary: 'Pick the future value that grows from each starting amount and rate.',
  tier: 'fundamentals' as const,
  iconKey: 'sprout',
  bundleUrl: '/games/compound-match/index.html',
  sdkVersion: 1,
  capabilities: ['score', 'xp'] as const,
  estimatedMinutes: 4,
  maxXpPerSession: 100,
};
