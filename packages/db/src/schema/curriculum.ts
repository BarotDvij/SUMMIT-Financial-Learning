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

import { tierEnum } from './enums';

export const module = pgTable(
  'module',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tier: tierEnum('tier').notNull(),
    slug: varchar('slug', { length: 64 }).notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    summary: varchar('summary', { length: 500 }).notNull(),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    slugIdx: uniqueIndex('module_slug_idx').on(t.slug),
    tierOrderIdx: index('module_tier_order_idx').on(t.tier, t.order),
  }),
);

export const lessonRef = pgTable(
  'lesson_ref',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sanityId: varchar('sanity_id', { length: 64 }).notNull(),
    moduleId: uuid('module_id')
      .notNull()
      .references(() => module.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 64 }).notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    estimatedMinutes: integer('estimated_minutes').notNull().default(5),
    xpReward: integer('xp_reward').notNull().default(50),
    gameSlug: varchar('game_slug', { length: 64 }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    sanityIdx: uniqueIndex('lesson_sanity_idx').on(t.sanityId),
    slugIdx: uniqueIndex('lesson_slug_idx').on(t.slug),
    moduleOrderIdx: index('lesson_module_order_idx').on(t.moduleId, t.order),
  }),
);
