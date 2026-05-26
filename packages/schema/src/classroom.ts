import { z } from 'zod';

import { idSchema, slugSchema, timestamps } from './primitives';

export const classroomSchema = z
  .object({
    id: idSchema,
    organizationId: idSchema,
    schoolId: idSchema,
    teacherUserId: idSchema,
    name: z.string().min(1).max(120),
    slug: slugSchema,
    gradeLabel: z.string().max(32).nullable(),
    /** 6-char alphanumeric, regenerable. Students join with this. */
    joinCode: z.string().regex(/^[A-Z0-9]{6}$/),
    joinCodeExpiresAt: z.string().datetime({ offset: true }).nullable(),
    archivedAt: z.string().datetime({ offset: true }).nullable(),
  })
  .merge(timestamps);
export type Classroom = z.infer<typeof classroomSchema>;

export const enrollmentSchema = z
  .object({
    id: idSchema,
    classroomId: idSchema,
    studentUserId: idSchema,
    enrolledAt: z.string().datetime({ offset: true }),
    leftAt: z.string().datetime({ offset: true }).nullable(),
  })
  .merge(timestamps);
export type Enrollment = z.infer<typeof enrollmentSchema>;

export const createClassroomInput = classroomSchema.pick({
  schoolId: true,
  name: true,
  slug: true,
  gradeLabel: true,
});
export type CreateClassroomInput = z.infer<typeof createClassroomInput>;

export const joinClassroomInput = z.object({
  joinCode: z.string().regex(/^[A-Z0-9]{6}$/),
});
export type JoinClassroomInput = z.infer<typeof joinClassroomInput>;
