import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

import { subscriptionStatusEnum } from './enums';
import { organization } from './organization';

export const subscription = pgTable(
  'subscription',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    /** Stripe customer + subscription identifiers. Null for invoice-only districts. */
    stripeCustomerId: varchar('stripe_customer_id', { length: 64 }),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 64 }),
    plan: varchar('plan', { length: 64 }).notNull(),
    seats: integer('seats').notNull().default(30),
    status: subscriptionStatusEnum('status').notNull().default('trialing'),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    orgIdx: index('subscription_org_idx').on(t.organizationId),
    stripeSubIdx: uniqueIndex('subscription_stripe_sub_idx')
      .on(t.stripeSubscriptionId)
      .where(sql`${t.stripeSubscriptionId} IS NOT NULL`),
  }),
);

export const invoice = pgTable(
  'invoice',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    stripeInvoiceId: varchar('stripe_invoice_id', { length: 64 }),
    amountCents: integer('amount_cents').notNull(),
    currency: varchar('currency', { length: 8 }).notNull().default('cad'),
    status: varchar('status', { length: 32 }).notNull().default('draft'),
    issuedAt: timestamp('issued_at', { withTimezone: true }),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    orgIdx: index('invoice_org_idx').on(t.organizationId),
  }),
);
