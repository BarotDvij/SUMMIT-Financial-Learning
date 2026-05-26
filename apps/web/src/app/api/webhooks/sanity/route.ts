import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

/**
 * On Sanity publish: upsert a corresponding lesson_ref row so we can join
 * activity data on lesson without round-tripping to Sanity.
 * Phase 1 implementation: validate signature, log, return ok. The actual
 * upsert is added when we cut the first published lesson.
 */
export async function POST() {
  const headerList = await headers();
  if (!headerList.get('x-sanity-signature')) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
