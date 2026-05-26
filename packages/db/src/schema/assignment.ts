import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { assignmentTargetKindEnum } from './enums';
import { classroom } from './classroom';
import { gameSession } from './game';
import { organization } from './organization';
import { user } from './user';

export const assignment = pgTable(
  'assignment',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    classroomId: uuid('classroom_id')
      .notNull()
      .references(() => classroom.id, { onDelete: 'cascade' }),
    teacherUserId: uuid('teacher_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    title: varchar('title', { length: 200 }).notNull(),
    instructions: text('instructions'),
    targetKind: assignmentTargetKindEnum('target_kind').notNull(),
    /** Either lesson_ref.id or game.id depending on `target_kind`. */
    targetRefId: uuid('target_ref_id').notNull(),
    dueAt: timestamp('due_at', { withTimezone: true }),
    requiredMinScore: integer('required_min_score'),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    classroomIdx: index('assignment_classroom_idx').on(t.classroomId),
    dueIdx: index('assignment_due_idx').on(t.dueAt),
  }),
);

export const assignmentSubmission = pgTable(
  'assignment_submission',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    assignmentId: uuid('assignment_id')
      .notNull()
      .references(() => assignment.id, { onDelete: 'cascade' }),
    studentUserId: uuid('student_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    score: integer('score'),
    refGameSessionId: uuid('ref_game_session_id').references(() => gameSession.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    pairIdx: uniqueIndex('assignment_submission_pair_idx').on(
      t.assignmentId,
      t.studentUserId,
    ),
  }),
);
