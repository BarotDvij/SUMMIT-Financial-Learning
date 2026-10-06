import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Routes that anyone can hit without authenticating.
 * Everything else requires a signed-in Clerk session and (later) a valid
 * tenant binding via the `user` table.
 */
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/for-teachers',
  '/for-parents',
  '/legal/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  '/api/webhooks/(.*)',
  '/games/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next internals and static files.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
