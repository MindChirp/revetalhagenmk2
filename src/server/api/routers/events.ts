import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { event, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const eventsRouter = createTRPCRouter({
  getEvents: publicProcedure
    .input(
      z.object({
        from: z.date().optional(),
        to: z.date().optional(),
        limit: z.number().min(1).max(100).nullish(),
        // TODO: implement proper pagination
      }),
    )
    .query(async ({ ctx, input }) => {
      const events = await ctx.db.query.event.findMany({
        orderBy: (event, { desc }) => [desc(event.start)],
        where: (event, { and, gte, lte }) =>
          input.from && input.to
            ? and(gte(event.start, input.from), lte(event.end, input.to))
            : input.from
              ? gte(event.start, input.from)
              : input.to
                ? lte(event.end, input.to)
                : undefined,
        limit: input.limit ?? 50,
      });

      return events;
    }),

  createEvent: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        start: z.date(),
        end: z.date(),
        image: z.string().optional(),
        location: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.db.insert(event).values({
        title: input.title,
        end: input.end,
        start: input.start,
        author: ctx.session.user.id,
        updatedAt: new Date(),
        location: input.location,
        image: input.image,
        description: input.content,
      });

      return created;
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const eventWithAuthor = await ctx.db
        .select()
        .from(event)
        .leftJoin(user, eq(event.author, user.id))
        .where(eq(event.id, input.id));
      return eventWithAuthor?.[0];
    }),
});
