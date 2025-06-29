"use client";
import { api } from "@/trpc/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid,
} from "@schedule-x/calendar";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function EventCalendar() {
  const [from, setFrom] = useState(startOfWeek(new Date()));
  const [to, setTo] = useState(endOfWeek(new Date()));
  const router = useRouter();
  const { data: events } = api.events.getEvents.useQuery({
    from: from,
    to: to,
  });

  useEffect(() => {
    calendar?.events.set(
      events?.map((e) => ({
        id: e.id,
        title: e.title ?? "Ukjent",
        start: format(new Date(e.start), "yyyy-MM-dd HH:mm"),
        end: format(new Date(e.end), "yyyy-MM-dd HH:mm"),
        description: e.description ?? "Test",
        location: e.location ?? "Sted",
      })) ?? [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

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

  return <ScheduleXCalendar calendarApp={calendar} />;
}

export default EventCalendar;
