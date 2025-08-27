"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ComponentProps, type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { createPortal } from "react-dom";

interface BottomDialogProps extends ComponentProps<typeof motion.div> {
  // Add any additional props you need here
  open?: boolean;
  description?: string;
  title?: string;
  onOpenChange?: (open: boolean) => void;
}

function BottomDialog({
  children,
  title,
  description,
  open,
  onOpenChange,
  ...props
}: BottomDialogProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [open]);

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            {...props}
            onClick={() => onOpenChange?.(false)}
            className="fixed top-0 left-0 z-50 h-full w-full bg-black/50"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-10 left-1/2 z-50 w-full -translate-x-1/2 px-5 md:px-10"
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
              type: "spring",
            }}
          >
            {/* <div className="border-border bg-background h-full w-full rounded-[60px] border-2 p-5"></div> */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent className="flex max-h-[calc(100vh_-_200px)] flex-col gap-10 overflow-x-hidden overflow-y-auto">
                {children as ReactNode}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}

export default BottomDialog;
