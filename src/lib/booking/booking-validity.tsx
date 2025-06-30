import { type db } from "@/server/db";
import { booking, item } from "@/server/db/schema";
import { eq, lte } from "drizzle-orm";

/**
 * THE FOLLOWING RULES APPLY TO BOOKING VALIDITY:
 * 1. If an item of type "arrangement" is booked for a day, any regular room reservations shall not overlap with the event.
 * 2. A room cannot be booked for less than one night (check that the dates are different)
 * 3. A room cannot be booked with the end date being before the starting date
 * 4. A room cannot be booked if it is already occupied during the requested dates
 * 5. A room cannot be booked if the requested dates are in the past
 * 6. A room cannot be booked if the requested dates are more than 1 year in the future
 * 7. A room cannot be booked in the past
 * 8. If other parts of the house is booked, the user shall be notified of this
 */

type CheckBookingValidityProps = {
  db: typeof db;
  itemId: number;
  from: Date;
  to: Date;
};
export const CheckBookingValidity = async ({
  db,
  itemId,
  from,
  to,
}: CheckBookingValidityProps) => {
  // First check if an event is ongoing and overlapping with the times of the booking request
  const bookings = await db.query.booking.findFirst({
    with: {
      item: true,
    },
    where: (booking, { eq, or, lte, gte, and }) => {
      const conditions = [];
      conditions.push(or(eq(booking.item, itemId), eq(item.type, 2)));
      conditions.push(and(lte(booking.from, to), gte(booking.to, from)));
      return and(...conditions);
    },
  });

  return !!bookings;
};
