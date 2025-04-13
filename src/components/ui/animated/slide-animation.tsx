"use client";

import React, { type ComponentProps } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlideAnimationProps extends ComponentProps<typeof motion.div> {
  direction?: "left" | "right" | "up" | "down";
}
function SlideAnimation({
  className,
  direction = "right",
  children,
  ...props
}: SlideAnimationProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
        x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
      }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      exit={{
        opacity: 0,
        y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
        x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
      }}
      transition={{
        duration: 0.2,
      }}
      {...props}
      className={cn("", className)}
    >
      {children}
    </motion.div>
  );
}

export default SlideAnimation;
