"use client";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid,
} from "@schedule-x/calendar";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

interface BookingCalendarDialogProps {
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function BookingCalendarDialog({ trigger }: BookingCalendarDialogProps) {
  const router = useRouter();
  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthAgenda(),
      createViewMonthGrid(),
    ],
    defaultView: viewMonthGrid.name,
    callbacks: {
      onEventClick: (event) => {
        router.push(`/arrangementer/${event.id}`);
      },
    },

    showWeekNumbers: true,
    locale: "nb-NO",
    theme: "shadcn",
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex max-h-[90vh] w-full max-w-[90vw] flex-col">
        <DialogHeader>
          <DialogTitle>Bookingkalender</DialogTitle>
          <DialogDescription>
            Se tilgjengelighet av gjenstanden
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-scroll">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>
              <XIcon /> Lukk
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BookingCalendarDialog;
