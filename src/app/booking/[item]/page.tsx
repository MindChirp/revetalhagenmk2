import BookingInformationDialog from "@/components/booking-information-dialog";
import BookingForm from "@/components/forms/booking-form/booking-form";
import { Badge } from "@/components/ui/badge";
import BookingCalendarDialog from "@/components/ui/booking-calendar-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import CreateItemMeta from "@/components/ui/create-item-meta";
import DeleteItemMeta from "@/components/ui/delete-item-meta";
import EditableItemDescription from "@/components/ui/editable-item-description";
import { Separator } from "@/components/ui/separator";
import { ItemType, ItemTypePriceTypeMap } from "@/lib/item-type";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarIcon, CheckIcon, ShoppingCartIcon } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

async function Item({
  params,
  searchParams,
}: {
  params: Promise<{ item: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { item } = await params;
  const { from, to } = await searchParams;
  if (!item) {
    // Redirect to not found
    redirect("/404");
  }
  const itemData = await api.booking.getItemById({ id: Number(item) });
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!itemData)
    return (
      <div className="flex min-h-screen w-full flex-col gap-5 px-5 pt-20 pb-10 md:px-10">
        <span className="text-2xl font-medium">
          Kunne ikke finne gjenstanden
        </span>
      </div>
    );
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-5 pt-32 pb-10 md:px-10">
      <div className="relative h-56 w-full overflow-hidden rounded-3xl md:h-96">
        <Image
          src={itemData?.image ?? ""}
          alt="Gjenstandsbilde"
          width={1000}
          height={1000}
          className="absolute top-0 left-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <h1 className="w-fit text-5xl font-black">{itemData.name}</h1>
        {from && to && (
          <Badge>
            <CheckIcon />
            Ledig fra{" "}
            {format(from, "do LLL yyy", {
              locale: nb,
            })}{" "}
            til{" "}
            {format(to, "do LLL yyy", {
              locale: nb,
            })}
          </Badge>
        )}
        <Card className="mt-5 gap-2.5">
          <CardContent className="flex flex-col gap-5">
            <Badge variant="secondary">
              {itemData.type && (
                <span className="flex items-center gap-2.5">
                  <DynamicIcon name="banknote" />
                  {`${itemData.price} ${(itemData.type as ItemType) === ItemType.OVERNATTING ? `+ ${itemData.personPrice}` : ""} ${ItemTypePriceTypeMap[itemData.type as ItemType]}`}
                </span>
              )}
            </Badge>

            <div className="flex flex-col flex-wrap gap-2.5 md:flex-row md:gap-5">
              {itemData.itemMeta.map((meta) => (
                <span
                  className="flex items-center gap-2.5"
                  key={meta.id + "meta"}
                >
                  {meta.icon && <DynamicIcon name={meta.icon as IconName} />}
                  {meta.label}
                  {session?.user.role === "admin" && (
                    <DeleteItemMeta id={Number(meta.id)} />
                  )}
                </span>
              ))}
              {session?.user.role === "admin" && (
                <CreateItemMeta itemId={Number(item)} />
              )}
              <Separator orientation="horizontal" />

              <div>
                <EditableItemDescription
                  itemId={Number(item)}
                  description={itemData.description ?? ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-2.5">
          <CardHeader>
            <CardDescription>Bookinginformasjon</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm
              id={itemData.id}
              memberPriceDiscount={itemData.memberDiscount}
              type={itemData.type as ItemType}
              basePrice={itemData.price}
              personPrice={itemData.personPrice}
            />
          </CardContent>
        </Card>
        <div className="mt-5 flex w-full flex-col items-center gap-2.5 md:flex-row md:gap-5">
          <div className="flex w-full flex-col gap-1 md:w-fit md:flex-row md:gap-2.5">
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
          <div className="bg-border hidden h-5 w-[1px] md:block" />
          <BookingInformationDialog />
        </div>
      </div>
    </div>
  );
}

export default Item;
