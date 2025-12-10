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

  return (
    <div className="flex w-full flex-col gap-5">
      <EventDialog />
      {Object.entries(groupedEvents).map(([key, monthEvents]) => (
        <div key={key} className="flex w-full flex-col gap-2">
          {monthEvents[0]?.start && (
            <div className="flex w-full flex-col">
              <h3 className="text-lg font-semibold capitalize">
                {format(monthEvents[0]?.start, "LLLL yyyy", {
                  locale: nb,
                })}
              </h3>
              <Separator orientation="horizontal" className="w-full" />
            </div>
          )}
          {monthEvents.map((e) => (
            <Link href={`/arrangementer/${e.id}`} key={e.id}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2>{e.title}</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <span className="flex flex-row items-center gap-2">
                    <ClockIcon size={16} className="flex-shrink-0" />
                    {isSameDay(e.start, e.end)
                      ? `${format(e.start, "PPPP p", { locale: nb })} - ${format(e.end, "p", { locale: nb })}`
                      : `${format(e.start, "EEEE Pp", { locale: nb })} - ${format(e.end, "EEEE Pp", { locale: nb })}`}
                  </span>
                  <div className="bg-card">
                    {e.location && (
                      <span className="flex flex-row items-center gap-2">
                        <MapPin size={16} className="flex-shrink-0" />
                        {e.location}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant={"secondary"}>
                    <ArrowRight /> Les mer
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ))}

      {(events?.length ?? 0) === 0 && (
        <div>
          <h2>Ops! Det er ingen kommende arrangementer akkurat nå</h2>
        </div>
      )}
    </div>
  );
}

export default EventCalendar;
