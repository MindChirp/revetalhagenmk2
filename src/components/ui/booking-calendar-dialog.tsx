"use client";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid,
  viewWeek,
} from "@schedule-x/calendar";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import type { booking } from "@/server/db/schema";
import { endOfWeek, format, startOfWeek } from "date-fns";

interface BookingCalendarDialogProps {
  initialRange?: {
    from: Date;
    to: Date;
  };
  bookings?: (typeof booking.$inferSelect)[];
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function BookingCalendarDialog({
  trigger,
  bookings,
}: BookingCalendarDialogProps) {
  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthAgenda(),
      createViewMonthGrid(),
    ],
    defaultView: viewWeek.name,
    showWeekNumbers: true,
    locale: "nb-NO",
    theme: "shadcn",
  });

  useEffect(() => {
    if (!bookings) return;
    calendar?.events.set(
      bookings?.map((booking) => ({
        id: booking.id,
        title: "Annen booking",
        start: format(new Date(booking.from), "yyyy-MM-dd HH:mm"),
        end: format(new Date(booking.to), "yyyy-MM-dd HH:mm"),
        description: `${format(new Date(booking.from), "dd.MM.yyyy")} - ${format(new Date(booking.to), "dd.MM.yyyy")}`,
        location: "Et sted",
        calendarId: booking.id.toString(),
      })) ?? [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  if (!bookings) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex max-h-[90vh] w-full max-w-[90vw]! flex-col">
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
