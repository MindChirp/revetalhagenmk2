"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, Loader, PlusIcon } from "lucide-react";
import { type IconName } from "lucide-react/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { IconPickerPopover } from "./icon-picker-popover";
import { Input } from "./input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const formSchema = z.object({
  label: z.string(),
  icon: z.string().optional(),
  itemId: z.number(),
});
function CreateItemMeta({ itemId }: { itemId: number }) {
  const { mutateAsync, isPending } = api.booking.addItemMeta.useMutation();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      icon: "",
      itemId,
    },
  });
  const handleCreate = (data: z.infer<typeof formSchema>) => {
    void mutateAsync({
      ...data,
      itemId,
    })
      .then(() => {
        toast(
          "Informasjonsbrikken ble opprettet! Last inn siden på nytt for å se endringene",
        );
        setOpen(false);
      })
      .catch(() => {
        toast("Kunne ikke opprette informasjonsbrikke");
      });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => setOpen(true)}>
              <PlusIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Opprett ny informasjonsbrikke</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Opprett ny informasjonsbrikke</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="flex w-full flex-col gap-5"
          >
            <div className="flex flex-row gap-2.5">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ikon</FormLabel>
                    <FormControl>
                      <IconPickerPopover
                        value={field.value as IconName}
                        onChange={(value) => field.onChange(value as string)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Tekst</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <span className="text-muted-foreground flex gap-2.5 text-sm">
              <InfoIcon /> Begynn alle beskrivelser med en stor forbokstav - det
              ser mer profesjonelt ut!
            </span>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  <PlusIcon /> Opprett
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateItemMeta;
