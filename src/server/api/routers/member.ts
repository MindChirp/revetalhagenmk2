import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { membershipApplication } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const memberRouter = createTRPCRouter({
  registerInterest: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1, "Navn må fylles ut"),
        phone: z.string().min(1, "Telefon må fylles ut"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check if email already exists
      const existing = await ctx.db.query.membershipApplication.findFirst({
        where: (app) => eq(app.email, input.email),
      });
      if (existing) {
        return Error("E-post er allerede registrert");
      }
      await ctx.db.insert(membershipApplication).values({
        email: input.email,
        name: input.name,
        phone: input.phone,
      });

      return;
    }),
});
