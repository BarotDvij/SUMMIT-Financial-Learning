# Google Classroom Roster Import (Phase 2)

Goal: a teacher signs in with their Google Workspace identity, picks a
Google Classroom course, and SUMMIT pulls the roster into a classroom row.

## Scopes (minimum)

- `https://www.googleapis.com/auth/classroom.courses.readonly`
- `https://www.googleapis.com/auth/classroom.rosters.readonly`
- `https://www.googleapis.com/auth/classroom.profile.emails`

Note: many boards have these scopes disabled for student accounts. We sync
*from* the teacher's account; we never call the API as a student.

## OAuth setup

1. In Google Cloud Console, create a project + OAuth client.
2. Authorize the SUMMIT redirect URI: `${NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`.
3. Submit for verification (Workspace boards may require this).

## Flow

1. Teacher clicks "Import from Google Classroom" in `/classes/new`.
2. `roster.linkGoogleClassroom` returns an authorize URL with state + PKCE.
3. Callback handler exchanges the code, stores a refresh token in an
   encrypted `oauth_account` table (Phase 2 addition).
4. Teacher picks a course; we call `courses.students.list` and upsert
   `user` + `enrollment` rows for the SUMMIT classroom.
5. Students see the SUMMIT classroom appear next time they sign in.

## Notes

- Treat the first import as authoritative; subsequent imports add/remove
  enrollments but never delete users.
- Don't write back to Google Classroom in Phase 2 (read-only). Once a board
  approves it, we can post assignment links via the `coursework.create`
  scope.
