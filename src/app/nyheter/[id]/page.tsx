import type { PageProps } from ".next/types/app/nyheter/[id]/page";
import DynamicBreadcrumbs from "@/components/dynamic-breadcrumbs";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import NewsContextMenu from "@/components/ui/news-context-menu";
import PortableRenderer from "@/components/ui/portable-text/render-components/PortableRenderer";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import type { PortableTextBlock } from "@portabletext/editor";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { HomeIcon } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";

import "quill/dist/quill.snow.css";

async function Page({ params }: PageProps) {
  // Fetch the news article using the ID from params
  const { id } = (await params) as { id: string };
  const data = await api.news.getById({ id: Number(id) });
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <SlideAnimation
      className="mx-auto flex max-w-6xl flex-col gap-5 px-5 pt-24 pb-10 md:px-10 md:pt-36"
      direction="up"
      transition={{
        delay: 0.2,
        duration: 1,
        type: "spring",
        damping: 10,
      }}
    >
      <DynamicBreadcrumbs
        items={[
          { href: "/", label: "Hjem", icon: <HomeIcon size={16} /> },
          {
            href: "/nyheter",
            label: "Nyheter",
          },
          {
            href: `/nyheter/${data?.news.id}`,
            label: data?.news.name ?? "Nyhetsartikkel",
          },
        ]}
      />
      <div className="flex flex-row items-center gap-5">
        <SlideAnimation
          direction="up"
          transition={{
            delay: 0.6,
            duration: 0.3,
          }}
        >
          <h1 className="text-foreground w-fit flex-row gap-5 text-4xl leading-12 md:text-6xl md:leading-20">
            {data?.news.name}
          </h1>
        </SlideAnimation>
        {session?.user?.role === "admin" && data && (
          <NewsContextMenu news={data.news} />
        )}
      </div>
      <div className="flex h-fit w-full flex-col gap-5 md:h-96 md:flex-row">
        <SlideAnimation
          className="h-full w-full"
          transition={{
            delay: 0.2,
            duration: 0.7,
          }}
          direction="up"
        >
          <div className="h-full w-full overflow-hidden rounded-[60px]">
            <Image
              src="/images/hagen_wide.jpg"
              className="bg-secondary h-full w-full object-cover object-center"
              alt="Hagen"
              width={2000}
              height={2000}
            />
          </div>
        </SlideAnimation>
        <SlideAnimation
          direction="up"
          className="h-fit w-full md:w-96"
          transition={{
            delay: 0.4,
            duration: 0.5,
          }}
        >
          <div className="flex w-full flex-col gap-5 md:h-full">
            <div className="bg-secondary flex h-fit w-full flex-col gap-2.5 rounded-[60px] p-10 md:h-full">
              <div>
                <h3 className="font-semibold">Skrevet av</h3>
                <h4>{data?.user?.name}</h4>
              </div>
              {data?.news.createdAt && (
                <div>
                  <h3 className="font-semibold">Opprettet </h3>
                  <h4>
                    {format(data.news.createdAt, "do LLL yyy", {
                      locale: nb,
                    })}
                  </h4>
                </div>
              )}
              {data?.news.updatedAt && (
                <div>
                  <h3 className="font-semibold">Oppdatert</h3>
                  <h4>
                    {format(data.news.createdAt, "do LLL yyy", {
                      locale: nb,
                    })}
                  </h4>
                </div>
              )}
            </div>
            <div className="bg-accent text-accent-foreground flex h-fit flex-row items-baseline gap-2.5 rounded-[60px] p-10">
              <h4 className="text-4xl">{data?.news.views}</h4>
              <p className="text-sm">
                visning{data?.news.views != 1 ? "er" : ""}
              </p>
            </div>
          </div>
        </SlideAnimation>
      </div>

      <SlideAnimation>
        <div className="bg-accent max-w-screen overflow-hidden rounded-[60px] p-10 text-wrap">
          <PortableRenderer
            value={
              JSON.parse(data?.news.content ?? "[]") as PortableTextBlock[]
            }
          />
        </div>
      </SlideAnimation>
    </SlideAnimation>
  );
}

export default Page;
