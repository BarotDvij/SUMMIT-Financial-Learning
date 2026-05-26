import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

import { xpEventKindEnum } from './enums';
import { classroom } from './classroom';
import { organization } from './organization';
import { user } from './user';

/**
 * Append-only XP ledger. Use a check constraint at the DB level (added in
 * a follow-up migration) to forbid UPDATE/DELETE outside of admin tooling.
 */
export const xpEvent = pgTable(
  'xp_event',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    classroomId: uuid('classroom_id').references(() => classroom.id, { onDelete: 'set null' }),
    kind: xpEventKindEnum('kind').notNull(),
    amount: integer('amount').notNull(),
    refType: varchar('ref_type', { length: 24 }),
    refId: uuid('ref_id'),
    reason: varchar('reason', { length: 280 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userTimeIdx: index('xp_event_user_time_idx').on(t.userId, t.createdAt),
    classroomTimeIdx: index('xp_event_classroom_time_idx').on(t.classroomId, t.createdAt),
    orgTimeIdx: index('xp_event_org_time_idx').on(t.organizationId, t.createdAt),
  }),
);

export const badge = pgTable(
  'badge',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 64 }).notNull(),
    title: varchar('title', { length: 120 }).notNull(),
    description: varchar('description', { length: 500 }).notNull(),
    iconKey: varchar('icon_key', { length: 64 }).notNull(),
    xpReward: integer('xp_reward').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    slugIdx: uniqueIndex('badge_slug_idx').on(t.slug),
  }),
);

export const achievement = pgTable(
  'achievement',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    badgeId: uuid('badge_id')
      .notNull()
      .references(() => badge.id, { onDelete: 'restrict' }),
    unlockedAt: timestamp('unlocked_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    pairIdx: uniqueIndex('achievement_pair_idx').on(t.userId, t.badgeId),
  }),
);
