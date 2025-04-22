"use client";
import type { AppRouter } from "@/server/api/root";
import { zodResolver } from "@hookform/resolvers/zod";
import type { inferProcedureOutput } from "@trpc/server";
import { format } from "date-fns";
import { PencilIcon, SendIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Form, FormField } from "./form";
import { Input } from "./input";
import { authClient } from "@/server/auth/client";
import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx";

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
  onEditMessage,
  scrollContainerStyling,
}: MemberChatProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(formSchema),
  });
  const session = authClient.useSession();
  return (
    <div className="flex w-full flex-col gap-2.5 md:w-fit">
      <h3>Medlemstråd</h3>
      <div className={cn("flex w-full flex-col gap-1", scrollContainerStyling)}>
        {messages.map((message) => (
          <Card
            key={message.eventMessage.id}
            className="w-full max-w-full md:w-fit md:min-w-lg"
          >
            <CardHeader>
              <CardTitle>
                {message.user?.name} -{" "}
                {format(message.eventMessage?.createdAt, "dd.MM.yyyy HH:mm")}
              </CardTitle>
              <CardDescription>{message.eventMessage.content}</CardDescription>
            </CardHeader>
            {session.data?.user.id === message.user?.id && (
              <CardContent className="flex flex-row items-start gap-2.5">
                <Button
                  variant={"destructive"}
                  onClick={() => onDeleteMessage(message.eventMessage.id)}
                >
                  <TrashIcon />
                  Slett
                </Button>
                <Button variant={"ghost"}>
                  <PencilIcon />
                  Rediger
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
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
            render={({ field }) => (
              <Input placeholder="Send en melding" {...field} />
            )}
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
