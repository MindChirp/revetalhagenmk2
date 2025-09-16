import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ItemType } from "@/lib/item-type";
import { cn } from "@/lib/utils";
import type { item } from "@/server/db/schema";
import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type BookingItemCardProps = {
  item: typeof item.$inferSelect;
  href: string;
  withImage?: boolean;
  withPrice?: boolean;
  description?: React.ReactNode;
  buttonContent?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;
const BookingItemCard = ({
  item,
  withImage = true,
  withPrice = false,
  href,
  description = item.description,
  buttonContent,
  className,
  ...props
}: BookingItemCardProps) => {
  const price = `Fra ${
    item.type === ItemType.OVERNATTING
      ? item.price + item.personPrice
      : item.price
  } kroner`;
  return (
    <div
      className={cn(
        "border-border bg-card flex h-full flex-col overflow-hidden rounded-lg border shadow-xs md:w-80",
        className,
      )}
      {...props}
    >
      {withImage && item.image && (
        <Image
          src={item.image}
          alt={item.name ?? "Booking-gjenstand"}
          width={1000}
          height={500}
          className="h-48 w-full rounded-t-lg rounded-b-md object-cover shadow-xs"
        />
      )}
      <div className="flex grow flex-col gap-2.5 py-5">
        <CardHeader className="grow">
          {item.type && (
            <Badge className="mb-2.5 capitalize">
              {ItemType[item.type]?.toLowerCase()}
            </Badge>
          )}
          <CardTitle>{item.name}</CardTitle>
          <CardDescription className="line-clamp-3">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row items-center gap-2.5">
          <Link href={href}>
            {buttonContent ?? (
              <>
                <Button>
                  <ShoppingCartIcon />
                  Bestill
                </Button>
              </>
            )}
          </Link>
          {withPrice && (
            <span className="text-primary leading-none font-semibold">
              {price}
            </span>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default BookingItemCard;
