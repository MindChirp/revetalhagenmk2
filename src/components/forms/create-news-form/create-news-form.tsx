"use client";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Tittel er påkrevd"),
  content: z.string().min(1, "Innhold er påkrevd"),
  image: z.string().optional(),
});
type ChildType = {
  canSubmit: boolean;
};
interface CreateNewsFormProps {
  children?: (props: ChildType) => React.ReactNode;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
}
function CreateNewsForm({ children, onSubmit }: CreateNewsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
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
              <Textarea placeholder="Innhold" {...field} />
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
