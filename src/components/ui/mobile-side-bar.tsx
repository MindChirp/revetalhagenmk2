import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Button } from "./button";
import {
  BedIcon,
  CalendarIcon,
  HomeIcon,
  MenuIcon,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import HeaderNavigationButton from "./header-navigation-button";
import SignInCard from "./sign-in-card";
import UserArea from "./user-area";
import { authClient } from "@/server/auth/client";

interface MobileSideBarProps {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}
function MobileSideBar({ onOpenChange, open }: MobileSideBarProps) {
  const { data: session } = authClient.useSession();
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant="ghost">
          <MenuIcon
            className={cn(
              "scale-200 transition-all",
              open ? "rotate-180" : undefined,
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
          onClick={() => onOpenChange?.(false)}
        >
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
        <div className="flex flex-1 justify-end"></div>
        {!session?.user && <SignInCard />}
        {session?.user && <UserArea session={session} />}
      </SheetContent>
    </Sheet>
  );
}

export default MobileSideBar;
