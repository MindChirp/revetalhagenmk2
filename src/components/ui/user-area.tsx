"use client";

import type { auth } from "@/server/auth";
import React, { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { authClient } from "@/server/auth/client";

interface UserAreaProps extends React.HTMLProps<HTMLDivElement> {
  session?: Awaited<ReturnType<typeof auth.api.getSession>>;
}
function UserArea({
  className,
  session: serverSession,
  ...props
}: UserAreaProps) {
  const { data: clientSession, isPending } = authClient.useSession();
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
        <PopoverContent>
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
