import BookingForm from "@/components/forms/booking-form/booking-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CreateItemMeta from "@/components/ui/create-item-meta";
import DeleteItemMeta from "@/components/ui/delete-item-meta";
import EditableItemDescription from "@/components/ui/editable-item-description";
import { Separator } from "@/components/ui/separator";
import { ItemType } from "@/lib/item-type";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CheckIcon, TriangleAlertIcon } from "lucide-react";
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
  const availability =
    from && to
      ? await api.booking.checkAvailability({
          itemId: Number(item),
          from: new Date(from),
          to: new Date(to),
        })
      : undefined;
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

  const price = `Fra ${itemData.type === ItemType.OVERNATTING ? itemData.price + itemData.personPrice : itemData.price} kroner`;
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-5 pt-32 pb-10 md:px-10">
      <div className="relative h-56 w-full rounded-3xl md:h-96">
        <Carousel
          className="h-56 w-full max-w-none md:h-96"
          opts={{
            align: "center",
          }}
        >
          <CarouselContent className="h-full w-full flex-1">
            {itemData.itemImage?.map((image) => (
              <CarouselItem className="h-96 basis-1/3" key={image.id + "image"}>
                <Image
                  src={image.url}
                  alt={"Bilde av gjenstanden"}
                  className="h-56 w-full rounded-3xl object-cover md:h-96"
                  width={1000}
                  height={1000}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
        {/* <Image
          src={itemData?.image ?? ""}
          alt="Gjenstandsbilde"
          width={1000}
          height={1000}
          className="absolute top-0 left-0 h-full w-full object-cover"
        /> */}
      </div>
      <div className="mt-5 flex flex-col gap-2.5">
        <h1 className="w-fit text-5xl font-black">{itemData.name}</h1>
        {availability === true && from && to && (
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
        {availability === false && from && to && (
          <Badge variant="destructive">
            <TriangleAlertIcon />
            Ikke ledig fra{" "}
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
                  {price}
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

        <BookingForm
          item={{
            id: itemData.id,
            name: itemData.name ?? "Ukjent gjenstand",
          }}
          memberPriceDiscount={itemData.memberDiscount}
          type={itemData.type as ItemType}
          basePrice={itemData.price}
          personPrice={itemData.personPrice}
        />
      </div>
    </div>
  );
}

export default Item;
