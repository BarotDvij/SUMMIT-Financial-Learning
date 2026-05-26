import { router } from './trpc';
import { meRouter } from './routers/me';
import { classroomRouter } from './routers/classroom';
import { lessonRouter } from './routers/lesson';
import { gameRouter } from './routers/game';
import { leaderboardRouter } from './routers/leaderboard';
import { assignmentRouter } from './routers/assignment';
import { adminRouter } from './routers/admin';
import { tutorRouter } from './routers/tutor';
import { billingRouter } from './routers/billing';
import { rosterRouter } from './routers/roster';

export const appRouter = router({
  me: meRouter,
  classroom: classroomRouter,
  lesson: lessonRouter,
  game: gameRouter,
  leaderboard: leaderboardRouter,
  assignment: assignmentRouter,
  admin: adminRouter,
  tutor: tutorRouter,
  billing: billingRouter,
  roster: rosterRouter,
});

export type AppRouter = typeof appRouter;
