import { z } from 'zod';

import { idSchema, timestamps } from './primitives';

export const assignmentTargetSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('lesson'), lessonId: idSchema }),
  z.object({ kind: z.literal('game'), gameId: idSchema }),
]);
export type AssignmentTarget = z.infer<typeof assignmentTargetSchema>;

export const assignmentSchema = z
  .object({
    id: idSchema,
    organizationId: idSchema,
    classroomId: idSchema,
    teacherUserId: idSchema,
    title: z.string().min(1).max(200),
    instructions: z.string().max(2000).nullable(),
    target: assignmentTargetSchema,
    dueAt: z.string().datetime({ offset: true }).nullable(),
    requiredMinScore: z.number().int().min(0).max(100).nullable(),
    archivedAt: z.string().datetime({ offset: true }).nullable(),
  })
  .merge(timestamps);
export type Assignment = z.infer<typeof assignmentSchema>;

export const assignmentSubmissionSchema = z
  .object({
    id: idSchema,
    assignmentId: idSchema,
    studentUserId: idSchema,
    completedAt: z.string().datetime({ offset: true }).nullable(),
    score: z.number().int().min(0).max(100).nullable(),
    refGameSessionId: idSchema.nullable(),
  })
  .merge(timestamps);
export type AssignmentSubmission = z.infer<typeof assignmentSubmissionSchema>;

export const createAssignmentInput = assignmentSchema.pick({
  classroomId: true,
  title: true,
  instructions: true,
  target: true,
  dueAt: true,
  requiredMinScore: true,
});
export type CreateAssignmentInput = z.infer<typeof createAssignmentInput>;
