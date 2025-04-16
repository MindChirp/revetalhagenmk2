"use client";
import { api } from "@/trpc/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

function EventCalendar() {
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const { data: events, isPending } = api.events.getEvents.useQuery({
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
    callbacks: {
      onRangeUpdate: (range) => {
        setFrom(new Date(range.start));
        setTo(new Date(range.end));
      },
    },
    locale: "nb-NO",
    theme: "shadcn",
  });

  return (
    <>
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
          >
            <Loader className="animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      {true && <ScheduleXCalendar calendarApp={calendar} />}
    </>
  );
}

export default EventCalendar;
