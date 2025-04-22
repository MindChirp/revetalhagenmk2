"use client";
import React, { type HTMLAttributes } from "react";
import MemberChat from "../ui/member-chat";
import { api } from "@/trpc/react";

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
  return (
    <div {...props}>
      <MemberChat
        scrollContainerStyling="max-h-80 overflow-y-auto"
        messages={messages ?? []}
        onDeleteMessage={(id) =>
          deleteComment({ id }).then(() => {
            void utils.events.getComments.invalidate({
              eventId: eventId,
            });
          })
        }
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
