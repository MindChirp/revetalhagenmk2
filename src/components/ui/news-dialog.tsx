"use client";

import { Loader, PlusIcon, XIcon } from "lucide-react";
import CreateNewsForm from "../forms/create-news-form/create-news-form";
import BottomDialog from "./bottom-dialog";
import { Button } from "./button";
import { CardAction } from "./card";
import { api } from "@/trpc/react";
import SlideAnimation from "./animated/slide-animation";
import { AnimatePresence } from "framer-motion";

interface NewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function NewsDialog({ open, onOpenChange }: NewsDialogProps) {
  const utils = api.useUtils();
  const { mutate, isPending } = api.news.create.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      void utils.news.getAllInfinite.invalidate();
    },
  });
  return (
    <div>
      <BottomDialog
        onOpenChange={onOpenChange}
        open={open}
        title="Opprett nyhet"
        description="Legg til en nyhet som vil bli synlig for alle brukere av nettsida."
      >
        <CreateNewsForm
          onSubmit={(data) => {
            mutate(data);
          }}
        >
          {({ canSubmit }) => (
            <CardAction className="flex w-full justify-end gap-2.5">
              <Button variant="ghost">
                <XIcon />
                Avbryt
              </Button>
              <Button disabled={!canSubmit} type="submit">
                <AnimatePresence>
                  {!isPending && (
                    <SlideAnimation className="flex flex-row items-center gap-2.5">
                      <PlusIcon />
                      Opprett
                    </SlideAnimation>
                  )}
                  {isPending && (
                    <SlideAnimation>
                      <Loader className="animate-spin" />
                    </SlideAnimation>
                  )}
                </AnimatePresence>
              </Button>
            </CardAction>
          )}
        </CreateNewsForm>
      </BottomDialog>
    </div>
  );
}

export default NewsDialog;
