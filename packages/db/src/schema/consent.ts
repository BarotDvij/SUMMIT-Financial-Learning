import { pgTable, uuid, varchar, text, char, timestamp, index } from 'drizzle-orm/pg-core';

import { consentMethodEnum } from './enums';
import { user } from './user';

export const consentRecord = pgTable(
  'consent_record',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    studentUserId: uuid('student_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    parentUserId: uuid('parent_user_id').references(() => user.id, { onDelete: 'set null' }),
    policyVersion: varchar('policy_version', { length: 64 }).notNull(),
    termsVersion: varchar('terms_version', { length: 64 }).notNull(),
    /** SHA-256 of the exact consent text shown to the parent/guardian. */
    consentTextHash: char('consent_text_hash', { length: 64 }).notNull(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    method: consentMethodEnum('method').notNull(),
    grantedAt: timestamp('granted_at', { withTimezone: true }),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    withdrawnAt: timestamp('withdrawn_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    studentIdx: index('consent_student_idx').on(t.studentUserId),
    activeIdx: index('consent_active_idx').on(t.studentUserId, t.withdrawnAt),
  }),
);
