import { authClient } from "@/server/auth/client";
import type { eventMessage, user } from "@/server/db/schema";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInYears,
} from "date-fns";
import { EllipsisVertical, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { CardDescription, CardTitle } from "./card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type MemberMessageProps = {
  message: {
    eventMessage: typeof eventMessage.$inferSelect;
    user: typeof user.$inferSelect | null;
  };
  onDelete?: (id: number) => void;
};
function MemberMessage({ message, onDelete }: MemberMessageProps) {
  const { data: session } = authClient.useSession();
  const ageMinutes = differenceInMinutes(
    new Date(),
    message.eventMessage.createdAt,
  );
  const ageHours = differenceInHours(
    new Date(),
    message.eventMessage.createdAt,
  );
  const ageDays = differenceInDays(new Date(), message.eventMessage.createdAt);
  const ageYears = differenceInYears(
    new Date(),
    message.eventMessage.createdAt,
  );

  return (
    <div key={message.eventMessage.id + "message"} className="flex gap-5">
      <Avatar className="h-12 w-12">
        <AvatarImage src={message.user?.image ?? ""} />
        <AvatarFallback>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-5">
          <div className="flex flex-col">
            <CardTitle>
              {message.user?.name}{" "}
              {message.user?.id === session?.user.id && <Badge>Deg</Badge>}
            </CardTitle>
            <CardDescription>
              {ageMinutes < 59 &&
                `${ageMinutes} minutt${ageMinutes !== 1 ? "er" : ""} siden`}
              {ageHours > 0 &&
                ageHours < 24 &&
                `${ageHours} time${ageHours !== 1 ? "r" : ""} siden`}
              {ageDays > 0 &&
                ageDays < 365 &&
                `${ageDays} dag${ageDays !== 1 ? "er" : ""} siden`}
              {ageYears > 0 && `${ageYears} år siden`}
            </CardDescription>
          </div>
          {session?.user.id === message.user?.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Kommentarhandlinger</DropdownMenuLabel>
                <DropdownMenuItem
                  className="flex items-center"
                  onClick={() => onDelete?.(message.eventMessage.id)}
                >
                  Slett
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-sm">{message.eventMessage.content}</p>
      </div>
    </div>
  );
}

export default MemberMessage;
