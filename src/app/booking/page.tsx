"use client";

import BookingItemList from "@/components/screen/booking-item-list";
import BookingWizard from "@/components/screen/booking-wizard";

function Booking() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-5 pt-20 pb-10">
      <BookingWizard />
      <BookingItemList />
    </div>
  );
}

export default Booking;
