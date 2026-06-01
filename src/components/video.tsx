"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type VideoProps = {
  src: string;
  className?: string;
};
export const Video = ({ src, className }: VideoProps) => {
  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative frame */}
      <div className="bg-primary/5 absolute -top-4 -right-4 -bottom-4 -left-4 -z-10 rounded-[2.5rem] md:-top-8 md:-right-8 md:-bottom-8 md:-left-8" />

      <div className="hover:shadow-primary/20 relative aspect-video overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/5 transition-all duration-300 hover:scale-[1.02]">
        <iframe
          className="h-full w-full"
          src={src}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </motion.div>
  );
};
