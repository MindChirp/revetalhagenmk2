"use client";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { event } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PortableTextBlock } from "@portabletext/editor";
import "quill/dist/quill.snow.css";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatetimePicker } from "../ui/datetime-picker";
import { Label } from "../ui/label";
import TextEditor from "../ui/portable-text/portable-text";
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
  preview: z.string().optional(),
});
type ChildType = {
  canSubmit: boolean;
};
interface CreateEventFormProps {
  children?: (props: ChildType) => React.ReactNode;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: typeof event.$inferSelect;
}

function CreateEventForm({
  defaultValues,
  children,
  onSubmit,
}: CreateEventFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.description ?? "[]",
      start: defaultValues?.start ?? new Date(),
      end: defaultValues?.end ?? new Date(),
      image: defaultValues?.image ?? "",
      location: defaultValues?.location ?? "",
      preview: defaultValues?.preview ?? "",
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
                <TextEditor
                  onChange={(value) => {
                    field.onChange(JSON.stringify(value ?? []));
                  }}
                  value={JSON.parse(field.value ?? "[]") as PortableTextBlock[]}
                />
              </div>
            )}
          />
          <FormField
            name="preview"
            control={form.control}
            render={({ field }) => (
              <div className="flex w-full flex-col gap-1">
                <Label>Kort oppsummering av beskrivelse</Label>
                <Textarea {...field} />
              </div>
            )}
          />

          <div className="flex w-fit flex-row flex-nowrap gap-5">
            <FormField
              name="start"
              control={form.control}
              render={({ field }) => (
                <div className="flex w-full flex-col gap-1">
                  <Label>Start</Label>
                  <DatetimePicker
                    {...field}
                    format={[
                      ["months", "days", "years"],
                      ["hours", "minutes"],
                    ]}
                  />
                  {/* <DateTimePicker className="col-start-1 w-full" {...field} /> */}
                </div>
              )}
            />
            <FormField
              name="end"
              control={form.control}
              render={({ field }) => (
                <div className="flex w-full flex-col gap-1">
                  <Label>Slutt</Label>
                  {/* <DateTimePicker className="w-full" {...field} /> */}
                  <DatetimePicker
                    {...field}
                    format={[
                      ["months", "days", "years"],
                      ["hours", "minutes"],
                    ]}
                  />
                </div>
              )}
            />
          </div>
          <FormField
            name="location"
            control={form.control}
            render={({ field }) => (
              <div className="flex w-full flex-col gap-1">
                <Label>Sted</Label>
                <Input {...field} placeholder="Revetal..." />
              </div>
            )}
          />
          {children?.({
            canSubmit: form.formState.isValid && form.formState.isDirty,
          })}
        </form>
      </Form>
    </div>
  );
}

export default CreateEventForm;
