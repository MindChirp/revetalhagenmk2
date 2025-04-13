"use client";
import React from "react";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { format } from "date-fns";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";

function EventCalendar() {
  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthAgenda(),
      createViewMonthGrid(),
    ],
    locale: "nb-NO",

    theme: "shadcn",
    events: [
      {
        id: "1",
        start: format(new Date("2025-04-14T10:00:00"), "yyyy-MM-dd HH:mm"),
        end: format(new Date("2025-04-14T12:00:00"), "yyyy-MM-dd HH:mm"),
        title: "Event 1",
      },
    ],
  });
  return <ScheduleXCalendar calendarApp={calendar} />;
}

export default EventCalendar;
