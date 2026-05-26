import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

import { roleEnum } from './enums';
import { organization } from './organization';

export const user = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    clerkUserId: varchar('clerk_user_id', { length: 128 }).notNull(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'restrict' }),
    role: roleEnum('role').notNull(),
    email: varchar('email', { length: 320 }),
    displayName: varchar('display_name', { length: 120 }).notNull(),
    firstName: varchar('first_name', { length: 120 }),
    lastName: varchar('last_name', { length: 120 }),
    avatarUrl: text('avatar_url'),
    grade: varchar('grade', { length: 8 }),
    /**
     * Whether this user requires verifiable parental consent before writes are allowed.
     * Set to true for any student under the configured age threshold.
     */
    consentRequired: boolean('consent_required').notNull().default(false),
    /** Mirror of the most recent active consent_record.granted_at for fast gating. */
    consentGrantedAt: timestamp('consent_granted_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    clerkIdx: uniqueIndex('user_clerk_user_id_idx').on(t.clerkUserId),
    orgRoleIdx: index('user_org_role_idx').on(t.organizationId, t.role),
    emailInOrgIdx: uniqueIndex('user_email_in_org_idx')
      .on(t.organizationId, t.email)
      .where(sql`${t.email} IS NOT NULL`),
  }),
);

export const parentStudentLink = pgTable(
  'parent_student_link',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    parentUserId: uuid('parent_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    studentUserId: uuid('student_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    relationship: varchar('relationship', { length: 16 }).notNull().default('parent'),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    pairIdx: uniqueIndex('parent_student_pair_idx').on(t.parentUserId, t.studentUserId),
    studentIdx: index('parent_student_student_idx').on(t.studentUserId),
  }),
);
