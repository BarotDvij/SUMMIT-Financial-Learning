# Internal Alpha — Phase 1

Goal: one WRDSB teacher uses SUMMIT with one of their classes for one
two-week unit on Tier 1 — Compound Interest. We learn whether the loop
(lesson → game → XP) holds attention, and what blocks teachers.

## Outreach (already in flight)

- Primary contact: Mr. Taylor (per `Pitch Competitions/.../Velocity Pitch Mentor Q+A`).
- Backup: any teacher in Mr. Taylor's department willing to test.

## Setup with the teacher (30-minute call)

1. Confirm classroom size and grade.
2. Walk the teacher through:
   - Sign in
   - Create class → share 6-char join code with students
   - Assign Compound Match
   - Review the roster + leaderboard
3. Confirm consent path. For the alpha, the school's standard ed-tech
   approval covers us (verify with the principal). Parents see the consent
   notice when their child first signs in.
4. Provide a private Slack/email channel for issues.

## Feedback capture

- 1 PostHog funnel: `sign_up → join_class → lesson_open → game_complete`.
- 1 PostHog funnel for teachers: `sign_in → create_class → assign → view_progress`.
- A weekly 20-min retro with the teacher.
- A 4-question student survey at end of week 2 (linked in-app under "Help"):
  1. How much did this feel like a game vs. homework? (1-5)
  2. Did you finish the round? (yes/no)
  3. What was confusing?
  4. What should we add?

## Hard exit criteria for Phase 1

- ≥ 70% of enrolled students complete at least one game session.
- Teacher reports the workflow is "lighter" than the existing tool.
- No P1 privacy incident.

If we don't hit these, fix before expanding to a second classroom.
