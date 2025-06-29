"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { SearchIcon, XIcon } from "lucide-react";
import { parseAsIsoDateTime, parseAsString, useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { DateTimePicker } from "@/components/ui/date-time-picker";

const formSchema = z.object({
  itemType: z.string().min(1, "Gjenstandstype er påkrevd"),
  from: z.date().optional(),
  to: z.date().optional(),
});
function BookingWizardForm() {
  const { data: itemTypes } = api.booking.getItemTypes.useQuery();
  const [queries, setQueries] = useQueryStates({
    type: parseAsString,
    from: parseAsIsoDateTime,
    to: parseAsIsoDateTime,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemType: queries.type ?? undefined,
      from: new Date(),
      to: new Date(),
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    void setQueries({
      type: data.itemType,
      from: data.from ?? undefined,
      to: data.to ?? undefined,
    });

    // Scroll
    const element = document.getElementById("booking-item-list");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2.5"
      >
        <FormField
          control={form.control}
          name="itemType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="bg-card/50 w-full">
                    <SelectValue placeholder="Gjenstandstype" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes?.map((itemType, index) => (
                      <SelectItem
                        key={itemType.id + "" + index}
                        value={String(itemType.id)}
                      >
                        {itemType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2.5">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fra</FormLabel>
                <FormControl>
                  <DateTimePicker {...field} className="bg-card/50" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Til</FormLabel>
                <FormControl>
                  <DateTimePicker {...field} className="bg-card/50" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row">
          <Button className="flex-1" type="submit">
            <SearchIcon />
            Søk
          </Button>
          <AnimatePresence mode="wait" initial={false}>
            {queries.type && (
              <motion.div
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: "fit-content", marginLeft: 10 }}
                exit={{
                  opacity: 0,
                  width: 0,
                  marginLeft: 0,
                }}
                className="overflow-hidden"
              >
                <Button
                  variant="secondary"
                  className="w-fit"
                  onClick={(e) => {
                    e.preventDefault();
                    void setQueries(null);
                  }}
                >
                  <XIcon />
                  Nullstill
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Form>
  );
}

export default BookingWizardForm;
