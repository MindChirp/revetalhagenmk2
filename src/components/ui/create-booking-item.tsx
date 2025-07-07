"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function CreateBookingItem() {
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
