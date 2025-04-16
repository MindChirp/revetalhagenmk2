import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

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

      console.log(input.from, input.to, events.length);

      return events;
    }),
});
