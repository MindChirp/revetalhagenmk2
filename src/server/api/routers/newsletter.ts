import { newsletterSubscription } from "@/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { count } from "drizzle-orm";

export const newsletterRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Ugyldig epostadresse"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingSubscription =
        await ctx.db.query.newsletterSubscription.findFirst({
          where: (subscription, { eq }) => eq(subscription.email, input.email),
        });

      if (existingSubscription)
        throw new Error("Epostadresse er allerede abonnert");

      const result = await ctx.db
        .insert(newsletterSubscription)
        .values({
          email: input.email,
        })
        .returning();

      return result[0];
    }),

  getSubscriberCount: publicProcedure.query(async ({ ctx }) => {
    const subscribers = await ctx.db
      .select({ count: count() })
      .from(newsletterSubscription);

    return subscribers[0]?.count ?? 0;
  }),
});
