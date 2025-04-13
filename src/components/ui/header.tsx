"use client";

import { authClient } from "@/server/auth/client";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon, HomeIcon, Loader, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import HeaderNavigationButton from "./header-navigation-button";
import UserArea from "./user-area";
import { useState } from "react";
import SlideAnimation from "./animated/slide-animation";

function Header() {
  const { data: session, isPending } = authClient.useSession();
  const [signInLoading, setSignInLoading] = useState(false);

  return (
    <div className="absolute z-50 flex w-full flex-row items-center justify-between px-10 py-5">
      <div className="flex w-fit flex-row items-center gap-5">
        <Image
          className="aspect-square w-10"
          src="/images/nakuhel-logo.webp"
          alt="Nakuhel logo"
          height={500}
          width={500}
        />
        <p className="font-normal">Nakuhel</p>
      </div>
      <div className="flex w-full items-center justify-center gap-5">
        <HeaderNavigationButton icon={<HomeIcon />} href="/">
          Hjem
        </HeaderNavigationButton>
        <HeaderNavigationButton icon={<CalendarIcon />} href="/arrangementer">
          Arrangementer
        </HeaderNavigationButton>
        <HeaderNavigationButton icon={<Newspaper />} href="/nyheter">
          Nyheter
        </HeaderNavigationButton>
      </div>
      <div className="absolute top-1/2 right-10 w-fit -translate-y-1/2">
        <AnimatePresence mode="wait">
          {!session && !isPending && (
            <motion.div
              key={"login-button"}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 10,
              }}
            >
              <Link href="/sign-in">
                <Button
                  onClick={() => {
                    setSignInLoading(true);
                    setTimeout(() => {
                      setSignInLoading(false);
                    }, 2000);
                  }}
                  className="min-w-28"
                >
                  <AnimatePresence mode="wait">
                    {signInLoading && (
                      <SlideAnimation key="loader" direction="left">
                        <Loader className="animate-spin" />
                      </SlideAnimation>
                    )}
                    {!signInLoading && (
                      <SlideAnimation key="sign-in">Logg inn</SlideAnimation>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>
            </motion.div>
          )}
          {session && (
            <motion.div
              key={"user-area"}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 10,
              }}
            >
              <UserArea session={session} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Header;
