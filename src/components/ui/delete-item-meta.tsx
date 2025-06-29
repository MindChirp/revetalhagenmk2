"use client";
import { api } from "@/trpc/react";
import { Loader, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./button";

function DeleteItemMeta({ id }: { id: number }) {
  const { mutateAsync } = api.booking.deleteItemMeta.useMutation();
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();
  const handleDelete = () => {
    setLoading(true);
    void mutateAsync({ id })
      .then((res) => {
        console.log("Deleted ", res);
        toast(
          "Informasjonsbrikken er slettet. Last inn siden på nytt for å se endringene.",
        );
        void utils.booking.getItemById.invalidate();
      })
      .catch(() => {
        toast("Kunne ikke slette informasjonsbrikken");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Button
      onClick={handleDelete}
      variant={"ghost"}
      size="sm"
      disabled={loading}
    >
      {!loading ? <XIcon /> : <Loader className="animate-spin" />}
    </Button>
  );
}

export default DeleteItemMeta;
