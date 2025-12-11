"use client";
import type { bookingFormSchema } from "@/lib/schemas/booking-form-schema";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { BedDouble, ClockIcon, Loader, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { z } from "zod";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Separator } from "./separator";

type SubmitBookingDialogProps = {
  booking: z.infer<typeof bookingFormSchema>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  itemName: string;
  totalPrice?: number;
  memberPrice?: number;
  memberPriceDiscount?: number;
};
function SubmitBookingDialog({
  booking,
  itemName,
  totalPrice,
  open,
  onOpenChange,
  memberPrice,
  memberPriceDiscount,
}: SubmitBookingDialogProps) {
  const {
    mutateAsync: bookItem,
    isPending,
    status,
  } = api.booking.createBooking.useMutation();

  const handleBookItem = async () => {
    void bookItem({
      ...booking,
    })
      .then(() => {
        toast.success("Booking opprettet!");
      })
      .catch(() => {
        toast.error("Noe gikk galt, og bookingen kunne ikke opprettes.");
      });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bekreft booking</DialogTitle>
        </DialogHeader>
        {status === "idle" && (
          <>
            <div className="flex flex-row flex-wrap gap-2.5">
              <Badge variant="outline">
                <ClockIcon /> Fra{" "}
                {booking.from && format(booking.from, "dd.MM.yyyy")}
              </Badge>
              <Badge variant="outline">
                <ClockIcon /> Til{" "}
                {booking.to && format(booking.to, "dd.MM.yyyy")}
              </Badge>
              <Badge variant="outline">
                <BedDouble /> {itemName}
              </Badge>
            </div>
            <Separator />
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col">
                <span>Totalpris</span>
                <div className="flex flex-row items-center gap-2.5">
                  <span
                    className={
                      "text-card-foreground text-2xl font-bold transition-all"
                    }
                  >
                    {totalPrice} kr
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span>Medlemspris</span>
                <div className="flex flex-row items-center gap-2.5">
                  <span
                    className={"text-primary text-2xl font-bold transition-all"}
                  >
                    {memberPrice} kr
                  </span>
                  <Badge>-{memberPriceDiscount}%</Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <Button
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  void handleBookItem();
                }}
              >
                {!isPending && (
                  <>
                    <ShoppingCartIcon /> Book nå
                  </>
                )}

                {isPending && (
                  <>
                    <Loader className="animate-spin" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {status === "pending" && <Loader className="animate-spin" />}
        {status === "success" && (
          <>
            <div className="flex flex-col items-center justify-center gap-2.5">
              <h3 className="text-2xl font-bold">Booking opprettet!</h3>
              <p className="text-muted-foreground">
                Du vil motta en bekreftelse på e-post.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Link href="/booking">
                  <Button>Lukk</Button>
                </Link>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SubmitBookingDialog;
