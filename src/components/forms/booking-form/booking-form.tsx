"use client";

import { PhoneInput } from "@/components/phone-input";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import { Badge } from "@/components/ui/badge";
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
import { ItemType } from "@/lib/item-type";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/client";
import { booking } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { intervalToDuration, startOfDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, SmileIcon, TriangleAlertIcon } from "lucide-react";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    from: z.date({
      message: "Fra-dato må være definert",
    }),
    to: z.date({
      message: "Til-dato må være definert",
    }),
    itemId: z.number(),
    userId: z.number().optional(),
    email: z.string().email({ message: "Ugyldig epostadresse" }).optional(),
    phone: z.string().optional(),
    name: z.string().min(5, {
      message: "Navn er påkrevd",
    }),
    message: z.string().optional(),
    personCount: z.number().min(1).max(100).optional(),
  })
  .refine(
    (data) => {
      console.log("Refining dates: ", data.from, data.to);
      return data.from < data.to;
    },
    {
      message: "Fra-dato må være før til-dato",
      path: ["from"],
    },
  )
  .refine((data) => !!data.email || !!data.phone, {
    message: "Du må fylle ut enten epost eller telefonnummer",
    path: ["email", "phone"],
  });

const handleSubmit = (data: z.infer<typeof formSchema>) => {
  console.log("Form submitted with data:", data);
};

type BookingFormProps = {
  type?: ItemType;
  basePrice: number;
  personPrice: number;
  memberPriceDiscount?: number;
  id: number;
};
function BookingForm({
  id,
  type,
  basePrice,
  personPrice,
  memberPriceDiscount,
}: BookingFormProps) {
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
      itemId: id,
    },
    resolver: zodResolver(formSchema),
    reValidateMode: "onBlur",
  });
  const [people, from, to] = form.watch(["personCount", "from", "to"]);
  const {
    data: bookingAvailability,
    isLoading: isCheckingAvailability,
    isError: isAvailabilityError,
  } = api.booking.checkAvailability.useQuery({
    itemId: id,
    from: from,
    to: to,
  });
  const { data: itemBookings, isLoading: itemBookingsLoading } =
    api.booking.getItemBookings.useQuery({
      itemId: id,
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        {itemBookings?.[0]?.booking.from.toISOString()}
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
                        type !==
                        (ItemType.OVERNATTING ||
                          ItemType.MØTEROM ||
                          ItemType.ARRANGEMENTSROM)
                      }
                      calendarDisable={
                        itemBookingsLoading
                          ? []
                          : itemBookings?.map((booking) => {
                              console.log(
                                "Booking dates: ",
                                booking.booking.from,
                                booking.booking.to,
                              );
                              return [booking.booking.from, booking.booking.to];
                            })
                      }
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
                      type !==
                      (ItemType.OVERNATTING ||
                        ItemType.MØTEROM ||
                        ItemType.ARRANGEMENTSROM)
                    }
                    calendarDisable={itemBookings?.map((booking) => {
                      return [booking.booking.from, booking.booking.to];
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
                          Gjenstanden kan ikke bookes i dette tidsrommet, da den
                          allerede er booket av noen andre.
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
            <CardDescription>Fyll ut én eller fler av følgende</CardDescription>
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
                showMemberPrice && "text-green-600",
              )}
            >
              {type === ItemType.OVERNATTING ? (
                <>
                  {((people ?? 0) * personPrice + basePrice) *
                    (duration.days ?? 1) *
                    (showMemberPrice
                      ? (100 - (memberPriceDiscount ?? 0)) / 100
                      : 1)}{" "}
                  kr
                </>
              ) : (
                <>
                  {basePrice *
                    (duration.days ?? 1) *
                    (showMemberPrice
                      ? (100 - (memberPriceDiscount ?? 0)) / 100
                      : 1)}{" "}
                  kr
                </>
              )}
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
              id={id}
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
      </form>
    </Form>
  );
}

export default BookingForm;
