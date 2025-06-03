"use client";

import { PlusIcon, XIcon } from "lucide-react";
import CreateAreaForm from "../forms/create-area-form/create-area-form";
import BottomDialog from "./bottom-dialog";
import { Button } from "./button";
import { CardAction } from "./card";

function CreateAreaDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <BottomDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Legg til et område"
      description="Legg til ulike typer områder til hovedsiden. Disse endringene
                  vil umiddelbart bli synlige for alle som besøker siden."
    >
      <CreateAreaForm>
        {({ canSubmit }) => (
          <CardAction className="flex w-full justify-end gap-2.5">
            <Button variant={"ghost"} onClick={() => onOpenChange?.(false)}>
              <XIcon />
              Avbryt
            </Button>
            <Button disabled={!canSubmit} type="submit">
              <PlusIcon />
              Opprett
            </Button>
          </CardAction>
        )}
      </CreateAreaForm>
    </BottomDialog>
  );
}

export default CreateAreaDialog;
