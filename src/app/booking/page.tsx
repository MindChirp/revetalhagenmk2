import BookingItemList from "@/components/screen/booking-item-list";
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
      {session?.user.role === "admin" ? (
        <>
          <BookingWizard />

          <HeroPill
            className="mx-auto w-fit"
            isExternal
            label="Alle soverom er dobbeltrom med tilgang til et fellesbad, kjøkken og stue."
            announcement="⚠️ Viktig informasjon"
          />
          <BookingItemList />
          {session?.user.role === "admin" && <CreateBookingItem />}
        </>
      ) : (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-2.5">
          <h1 className="text-3xl font-black">
            Oi, her har du ikke tilgang! (enda)
          </h1>
          <span className="max-w-xl text-center">
            Om litt vil du kunne booke rom og gjenstander fra denne siden.
            Dersom du er administrator og ikke er logget inn, har du allerede
            mulighet til å se innholdet på denne siden når du er logget inn.
          </span>
          {!session && (
            <div className="mt-2.5 w-fit">
              <SignInCard />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Booking;
