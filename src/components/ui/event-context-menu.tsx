"use client";
import { EllipsisVertical, TrashIcon } from "lucide-react";
import { Button } from "./button";
import EventDialog from "./event-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import type { event } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface EventContextMenuProps {
  event?: typeof event.$inferSelect;
}
function EventContextMenu({ event }: EventContextMenuProps) {
  const { mutateAsync: deleteEvent } = api.events.deleteEvent.useMutation();
  const router = useRouter();
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"}>
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-1">
          <EventDialog defaultEvent={event} />
          <Button
            variant={"destructive"}
            onClick={() => {
              if (!event) return;
              void deleteEvent({ id: Number(event?.id) }).then(() => {
                router.replace("/arrangementer");
              });
            }}
          >
            <TrashIcon />
            Slett
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default EventContextMenu;
