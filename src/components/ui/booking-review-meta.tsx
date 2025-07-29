import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import type { booking } from "@/server/db/schema";
import { format } from "date-fns";
import { BanknoteIcon, ClockIcon } from "lucide-react";
import { nb } from "date-fns/locale";

type BookingReviewMetaProps = {
  booking: typeof booking.$inferSelect;
};

function BookingReviewMeta({ booking }: BookingReviewMetaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookingoversikt</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        <span className="flex items-center gap-2.5">
          <ClockIcon />
          <span>
            Fra <strong>{format(booking.from, "PPPP", { locale: nb })}</strong>{" "}
            til <strong>{format(booking.to, "PPPP", { locale: nb })}</strong>
          </span>
        </span>
        <span className="flex items-center gap-2.5">
          <BanknoteIcon />
          <span>
            <strong>{booking.price} kr</strong>
          </span>
        </span>
      </CardContent>
    </Card>
  );
}

export default BookingReviewMeta;
