"use client";
import { cn } from "@/lib/utils";
import type { AppRouter } from "@/server/api/root";
import { zodResolver } from "@hookform/resolvers/zod";
import type { inferProcedureOutput } from "@trpc/server";
import type { ClassValue } from "clsx";
import { SendIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./button";
import { Form, FormField } from "./form";
import { Input } from "./input";
import MemberMessage from "./member-message";
import { api } from "@/trpc/react";
import SlideAnimation from "./animated/slide-animation";
import { AnimatePresence } from "framer-motion";

interface MemberChatProps {
  messages: inferProcedureOutput<AppRouter["events"]["getComments"]>;
  onSendMessage: (message: string, replyTo?: number) => void;
  onEditMessage: (id: number, message: string) => void;
  onDeleteMessage: (id: number) => void;
  scrollContainerStyling?: ClassValue;
}
const formSchema = z.object({
  message: z.string().min(1, { message: "Meldingen må være minst 1 tegn" }),
});
function MemberChat({
  messages,
  onSendMessage,
  onDeleteMessage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEditMessage,
  scrollContainerStyling,
}: MemberChatProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="flex w-full flex-col gap-2.5 md:w-fit">
      <h3>Medlemstråd</h3>
      <div className={cn("flex w-full flex-col gap-5", scrollContainerStyling)}>
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <SlideAnimation
              direction="right"
              key={message.eventMessage.id + "message"}
            >
              <MemberMessage onDelete={onDeleteMessage} message={message} />
            </SlideAnimation>
          ))}
        </AnimatePresence>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            onSendMessage(values.message);
            form.reset();
          })}
          className="flex w-full flex-row gap-2.5 md:w-fit"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => <Input placeholder="Skriv noe" {...field} />}
          />
          <Button type="submit">
            <SendIcon />
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default MemberChat;
