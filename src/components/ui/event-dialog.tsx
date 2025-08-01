"use client";

import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, PencilIcon, PlusIcon, SaveIcon, XIcon } from "lucide-react";
import { useState, type HTMLAttributes } from "react";
import CreateEventForm from "../forms/create-event-form";
import BottomDialog from "./bottom-dialog";
import { Button } from "./button";
import { CardAction } from "./card";
import type { event } from "@/server/db/schema";

interface EventDialogProps extends HTMLAttributes<HTMLDivElement> {
  defaultEvent?: typeof event.$inferSelect;
}
function EventDialog({ defaultEvent, ...props }: EventDialogProps) {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);

  const { mutateAsync: updateMutateAsync } =
    api.events.updateEvent.useMutation();
  const { mutateAsync, isPending } = api.events.createEvent.useMutation();
  const trpcUtils = api.useUtils();
  return (
    <div {...props}>
      <AnimatePresence initial={false}>
        {session?.user.role === "admin" && (
          <motion.div
            key={"create-event"}
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
          >
            <BottomDialog open={open} onOpenChange={setOpen}>
              <CreateEventForm
                defaultValues={defaultEvent}
                onSubmit={(data) => {
                  if (!defaultEvent) {
                    void mutateAsync({
                      ...data,
                    }).then(() => {
                      setOpen(false);
                    });
                    return;
                  } else {
                    void updateMutateAsync({
                      ...data,
                      id: defaultEvent.id,
                    }).then(() => {
                      setOpen(false);
                      void trpcUtils.events.getEvents.invalidate();
                      void trpcUtils.events.getById.invalidate({
                        id: defaultEvent.id,
                      });
                    });
                    return;
                  }
                }}
              >
                {({ canSubmit }) => (
                  <CardAction className="flex w-full justify-end gap-2.5">
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                      <XIcon />
                      Avbryt
                    </Button>
                    <Button
                      disabled={!canSubmit}
                      type="submit"
                      className="w-full md:w-fit"
                    >
                      {!isPending && !defaultEvent && (
                        <>
                          <PlusIcon /> Opprett
                        </>
                      )}
                      {!isPending && defaultEvent && (
                        <>
                          <SaveIcon /> Lagre
                        </>
                      )}
                      {isPending && <Loader className="animate-spin" />}
                    </Button>
                  </CardAction>
                )}
              </CreateEventForm>
            </BottomDialog>
            <Button
              onClick={() => setOpen(true)}
              className="w-full md:w-fit"
              variant={defaultEvent ? "outline" : "default"}
            >
              {!defaultEvent && (
                <>
                  <PlusIcon /> Opprett
                </>
              )}
              {defaultEvent && (
                <>
                  <PencilIcon /> Rediger
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EventDialog;
