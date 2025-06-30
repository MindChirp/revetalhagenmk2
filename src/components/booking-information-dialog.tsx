"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { InfoIcon, Loader, XIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { AnimatePresence } from "framer-motion";
import SlideAnimation from "./ui/animated/slide-animation";
import { authClient } from "@/server/auth/client";
import EditableParagraph from "./editable-paragraph";
import { toast } from "sonner";

function BookingInformationDialog() {
  const { data, isLoading } = api.cms.getContent.useQuery({
    slug: "booking-information",
  });
  const { mutateAsync } = api.cms.updateContent.useMutation();
  const { data: session } = authClient.useSession();
  const utils = api.useUtils();

  const content = data?.[0];

  const handleUpdate = async (newContent: string) => {
    if (!content?.slug) return;

    void mutateAsync({
      id: content.id,
      slug: content.slug,
      content: {
        ...content.content,
        content: newContent,
      },
    })
      .then(() => {
        toast("Informasjonen er oppdatert");
        void utils.cms.getContent.invalidate({
          slug: "booking-information",
        });
      })
      .catch(() => {
        toast.error("Noe gikk galt under oppdatering av informasjonen");
      });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"lg"} className="w-full md:w-fit">
          <InfoIcon /> Mer informasjon
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bookinginformasjon</DialogTitle>
        </DialogHeader>
        <AnimatePresence>
          {isLoading && (
            <SlideAnimation>
              <Loader className="animate-spin" />
            </SlideAnimation>
          )}

          {!isLoading && content && (
            <SlideAnimation>
              <EditableParagraph
                onChange={handleUpdate}
                buttonVariant={"outline"}
                admin={session?.user.role === "admin"}
                content={content.content.content}
              />
            </SlideAnimation>
          )}
        </AnimatePresence>
        <DialogFooter>
          <DialogClose asChild>
            <Button>
              <XIcon /> Den er grei
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BookingInformationDialog;
