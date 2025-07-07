import type { item } from "@/server/db/schema";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "./badge";

type BookingStatusHeroProps = {
  item: typeof item.$inferSelect;
  from: Date;
  to: Date;
};
function BookingStatusHero({ item, from, to }: BookingStatusHeroProps) {
  return (
    <div className="w-full">
      <div className="relative h-52 w-full overflow-hidden rounded-3xl shadow-md">
        <Image
          src={item.image ?? ""}
          alt={item.name ?? ""}
          width={2000}
          height={1000}
          className="absolute top-0 left-0 h-full w-full object-cover"
        />
      </div>
      <div className="mt-5">
        <h1>Bookingforespørsel av</h1>
        <h1 className="text-3xl font-black break-words md:text-6xl">
          {item.name}
        </h1>
        <Badge className="mt-2.5 capitalize">
          <ClockIcon /> {format(from, "PPPP", { locale: nb })} -{" "}
          {format(to, "PPPP", { locale: nb })}
        </Badge>
      </div>
    </div>
  );
}

export default BookingStatusHero;
