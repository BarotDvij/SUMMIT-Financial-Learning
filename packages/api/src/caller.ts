import type { Context } from './context';
import { appRouter } from './router';

/** Server-side caller for use in Next.js Server Components and webhooks. */
export const createCaller = (ctx: Context) => appRouter.createCaller(ctx);
