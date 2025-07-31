"use client";

import EditableParagraph from "@/components/editable-paragraph";
import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";
import React from "react";

type HybridParagraphProps = {
  initialData?: string;
  slug: string;
};
const HybridParagraph = ({ initialData, slug }: HybridParagraphProps) => {
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
            slug: "about",
            content: {
              content: content,
              title: "Om oss",
            },
            id: data?.[0]?.id ?? 0,
          }).then(() => {
            void utils.cms.getContent.invalidate({ slug });
          });
        } else {
          return create({
            slug: "about",
            content: {
              content: content,
              title: "Om oss",
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
