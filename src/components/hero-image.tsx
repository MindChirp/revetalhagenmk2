"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import Image from "next/image";
import React from "react";
import SlideAnimation from "./ui/animated/slide-animation";
import { Card, CardContent } from "./ui/card";

type HeroImageProps = {
  cardContent?: React.ReactNode;
  cardContentLoading?: boolean;
  src: string;
};
const HeroImage = ({
  cardContent,
  cardContentLoading,
  src,
}: HeroImageProps) => {
  return (
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
        src={src}
        alt="Lånehuset"
        height={2000}
        width={2000}
      />
      <AnimatePresence>
        <SlideAnimation
          direction="up"
          className="md:absolute md:bottom-0 md:ml-40 md:translate-y-2/3"
        >
          <Card className="bg-card/60 w-fit gap-0 shadow-none backdrop-blur-sm">
            <CardContent className="mx-auto flex w-fit max-w-3/4 flex-col gap-2.5 md:max-w-xl">
              {cardContentLoading && (
                <Loader className="mx-auto animate-spin" />
              )}
              {cardContent}
            </CardContent>
          </Card>
        </SlideAnimation>
      </AnimatePresence>
    </motion.div>
  );
};

export default HeroImage;
