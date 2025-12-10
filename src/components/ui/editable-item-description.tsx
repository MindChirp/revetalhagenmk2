"use client";

import React from "react";
import EditableParagraph from "../editable-paragraph";
import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface EditableItemDescriptionProps {
  description?: string;
  itemId: number;
}
function EditableItemDescription({
  description,
  itemId,
}: EditableItemDescriptionProps) {
  const { data: session } = authClient.useSession();
  const { mutateAsync, isPending } = api.booking.updateItem.useMutation();

  const handleChange = async (content: string) => {
    void mutateAsync({
      id: itemId,
      description: content,
    })
      .then(() => {
        toast(
          "Beskrivelsen er oppdatert! Last inn siden på nytt for å se endringene.",
        );
      })
      .catch(() => {
        toast.error("Kunne ikke oppdatere beskrivelsen.");
      });
  };
  return (
    <EditableParagraph
      loading={isPending}
      customLabel="Rediger beskrivelse"
      buttonVariant={"outline"}
      onChange={handleChange}
      content={description ?? ""}
      admin={session?.user.role === "admin"}
    />
  );
}

export default EditableItemDescription;
