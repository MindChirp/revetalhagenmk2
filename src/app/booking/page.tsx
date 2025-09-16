import DynamicBreadcrumbs from "@/components/dynamic-breadcrumbs";
import BookingItemList from "@/components/screen/booking-item-list/booking-item-list";
import BookingWizard from "@/components/screen/booking-wizard";
import CreateBookingItem from "@/components/ui/create-booking-item";
import { HeroPill } from "@/components/ui/hero-pill";
import { auth } from "@/server/auth";
import { HomeIcon } from "lucide-react";
import { headers } from "next/headers";

async function Booking() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen w-full flex-col gap-5 pt-20 pb-10">
      <DynamicBreadcrumbs
        className="mt-5 px-5 md:px-10"
        items={[
          { href: "/", label: "Hjem", icon: <HomeIcon size={16} /> },
          { href: "/booking", label: "Booking" },
        ]}
      />
      <BookingWizard />

      <div className="px-5 md:px-10">
        <HeroPill
          className="mx-auto w-fit flex-wrap items-center justify-center rounded-md text-center whitespace-break-spaces md:flex md:rounded-full md:text-start"
          label="Alle soverom er dobbeltrom med tilgang til et fellesbad, kjøkken og stue."
          announcement="⚠️ Viktig informasjon"
        />
      </div>
      <BookingItemList />
      {session?.user.role === "admin" && <CreateBookingItem />}
    </div>
  );
}

export default Booking;
