import { relations } from 'drizzle-orm';

import { organization, school } from './organization';
import { user, parentStudentLink } from './user';
import { classroom, enrollment } from './classroom';
import { consentRecord } from './consent';
import { module, lessonRef } from './curriculum';
import { game, gameSession } from './game';
import { xpEvent, badge, achievement } from './progress';
import { assignment, assignmentSubmission } from './assignment';

export const organizationRelations = relations(organization, ({ many }) => ({
  schools: many(school),
  users: many(user),
  classrooms: many(classroom),
}));

export const schoolRelations = relations(school, ({ one, many }) => ({
  organization: one(organization, {
    fields: [school.organizationId],
    references: [organization.id],
  }),
  classrooms: many(classroom),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  organization: one(organization, {
    fields: [user.organizationId],
    references: [organization.id],
  }),
  enrollments: many(enrollment),
  taughtClassrooms: many(classroom, { relationName: 'classroomTeacher' }),
  xpEvents: many(xpEvent),
  gameSessions: many(gameSession),
  achievements: many(achievement),
  consentRecords: many(consentRecord),
  childLinks: many(parentStudentLink, { relationName: 'parent' }),
  parentLinks: many(parentStudentLink, { relationName: 'student' }),
}));

export const parentStudentLinkRelations = relations(parentStudentLink, ({ one }) => ({
  parent: one(user, {
    fields: [parentStudentLink.parentUserId],
    references: [user.id],
    relationName: 'parent',
  }),
  student: one(user, {
    fields: [parentStudentLink.studentUserId],
    references: [user.id],
    relationName: 'student',
  }),
}));

export const classroomRelations = relations(classroom, ({ one, many }) => ({
  organization: one(organization, {
    fields: [classroom.organizationId],
    references: [organization.id],
  }),
  school: one(school, {
    fields: [classroom.schoolId],
    references: [school.id],
  }),
  teacher: one(user, {
    fields: [classroom.teacherUserId],
    references: [user.id],
    relationName: 'classroomTeacher',
  }),
  enrollments: many(enrollment),
  assignments: many(assignment),
}));

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  classroom: one(classroom, {
    fields: [enrollment.classroomId],
    references: [classroom.id],
  }),
  student: one(user, {
    fields: [enrollment.studentUserId],
    references: [user.id],
  }),
}));

export const consentRecordRelations = relations(consentRecord, ({ one }) => ({
  student: one(user, {
    fields: [consentRecord.studentUserId],
    references: [user.id],
  }),
  parent: one(user, {
    fields: [consentRecord.parentUserId],
    references: [user.id],
  }),
}));

export const moduleRelations = relations(module, ({ many }) => ({
  lessons: many(lessonRef),
}));

export const lessonRefRelations = relations(lessonRef, ({ one }) => ({
  module: one(module, {
    fields: [lessonRef.moduleId],
    references: [module.id],
  }),
}));

export const gameRelations = relations(game, ({ many }) => ({
  sessions: many(gameSession),
}));

export const gameSessionRelations = relations(gameSession, ({ one }) => ({
  user: one(user, {
    fields: [gameSession.userId],
    references: [user.id],
  }),
  game: one(game, {
    fields: [gameSession.gameId],
    references: [game.id],
  }),
  classroom: one(classroom, {
    fields: [gameSession.classroomId],
    references: [classroom.id],
  }),
}));

export const xpEventRelations = relations(xpEvent, ({ one }) => ({
  user: one(user, {
    fields: [xpEvent.userId],
    references: [user.id],
  }),
}));

export const badgeRelations = relations(badge, ({ many }) => ({
  achievements: many(achievement),
}));

export const achievementRelations = relations(achievement, ({ one }) => ({
  user: one(user, {
    fields: [achievement.userId],
    references: [user.id],
  }),
  badge: one(badge, {
    fields: [achievement.badgeId],
    references: [badge.id],
  }),
}));

export const assignmentRelations = relations(assignment, ({ one, many }) => ({
  classroom: one(classroom, {
    fields: [assignment.classroomId],
    references: [classroom.id],
  }),
  teacher: one(user, {
    fields: [assignment.teacherUserId],
    references: [user.id],
  }),
  submissions: many(assignmentSubmission),
}));

export const assignmentSubmissionRelations = relations(assignmentSubmission, ({ one }) => ({
  assignment: one(assignment, {
    fields: [assignmentSubmission.assignmentId],
    references: [assignment.id],
  }),
  student: one(user, {
    fields: [assignmentSubmission.studentUserId],
    references: [user.id],
  }),
}));
