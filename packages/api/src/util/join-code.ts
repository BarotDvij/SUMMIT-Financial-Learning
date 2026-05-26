import type { Database } from '@summit/db';
import { eq } from '@summit/db';
import { schema } from '@summit/db';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

function randomCode(length = 6) {
  let out = '';
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  for (let i = 0; i < length; i++) {
    const b = buf[i];
    if (b === undefined) continue;
    out += ALPHABET[b % ALPHABET.length];
  }
  return out;
}

/** Generate a unique 6-char join code, retrying on collision. */
export async function generateJoinCode(db: Database, maxAttempts = 5): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const code = randomCode();
    const existing = await db
      .select({ id: schema.classroom.id })
      .from(schema.classroom)
      .where(eq(schema.classroom.joinCode, code))
      .limit(1);
    if (existing.length === 0) return code;
  }
  throw new Error('Failed to generate a unique join code after several attempts');
}
