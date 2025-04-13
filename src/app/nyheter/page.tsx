"use client";

import NewsFilters from "@/components/screen/news-filters";
import NewsList from "@/components/ui/news-list";
import { motion } from "framer-motion";

function Page() {
  return (
    <div className="flex flex-col gap-2.5 px-10 pt-36">
      <motion.div
        className="col-start-2 row-start-1 w-fit"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.5,
          type: "spring",
          damping: 20,
          duration: 0.5,
        }}
      >
        <h1 className="text-foreground flex flex-row gap-5 pl-20 text-6xl leading-20">
          Hva er siste
          <motion.div
            className="text-secondary-foreground bg-secondary overflow-hidden rounded-3xl px-2"
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.7,
              duration: 0.5,
            }}
          >
            <motion.span
              className="block"
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.25,
                type: "spring",
                duration: 0.5,
              }}
            >
              nytt
            </motion.span>
          </motion.div>
          i Revetalhagen?
        </h1>
      </motion.div>
      <div className="flex flex-col gap-5 px-20">
        <NewsFilters />
        <NewsList />
      </div>
    </div>
  );
}

export default Page;
