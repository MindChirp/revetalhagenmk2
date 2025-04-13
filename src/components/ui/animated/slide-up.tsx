import React, { type ComponentProps } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function SlideUp({
  className,
  children,
  ...props
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 20,
      }}
      transition={{
        duration: 0.2,
      }}
      {...props}
      className={cn(
        "col-span-3 flex h-[300px] items-center justify-center",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export default SlideUp;
