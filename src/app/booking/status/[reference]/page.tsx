"use server";
import BookingContact from "@/components/ui/booking-contact";
import BookingReviewMeta from "@/components/ui/booking-review-meta";
import BookingStatusHero from "@/components/ui/booking-status-hero";
import BookingStatusProgress from "@/components/ui/booking-status-progress";
import BookingStatusToggle from "@/components/ui/booking-status-toggle";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import type { PortableTextBlock } from "@portabletext/editor";
import { endOfWeek, startOfWeek } from "date-fns";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

  if (!bookingData?.item) return redirect("/404");

  // const otherBookings = await api.booking.getOverlappingBookings({
  //   from: startOfWeek(bookingData?.from),
  //   to: endOfWeek(bookingData?.to),
  //   itemId: bookingData?.item?.id,
  // });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-5 pt-20 pb-10 md:px-10">
      <BookingStatusHero
        item={bookingData?.item}
        from={bookingData?.from}
        to={bookingData?.to}
      />
      {session?.user.role !== "admin" && (
        <>
          <BookingStatusProgress status={bookingData?.status} />
          <BookingContact className="mt-5" />
        </>
      )}

      {session?.user.role === "admin" && (
        <>
          <BookingReviewMeta
            booking={{
              ...bookingData,
              item: bookingData.item.id,
            }}
          />
          {/* <BookingCalendarDialog
            bookings={[
              ...otherBookings.map((b) => ({
                ...b.booking,
                item: Number(b.item?.id),
              })),
              {
                ...bookingData,
                item: bookingData.item.id,
              },
            ]}
            trigger={
              <Button className="w-fit">
                <CalendarIcon />
                Se bookingkalender
              </Button>
            }
          /> */}
        </>
      )}

      {session?.user?.role === "admin" && (
        <BookingStatusToggle
          bookingId={bookingData?.id}
          initialValue={{
            status: bookingData?.status,
            reason: JSON.parse(
              bookingData?.rejectionReason ?? "[]",
            ) as PortableTextBlock[],
          }}
        />
      )}
    </div>
  );
}

export default BookingStatus;
