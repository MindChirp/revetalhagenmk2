"use client";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useMemo, type ComponentProps } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import SlideAnimation from "./animated/slide-animation";

function EventList({ className, ...props }: ComponentProps<typeof motion.div>) {
  const dateToday = useMemo(() => new Date(), []);
  const { data, isPending } = api.events.getEvents.useQuery({
    from: dateToday,
    limit: 5,
  });

  return (
    <AnimatePresence mode="sync">
      {isPending && (
        <SlideAnimation
          key="loader"
          direction="up"
          className="mx-auto"
          exit={{
            height: 0,
            opacity: 0,
          }}
        >
          <Loader className="animate-spin" />
        </SlideAnimation>
      )}
      {data && !isPending && (
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
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  <div className="flex flex-col gap-2">
                    <span className="line-clamp-3">
                      {event.description ?? "Ingen beskrivelse tilgjengelig"}
                    </span>
                    <div>
                      {format(event.start, "dd.MM.yyyy")} -{" "}
                      {format(event.end, "dd.MM.yyyy")}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EventList;
