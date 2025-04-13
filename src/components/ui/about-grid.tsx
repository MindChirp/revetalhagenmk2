import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import TextHighlight from "./text-highlight";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

function AboutGrid({ mirrored }: { mirrored?: boolean }) {
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
          "flex gap-10",
          mirrored ? "flex-row-reverse" : "flex-row",
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
        <div className="relative aspect-[3/4] w-96 rounded-[60px]">
          <div
            className={cn(
              "bg-background absolute top-0 pb-10",
              mirrored
                ? "right-0 rounded-bl-[60px] pl-10"
                : "left-0 rounded-br-[60px] pr-10",
            )}
          >
            <p className="text-3xl">Levende miljø</p>
          </div>
          <Image
            src="/images/skur_revetalhagen.jpg"
            className="h-full w-full rounded-[60px] object-cover"
            alt="Hagen"
            height={500}
            width={500}
          />
        </div>
        <div className="flex w-min flex-col gap-10">
          <motion.div
            className="w-fit pt-10"
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
            <h2 className="w-lg text-2xl">
              Revetalhagen har et <TextHighlight>levende</TextHighlight> miljø
            </h2>
          </motion.div>
          <motion.div
            className="w-full"
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
                <p>
                  Skibidi Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Rem deserunt repellendus nostrum at, corporis natus
                  eligendi, odit iure, aperiam modi delectus fugiat laborum
                  laboriosam totam sapiente consequuntur voluptates et
                  assumenda.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default AboutGrid;
