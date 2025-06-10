"use client";

import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import React from "react";
import EditableParagraph from "../editable-paragraph";
import { Card, CardContent } from "../ui/card";
import Quadrants from "../ui/quadrants";
import SquigglyCircle from "../ui/squiggly-circle";
import SlideAnimation from "../ui/animated/slide-animation";

function Hero({ className, ...props }: React.HTMLProps<HTMLDivElement>) {
  const { data: session } = authClient.useSession();
  const { data: paragraph, isLoading: paragraphLoading } =
    api.cms.getContent.useQuery({
      slug: "hero-description",
    });
  const trpcUtils = api.useUtils();
  const { mutate } = api.cms.updateContent.useMutation({
    onSuccess: () => {
      void trpcUtils.cms.getContent.invalidate({
        slug: "hero-description",
      });
    },
  });

  return (
    <div className="relative flex min-h-screen w-full max-w-screen items-center overflow-x-hidden overflow-y-hidden pt-20 pb-5">
      <div
        className={cn(
          "mx-auto flex w-[95vw] grid-cols-[min-content_1fr] grid-rows-[min-content_min-content_1fr] flex-col justify-start gap-10 md:grid md:w-full md:justify-center md:pr-10",
          className,
        )}
        {...props}
      >
        <motion.div
          className="col-start-2 row-start-1 mx-auto block w-fit md:mx-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.5,
            type: "spring",
            damping: 20,
            duration: 0.5,
          }}
        >
          <h1 className="text-foreground text-center align-top text-4xl leading-14 md:pl-40 md:text-6xl md:leading-20">
            Velkommen til{" "}
            <motion.span
              className="text-secondary-foreground bg-secondary inline-flex items-center overflow-hidden rounded-3xl px-2"
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
            </motion.span>
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
          className="relative col-start-2 row-start-2 flex w-full flex-col gap-5"
        >
          <Image
            className="mx-auto h-96 w-full rounded-[60px] object-cover md:mx-0"
            src="/images/laahnehuset.jpg"
            alt="Lånehuset"
            height={2000}
            width={2000}
          />
          <AnimatePresence>
            {!paragraphLoading && (
              <SlideAnimation
                direction="up"
                className="md:absolute md:bottom-0 md:ml-40 md:translate-y-2/3"
              >
                <Card className="bg-card/60 w-fit gap-0 shadow-none backdrop-blur-sm">
                  <CardContent className="mx-auto w-fit max-w-3/4 md:max-w-xl">
                    <EditableParagraph
                      className="line-clamp-[7]"
                      content={paragraph?.[0]?.content.content}
                      admin={session?.user?.role === "admin"}
                      onChange={(content) => {
                        if (!paragraph?.[0]?.id) return;
                        mutate({
                          id: paragraph?.[0]?.id,
                          content: {
                            content,
                            title: "",
                          },
                          slug: "hero-description",
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              </SlideAnimation>
            )}
          </AnimatePresence>
        </motion.div>
        <button className="bg-secondary/50 border-secondary text-secondary-foreground col-start-1 row-start-2 flex h-auto w-full cursor-pointer flex-col items-center justify-evenly border border-l-0 p-5 backdrop-blur-md transition-all hover:pl-10 max-sm:rounded-full md:w-fit md:rounded-r-[60px]">
          <div className="flex flex-row items-center gap-2.5 text-nowrap">
            <p>Bli medlem</p>

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
      </div>
      {/* <button
        className="border-secondary text-foreground hover:bg-secondary/30 bg-background absolute bottom-5 left-1/2 flex -translate-x-1/2 animate-bounce cursor-pointer flex-row items-center gap-2.5 rounded-full border-2 p-5 transition-colors"
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
      >
        <ArrowDown />
        <p>Bla ned</p>
      </button> */}
      <SquigglyCircle
        className="absolute top-0 right-0 w-[400] translate-x-1/3 -translate-y-1/2 animate-spin opacity-50 md:w-[800] md:opacity-30"
        style={{
          animationDuration: "50s",
        }}
        width={800}
        height={800}
      />
      <Quadrants
        className="absolute -bottom-10 left-0 w-[300] opacity-70 md:bottom-10 md:left-10 md:w-[500] md:opacity-50"
        width={500}
        height={500}
      />
    </div>
  );
}

export default Hero;
