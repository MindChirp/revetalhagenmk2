import type { event } from "@/server/db/schema";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";

type LandingEventListProps = {
  events: (typeof event.$inferSelect)[];
};
const LandingEventList = ({ events }: LandingEventListProps) => {
  return (
    <div className="mx-auto my-10 flex w-full max-w-6xl flex-col gap-5 px-5 md:px-10">
      <div className="flex flex-row items-center justify-center gap-2.5">
        <CalendarIcon />
        <h2 className="w-fit text-2xl leading-none font-black">
          Kommende arrangementer
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {events.map((event) => (
          <Card className="max-w-lg" key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {event.preview}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <p className="flex items-center gap-1">
                <ClockIcon />
                {isSameDay(event.start, event.end)
                  ? format(event.start, "do LLL yyy HH:mm", {
                      locale: nb,
                    }) +
                    " - " +
                    format(event.end, "HH:mm", {
                      locale: nb,
                    })
                  : format(event.start, "do LLL yyy HH:mm", {
                      locale: nb,
                    }) +
                    " - " +
                    format(event.end, "do LLL yyy", { locale: nb })}
              </p>
              <p className="flex items-center gap-1">
                <MapPinIcon /> {event.location}
              </p>
              <CardAction className="mt-2.5 justify-self-start">
                <Link href={`/arrangementer/${event.id}`}>
                  <Button>
                    Se mer <ArrowRightIcon />
                  </Button>
                </Link>
              </CardAction>
            </CardContent>
          </Card>
        ))}
      </div>
      {events.length === 0 && (
        <div className="flex w-full items-center justify-center rounded-3xl bg-gray-300 p-5">
          <span>Det er ingen kommende arrangementer akkurat nå</span>
        </div>
      )}
    </div>
  );
};

export default LandingEventList;
