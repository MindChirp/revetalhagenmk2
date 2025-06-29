"use client";

import { cn } from "@/lib/utils";
import type { auth } from "@/server/auth";
import { authClient } from "@/server/auth/client";
import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ShieldCheckIcon, ShieldIcon, UserIcon } from "lucide-react";
import { Badge } from "./badge";

interface UserAreaProps extends React.HTMLProps<HTMLDivElement> {
  session?: Awaited<ReturnType<typeof auth.api.getSession>>;
}
function UserArea({
  className,
  session: serverSession,
  ...props
}: UserAreaProps) {
  const { data: clientSession } = authClient.useSession();
  const session = useMemo(() => {
    if (clientSession) return clientSession;
    if (serverSession) return serverSession;
    return null;
  }, [serverSession, clientSession]);

  return (
    <div className={cn("", className)} {...props}>
      <Popover>
        <PopoverTrigger className="cursor-pointer">
          <Avatar>
            <AvatarImage src={session?.user.image ?? ""} />
            <AvatarFallback>
              {session?.user.name?.charAt(0) ?? ""}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2.5">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="relative">
              {session?.user.role === "admin" && (
                <Badge className="absolute top-0 right-0 z-10">
                  <ShieldCheckIcon />
                </Badge>
              )}
              <Avatar className="h-20 w-20">
                <AvatarImage src={session?.user.image ?? ""} />
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="font-semibold">Hei, {session?.user.name}!</span>
          </div>
          <Button
            variant={"destructive"}
            className="w-full cursor-pointer"
            onClick={() => authClient.signOut()}
          >
            Logg ut
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default UserArea;
