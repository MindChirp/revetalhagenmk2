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

  if (!item) {
    throw new Error("Item not found");
  }

  const dayDifference = differenceInCalendarDays(
    startOfDay(to),
    startOfDay(from),
  );
  const days =
    item.type === 2 || item.type === 4
      ? Math.max(1, dayDifference + 1)
      : Math.max(1, dayDifference);

  const price =
    item.type === 1
      ? ((people ?? 0) * item.personPrice + item.price) * days
      : item.price * days;

  return {
    nonMemberPrice: price,
    memberPrice: (price * (100 - (item?.memberDiscount ?? 0))) / 100,
  };
};
