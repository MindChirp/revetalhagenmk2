"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Loader, PencilIcon, SaveIcon } from "lucide-react";
import { Input } from "./input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { ItemType } from "@/lib/item-type";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "./separator";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type EditItemPriceDialogProps = {
  type: ItemType;
  defaultValues?: {
    price: number;
    memberDiscount: number;
    personPrice?: number;
  };
  id: number;
};

const formSchema = z.object({
  price: z.number().min(0, "Prisen må være et positivt tall"),
  memberDiscount: z
    .number()
    .min(0, "Rabatten må være et positivt tall")
    .max(100, "Rabatten kan ikke være mer enn 100%"),
  personPrice: z
    .number()
    .min(0, "Prisen per person må være et positivt tall")
    .optional(),
});

function EditItemPriceDialog({
  type,
  defaultValues,
  id,
}: EditItemPriceDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
    },
  });
  const { mutateAsync, isPending } = api.booking.updateItem.useMutation();
  const [open, setOpen] = useState(false);

  const [price, memberDiscount] = form.watch(["price", "memberDiscount"]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
    void mutateAsync({
      id,
      price: data.price,
      memberDiscount: data.memberDiscount,
      personPrice: data.personPrice,
    })
      .then(() => {
        toast(
          "Prisen er oppdatert! Last inn siden på nytt for å se endringene.",
        );
        setOpen(false);
      })
      .catch(() => {
        toast("Prisen kunne ikke oppdateres");
      });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rediger pris</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pris (kroner)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.currentTarget.value));
                      }}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === ItemType.OVERNATTING && (
              <FormField
                control={form.control}
                name="personPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persontillegg (kroner per person)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.currentTarget.value));
                        }}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="memberDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medlemsrabatt (%)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.currentTarget.value));
                      }}
                      type="number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Separator />
            <div>
              <h2>Medlemspris</h2>
              <span className="text-card-foreground text-2xl font-bold transition-all">
                {((price * (100 - memberDiscount)) / 100).toFixed(2)} kr
              </span>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {!isPending ? (
                  <>
                    <SaveIcon /> Lagre
                  </>
                ) : (
                  <Loader className="animate-spin" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditItemPriceDialog;
