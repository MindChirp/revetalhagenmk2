import { event, eventMessage, user } from "@/server/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  memberProcedure,
  publicProcedure,
} from "../trpc";

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
        preview: z.string().optional(),
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
        preview: input.preview,
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
  updateEvent: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        id: z.number(),
        content: z.string().min(1),
        start: z.date(),
        end: z.date(),
        image: z.string().optional(),
        preview: z.string().optional(),
        location: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db
        .update(event)
        .set({
          title: input.title,
          end: input.end,
          start: input.start,
          updatedAt: new Date(),
          location: input.location,
          image: input.image,
          description: input.content,
          preview: input.preview,
        })
        .where(eq(event.id, input.id));

      return updated;
    }),
  deleteEvent: adminProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(event).where(eq(event.id, input.id));
      return { success: true };
    }),
  getComments: memberProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db
        .select()
        .from(eventMessage)
        .orderBy(asc(eventMessage.createdAt))
        .where(eq(eventMessage.event, input.eventId))
        .leftJoin(user, eq(eventMessage.author, user.id));

      return comments;
    }),
  addComment: memberProcedure
    .input(
      z.object({
        eventId: z.number(),
        content: z.string().min(1),
        replyTo: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(eventMessage).values({
        content: input.content,
        event: input.eventId,
        author: ctx.session.user.id,
        replyTo: input.replyTo,
      });

      return { success: true };
    }),

  editComment: memberProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(eventMessage)
        .set({
          content: input.content,
        })
        .where(
          and(
            eq(eventMessage.id, input.id),
            eq(eventMessage.author, ctx.session.user.id),
          ),
        );

      return { success: true };
    }),
  deleteComment: memberProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(eventMessage)
        .where(
          and(
            eq(eventMessage.id, input.id),
            eq(eventMessage.author, ctx.session.user.id),
          ),
        );

      return { success: true };
    }),
});
