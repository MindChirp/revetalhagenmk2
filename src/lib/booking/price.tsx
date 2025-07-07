// Calculate the price of a booking based on the item type (and the price stored in the database) and duration

import type { db } from "@/server/db";
import { intervalToDuration } from "date-fns";

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

  // Calculate the duration in days
  const duration = intervalToDuration({ start: from, end: to });

  const days =
    (duration?.days ?? 1) +
    (duration?.months ?? 0) * 30 +
    (duration?.years ?? 0) * 365;

  if (!item) {
    throw new Error("Item not found");
  }

  // If the item is of type "overnatting", return the price per day multiplied by the number of days + number of people
  let price;

  if (item.type === 1 && people) {
    price = item.price * days + item.personPrice * people;
  } else {
    price = item.price * days;
  }

  return {
    nonMemberPrice: price,
    memberPrice: (price * (100 - (item?.memberDiscount ?? 0))) / 100,
  };
};
