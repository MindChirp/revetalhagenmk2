"use client";
import { api } from "@/trpc/react";
import { type HTMLAttributes } from "react";
import { toast } from "sonner";
import MemberChat from "../ui/member-chat";

interface EventChatProps extends HTMLAttributes<HTMLDivElement> {
  eventId: number;
}
function EventChat({ eventId, ...props }: EventChatProps) {
  const utils = api.useUtils();
  const { data: messages } = api.events.getComments.useQuery({
    eventId: eventId,
  });
  const { mutateAsync: addComment } = api.events.addComment.useMutation();
  const { mutateAsync: editComment } = api.events.editComment.useMutation();
  const { mutateAsync: deleteComment } = api.events.deleteComment.useMutation();

  const handleDeleteComment = (id: number) => {
    if (!id) return;
    void deleteComment({
      id,
    })
      .then(() => {
        toast("Kommentaren er slettet!");
        void utils.events.getComments.invalidate();
      })
      .catch(() => {
        toast("Kunne ikke slette kommentaren");
      });
  };
  return (
    <div {...props}>
      <MemberChat
        scrollContainerStyling="md:w-50 h-fit lg:w-auto"
        messages={messages ?? []}
        onDeleteMessage={handleDeleteComment}
        onEditMessage={(id, message) =>
          editComment({ id, content: message }).then(() => {
            void utils.events.getComments.invalidate({
              eventId: eventId,
            });
          })
        }
        onSendMessage={(message, replyTo) =>
          addComment({
            eventId: eventId,
            content: message,
            replyTo: replyTo,
          }).then(() => {
            void utils.events.getComments.invalidate({
              eventId: eventId,
            });
          })
        }
      />
    </div>
  );
}

export default EventChat;
