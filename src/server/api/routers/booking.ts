import { booking, item, itemMeta } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import {
  CheckBookingValidity,
  GetItemBookings,
} from "@/lib/booking/booking-validity";

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
  updateItem: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(256).optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        type: z.number().optional(),
        price: z.number().optional(),
        memberDiscount: z.number().optional(),
        personPrice: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, description, image, type, price } = input;
      const updatedItem = await ctx.db
        .update(item)
        .set({
          name: name ?? undefined,
          description: description ?? undefined,
          image: image ?? undefined,
          type: type ?? undefined,
          price: price ?? undefined,
          memberDiscount: input.memberDiscount ?? undefined,
          personPrice: input.personPrice ?? undefined,
        })
        .where(eq(item.id, id))
        .returning();

      return updatedItem[0];
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

  createBooking: publicProcedure
    .input(
      z.object({
        itemId: z.number(),
        from: z.date(),
        to: z.date(),
        userId: z.number().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        name: z.string().optional(),
        message: z.string().optional(),
        personCount: z.number().min(1).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        itemId,
        from,
        to,
        userId,
        email,
        phone,
        name,
        message,
        personCount,
      } = input;

      // Check booking validity
      const isValid = await CheckBookingValidity({
        db: ctx.db,
        itemId,
        from,
        to,
      });

      console.log("IS VALID? ", isValid);

      if (!isValid) {
        throw new Error("Invalid booking");
      }

      // Create booking
      return undefined;
    }),
  checkAvailability: publicProcedure
    .input(
      z.object({
        itemId: z.number(),
        from: z.date(),
        to: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const validity = await CheckBookingValidity({
        db: ctx.db,
        ...input,
      });

      return validity;
    }),
  getItemBookings: publicProcedure
    .input(
      z.object({
        itemId: z.number(),
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { itemId, from, to } = input;
      const bookings = await GetItemBookings({
        db: ctx.db,
        itemId,
        from: from ?? new Date(),
        to: to ?? new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 60), // Default to 60 day later
      });

      return bookings;
    }),
});
