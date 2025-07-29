import BookingItemCard from "@/components/screen/booking-item-list/booking-item-card";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { ArrowRightIcon, UserIcon } from "lucide-react";

const Booking = async () => {
  const bookings = await api.booking.getBookings({
    status: "pending",
    from: new Date("2025-01-01"),
  });
  return (
    <div className="w-full">
      <h1 className="text-6xl font-black">Booking</h1>
      <div>
        <h2>Aktive forespørsler</h2>
        <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-3">
          {bookings
            .filter((booking) => booking.item !== null)
            .map((booking) => (
              <BookingItemCard
                withImage={false}
                className="w-full md:w-full!"
                description={
                  <div className="flex items-center gap-1">
                    <UserIcon size={16} />
                    {booking.name}
                  </div>
                }
                buttonContent={
                  <Button>
                    <ArrowRightIcon /> Behandle
                  </Button>
                }
                key={booking.id}
                item={booking.item!}
                href={`/booking/status/${booking.reference}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Booking;
