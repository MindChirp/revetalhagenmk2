"use client";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useQuill } from "react-quilljs";
import { z } from "zod";
import "quill/dist/quill.snow.css";

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

  const { quill, quillRef, editor } = useQuill();

  editor?.on("text-change", () => {
    form.setValue("content", quill?.getSemanticHTML() ?? "");
    console.log(quill?.getText(0, 100));
    form.setValue("preview", editor.getText(0, 100));
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
            render={({}) => (
              <div className="flex flex-col">
                <div ref={quillRef} />
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
