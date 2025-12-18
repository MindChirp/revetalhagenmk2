import BookingItemCard from "@/components/screen/booking-item-list/booking-item-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookingStatusMap } from "@/lib/booking-status-map";
import { api } from "@/trpc/server";
import { ArrowRightIcon, ListCheck, UserIcon } from "lucide-react";

const Booking = async () => {
  const bookings = await api.booking.getBookings({
    status: "pending",
    from: new Date("2025-01-01"),
  });
  const accepted = await api.booking.getBookings({
    status: "confirmed",
  });
  const rejected = await api.booking.getBookings({
    status: "rejected",
  });

  return (
    <div className="w-full">
      <h1 className="text-3xl font-black md:text-6xl">Booking</h1>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <h2>Aktive forespørsler</h2>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {bookings
              .filter((booking) => booking.item !== null)
              .map((booking) => (
                <BookingItemCard
                  withImage={false}
                  className="w-full md:w-full!"
                  description={
                    <div>
                      <div className="flex items-center gap-1">
                        <UserIcon size={16} />
                        {booking.name}
                      </div>
                      <span className="flex flex-row items-center gap-1">
                        <ListCheck size={16} />{" "}
                        {BookingStatusMap[booking.status]}
                      </span>
                    </div>
                  }
                  buttonContent={
                    <div className="flex flex-row items-center gap-2.5">
                      <Button>
                        <ArrowRightIcon /> Behandle
                      </Button>
                    </div>
                  }
                  key={booking.id}
                  item={booking.item!}
                  href={`/booking/status/${booking.reference}`}
                />
              ))}
          </div>
        </div>

        <Separator orientation="horizontal" />
        <Accordion type="multiple">
          <AccordionItem value="accepted-bookings">
            <AccordionTrigger>Godkjente bookinger</AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
              {accepted.map((booking) => (
                <BookingItemCard
                  withImage={false}
                  className="w-full md:w-full!"
                  description={
                    <div>
                      <div className="flex items-center gap-1">
                        <UserIcon size={16} />
                        {booking.name}
                      </div>
                      <span className="flex flex-row items-center gap-1">
                        <ListCheck size={16} />{" "}
                        {BookingStatusMap[booking.status]}
                      </span>
                    </div>
                  }
                  buttonContent={
                    <div className="flex flex-row items-center gap-2.5">
                      <Button variant="outline">
                        <ArrowRightIcon /> Se detaljer
                      </Button>
                    </div>
                  }
                  key={booking.id}
                  item={booking.item!}
                  href={`/booking/status/${booking.reference}`}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="rejected-bookings">
            <AccordionTrigger>Avslåtte bookinger</AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-2.5 xl:grid-cols-3">
              {rejected.map((booking) => (
                <BookingItemCard
                  withImage={false}
                  className="w-full md:w-full!"
                  description={
                    <div>
                      <div className="flex items-center gap-1">
                        <UserIcon size={16} />
                        {booking.name}
                      </div>
                      <span className="flex flex-row items-center gap-1">
                        <ListCheck size={16} />{" "}
                        {BookingStatusMap[booking.status]}
                      </span>
                    </div>
                  }
                  buttonContent={
                    <div className="flex flex-row items-center gap-2.5">
                      <Button variant="outline">
                        <ArrowRightIcon /> Se detaljer
                      </Button>
                    </div>
                  }
                  key={booking.id}
                  item={booking.item!}
                  href={`/booking/status/${booking.reference}`}
                />
              ))}
              {rejected.length === 0 && (
                <span>Det er ingen avslåtte bookinger</span>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Booking;
