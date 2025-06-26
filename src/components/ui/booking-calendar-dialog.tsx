"use client";
import React, { useState } from "react";
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
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid,
} from "@schedule-x/calendar";
import { endOfWeek, startOfWeek } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { XIcon } from "lucide-react";

interface BookingCalendarDialogProps {
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function BookingCalendarDialog({ trigger }: BookingCalendarDialogProps) {
  const [from, setFrom] = useState(startOfWeek(new Date()));
  const [to, setTo] = useState(endOfWeek(new Date()));
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
      onRangeUpdate: (range) => {
        setFrom(new Date(range.start));
        setTo(new Date(range.end));
      },
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
