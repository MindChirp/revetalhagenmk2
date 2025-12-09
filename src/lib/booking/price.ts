// Calculate the price of a booking based on the item type (and the price stored in the database) and duration

import type { db } from "@/server/db";
import { differenceInCalendarDays, startOfDay } from "date-fns";

type CalculatePriceProps = {
  db: typeof db;
  itemId: number;
  from: Date;
  to: Date;
  people?: number;
};
export const CalculatePrice = async ({
  db,
  from,
  to,
  itemId,
  people,
}: CalculatePriceProps) => {
  // Get the item pricing from the database
  const item = await db.query.item.findFirst({
    where: (item, { eq }) => eq(item.id, itemId),
  });

  // Calculate the duration in full calendar days to ensure nights are counted correctly
  const days = Math.max(
    1,
    differenceInCalendarDays(startOfDay(to), startOfDay(from)),
  );

  if (!item) {
    throw new Error("Item not found");
  }

  // If the item is of type "overnatting", return the price per day multiplied by the number of days + number of people
  let price;

  if (item.type === 1) {
    const headCount = people ?? 0;
    console.log("ITEM: ", item);
    // Overnight stays: base price + per-person price for each night
    price = (item.price + item.personPrice * headCount) * days;
    console.log("THIS IS A SLEEP RESERVATION: ", people, price);
  } else {
    price = item.price * days;
  }

  return {
    nonMemberPrice: price,
    memberPrice: (price * (100 - (item?.memberDiscount ?? 0))) / 100,
  };
};
