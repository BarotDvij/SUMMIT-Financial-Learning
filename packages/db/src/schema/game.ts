import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

import { tierEnum } from './enums';
import { classroom } from './classroom';
import { organization } from './organization';
import { user } from './user';

export const game = pgTable(
  'game',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 64 }).notNull(),
    title: varchar('title', { length: 120 }).notNull(),
    summary: varchar('summary', { length: 500 }).notNull(),
    tier: tierEnum('tier').notNull(),
    iconKey: varchar('icon_key', { length: 64 }).notNull(),
    bundleUrl: text('bundle_url').notNull(),
    sdkVersion: integer('sdk_version').notNull().default(1),
    capabilities: jsonb('capabilities').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    estimatedMinutes: integer('estimated_minutes').notNull().default(5),
    maxXpPerSession: integer('max_xp_per_session').notNull().default(100),
    enabled: boolean('enabled').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    slugIdx: uniqueIndex('game_slug_idx').on(t.slug),
    enabledIdx: index('game_enabled_idx').on(t.enabled),
  }),
);

export const gameSession = pgTable(
  'game_session',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    classroomId: uuid('classroom_id').references(() => classroom.id, { onDelete: 'set null' }),
    gameId: uuid('game_id')
      .notNull()
      .references(() => game.id, { onDelete: 'restrict' }),
    gameSlug: varchar('game_slug', { length: 64 }).notNull(),
    score: integer('score').notNull().default(0),
    correctCount: integer('correct_count').notNull().default(0),
    totalCount: integer('total_count').notNull().default(0),
    durationMs: integer('duration_ms').notNull().default(0),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    metrics: jsonb('metrics')
      .$type<Record<string, number | string | boolean>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    userIdx: index('game_session_user_idx').on(t.userId, t.completedAt),
    classroomIdx: index('game_session_classroom_idx').on(t.classroomId, t.completedAt),
    gameIdx: index('game_session_game_idx').on(t.gameId, t.completedAt),
  }),
);
