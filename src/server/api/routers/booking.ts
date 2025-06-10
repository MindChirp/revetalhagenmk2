import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
      }),
    )
    .query(async ({ ctx, input }) => {
      const { query, type } = input;
      const items = await ctx.db.query.item.findMany({
        where: (item, { eq, and }) => {
          const conditions = [];
          if (query) {
            conditions.push(eq(item.name, query));
          }
          if (type) {
            conditions.push(eq(item.type, type));
          }
          return and(...conditions);
        },
      });

      return items;
    }),
});
