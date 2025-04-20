import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import TextHighlight from "./text-highlight";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface AboutGridProps {
  mirrored?: boolean;
  imageTitle: string;
  title: string;
  titleHighlightIndex?: number;
  description: string;
}
function AboutGrid({
  mirrored,
  imageTitle,
  title,
  titleHighlightIndex,
  description,
}: AboutGridProps) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    margin: "-40%",
    once: true,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      void controls.start("visible");
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return (
    <section ref={ref}>
      <motion.div
        className={cn(
          "mx-auto flex flex-col items-center gap-0 md:w-3/4 md:flex-row md:items-start md:gap-10",
          mirrored ? "md:flex-row-reverse" : "md:flex-row",
        )}
        variants={{
          hidden: {
            opacity: 0,
            y: 50,
          },
          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        transition={{
          duration: 0.5,
          ease: "circOut",
        }}
        initial="hidden"
        animate={controls}
      >
        <div className="relative aspect-[3/4] w-3/4 rounded-[60px] md:w-96">
          <div
            className={cn(
              "bg-background absolute top-0 pb-5 md:pb-10",
              mirrored
                ? "right-0 rounded-bl-3xl pl-5 md:rounded-bl-[60px] md:pl-10"
                : "left-0 rounded-br-3xl pr-5 md:rounded-br-[60px] md:pr-10",
            )}
          >
            <p className="text-3xl">{imageTitle}</p>
          </div>
          <Image
            src="/images/skur_revetalhagen.jpg"
            className="h-full w-full rounded-[60px] object-cover md:min-w-92"
            alt="Hagen"
            height={500}
            width={500}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-5 md:gap-10">
          <motion.div
            className="w-full pt-10"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {
                opacity: 0,
                x: -50,
              },
              visible: {
                opacity: 1,
                x: 0,
              },
            }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          >
            <h2 className="w-full max-w-full text-2xl text-wrap break-normal md:w-lg">
              {title.split(" ").map((word, index) => {
                if (index === titleHighlightIndex) {
                  return (
                    <span key={index + "highlight" + word}>
                      <TextHighlight>{word}</TextHighlight>{" "}
                    </span>
                  );
                }
                return <span key={"word-" + index}>{word} </span>;
              })}
            </h2>
          </motion.div>
          <motion.div
            className="w-full md:w-full"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: {
                opacity: 0,
                y: 50,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            transition={{
              duration: 0.5,
              delay: 0.7,
            }}
          >
            <Card className="bg-accent h-full w-full border-none shadow-none">
              <CardContent>
                <p>{description}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default AboutGrid;
