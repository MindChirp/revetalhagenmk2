"use client";
import { motion } from "framer-motion";
import { api } from "@/trpc/react";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TimeDirection } from "../screen/news-filters";
import { useDebounce } from "use-debounce";
import { Button } from "./button";
import { AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import SlideAnimation from "./animated/slide-animation";
import Link from "next/link";
import { Avatar, AvatarImage } from "./avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import NewsCard from "./news-card";

function NewsList() {
  const [filters] = useQueryStates({
    orderBy: parseAsStringEnum<TimeDirection>(
      Object.values(TimeDirection),
    ).withDefault(TimeDirection.NEWEST),
    q: parseAsString,
  });
  const [debouncedFilters] = useDebounce(filters, 500);

  const {
    data: news,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = api.news.getAllInfinite.useInfiniteQuery(
    {
      limit: 9,
      query: debouncedFilters.q ?? "",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  return (
    <div className="flex flex-col gap-2.5 pb-10">
      <div className="">
        <AnimatePresence mode="wait">
          {!news?.pages.length && (isFetching || isFetchingNextPage) && (
            <SlideAnimation
              className="flex h-[300px] items-center justify-center"
              direction="up"
            >
              <Loader key="loader" className="animate-spin" />
            </SlideAnimation>
          )}

          {!news?.pages.flatMap((i) => i.news).length &&
            !(isFetching || isFetchingNextPage) && (
              <SlideAnimation
                direction="up"
                key="empty"
                className="flex h-[300px] items-center justify-center"
              >
                Ingen nyheter funnet
              </SlideAnimation>
            )}
          {news?.pages && (
            <SlideAnimation
              direction="up"
              className="grid grid-cols-1 gap-2.5 md:grid-cols-3"
              key="news-list"
            >
              {news?.pages.flatMap((page) => {
                return page.news.map((article) => (
                  <Link
                    href={`/nyheter/${article.id}`}
                    key={article.id + "nyhet"}
                  >
                    <NewsCard
                      description={article.preview ?? ""}
                      title={article.name ?? ""}
                      author={{
                        role: article.author?.role ?? "user",
                        image: article.author?.image ?? "",
                        name: article.author?.name ?? "Ukjent",
                        email: article.author?.email ?? "",
                      }}
                    />
                  </Link>
                ));
              })}
            </SlideAnimation>
          )}
        </AnimatePresence>
      </div>
      {hasNextPage && (
        <Button
          className="w-fit min-w-60"
          disabled={!hasNextPage && !isFetchingNextPage && !isFetching}
          onClick={() => fetchNextPage()}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isFetchingNextPage && (
              <motion.div
                key="loader"
                className="flex flex-row items-center gap-2"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 20,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <Loader className="animate-spin" /> Laster flere nyheter
              </motion.div>
            )}
            {!isFetchingNextPage && (
              <motion.div
                key="more"
                className="flex flex-row items-center gap-2"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 20,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                Mer nyheter
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      )}
    </div>
  );
}

export default NewsList;
