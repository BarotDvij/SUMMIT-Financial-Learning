import { pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', [
  'super_admin',
  'district_admin',
  'school_admin',
  'teacher',
  'parent',
  'student',
]);

export const organizationKindEnum = pgEnum('organization_kind', [
  'district',
  'independent_school',
  'direct_consumer',
]);

export const tierEnum = pgEnum('tier', ['fundamentals', 'intermediate', 'advanced']);

export const xpEventKindEnum = pgEnum('xp_event_kind', [
  'lesson_complete',
  'game_complete',
  'streak_bonus',
  'badge_unlocked',
  'manual_adjust',
]);

export const consentMethodEnum = pgEnum('consent_method', [
  'direct_signup',
  'school_provisioned',
  'oneroster_csv',
  'google_classroom',
  'manual_override',
]);

export const assignmentTargetKindEnum = pgEnum('assignment_target_kind', ['lesson', 'game']);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
]);

export const auditActionEnum = pgEnum('audit_action', [
  'create',
  'update',
  'delete',
  'access',
  'export',
  'grant_consent',
  'withdraw_consent',
  'role_change',
]);
