import { z } from 'zod';

import { idSchema, timestamps } from './primitives';
import { roleSchema } from './roles';

export const userSchema = z
  .object({
    id: idSchema,
    clerkUserId: z.string().min(1),
    organizationId: idSchema,
    role: roleSchema,
    email: z.string().email().nullable(),
    displayName: z.string().min(1).max(120),
    firstName: z.string().max(120).nullable(),
    lastName: z.string().max(120).nullable(),
    avatarUrl: z.string().url().nullable(),
    grade: z.string().max(8).nullable(),
    /** For students under the consent threshold, writes are gated by `consent_record.granted_at`. */
    consentRequired: z.boolean(),
    consentGrantedAt: z.string().datetime({ offset: true }).nullable(),
    deletedAt: z.string().datetime({ offset: true }).nullable(),
  })
  .merge(timestamps);
export type User = z.infer<typeof userSchema>;

export const parentStudentLinkSchema = z
  .object({
    id: idSchema,
    parentUserId: idSchema,
    studentUserId: idSchema,
    relationship: z.enum(['parent', 'guardian', 'other']),
    /** A link can exist before consent is granted (e.g. invitation sent). */
    confirmedAt: z.string().datetime({ offset: true }).nullable(),
  })
  .merge(timestamps);
export type ParentStudentLink = z.infer<typeof parentStudentLinkSchema>;
