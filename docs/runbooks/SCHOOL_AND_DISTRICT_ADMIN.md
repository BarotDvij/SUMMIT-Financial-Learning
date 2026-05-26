# School-Admin & District-Admin Consoles

Two roles, two layers of dashboards. The data model already supports both
(`organization` = district, `school` = building).

## School admin (Phase 2)

Capabilities:
- View all teachers and classrooms in the school.
- Reassign students between classrooms.
- View school-level XP totals and weekly trends (read-only).
- Manage teacher invitations within the school (via Clerk org invitations).

Pages to add under `apps/web/src/app/(app)/admin/school/[id]/`:
- `page.tsx` — summary with classrooms, teachers, students count.
- `teachers/page.tsx` — invite, deactivate.
- `classrooms/page.tsx` — list + reassignment UI.

API: extends `adminRouter` with `schoolSummary` (already stubbed),
`schoolTeacherInvite`, `schoolClassroomList`.

## District admin (Phase 3)

Capabilities:
- Everything a school admin can do, across all schools.
- Add and remove schools.
- View district-wide aggregate analytics (already covered by
  `admin.districtSummary` in the API).
- View the audit log (`admin.recentAuditLog`).
- Manage subscription / billing seats.

Pages to add under `apps/web/src/app/(app)/admin/district/`:
- `page.tsx` — district overview (exists as `/admin/page.tsx`; rename when
  the school-admin path lands).
- `schools/page.tsx` — list + add school.
- `audit/page.tsx` — paginated audit log viewer.
- `billing/page.tsx` — subscription + invoice viewer.

## Accessibility

Run the full WCAG 2.1 AA audit on these pages before the Phase 2 launch.
Admin pages are particularly prone to ARIA gaps because they're table-heavy.
