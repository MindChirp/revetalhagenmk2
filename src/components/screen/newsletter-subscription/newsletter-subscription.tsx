"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellIcon, Loader } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const NewsletterSubscription = () => {
  const { data: count, isPending } =
    api.newsletter.getSubscriberCount.useQuery();

  if (isPending) return null;

  return (
    <div className="w-full px-5 md:px-20">
      <Card className="bg-accent border-none shadow-none">
        <CardHeader>
          <CardTitle>
            {(count ?? 0) > 0 ? (
              <>
                {count} {count === 1 ? "person" : "mennesker"} følger med på nye
                oppdateringer fra Revetalhagen over epost.
              </>
            ) : (
              "Vil du holde deg oppdatert på hva som skjer i Revetalhagen?"
            )}
          </CardTitle>
          <CardDescription>
            {(count ?? 0) > 0
              ? count === 1
                ? "Kanskje du også skal bli med?"
                : "Kanskje du skal bli en av dem?"
              : "Bli den første til å få nyheter fra Revetalhagen!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionDialog>
            <Button>
              <BellIcon /> Abonnér nå
            </Button>
          </SubscriptionDialog>
        </CardContent>
      </Card>
    </div>
  );
};

const formSchema = z.object({
  email: z.string().email("Ugyldig epostadresse"),
});

type SubscriptionDialogProps = {} & ComponentProps<typeof Dialog>;
const SubscriptionDialog = ({
  children,
  ...props
}: SubscriptionDialogProps) => {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const utils = api.useUtils();
  const { mutate, isPending: isMutating } =
    api.newsletter.subscribe.useMutation({
      onSuccess: () => {
        void utils.newsletter.getSubscriberCount.invalidate();
        setOpen(false);
      },
      onError: (err) => {
        toast.error(err.message ?? "En ukjent feil oppstod");
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: session?.user?.email ?? "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    // Here you would typically send the data to your backend
    mutate(data);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open} {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abonnér på nyheter fra Revetalhagen</DialogTitle>
          <DialogDescription>
            Er du interessert i hva vi driver med? Meld deg på epost-lista vår,
            så kan vi sende deg varslinger hver gang en ny artikkel blir lagt
            ut!
          </DialogDescription>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mt-5 flex flex-col gap-5"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foretrukken epostadresse</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Avbryt
                </Button>
                <Button type="submit" className="w-fit" disabled={isMutating}>
                  {isMutating ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <>
                      <BellIcon /> Abonnér
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterSubscription;
