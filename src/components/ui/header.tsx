"use client";

import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/client";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  BedIcon,
  CalendarIcon,
  HomeIcon,
  Loader,
  MenuIcon,
  Newspaper,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SlideAnimation from "./animated/slide-animation";
import { Button } from "./button";
import HeaderNavigationButton from "./header-navigation-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import SignInCard from "./sign-in-card";
import UserArea from "./user-area";
import MobileSideBar from "./mobile-side-bar";

function Header() {
  const { data: session, isPending } = authClient.useSession();
  const [signInLoading, setSignInLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const path = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    console.log("Scroll value:", value);
    if (value > 10 && !scrolled) {
      setScrolled(true);
    } else if (value <= 10 && scrolled) {
      setScrolled(false);
    }
  });

  return (
    <div
      className={cn(
        "fixed top-0 z-50 flex w-full flex-row items-center justify-between px-5 py-5 transition-colors md:px-10",
        scrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="flex w-fit flex-row items-center gap-5">
        <MobileSideBar open={sheetOpen} onOpenChange={setSheetOpen} />
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
        <HeaderNavigationButton icon={<BedIcon />} href="/booking">
          Booking
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
              <Link href={`/sign-in?redirect=${encodeURI(path)}`}>
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
