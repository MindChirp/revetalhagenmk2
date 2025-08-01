import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { newsRouter } from "./routers/news";
import { eventsRouter } from "./routers/events";
import { cmsRouter } from "./routers/cms";
import { bookingRouter } from "./routers/booking";
import { newsletterRouter } from "./routers/newsletter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  news: newsRouter,
  events: eventsRouter,
  cms: cmsRouter,
  booking: bookingRouter,
  newsletter: newsletterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
