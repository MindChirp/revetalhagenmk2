import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { news, user } from "@/server/db/schema";
import { eq } from "drizzle-orm";

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

      // Get list of news, including the author object
      const items = await ctx.db.query.news.findMany({
        orderBy: (news, { asc }) => [asc(news.id)],
        where: (news, { gt, like, and }) =>
          and(
            cursor ? gt(news.id, cursor) : undefined,
            like(news.name, `%${input.query ?? ""}%`),
          ),
        columns: {
          author: false,
        },
        with: {
          author: {
            columns: {
              id: true,
              name: true,
              image: true,
              email: true,
              role: true,
            },
          },
        },
        limit,
      });

      // const items = await ctx.db.query.news.findMany({
      //   orderBy: (news, { asc }) => [asc(news.id)],
      //   where: (news, { gt, like, and }) =>
      //     and(
      //       cursor ? gt(news.id, cursor) : undefined,
      //       like(news.name, `%${input.query ?? ""}%`),
      //     ),
      //   limit: limit,
      // });
      return {
        nextCursor:
          items.length === limit
            ? (items[items.length - 1]?.id ?? undefined)
            : undefined,
        news: items,
      };
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const newsWithAuthor = await ctx.db
        .select()
        .from(news)
        .leftJoin(user, eq(news.author, user.id))
        .where(eq(news.id, input.id));

      if (!newsWithAuthor) {
        throw new Error("News not found");
      }

      // Update view count
      await ctx.db
        .update(news)
        .set({ views: (newsWithAuthor[0]?.news.views ?? 0) + 1 })
        .where(eq(news.id, input.id));

      return newsWithAuthor[0];
    }),
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "Tittel er påkrevd"),
        content: z.string().min(1, "Innhold er påkrevd"),
        image: z.string().optional(),
        preview: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const obj = await ctx.db.insert(news).values({
        content: input.content,
        name: input.title,
        author: ctx.session.user.id,
        preview: input.preview,
      });

      return obj;
    }),
});
