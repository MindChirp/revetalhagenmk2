import { formatEventDateRange } from "@/lib/event-date-format";
import { cn } from "@/lib/utils";
import type { event } from "@/server/db/schema";
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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

const eventDayFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "short",
});

type LandingEventListProps = {
  events: (typeof event.$inferSelect)[];
} & React.HTMLAttributes<HTMLDivElement>;

const LandingEventList = ({
  events,
  className,
  ...props
}: LandingEventListProps) => {
  const sectionDescription =
    events.length > 0
      ? "Fra åpne møteplasser til kurs og samlinger. Her finner du det som skjer nå."
      : "Det er rolig i kalenderen akkurat nå, men nye aktiviteter legges ut fortløpende.";

  return (
    <section
      className={cn(
        "relative mx-auto w-full max-w-6xl px-5 md:px-10",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_top_left,_rgba(220,235,208,0.9),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.86),_rgba(255,255,255,0.7))]" />
      <div className="rounded-[2.5rem] border border-white/60 bg-background/75 px-6 py-8 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.45)] backdrop-blur-md md:px-10 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="bg-secondary/65 text-foreground inline-flex w-fit items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-sm font-medium shadow-sm">
              <CalendarIcon className="size-4" />
              Kommende arrangementer
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl leading-tight font-semibold md:text-4xl">
                Aktiviteter som samler folk i og rundt Revetalhagen
              </h2>
              <p className="max-w-xl text-base leading-7 text-foreground/70">
                {sectionDescription}
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/70 bg-background/70 px-5 backdrop-blur-sm"
          >
            <Link href="/arrangementer">
              Alle arrangementer <ArrowRightIcon />
            </Link>
          </Button>
        </div>

        {events.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {events.map((event) => (
              <Link
                href={`/arrangementer/${event.id}`}
                key={event.id}
                className="group h-full"
              >
                <Card className="h-full gap-0 rounded-[2rem] border-white/60 bg-white/65 py-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardHeader className="gap-4 border-b border-border/50 py-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="bg-secondary/70 text-foreground/80 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]">
                          {eventDayFormatter.format(event.start)}
                        </div>
                        <CardTitle className="text-xl leading-tight">
                          {event.title ?? "Arrangement"}
                        </CardTitle>
                      </div>
                      <div className="bg-background/80 text-foreground/40 flex size-9 shrink-0 items-center justify-center rounded-full transition group-hover:translate-x-1 group-hover:text-foreground">
                        <ArrowRightIcon className="size-4" />
                      </div>
                    </div>
                    <CardDescription className="line-clamp-3 text-sm leading-6 text-foreground/70">
                      {event.preview ??
                        "Les mer om arrangementet og finn praktisk informasjon."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex h-full flex-col gap-3 py-6">
                    <div className="flex items-start gap-3 rounded-2xl bg-background/70 px-4 py-3">
                      <ClockIcon className="text-primary mt-0.5 size-4 shrink-0" />
                      <p className="text-sm leading-6 text-foreground/75">
                        {formatEventDateRange(event.start, event.end)}
                      </p>
                    </div>
                    {event.location && (
                      <div className="flex items-start gap-3 rounded-2xl bg-background/70 px-4 py-3">
                        <MapPinIcon className="text-primary mt-0.5 size-4 shrink-0" />
                        <p className="text-sm leading-6 text-foreground/75">
                          {event.location}
                        </p>
                      </div>
                    )}
                    <div className="mt-auto pt-2">
                      <Button variant="secondary" className="rounded-full">
                        Se mer <ArrowRightIcon />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Alert
            variant="default"
            className="mx-auto mt-8 w-fit border-white/60 bg-background/80"
          >
            <TriangleAlertIcon />
            <AlertTitle>Her var det tomt</AlertTitle>
            <AlertDescription>
              Det er ingen kommende arrangementer akkurat nå.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </section>
  );
};

export default LandingEventList;
