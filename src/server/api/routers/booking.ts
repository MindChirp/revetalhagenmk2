import { booking, itemMeta } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

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
  getItemById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.query.item.findFirst({
        where: (item, { eq }) => eq(item.id, input.id),
        with: {
          itemMeta: true,
        },
      });
      return item;
    }),
  addItemMeta: adminProcedure
    .input(
      z.object({
        icon: z.string().optional(),
        label: z.string().min(1).max(256),
        itemId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { icon, label, itemId } = input;
      const meta = await ctx.db
        .insert(itemMeta)
        .values({
          icon: icon ?? null,
          label,
          item: itemId,
        })
        .returning();

      return meta[0];
    }),

  deleteItemMeta: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const deletedMeta = await ctx.db
        .delete(itemMeta)
        .where(eq(itemMeta.id, id))
        .returning();
      return deletedMeta[0];
    }),
});
