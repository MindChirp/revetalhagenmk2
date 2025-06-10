"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
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
import { parseAsString, useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";

const formSchema = z.object({
  itemType: z.string().min(1, "Gjenstandstype er påkrevd"),
});
function BookingWizardForm() {
  const { data: itemTypes } = api.booking.getItemTypes.useQuery();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [queries, setQueries] = useQueryStates({
    type: parseAsString,
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    void setQueries({
      type: data.itemType,
    });
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
                  onClick={() =>
                    setQueries({
                      type: undefined,
                    })
                  }
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
