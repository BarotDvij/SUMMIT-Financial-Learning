import { z } from 'zod';

import { idSchema } from './primitives';

export const consentMethodSchema = z.enum([
  'direct_signup',
  'school_provisioned',
  'oneroster_csv',
  'google_classroom',
  'manual_override',
]);
export type ConsentMethod = z.infer<typeof consentMethodSchema>;

export const consentRecordSchema = z.object({
  id: idSchema,
  studentUserId: idSchema,
  parentUserId: idSchema.nullable(),
  policyVersion: z.string().min(1),
  termsVersion: z.string().min(1),
  consentTextHash: z.string().length(64),
  ipAddress: z.string().max(45).nullable(),
  userAgent: z.string().max(500).nullable(),
  method: consentMethodSchema,
  grantedAt: z.string().datetime({ offset: true }).nullable(),
  confirmedAt: z.string().datetime({ offset: true }).nullable(),
  withdrawnAt: z.string().datetime({ offset: true }).nullable(),
});
export type ConsentRecord = z.infer<typeof consentRecordSchema>;

export const grantConsentInput = z.object({
  studentUserId: idSchema,
  policyVersion: z.string().min(1),
  termsVersion: z.string().min(1),
  consentTextHash: z.string().length(64),
  method: consentMethodSchema,
});
export type GrantConsentInput = z.infer<typeof grantConsentInput>;
