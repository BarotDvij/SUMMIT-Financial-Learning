import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

import { getDb, schema } from '@summit/db';

export const runtime = 'nodejs';

/**
 * Provision a Summit user row when Clerk creates a user. Default role is
 * 'student' inside a 'direct_consumer' organization; school-mediated users
 * are upserted instead by the roster import flow.
 */
export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false, reason: 'no_secret' }, { status: 503 });

  const headerList = await headers();
  const svixId = headerList.get('svix-id');
  const svixTimestamp = headerList.get('svix-timestamp');
  const svixSignature = headerList.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const body = await req.text();
  let event: unknown;
  try {
    event = new Webhook(secret).verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    console.error('Clerk webhook verify failed', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const e = event as { type: string; data: { id: string; email_addresses?: { email_address: string }[]; first_name?: string | null; last_name?: string | null } };
  if (e.type === 'user.created') {
    const db = getDb();
    // Phase 0: park new direct-signup users in a "Direct Consumer" tenant.
    // Phase 2: switch to school-bound provisioning via roster import.
    const orgs = await db.select().from(schema.organization).limit(1);
    const orgId = orgs[0]?.id;
    if (!orgId) {
      console.warn('Clerk user.created received but no organization exists; run seed.');
      return NextResponse.json({ ok: true, skipped: true });
    }
    const email = e.data.email_addresses?.[0]?.email_address ?? null;
    const displayName = [e.data.first_name, e.data.last_name].filter(Boolean).join(' ') || (email ?? 'Learner');
    await db
      .insert(schema.user)
      .values({
        clerkUserId: e.data.id,
        organizationId: orgId,
        role: 'student',
        email,
        displayName,
        firstName: e.data.first_name ?? null,
        lastName: e.data.last_name ?? null,
        consentRequired: true,
      })
      .onConflictDoNothing();
  }

  return NextResponse.json({ ok: true });
}
