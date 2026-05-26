import { z } from 'zod';

import { idSchema, slugSchema, timestamps } from './primitives';

export const organizationKindSchema = z.enum(['district', 'independent_school', 'direct_consumer']);
export type OrganizationKind = z.infer<typeof organizationKindSchema>;

export const organizationSchema = z
  .object({
    id: idSchema,
    kind: organizationKindSchema,
    name: z.string().min(2).max(200),
    slug: slugSchema,
    country: z.string().length(2).default('CA'),
    region: z.string().min(2).max(2).default('ON'),
    deletedAt: z.string().datetime({ offset: true }).nullable(),
  })
  .merge(timestamps);
export type Organization = z.infer<typeof organizationSchema>;

export const schoolSchema = z
  .object({
    id: idSchema,
    organizationId: idSchema,
    name: z.string().min(2).max(200),
    slug: slugSchema,
    externalSchoolId: z.string().max(64).nullable(),
    deletedAt: z.string().datetime({ offset: true }).nullable(),
  })
  .merge(timestamps);
export type School = z.infer<typeof schoolSchema>;

export const createOrganizationInput = organizationSchema.pick({
  kind: true,
  name: true,
  slug: true,
  country: true,
  region: true,
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationInput>;

export const createSchoolInput = schoolSchema.pick({
  organizationId: true,
  name: true,
  slug: true,
  externalSchoolId: true,
});
export type CreateSchoolInput = z.infer<typeof createSchoolInput>;
