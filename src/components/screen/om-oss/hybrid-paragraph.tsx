"use client";

import EditableParagraph from "@/components/editable-paragraph";
import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";

type HybridParagraphProps = {
  initialEntry?: {
    id: number;
    content: string;
    title: string;
    image?: string;
  };
  slug: string;
};

const HybridParagraph = ({ initialEntry, slug }: HybridParagraphProps) => {
  const { data: session } = authClient.useSession();
  const utils = api.useUtils();
  const queryInput = initialEntry?.id ? { slug, id: initialEntry.id } : { slug };
  const { data } = api.cms.getContent.useQuery(queryInput);
  const { mutateAsync: updateContent } = api.cms.updateContent.useMutation({
    onSuccess: () => {
      void utils.cms.getContent.invalidate();
    },
  });
  const { mutateAsync: createContent } = api.cms.createContent.useMutation({
    onSuccess: () => {
      void utils.cms.getContent.invalidate();
    },
  });

  const currentEntry = data?.[0] ??
    (initialEntry
      ? {
          id: initialEntry.id,
          slug,
          content: {
            content: initialEntry.content,
            title: initialEntry.title,
            image: initialEntry.image,
          },
          order: 0,
        }
      : undefined);

  return (
    <EditableParagraph
      admin={session?.user?.role === "admin"}
      onChange={async (content) => {
        if (currentEntry?.id) {
          return updateContent({
            slug,
            content: {
              content,
              title: currentEntry.content.title,
              image: currentEntry.content.image,
            },
            id: currentEntry.id,
            order: currentEntry.order,
          });
        }

        return createContent({
          slug,
          content: {
            content,
            title: initialEntry?.title ?? "Om oss",
            image: initialEntry?.image,
          },
        });
      }}
      type="rich"
      content={currentEntry?.content.content}
    />
  );
};

export default HybridParagraph;
