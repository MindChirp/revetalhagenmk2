import BookingItemList from "@/components/screen/booking-item-list/booking-item-list";
import BookingWizard from "@/components/screen/booking-wizard";
import CreateBookingItem from "@/components/ui/create-booking-item";
import { HeroPill } from "@/components/ui/hero-pill";
import SignInCard from "@/components/ui/sign-in-card";
import { auth } from "@/server/auth";
import { headers } from "next/headers";

async function Booking() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen w-full flex-col gap-5 pt-20 pb-10">
      <BookingWizard />

      <HeroPill
        className="mx-auto w-fit"
        isExternal
        label="Alle soverom er dobbeltrom med tilgang til et fellesbad, kjøkken og stue."
        announcement="⚠️ Viktig informasjon"
      />
      <BookingItemList />
      {session?.user.role === "admin" && <CreateBookingItem />}
    </div>
  );
}

export default Booking;
