"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { BedDouble, BedIcon, ClockIcon, ShoppingCartIcon } from "lucide-react";
import { Badge } from "./badge";
import { format } from "date-fns";
import type { item } from "@/server/db/schema";
import { ItemType } from "@/lib/item-type";
import { Separator } from "./separator";

type SubmitBookingDialogProps = {
  from: Date;
  to: Date;
  item: typeof item.$inferSelect;
  totalPrice?: number;
};
function SubmitBookingDialog({
  from,
  to,
  item,
  totalPrice,
}: SubmitBookingDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"lg"}>
          <ShoppingCartIcon /> Book nå
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bekreft booking</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row flex-wrap gap-2.5">
          <Badge variant="outline">
            <ClockIcon /> Fra {format(from, "dd.MM.yyyy")}
          </Badge>
          <Badge variant="outline">
            <ClockIcon /> Til {format(to, "dd.MM.yyyy")}
          </Badge>
          <Badge variant="outline">
            <BedDouble /> {item.name}
          </Badge>
        </div>
        <Separator />
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
        <Button className="animate-bounce">
          <ShoppingCartIcon /> Book nå
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default SubmitBookingDialog;
