"use client";

import EditableParagraph from "@/components/editable-paragraph";
import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";
import React from "react";

type HybridParagraphProps = {
  initialData?: string;
  slug: string;
  title?: string;
};
const HybridParagraph = ({
  initialData,
  slug,
  title,
}: HybridParagraphProps) => {
  const { data: session } = authClient.useSession();
  const { mutateAsync } = api.cms.updateContent.useMutation();
  const { mutateAsync: create } = api.cms.createContent.useMutation();
  const { data } = api.cms.getContent.useQuery({ slug });
  const utils = api.useUtils();

  return (
    <EditableParagraph
      admin={session?.user?.role === "admin"}
      onChange={async (content) => {
        if (data?.[0]?.id) {
          return mutateAsync({
            slug,
            content: {
              content: content,
              title: title ?? "Ingen tittel",
            },
            id: data?.[0]?.id ?? 0,
          }).then(() => {
            void utils.cms.getContent.invalidate({ slug });
          });
        } else {
          return create({
            slug,
            content: {
              content: content,
              title: title ?? "Ingen tittel",
            },
          }).then(() => {
            void utils.cms.getContent.invalidate({ slug });
          });
        }
      }}
      type="rich"
      content={data?.[0]?.content.content ?? initialData}
    />
  );
};

export default HybridParagraph;
