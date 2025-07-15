"use client";
import { BookingStatusMap } from "@/lib/booking-status-map";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { Loader, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatedTabs } from "./animated-tabs";
import GrowAnimation from "./animated/grow-animation";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Form, FormControl, FormField, FormLabel, FormMessage } from "./form";
import TextEditor from "./portable-text/portable-text";
import type { PortableTextBlock } from "@portabletext/editor";
import { BookingStates } from "@/server/db/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PortableRenderer from "./portable-text/render-components/PortableRenderer";
import { InfoCircledIcon } from "@radix-ui/react-icons";

type StatusValue = keyof typeof BookingStatusMap;

const formSchema = z
  .object({
    status: z.enum(BookingStates),
    reason: z.array(z.object({})),
  })
  .refine(
    (data) => {
      // Require rejection reason if status is rejected
      if (data.status === BookingStatusMap.rejected) {
        return !!data.reason;
      }
      return true;
    },
    { path: ["reason"], message: "Begrunnelse for avslag må dokumenteres" },
  );

type BookingStatusToggleProps = {
  initialValue?: {
    status: StatusValue;
    reason?: PortableTextBlock[];
  };
  bookingId: number;
};
function BookingStatusToggle({
  initialValue,
  bookingId,
}: BookingStatusToggleProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: initialValue?.status ?? "pending",
      reason: initialValue?.reason ?? [],
    },
  });
  const router = useRouter();

  const { mutateAsync, isPending } =
    api.booking.updateBookingStatus.useMutation();

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // alert("Submitting status change: " + JSON.stringify(data));
    alert(JSON.stringify(data.reason, null, 2));
    void mutateAsync({
      bookingId,
      status: data.status,
      reason:
        data.status === "rejected" ? JSON.stringify(data.reason) : undefined,
    }).then(() => {
      toast.success("Bookingen ble oppdatert");
      router.refresh();
    });
  };

  const [status, reason] = form.watch(["status", "reason"]);

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex w-full flex-col">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <AnimatedTabs
                    onClick={(e) => e.preventDefault()}
                    defaultValue={field.value}
                    onTabChange={(value) => field.onChange(value)}
                    tabs={[
                      {
                        label: BookingStatusMap.confirmed,
                        value: "confirmed",
                      },
                      {
                        label: BookingStatusMap.rejected,
                        value: "rejected",
                      },
                      {
                        label: BookingStatusMap.pending,
                        value: "pending",
                      },
                      {
                        label: BookingStatusMap.cancelled,
                        value: "cancelled",
                      },
                    ]}
                  />
                )}
              />

              <AnimatePresence>
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <>
                      {status === "rejected" && (
                        <GrowAnimation
                          className="flex w-full flex-col gap-5"
                          key={"rejection-reason"}
                          animate={{
                            marginTop: 20,
                          }}
                          exit={{
                            marginTop: 0,
                          }}
                          initial={{
                            marginTop: 0,
                          }}
                        >
                          <FormLabel className="mx-auto">
                            Årsak til avslag
                          </FormLabel>
                          <FormControl>
                            {(initialValue?.reason?.length ?? 0) > 0 ? (
                              <>
                                <div className="mx-auto flex flex-row items-center gap-1">
                                  <InfoCircledIcon className="text-amber-400" />
                                  <span className="text-amber-400">
                                    Begrunnelse for avslag kan ikke endres etter
                                    den er sendt inn
                                  </span>
                                </div>
                                <PortableRenderer
                                  className="px-5 md:px-10"
                                  value={field.value as PortableTextBlock[]}
                                />
                              </>
                            ) : (
                              <TextEditor
                                {...field}
                                value={field.value as PortableTextBlock[]}
                              />
                            )}

                            {/* <Textarea {...field} className="w-full" /> */}
                          </FormControl>
                          <FormMessage />
                        </GrowAnimation>
                      )}
                    </>
                  )}
                />
                {status != initialValue?.status && (
                  <GrowAnimation
                    className="w-full"
                    key={"booking-save"}
                    animate={{
                      marginTop: 10,
                    }}
                    exit={{
                      marginTop: 0,
                    }}
                    initial={{
                      marginTop: 0,
                    }}
                  >
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader className="animate-spin" />
                      ) : (
                        <>
                          <SaveIcon /> Lagre
                        </>
                      )}
                    </Button>
                  </GrowAnimation>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default BookingStatusToggle;
