"use client";

import BookingInformationDialog from "@/components/booking-information-dialog";
import { PhoneInput } from "@/components/phone-input";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import EditItemPriceDialog from "@/components/ui/edit-item-price-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HeroPill } from "@/components/ui/hero-pill";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import SubmitBookingDialog from "@/components/ui/submit-booking-dialog";
import { ItemType } from "@/lib/item-type";
import { bookingFormSchema as formSchema } from "@/lib/schemas/booking-form-schema";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { intervalToDuration, startOfDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader,
  ShoppingCartIcon,
  SmileIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

type BookingFormProps = {
  type?: ItemType;
  basePrice: number;
  personPrice: number;
  memberPriceDiscount?: number;
  item: {
    id: number;
    name: string;
  };
};
function BookingForm({
  item,
  type,
  basePrice,
  personPrice,
  memberPriceDiscount,
}: BookingFormProps) {
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [showMemberPrice, setShowMemberPrice] = useState(false);
  const [queryParams] = useQueryStates({
    from: parseAsIsoDateTime,
    to: parseAsIsoDateTime,
  });
  const { data: session } = authClient.useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: session?.user?.name,
      email: session?.user?.email,
      from: queryParams.from ?? undefined,
      to: queryParams.to ?? undefined,
      personCount: 1,
      itemId: item.id,
    },
    resolver: zodResolver(formSchema),
    reValidateMode: "onBlur",
  });
  const [people, from, to, email, phone, name, message, itemId] = form.watch([
    "personCount",
    "from",
    "to",
    "email",
    "phone",
    "name",
    "message",
    "itemId",
  ]);
  const {
    data: bookingAvailability,
    isLoading: isCheckingAvailability,
    isError: isAvailabilityError,
  } = api.booking.checkAvailability.useQuery({
    itemId: item.id,
    from: from,
    to: to,
  });
  const { data: itemBookings, isLoading: itemBookingsLoading } =
    api.booking.getItemBookings.useQuery({
      itemId: item.id,
      from: startOfDay(new Date()),
      // 60 days in the future
      to: startOfDay(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)),
    });
  const duration = useMemo(() => {
    return intervalToDuration({
      start: from,
      end: to,
    });
  }, [from, to]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
    setSubmitDialogOpen(true);
  };

  const totalPrice = useMemo(() => {
    if (type === ItemType.OVERNATTING) {
      return ((people ?? 0) * personPrice + basePrice) * (duration.days ?? 1);
    }
    return basePrice * (duration.days ?? 1);
  }, [basePrice, personPrice, people, duration, type]);

  const memberPrice = useMemo(() => {
    if (typeof memberPriceDiscount === "number") {
      return totalPrice * ((100 - memberPriceDiscount) / 100);
    }
    return totalPrice;
  }, [totalPrice, memberPriceDiscount]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="gap-2.5">
          <CardHeader>
            <CardDescription>Bookinginformasjon</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {session?.user && (
              <HeroPill
                className="mx-auto w-fit flex-wrap items-center justify-center rounded-md text-center whitespace-break-spaces md:flex md:rounded-full md:text-start"
                announcement={`👋 Hei ${session.user.name.split(" ")[0]}!`}
                label="Siden du er logget inn fylte vi inn litt informasjon om deg"
                isExternal={false}
              />
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullt navn</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-5">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Fra</FormLabel>
                    <FormControl>
                      {!itemBookingsLoading && (
                        <DateTimePicker
                          {...field}
                          allowTime={
                            type !== ItemType.OVERNATTING &&
                            type !== ItemType.MØTEROM &&
                            type !== ItemType.ARRANGEMENTSROM
                          }
                          calendarDisable={itemBookings?.map((booking) => {
                            return {
                              to: booking.booking.to,
                              from: booking.booking.from,
                            };
                          })}
                          onChange={(date) => {
                            // Set the time to 17:00 if the type is OVERNATTING
                            if (type === ItemType.OVERNATTING && date) {
                              date.setHours(17, 0, 0, 0);
                            }
                            field.onChange(date);
                          }}
                          value={field.value}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Til</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        {...field}
                        allowTime={
                          type !== ItemType.OVERNATTING &&
                          type !== ItemType.MØTEROM &&
                          type !== ItemType.ARRANGEMENTSROM
                        }
                        calendarDisable={itemBookings?.map((booking) => {
                          return {
                            to: booking.booking.to,
                            from: booking.booking.from,
                          };
                        })}
                        onChange={(date) => {
                          // Set the time to 12:00 if the type is OVERNATTING
                          if (type === ItemType.OVERNATTING && date) {
                            date.setHours(12, 0, 0, 0);
                          }
                          field.onChange(date);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <AnimatePresence>
              {from && to && (
                <motion.div
                  key="checking-availability"
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="bg-muted shadow-none">
                    <CardContent>
                      <AnimatePresence mode="popLayout">
                        {isCheckingAvailability && (
                          <SlideAnimation
                            className="flex animate-pulse items-center gap-2.5 overflow-hidden"
                            exit={{
                              height: 0,
                              opacity: 0,
                              translateY: -20,
                            }}
                            direction="up"
                            key="availability-loader"
                          >
                            <Loader className="animate-spin" />
                            <span>Sjekker tilgjengelighet</span>
                          </SlideAnimation>
                        )}
                        {isAvailabilityError && (
                          <SlideAnimation
                            className="flex items-center gap-2.5 overflow-hidden"
                            exit={{
                              height: 0,
                              opacity: 0,
                              translateY: 20,
                            }}
                            direction="up"
                            key="availability-error"
                          >
                            <TriangleAlertIcon className="text-red-500" />
                            <span className="text-red-500">
                              En feil oppstod, og vi kunne ikke sjekke om
                              gjenstanden er ledig
                            </span>
                          </SlideAnimation>
                        )}
                        {bookingAvailability &&
                          !isCheckingAvailability &&
                          !isAvailabilityError && (
                            <SlideAnimation
                              className="flex items-center gap-2.5 overflow-hidden"
                              exit={{
                                height: 0,
                                opacity: 0,
                                translateY: -20,
                              }}
                              direction="up"
                              key="availability-free"
                            >
                              <SmileIcon className="text-green-500" />
                              <span className="text-green-500">
                                Gjenstanden er ledig
                              </span>
                            </SlideAnimation>
                          )}
                        {!bookingAvailability && !isCheckingAvailability && (
                          <SlideAnimation
                            className="flex items-center gap-2.5 overflow-hidden"
                            exit={{
                              height: 0,
                              opacity: 0,
                              translateY: -20,
                            }}
                            direction="up"
                            key="availability-booked"
                          >
                            <TriangleAlertIcon className="text-red-500" />
                            <span className="text-red-500">
                              Gjenstanden kan ikke bookes i dette tidsrommet, da
                              den allerede er booket av noen andre.
                            </span>
                          </SlideAnimation>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            <Card className="gap-2.5 shadow-none">
              <CardHeader>
                <CardDescription>
                  Fyll ut én eller fler av følgende
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Epost</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefonnummer</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            {type === ItemType.OVERNATTING && (
              <FormField
                control={form.control}
                name="personCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antall personer</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        min={1}
                        onChange={(e) => {
                          // Refuse values below 1
                          const value = Number(e.currentTarget.value);
                          if (!isNaN(value) && value >= 1) {
                            field.onChange(value);
                          } else {
                            field.onChange(1);
                          }
                        }}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Separator />
            <div className="flex flex-col">
              <span>Totalpris</span>
              <div className="flex flex-row items-center gap-2.5">
                <span
                  className={cn(
                    "text-card-foreground text-2xl font-bold transition-all",
                    showMemberPrice && "text-primary",
                  )}
                >
                  {!showMemberPrice ? totalPrice : memberPrice} kr
                </span>
                <AnimatePresence>
                  {showMemberPrice && (
                    <SlideAnimation
                      direction="up"
                      transition={{
                        type: "spring",
                      }}
                    >
                      <Badge>-{memberPriceDiscount}%</Badge>
                    </SlideAnimation>
                  )}
                </AnimatePresence>
                <EditItemPriceDialog
                  id={item.id}
                  defaultValues={{
                    memberDiscount: memberPriceDiscount ?? 0,
                    price: basePrice,
                    personPrice,
                  }}
                  type={type!}
                />
              </div>
            </div>
            {typeof memberPriceDiscount === "number" && (
              <>
                <Separator />
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="member-price"
                    onCheckedChange={(checked) =>
                      setShowMemberPrice(Boolean(checked.valueOf()))
                    }
                  />
                  <Label htmlFor="member-price">Vis medlemspris</Label>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-5 flex w-full flex-col items-center gap-2.5 md:flex-row md:gap-5">
          <div className="flex w-full flex-col gap-1 md:w-fit md:flex-row md:gap-2.5">
            <Button size={"lg"} type="submit">
              <ShoppingCartIcon /> Book nå
            </Button>
            <SubmitBookingDialog
              booking={{
                from: from,
                to: to,
                itemId: item.id,
                email: email ?? "",
                phone: phone ?? "",
                name: name ?? "",
                message: message ?? "",
              }}
              open={submitDialogOpen}
              onOpenChange={setSubmitDialogOpen}
              itemName={item.name}
              totalPrice={totalPrice}
              memberPrice={memberPrice}
              memberPriceDiscount={memberPriceDiscount}
            />
          </div>
          <div className="bg-border hidden h-5 w-[1px] md:block" />
          <BookingInformationDialog />
        </div>
      </form>
    </Form>
  );
}

export default BookingForm;
