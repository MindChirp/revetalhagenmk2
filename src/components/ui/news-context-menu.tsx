"use client";
import { EllipsisVertical, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "./button";
import EventDialog from "./event-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import type { event, news } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import CreateNewsForm from "../forms/create-news-form/create-news-form";
import NewsDialog from "./news-dialog";
import { useState } from "react";

interface NewsContextMenuProps {
  news: typeof news.$inferSelect;
}
function NewsContextMenu({ news }: NewsContextMenuProps) {
  const { mutateAsync: deleteNews } = api.news.delete.useMutation();
  const router = useRouter();
  const [newsEditOpen, setNewsEditOpen] = useState(false);
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"}>
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-1">
          <NewsDialog
            defaultValues={news}
            onOpenChange={setNewsEditOpen}
            open={newsEditOpen}
          />
          <Button
            variant={"outline"}
            onClick={() => {
              setNewsEditOpen(true);
            }}
          >
            <PencilIcon />
            Rediger
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => {
              if (!news) return;
              void deleteNews({ id: Number(news?.id) }).then(() => {
                router.replace("/nyheter");
              });
            }}
          >
            <TrashIcon />
            Slett
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default NewsContextMenu;
