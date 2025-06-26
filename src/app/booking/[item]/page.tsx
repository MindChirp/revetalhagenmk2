import BookingCalendarDialog from "@/components/ui/booking-calendar-dialog";
import { Button } from "@/components/ui/button";
import type { item } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { CalendarIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

async function Item({ params }: { params: Promise<{ item: string }> }) {
  const { item } = await params;
  if (!item) {
    // Redirect to not found
    redirect("/404");
  }
  const itemData = await api.booking.getItemById({ id: Number(item) });
  // const item: ItemType = {
  //   id: 1,
  //   createdAt: new Date(),
  //   description: "Hei på deg",
  //   image: "images/snow.jpg",
  //   name: "Kjøkkenet",
  //   price: 1234,
  //   type: 1,
  //   updatedAt: new Date(),
  // };
  if (!itemData)
    return (
      <div className="flex min-h-screen w-full flex-col gap-5 px-10 pt-20 pb-10">
        <span className="text-2xl font-medium">
          Kunne ikke finne gjenstanden
        </span>
      </div>
    );
  return (
    <div className="flex min-h-screen w-full flex-col gap-5 px-10 pt-32 pb-10">
      <div className="relative h-56 w-full overflow-hidden rounded-3xl md:h-96">
        <Image
          src={itemData?.image ?? ""}
          alt="Gjenstandsbilde"
          width={1000}
          height={1000}
          className="absolute top-0 left-0 h-full w-full object-cover"
        />
      </div>
      <h1 className="w-fit text-5xl font-black">{itemData.name}</h1>
      <div className="flex flex-col gap-2.5 md:flex-row md:gap-5">
        <Button size={"lg"}>
          <ShoppingCartIcon /> Book nå
        </Button>
        <BookingCalendarDialog
          trigger={
            <Button size={"lg"} variant="outline">
              <CalendarIcon />
              Se bookingkalender
            </Button>
          }
        />
      </div>
    </div>
  );
}

export default Item;
