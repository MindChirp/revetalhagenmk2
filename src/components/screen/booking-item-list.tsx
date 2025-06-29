"use client";
import { api } from "@/trpc/react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeInfoIcon, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parseAsIsoDate, parseAsString, useQueryStates } from "nuqs";
import SlideAnimation from "../ui/animated/slide-animation";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

function BookingItemList() {
  const [filterQueries] = useQueryStates({
    type: parseAsString,
    from: parseAsIsoDate,
    to: parseAsIsoDate,
  });
  const {
    data: items,
    isFetching,
    isRefetching,
    isError,
    isRefetchError,
  } = api.booking.getItems.useQuery({
    type: filterQueries.type ? parseInt(filterQueries.type) : undefined,
    from: filterQueries.from ?? undefined,
    to: filterQueries.to ?? undefined,
  });
  return (
    <div
      className="flex min-h-[80vh] w-full flex-col items-center gap-2.5"
      id="booking-item-list"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!(isFetching || isRefetching) && (items?.length ?? 0) > 0 && (
          <motion.h2
            key="result-count"
            className="text-card-foreground px-10 text-3xl font-black"
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
        )}

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
        {(isError || isRefetchError) && (
          <SlideAnimation direction="up" key="error">
            <h2 className="text-card-foreground py-5 text-xl font-black">
              Noe gikk galt, prøv igjen senere.
            </h2>
          </SlideAnimation>
        )}
        <div className="grid w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 md:w-fit md:grid-cols-3 md:px-10">
          {items?.map((item, index) => (
            <motion.div
              key={item.id + "" + index}
              className="h-full w-full md:max-w-80"
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <div className="border-border bg-card flex h-full flex-col overflow-hidden rounded-lg border shadow-xs md:w-80">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name ?? "Booking-gjenstand"}
                    width={1000}
                    height={500}
                    className="h-48 w-full rounded-t-lg rounded-b-md object-cover shadow-xs"
                  />
                )}
                <div className="flex grow flex-col gap-2.5 py-5">
                  <CardHeader className="grow">
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center gap-2.5">
                    <Link
                      href={`/booking/${item.id}?from=${filterQueries.from?.toISOString() ?? ""}&to=${filterQueries.to?.toISOString() ?? ""}`}
                    >
                      <Button>
                        <BadgeInfoIcon />
                        Mer info
                      </Button>
                    </Link>
                    <span className="text-primary font-semibold">
                      {item.price} kroner
                    </span>
                  </CardContent>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

export default BookingItemList;
