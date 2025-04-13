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
import SlideUp from "./animated/slide-up";

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
            <SlideUp className="flex h-[300px] items-center justify-center">
              <Loader key="loader" className="animate-spin" />
            </SlideUp>
          )}

          {!news?.pages.flatMap((i) => i.news).length &&
            !(isFetching || isFetchingNextPage) && (
              <SlideUp
                key="empty"
                className="flex h-[300px] items-center justify-center"
              >
                Ingen nyheter funnet
              </SlideUp>
            )}
          {news?.pages && (
            <SlideUp
              className="grid grid-cols-1 gap-2.5 md:grid-cols-3"
              key="news-list"
            >
              {news?.pages.flatMap((page) => {
                return page.news.map((article) => (
                  <Card key={article.id + "nyhet"}>
                    <CardHeader>
                      <CardTitle>{article.name}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {article.content}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ));
              })}
            </SlideUp>
          )}
        </AnimatePresence>
      </div>
      <Button
        className="w-fit"
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
    </div>
  );
}

export default NewsList;
