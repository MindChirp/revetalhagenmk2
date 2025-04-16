"use client";

import { authClient } from "@/server/auth/client";
import React from "react";
import { Button } from "./button";
import { PlusIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useQuill } from "react-quilljs";

function CreateNews() {
  const { data: session } = authClient.useSession();
  return (
    <div>
      <AnimatePresence initial={false}>
        {session?.user.role === "admin" && (
          <motion.div
            key={"create-event"}
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
          >
            <Button>
              <PlusIcon /> Legg til arrangement
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateNews;
