import { api } from "@/trpc/react";
import { parseAsString, useQueryStates } from "nuqs";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AnimatePresence, motion } from "framer-motion";
import SlideAnimation from "../ui/animated/slide-animation";
import { Loader } from "lucide-react";

function BookingItemList() {
  const [filterQueries] = useQueryStates({
    type: parseAsString,
  });
  const {
    data: items,
    isFetching,
    isRefetching,
    isError,
    isRefetchError,
  } = api.booking.getItems.useQuery({
    type: filterQueries.type ? parseInt(filterQueries.type) : undefined,
  });
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center gap-2.5">
      <AnimatePresence mode="wait" initial={false}>
        {(!(isFetching || isRefetching) && items?.length) ??
          (0 > 0 && (
            <motion.h2
              key="result-count"
              className="text-card-foreground px-10 text-5xl font-black"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
            >
              {items?.length ?? 0} resultat{items?.length !== 1 ? "er" : ""}
            </motion.h2>
          ))}

        {(isFetching || isRefetching) && (
          <SlideAnimation direction="up" key="loader">
            <Loader className="animate-spin" />
          </SlideAnimation>
        )}
        {items?.length === 0 && !isFetching && !isRefetching && (
          <SlideAnimation direction="up" key="no-results">
            <h2 className="text-card-foreground py-5 text-xl font-black">
              Ingen resultater
            </h2>
          </SlideAnimation>
        )}
        <div className="grid w-full grid-cols-1 gap-5 px-10 sm:grid-cols-2 md:grid-cols-3">
          {items?.map((item, index) => (
            <motion.div
              key={item.id + "" + index}
              className="h-full w-full"
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <span>{item.description ?? "Ingen beskrivelse tilgjengelig"}</span> */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

export default BookingItemList;
