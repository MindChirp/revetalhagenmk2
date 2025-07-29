"use client";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useMemo, type ComponentProps } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import SlideAnimation from "./animated/slide-animation";
import Link from "next/link";

function EventList({ className, ...props }: ComponentProps<typeof motion.div>) {
  const dateToday = useMemo(() => new Date(), []);
  const { data, isPending } = api.events.getEvents.useQuery({
    from: dateToday,
    limit: 5,
  });

  return (
    <AnimatePresence mode="wait">
      {isPending && (
        <SlideAnimation key="loader" direction="up" className="mx-auto">
          <Loader className="animate-spin" />
        </SlideAnimation>
      )}

      {data && !isPending && data.length > 0 && (
        <motion.div
          key="event-list"
          {...props}
          className={cn("flex flex-col gap-2.5 overflow-hidden", className)}
          initial={{ opacity: 0, height: 0, paddingBottom: 0 }}
          animate={{ opacity: 1, height: "auto", paddingBottom: 2 }}
          transition={{
            type: "spring",
            damping: 20,
            duration: 0.5,
          }}
        >
          {data?.map((event) => (
            <Link key={event.id + "event"} href={`/arrangementer/${event.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-col gap-2">
                      <span className="line-clamp-3">
                        {event.preview ?? "Ingen oppsummering tilgjengelig"}
                      </span>
                      <div>
                        {format(event.start, "dd.MM.yyyy")} -{" "}
                        {format(event.end, "dd.MM.yyyy")}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </motion.div>
      )}
      {data?.length === 0 && !isPending && (
        <motion.div
          key="no-events"
          className={cn("w-full overflow-hidden")}
          initial={{ opacity: 0, height: 0, paddingBottom: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{
            type: "spring",
            damping: 20,
            duration: 0.5,
          }}
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Det er ingen kommende arrangementer</CardTitle>
              <CardDescription>
                Men sjekk igjen seinere for oppdateringer!
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EventList;
