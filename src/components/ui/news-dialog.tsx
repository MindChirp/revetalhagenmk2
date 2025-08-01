"use client";

import { Loader, PlusIcon, SaveIcon, XIcon } from "lucide-react";
import CreateNewsForm from "../forms/create-news-form/create-news-form";
import BottomDialog from "./bottom-dialog";
import { Button } from "./button";
import { CardAction } from "./card";
import { api } from "@/trpc/react";
import SlideAnimation from "./animated/slide-animation";
import { AnimatePresence } from "framer-motion";
import { type news } from "@/server/db/schema";

interface NewsDialogProps {
  open: boolean;
  onEditSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
  defaultValues?: typeof news.$inferSelect;
}
function NewsDialog({
  open,
  onOpenChange,
  defaultValues,
  onEditSuccess,
}: NewsDialogProps) {
  const utils = api.useUtils();
  const { mutate, isPending } = api.news.create.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      void utils.news.getAllInfinite.invalidate();
    },
  });

  const { mutate: mutateUpdate, isPending: isUpdatePending } =
    api.news.update.useMutation({
      onSuccess: () => {
        onOpenChange(false);
        void utils.news.getAllInfinite.invalidate();
        onEditSuccess?.();
        if (defaultValues?.id) return;
        void utils.news.getById.invalidate({
          id: defaultValues?.id,
        });
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
            if (!defaultValues) {
              mutate(data);
            } else {
              if (!defaultValues?.id) return;
              mutateUpdate({
                content: data.content,
                title: data.title,
                preview: data.preview,
                id: defaultValues.id,
              });
            }
          }}
          defaultValues={{
            content: defaultValues?.content ?? "[]",
            preview: defaultValues?.preview ?? "",
            title: defaultValues?.name ?? "",
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
                  {!isPending && !isUpdatePending && (
                    <>
                      {!defaultValues && (
                        <SlideAnimation className="flex flex-row items-center gap-2.5">
                          <PlusIcon />
                          Opprett
                        </SlideAnimation>
                      )}
                      {defaultValues && (
                        <SlideAnimation className="flex flex-row items-center gap-2.5">
                          <SaveIcon />
                          Lagre
                        </SlideAnimation>
                      )}
                    </>
                  )}

                  {(isPending || isUpdatePending) && (
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
