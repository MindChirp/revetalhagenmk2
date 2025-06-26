import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { motion } from "framer-motion";
import { Button } from "./button";
import { AnimatePresence } from "framer-motion";
import { authClient } from "@/server/auth/client";
import { Loader } from "lucide-react";

function SignInCard({ signinRedirect }: { signinRedirect?: string }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleSignIn = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: signinRedirect ?? "/",
    });
    // setGoogleLoading(false);
  };
  return (
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
        {/* <Button variant="secondary" disabled>
          Logg inn med RevetalhagenID
        </Button> */}
      </CardContent>
    </Card>
  );
}

export default SignInCard;
