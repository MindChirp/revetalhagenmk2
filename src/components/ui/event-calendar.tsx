"use client";
import { api } from "@/trpc/react";
import { format, isSameDay, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { ArrowRight, ClockIcon, MapPin } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import EventDialog from "./event-dialog";
import { Separator } from "./separator";
import Link from "next/link";
import { Button } from "./button";

function EventCalendar() {
  const [from, setFrom] = useState(startOfWeek(new Date()));
  const { data: events } = api.events.getEvents.useQuery({
    from: from,
  });

  type EventItem = NonNullable<typeof events>[number];
  const groupedEvents =
    events
      ?.slice()
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .reduce<Record<string, EventItem[]>>((acc, event) => {
        const key = `${event.start.getFullYear()}-${event.start.getMonth()}`;
        (acc[key] ??= []).push(event);
        return acc;
      }, {}) ?? {};

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
                <CardContent>
                  <span className="flex flex-row items-center gap-1">
                    <ClockIcon size={16} />
                    {isSameDay(e.start, e.end)
                      ? `${format(e.start, "PPPP p", { locale: nb })} - ${format(e.end, "p", { locale: nb })}`
                      : `${format(e.start, "PPPP p", { locale: nb })} - ${format(e.end, "do LLLL p", { locale: nb })}`}
                  </span>
                  <div className="bg-card">
                    {e.location && (
                      <span className="flex flex-row items-center gap-1">
                        <MapPin size={16} />
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
    </div>
  );
}

export default EventCalendar;
