import BookingContact from "@/components/ui/booking-contact";
import BookingStatusHero from "@/components/ui/booking-status-hero";
import BookingStatusProgress from "@/components/ui/booking-status-progress";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import React from "react";

async function BookingStatus({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  if (!reference) redirect("/404");

  const bookingData = await api.booking.getBookingByReference({
    reference,
  });

  if (!bookingData?.item) {
    redirect("/404");
  }
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-5 pt-20 pb-10 md:px-10">
      <BookingStatusHero
        item={bookingData?.item}
        from={bookingData?.from}
        to={bookingData?.to}
      />
      <BookingStatusProgress status={bookingData?.status} />
      <BookingContact className="mt-5" />
    </div>
  );
}

export default BookingStatus;
