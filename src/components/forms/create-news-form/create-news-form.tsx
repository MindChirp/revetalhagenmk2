"use client";

import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TextEditor from "@/components/ui/portable-text/portable-text";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PortableTextBlock } from "@portabletext/editor";
import "quill/dist/quill.snow.css";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Tittel er påkrevd"),
  content: z.string().min(1, "Innhold er påkrevd"),
  image: z.string().optional(),
  preview: z.string().optional(),
});
type ChildType = {
  canSubmit: boolean;
};
interface CreateNewsFormProps {
  children?: (props: ChildType) => React.ReactNode;
  defaultValues?: z.infer<typeof formSchema>;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
}
function CreateNewsForm({
  children,
  onSubmit,
  defaultValues,
}: CreateNewsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
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
              <Input placeholder="Overskrift" {...field} />
            )}
          />
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col">
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
              <div className="flex flex-col gap-1">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Kort oppsummering av innholdet"
                  />
                </FormControl>
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

export default CreateNewsForm;
