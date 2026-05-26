import { describe, expect, it } from 'vitest';

import { hasMinimumRole, hasPermission } from './roles';

describe('roles', () => {
  it('orders roles correctly', () => {
    expect(hasMinimumRole('super_admin', 'student')).toBe(true);
    expect(hasMinimumRole('teacher', 'school_admin')).toBe(false);
    expect(hasMinimumRole('school_admin', 'teacher')).toBe(true);
  });

  it('permission matrix denies students from classroom.create', () => {
    expect(hasPermission('student', 'classroom.create')).toBe(false);
    expect(hasPermission('teacher', 'classroom.create')).toBe(true);
    expect(hasPermission('super_admin', 'organization.manage')).toBe(true);
    expect(hasPermission('school_admin', 'organization.manage')).toBe(false);
  });
});
