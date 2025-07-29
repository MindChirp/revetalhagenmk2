"use client";

import NewsFilters from "@/components/screen/news-filters";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import NewsList from "@/components/ui/news-list";
import { motion } from "framer-motion";
import { HomeIcon } from "lucide-react";

function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-2.5 pt-36 md:px-10">
      <DynamicBreadcrumbs
        className="mt-5 px-5 md:px-20"
        items={[
          { href: "/", label: "Hjem", icon: <HomeIcon size={16} /> },
          { href: "/nyheter", label: "Nyheter" },
        ]}
      />
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
        <h1 className="text-foreground flex w-fit flex-row flex-wrap justify-center gap-x-2 text-center text-4xl leading-12 md:gap-5 md:pl-20 md:text-6xl md:leading-20">
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
            <SlideAnimation
              direction="up"
              transition={{
                delay: 1.2,
              }}
            >
              nytt
            </SlideAnimation>
          </motion.div>
          i Revetalhagen?
        </h1>
      </motion.div>
      <div className="flex flex-col gap-5 px-5 md:px-20">
        <NewsFilters />
        <NewsList />
      </div>
    </div>
  );
}

export default Page;
