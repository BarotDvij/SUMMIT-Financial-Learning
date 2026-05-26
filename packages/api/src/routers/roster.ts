import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { requirePermission, router } from '../trpc';

/**
 * Phase 2/3: roster sync. CSV import (OneRoster v1.2) is the
 * lowest-common-denominator format every Canadian SIS can produce.
 * Google Classroom OAuth lives behind a feature flag.
 */
export const rosterRouter = router({
  importOneRosterCsv: requirePermission('school.manage')
    .input(
      z.object({
        // Base64 of the CSV (per OneRoster spec). We'll switch to multipart
        // streaming when files exceed a few MB.
        csvBase64: z.string().min(1),
        sourceLabel: z.string().min(1).max(64).default('manual_csv'),
      }),
    )
    .mutation(async ({ input }) => {
      // Phase 2 implementation: parse CSV, upsert school/classroom/user/enrollment
      // rows inside a transaction, never deleting (only deactivating) existing
      // records. Emit audit_log entries. Return a summary.
      return {
        ok: true,
        source: input.sourceLabel,
        message:
          'OneRoster import implemented in Phase 2 — this stub validates the input contract.',
      };
    }),

  linkGoogleClassroom: requirePermission('classroom.create').mutation(async () => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new TRPCError({
        code: 'NOT_IMPLEMENTED',
        message: 'Google Classroom integration is not enabled in this environment.',
      });
    }
    // Phase 2: return an OAuth consent URL scoped to courses.readonly + rosters.readonly.
    return {
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth?placeholder=true',
    };
  }),
});
