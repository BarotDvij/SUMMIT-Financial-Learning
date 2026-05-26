import { pgTable, uuid, varchar, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

import { auditActionEnum } from './enums';
import { organization } from './organization';
import { user } from './user';

/**
 * Append-only audit log. Every administrative or teacher action that touches
 * student data must produce a row here. Retention: 12 months.
 */
export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => organization.id, {
      onDelete: 'set null',
    }),
    actorUserId: uuid('actor_user_id').references(() => user.id, { onDelete: 'set null' }),
    action: auditActionEnum('action').notNull(),
    /** Free-form noun (e.g. 'classroom', 'enrollment', 'consent_record'). */
    targetType: varchar('target_type', { length: 64 }).notNull(),
    targetId: uuid('target_id'),
    /** Optional sketch of fields changed; PII must be redacted. */
    diff: jsonb('diff').$type<Record<string, unknown>>(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orgTimeIdx: index('audit_org_time_idx').on(t.organizationId, t.createdAt),
    targetIdx: index('audit_target_idx').on(t.targetType, t.targetId),
    actorTimeIdx: index('audit_actor_time_idx').on(t.actorUserId, t.createdAt),
  }),
);
