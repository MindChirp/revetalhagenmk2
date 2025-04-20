"use client";

import SignInCard from "@/components/ui/sign-in-card";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

function Page() {
  const params = useSearchParams();
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
      >
        <SignInCard signinRedirect={params.get("redirect") ?? "/"} />
      </motion.div>
    </div>
  );
}

export default Page;
