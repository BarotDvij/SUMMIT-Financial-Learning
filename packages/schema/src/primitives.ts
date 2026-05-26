import { z } from 'zod';

export const idSchema = z.string().uuid();
export type Id = z.infer<typeof idSchema>;

export const slugSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be kebab-case');
export type Slug = z.infer<typeof slugSchema>;

export const isoDateTime = z.string().datetime({ offset: true });

export const timestamps = z.object({
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const paginationInput = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});
export type PaginationInput = z.infer<typeof paginationInput>;

export const paginationResult = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    nextCursor: z.string().optional(),
  });
