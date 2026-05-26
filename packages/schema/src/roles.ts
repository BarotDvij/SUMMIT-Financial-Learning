import { z } from 'zod';

/**
 * Canonical role list. Adding a role requires an ADR.
 * Ordered from highest privilege to lowest.
 */
export const ROLES = [
  'super_admin',
  'district_admin',
  'school_admin',
  'teacher',
  'parent',
  'student',
] as const;

export const roleSchema = z.enum(ROLES);
export type Role = z.infer<typeof roleSchema>;

export const ROLE_RANK: Record<Role, number> = {
  super_admin: 100,
  district_admin: 80,
  school_admin: 60,
  teacher: 40,
  parent: 20,
  student: 10,
};

export function hasMinimumRole(actual: Role, minimum: Role): boolean {
  return ROLE_RANK[actual] >= ROLE_RANK[minimum];
}

/**
 * Coarse permission matrix consumed by the API layer. The DB-level enforcement
 * is the source of truth — this is the convenience layer for UI gating.
 */
export const PERMISSIONS = {
  'organization.manage': ['super_admin', 'district_admin'],
  'school.manage': ['super_admin', 'district_admin', 'school_admin'],
  'classroom.create': ['super_admin', 'district_admin', 'school_admin', 'teacher'],
  'classroom.view': ['super_admin', 'district_admin', 'school_admin', 'teacher'],
  'student.write': ['student'],
  'parent.consent': ['parent'],
  'lesson.publish': ['super_admin'],
  'analytics.view.district': ['super_admin', 'district_admin'],
  'analytics.view.school': ['super_admin', 'district_admin', 'school_admin'],
  'analytics.view.classroom': ['super_admin', 'district_admin', 'school_admin', 'teacher'],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}
