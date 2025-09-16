"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowRightIcon, CheckIcon, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Navn er påkrevs"),
  phone: z.string().min(1, "Telefonnummer er påkrevd"),
  email: z.string().email("Ugyldig e-postadresse").min(1, "E-post er påkrevd"),
});

const MembershipForm = () => {
  // const {mutateAsync} = api.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending, isSuccess, status } =
    api.member.registerInterest.useMutation();

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(data, {
      onError: (error) => {
        toast.error(error.message ?? "Noe gikk galt");
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Navn</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefonnummer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Epost</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-fit"
          type="submit"
          disabled={status === "pending" || status === "success"}
        >
          {status === "pending" && <Loader className="animate-spin" />}
          {status === "idle" && (
            <>
              Meld interesse <ArrowRightIcon />
            </>
          )}
          {status === "success" && (
            <>
              <CheckIcon /> Takk for din interesse!
            </>
          )}
          {status === "error" && (
            <>
              <AlertTriangle /> Noe gikk galt
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default MembershipForm;
