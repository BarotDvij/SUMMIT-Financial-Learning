import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Stripe webhook handler. Implemented in Phase 3 alongside the billing
 * router. For now we acknowledge requests so Stripe doesn't retry.
 */
export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ ok: false, reason: 'stripe_disabled' }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
