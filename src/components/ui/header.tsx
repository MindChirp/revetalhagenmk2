"use client";

import { authClient } from "@/server/auth/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarIcon,
  HomeIcon,
  Loader,
  MenuIcon,
  Newspaper,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import HeaderNavigationButton from "./header-navigation-button";
import UserArea from "./user-area";
import { useState } from "react";
import SlideAnimation from "./animated/slide-animation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { cn } from "@/lib/utils";
import SignInCard from "./sign-in-card";

function Header() {
  const { data: session, isPending } = authClient.useSession();
  const [signInLoading, setSignInLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="absolute z-50 flex w-full flex-row items-center justify-between px-5 py-5 md:px-10">
      <div className="flex w-fit flex-row items-center gap-5">
        <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
          <SheetTrigger asChild>
            <Button className="md:hidden" variant="ghost">
              <MenuIcon
                className={cn(
                  "scale-200 transition-all",
                  sheetOpen ? "rotate-180" : undefined,
                )}
              />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[400px] max-w-screen p-10 sm:w-[540px]"
          >
            <SheetHeader>
              <SheetTitle>Meny</SheetTitle>
            </SheetHeader>

            <div
              className="flex flex-col gap-5"
              onClick={() => setSheetOpen(false)}
            >
              <HeaderNavigationButton icon={<HomeIcon />} href="/">
                Hjem
              </HeaderNavigationButton>
              <HeaderNavigationButton
                icon={<CalendarIcon />}
                href="/arrangementer"
              >
                Arrangementer
              </HeaderNavigationButton>
              <HeaderNavigationButton icon={<Newspaper />} href="/nyheter">
                Nyheter
              </HeaderNavigationButton>
            </div>
            <div className="flex flex-1 justify-end"></div>
            {!session?.user && <SignInCard />}
            {session?.user && <UserArea session={session} />}
          </SheetContent>
        </Sheet>
        <Image
          className="aspect-square w-10"
          src="/images/nakuhel-logo.webp"
          alt="Nakuhel logo"
          height={500}
          width={500}
        />
        <p className="font-normal">Nakuhel</p>
      </div>
      <div className="hidden w-full items-center justify-center gap-5 md:flex">
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
      <div className="absolute top-1/2 right-10 hidden w-fit -translate-y-1/2 md:block">
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
