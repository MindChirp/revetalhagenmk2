"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { PlusIcon } from "lucide-react";

function CreateBookingItem() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mx-auto w-fit">
          <PlusIcon />
          Opprett
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Opprett ny gjenstand</DialogTitle>
          <DialogDescription>
            Opprett en gjenstand som kan leies ut av alle
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateBookingItem;
