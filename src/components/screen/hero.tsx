"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowDown, ExternalLink } from "lucide-react";
import Image from "next/image";
import React from "react";

function Hero({ className, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <>
      <div
        className={cn(
          "grid min-h-screen w-full grid-cols-[min-content_1fr] grid-rows-[min-content_min-content_1fr] justify-start gap-10",
          className,
        )}
        {...props}
      >
        <button className="bg-secondary text-secondary-foreground col-start-1 row-start-2 flex h-auto w-fit cursor-pointer flex-col items-center justify-evenly rounded-r-[60px] p-5 transition-all hover:pl-10">
          <div className="flex flex-row items-center gap-2.5 text-nowrap">
            <p>Støtt oss</p>

            <ExternalLink size={16} />
          </div>
          <Image
            className="aspect-square w-10"
            src="/images/nakuhel-logo.webp"
            alt="Nakuhel logo"
            height={500}
            width={500}
          />
        </button>
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
          <h1 className="text-foreground pl-20 text-6xl leading-20">
            Velkommen til <br />
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
                Revetalhagen
              </motion.span>
            </motion.div>
          </h1>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            type: "spring",
            duration: 0.5,
            damping: 20,
          }}
          className="col-start-2 row-start-2 flex w-full flex-col gap-5"
        >
          <Image
            className="h-56 w-3/4 rounded-[60px] object-cover"
            src="/images/laahnehuset.jpg"
            alt="Lånehuset"
            height={500}
            width={500}
          />
        </motion.div>
        <button
          className="border-secondary text-foreground hover:bg-secondary/30 bg-background absolute bottom-5 left-1/2 flex -translate-x-1/2 animate-bounce cursor-pointer flex-row items-center gap-2.5 rounded-full border-2 p-5 transition-colors"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <ArrowDown />
          <p>Bla ned</p>
        </button>
      </div>
    </>
  );
}

export default Hero;
