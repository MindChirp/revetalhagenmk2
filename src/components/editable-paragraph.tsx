"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon, SaveIcon } from "lucide-react";
import React, { useState } from "react";
import BottomDialog from "./ui/bottom-dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "./ui/form";

interface EditableParagraphProps
  extends Omit<React.HTMLProps<HTMLSpanElement>, "onChange"> {
  content?: string;
  admin?: boolean;
  onChange?: (content: string) => void;
}

const formSchema = z.object({
  content: z.string().min(1, "Innhold kan ikke være tomt"),
});

function EditableParagraph({
  content,
  admin,
  onChange,
  ...props
}: EditableParagraphProps) {
  const [edit, setEdit] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (onChange) {
      onChange(values.content);
    }
    setEdit(false);
  };

  return (
    <>
      <span {...props}>{content}</span>
      <AnimatePresence>
        {admin && (
          <motion.div
            key="admin-edit-button"
            className="overflow-hidden"
            initial={{
              opacity: 0,
              height: 0,
              marginTop: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              marginTop: "1rem",
            }}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0,
            }}
          >
            <Button onClick={() => setEdit(true)}>
              <PencilIcon />
              Rediger
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <BottomDialog open={edit} onOpenChange={setEdit}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => <Textarea {...field} />}
            />

            <Button className="w-fit" type="submit">
              <SaveIcon />
              Lagre
            </Button>
          </form>
        </Form>
      </BottomDialog>
    </>
  );
}

export default EditableParagraph;
