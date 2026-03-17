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
      className="relative flex w-full flex-col gap-4"
    >
      <div className="pointer-events-none absolute inset-x-10 bottom-[-2rem] -z-10 h-24 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 shadow-[0_28px_80px_-40px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-primary/45 via-primary/5 to-white/10" />
        <div className="pointer-events-none absolute inset-x-6 bottom-6 z-10 h-20 rounded-full bg-white/15 blur-2xl" />
        <Image
          className="mx-auto h-[26rem] w-full object-cover md:mx-0 md:h-[34rem]"
          src={src}
          alt="Bilde fra Revetalhagen"
          height={2000}
          width={2000}
          sizes="(min-width: 1024px) 44rem, 100vw"
        />
      </div>
      <AnimatePresence>
        <SlideAnimation
          direction="up"
          className="md:absolute md:right-8 md:bottom-0 md:left-8 md:translate-y-1/2"
        >
          <Card className="w-full gap-0 border-white/60 bg-background/78 shadow-xl backdrop-blur-xl">
            <CardContent className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 md:px-8">
              {cardContentLoading && <Loader className="mx-auto animate-spin" />}
              {cardContent}
            </CardContent>
          </Card>
        </SlideAnimation>
      </AnimatePresence>
    </motion.div>
  );
};

export default HeroImage;
