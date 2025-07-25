import React, { type ComponentProps } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function GrowAnimation({
  initial,
  className,
  animate,
  exit,
  ...props
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{
        height: 0,
        ...(typeof initial === "object" ? initial : {}),
      }}
      animate={{
        height: "auto",

        ...(typeof animate === "object" ? animate : {}),
      }}
      exit={{
        height: 0,
        ...(typeof exit === "object" ? exit : {}),
      }}
      {...props}
    />
  );
}

export default GrowAnimation;
