import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { booking, item } from "@/server/db/schema";
import { and, eq, gt, ilike, lt, notExists } from "drizzle-orm";

export const bookingRouter = createTRPCRouter({
  getItemTypes: publicProcedure.query(async ({ ctx }) => {
    const itemTypes = await ctx.db.query.itemType.findMany();
    return itemTypes;
  }),
  getItems: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        type: z.number().optional(),
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { query, type, from, to } = input;

      const items = await ctx.db.query.item.findMany({
        where: (item, { eq, ilike, and, notExists, lt, gt }) => {
          const conditions = [];
          if (query) {
            // name ILIKE '%query%'
            conditions.push(ilike(item.name, `%${query}%`));
          }
          if (type !== undefined) {
            // exact match on item.type
            conditions.push(eq(item.type, type));
          }
          if (from && to) {
            // exclude any item that has *any* booking overlapping [from, to)
            conditions.push(
              notExists(
                ctx.db
                  .select({
                    id: booking.id,
                  })
                  .from(booking)
                  .where(
                    and(
                      eq(booking.item, item.id),
                      lt(booking.from, to), // booking.from < requestedTo
                      gt(booking.to, from), // booking.to   > requestedFrom
                    ),
                  ),
              ),
            );
          }
          return and(...conditions);
        },
      });

      return items;
    }),
});
