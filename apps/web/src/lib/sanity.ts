import 'server-only';

import { createClient, type SanityClient } from '@sanity/client';

import { env } from '~/env';

let cached: SanityClient | null = null;

export function getSanity(): SanityClient | null {
  if (cached) return cached;
  if (!env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  cached = createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    token: env.SANITY_API_READ_TOKEN,
    apiVersion: '2025-01-01',
    useCdn: true,
  });
  return cached;
}

/**
 * Fetch a lesson body by Sanity document id. Returns null if Sanity is
 * not configured (e.g. local dev without a project).
 */
export async function fetchLessonBody(sanityId: string): Promise<unknown | null> {
  const client = getSanity();
  if (!client) return null;
  return client.fetch(`*[_id == $id][0]`, { id: sanityId });
}
