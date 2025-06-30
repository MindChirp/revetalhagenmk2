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
import { intervalToDuration } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { parseAsIsoDateTime, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  from: z.date(),
  to: z.date(),
  itemId: z.number(),
  userId: z.number().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  name: z.string().optional(),
  message: z.string().optional(),
  personCount: z.number().min(1).max(100).optional(),
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
    },
  });
  const people = form.watch("personCount");
  const from = form.watch("from");
  const to = form.watch("to");
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
                  <DateTimePicker
                    {...field}
                    allowTime={
                      type !==
                      (ItemType.OVERNATTING ||
                        ItemType.MØTEROM ||
                        ItemType.ARRANGEMENTSROM)
                    }
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                  />
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
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                  <Input {...field} type="number" />
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
