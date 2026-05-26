import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, char, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';

import { organizationKindEnum } from './enums';

export const organization = pgTable(
  'organization',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    kind: organizationKindEnum('kind').notNull(),
    name: varchar('name', { length: 200 }).notNull(),
    slug: varchar('slug', { length: 64 }).notNull(),
    country: char('country', { length: 2 }).notNull().default('CA'),
    region: varchar('region', { length: 8 }).notNull().default('ON'),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    slugIdx: uniqueIndex('organization_slug_idx').on(t.slug),
    kindIdx: index('organization_kind_idx').on(t.kind),
  }),
);

export const school = pgTable(
  'school',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 200 }).notNull(),
    slug: varchar('slug', { length: 64 }).notNull(),
    externalSchoolId: varchar('external_school_id', { length: 64 }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    slugInOrgIdx: uniqueIndex('school_slug_in_org_idx').on(t.organizationId, t.slug),
    orgIdx: index('school_org_idx').on(t.organizationId),
  }),
);
