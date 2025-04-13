"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/server/auth/client";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Loader } from "lucide-react";

function Page() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleSignIn = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    // setGoogleLoading(false);
  };

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
        <Card>
          <CardHeader>
            <CardTitle>Logg inn</CardTitle>
            <CardDescription>
              Velg hvilken innlogginsmetode du ønsker å bruke.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            <Button onClick={googleSignIn}>
              <AnimatePresence mode="wait">
                {!googleLoading && (
                  <motion.div
                    key="google-text"
                    exit={{
                      opacity: 0,
                      x: 10,
                    }}
                  >
                    Logg inn med Google
                  </motion.div>
                )}
                {googleLoading && (
                  <motion.div
                    key="google-loader"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                  >
                    <Loader className="animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
            <Button variant="secondary" disabled>
              Logg inn med RevetalhagenID
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Page;
