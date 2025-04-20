"use client";

import { authClient } from "@/server/auth/client";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, PlusIcon, XIcon } from "lucide-react";
import { Button } from "./button";
import BottomDialog from "./bottom-dialog";
import { useState, type HTMLAttributes } from "react";
import CreateEventForm from "../forms/create-event-form";
import { CardAction } from "./card";
import { api } from "@/trpc/react";

function CreateEvent({ ...props }: HTMLAttributes<HTMLDivElement>) {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);

  const { mutateAsync, isPending } = api.events.createEvent.useMutation();
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
                onSubmit={(data) => {
                  void mutateAsync({
                    ...data,
                  }).then(() => {
                    setOpen(false);
                  });
                }}
              >
                {({ canSubmit }) => (
                  <CardAction className="flex w-full justify-end gap-2.5">
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                      <XIcon />
                      Avbryt
                    </Button>
                    <Button disabled={!canSubmit} type="submit">
                      {!isPending && (
                        <>
                          <PlusIcon /> Opprett
                        </>
                      )}
                      {isPending && <Loader className="animate-spin" />}
                    </Button>
                  </CardAction>
                )}
              </CreateEventForm>
            </BottomDialog>
            <Button onClick={() => setOpen(true)}>
              <PlusIcon /> Legg til arrangement
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateEvent;
