"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, PencilIcon, SaveIcon } from "lucide-react";
import React, { useState, type ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormField } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import TextEditor from "./ui/portable-text/portable-text";
import type { PortableTextBlock } from "@portabletext/editor";
import PortableRenderer from "./ui/portable-text/render-components/PortableRenderer";

interface EditableParagraphProps
  extends Omit<React.HTMLProps<HTMLSpanElement>, "onChange"> {
  content?: string;
  admin?: boolean;
  type?: "default" | "rich";
  buttonVariant?: ComponentProps<typeof Button>["variant"];
  onChange?: (content: string) => void;
  loading?: boolean;
}

const formSchema = z.object({
  content: z.string().min(1, "Innhold kan ikke være tomt"),
});

function EditableParagraph({
  content,
  admin,
  buttonVariant = "default",
  onChange,
  loading,
  type = "default",
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
      {type === "rich" && content ? (
        <>
          <PortableRenderer
            value={JSON.parse(content ?? "[]") as PortableTextBlock[]}
          />
        </>
      ) : (
        <span {...props}>{content}</span>
      )}
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={buttonVariant}
                  onClick={() => setEdit(true)}
                  disabled={loading}
                >
                  {!loading ? (
                    <>
                      <PencilIcon />
                      Rediger
                    </>
                  ) : (
                    <Loader className="animate-spin" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rediger innhold</TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rediger innhold</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => {
                  return type === "rich" ? (
                    <TextEditor
                      onChange={(value) => {
                        field.onChange(JSON.stringify(value ?? []));
                      }}
                      value={
                        JSON.parse(
                          field.value.length > 0 ? field.value : "[]",
                        ) as PortableTextBlock[]
                      }
                    />
                  ) : (
                    <Textarea {...field} />
                  );
                }}
              />

              <Button className="w-fit" type="submit">
                <SaveIcon />
                Lagre
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditableParagraph;
