import type { event } from "@/server/db/schema";
import { format, isSameDay } from "date-fns";
import { nb } from "date-fns/locale";
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { cn } from "@/lib/utils";

type LandingEventListProps = {
  events: (typeof event.$inferSelect)[];
} & React.HTMLAttributes<HTMLDivElement>;
const LandingEventList = ({
  events,
  className,
  ...props
}: LandingEventListProps) => {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 md:px-10",
        className,
      )}
      {...props}
    >
      <div className="flex flex-row items-start justify-center gap-2.5 md:items-center">
        <CalendarIcon />
        <h2 className="w-fit text-2xl leading-none font-black">
          Kommende arrangementer
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {events.map((event) => (
          <Link
            href={`/arrangementer/${event.id}`}
            key={event.id}
            className="h-auto"
          >
            <Card className="h-full w-full">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.preview}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-2.5">
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
                {event.location && (
                  <p className="flex items-center gap-1">
                    <MapPinIcon /> {event.location}
                  </p>
                )}
                <CardAction className="mt-2.5 flex h-full items-end justify-self-start">
                  <Button variant="secondary">
                    Se mer <ArrowRightIcon />
                  </Button>
                </CardAction>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {events.length === 0 && (
        <Alert variant="default" className="mx-auto w-fit">
          <TriangleAlertIcon />
          <AlertTitle>Her var det tomt</AlertTitle>
          <AlertDescription>
            Det er ingen kommende arrangementer akkurat nå
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LandingEventList;
