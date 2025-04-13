import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const newsRouter = createTRPCRouter({
  getAllInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
        direction: z.enum(["forward", "backward"]),
        query: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;

      const items = await ctx.db.query.news.findMany({
        orderBy: (news, { asc }) => [asc(news.id)],
        where: (news, { gt, like, and }) =>
          and(
            cursor ? gt(news.id, cursor) : undefined,
            like(news.name, `%${input.query ?? ""}%`),
          ),
        limit: limit,
      });

      return {
        nextCursor:
          items.length === limit
            ? (items[items.length - 1]?.id ?? undefined)
            : undefined,
        news: items,
      };
    }),
});
