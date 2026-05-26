import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

import { organization, school } from './organization';
import { user } from './user';

export const classroom = pgTable(
  'classroom',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => school.id, { onDelete: 'cascade' }),
    teacherUserId: uuid('teacher_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 120 }).notNull(),
    slug: varchar('slug', { length: 64 }).notNull(),
    gradeLabel: varchar('grade_label', { length: 32 }),
    joinCode: varchar('join_code', { length: 6 }).notNull(),
    joinCodeExpiresAt: timestamp('join_code_expires_at', { withTimezone: true }),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    joinCodeIdx: uniqueIndex('classroom_join_code_idx').on(t.joinCode),
    schoolIdx: index('classroom_school_idx').on(t.schoolId),
    teacherIdx: index('classroom_teacher_idx').on(t.teacherUserId),
  }),
);

export const enrollment = pgTable(
  'enrollment',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    classroomId: uuid('classroom_id')
      .notNull()
      .references(() => classroom.id, { onDelete: 'cascade' }),
    studentUserId: uuid('student_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    enrolledAt: timestamp('enrolled_at', { withTimezone: true }).notNull().defaultNow(),
    leftAt: timestamp('left_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    pairIdx: uniqueIndex('enrollment_pair_idx').on(t.classroomId, t.studentUserId),
    studentIdx: index('enrollment_student_idx').on(t.studentUserId),
  }),
);
