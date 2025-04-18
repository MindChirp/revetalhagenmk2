"use client";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import "quill/dist/quill.snow.css";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DateTimePicker } from "../ui/date-time-picker";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Tittel er påkrevd"),
  content: z.string().min(1, "Beskrivelse er påkrevd"),
  start: z.date({
    message: "Starttidspunkt er påkrevd",
  }),
  end: z.date({
    message: "Sluttidspunkt er påkrevd",
  }),
  image: z.string().optional(),
  location: z.string().optional(),
});
type ChildType = {
  canSubmit: boolean;
};
interface CreateEventFormProps {
  children?: (props: ChildType) => React.ReactNode;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
}

function CreateEventForm({ children, onSubmit }: CreateEventFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      start: undefined,
      end: undefined,
      image: "",
      location: "",
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit?.(values))}
          className="flex flex-col gap-2.5"
        >
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <div className="flex w-full flex-col gap-1">
                <Label>Tittel</Label>
                <Input {...field} placeholder="Fingerhekling med..." />
              </div>
            )}
          />

          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <div className="flex w-full flex-col gap-1">
                <Label>Beskrivelse</Label>
                <Textarea
                  {...field}
                  placeholder="Bli med på en hyggelig og spennende kveld med..."
                />
              </div>
            )}
          />

          <div className="flex w-full flex-row flex-nowrap gap-2.5">
            <FormField
              name="start"
              control={form.control}
              render={({ field }) => (
                <div className="flex w-full flex-col gap-1">
                  <Label>Starttidspunkt</Label>
                  <DateTimePicker className="col-start-1 w-full" {...field} />
                </div>
              )}
            />
            <FormField
              name="end"
              control={form.control}
              render={({ field }) => (
                <div className="flex w-full flex-col gap-1">
                  <Label>Slutttidspunkt</Label>
                  <DateTimePicker className="w-full" {...field} />
                  {form.formState.isValid}
                </div>
              )}
            />
          </div>
          {children?.({
            canSubmit: form.formState.isValid && form.formState.isDirty,
          })}
        </form>
      </Form>
    </div>
  );
}

export default CreateEventForm;
