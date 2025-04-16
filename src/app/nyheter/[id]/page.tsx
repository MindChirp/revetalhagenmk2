import type { PageProps } from ".next/types/app/nyheter/[id]/page";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import Image from "next/image";

import "quill/dist/quill.snow.css";

async function Page({ params }: PageProps) {
  // Fetch the news article using the ID from params
  const { id } = (await params) as { id: string };
  const data = await api.news.getById({ id: Number(id) });
  return (
    <SlideAnimation
      className="flex flex-col gap-5 px-10 pt-32 pb-10"
      direction="up"
      transition={{
        delay: 0.2,
        duration: 1,
        type: "spring",
        damping: 10,
      }}
    >
      <SlideAnimation
        direction="up"
        transition={{
          delay: 0.6,
          duration: 0.3,
        }}
      >
        <h1 className="text-foreground flex flex-row gap-5 pl-10 text-6xl leading-20">
          {data?.news.name}
        </h1>
      </SlideAnimation>
      <div className="flex h-96 w-full flex-row gap-5">
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
              src="/images/revetalhagen_hage.jpg"
              className="h-full w-full object-cover object-bottom"
              alt="Hagen"
              width={500}
              height={500}
            />
          </div>
        </SlideAnimation>
        <SlideAnimation
          direction="up"
          className="w-96"
          transition={{
            delay: 0.4,
            duration: 0.5,
          }}
        >
          <div className="flex h-full flex-col gap-5">
            <div className="bg-secondary flex h-full w-full flex-col gap-2.5 rounded-[60px] px-10 pt-10">
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
        <div
          className="bg-accent rounded-[60px] p-10"
          dangerouslySetInnerHTML={{ __html: data?.news.content ?? "" }}
        >
          {/* {data?.news.content} */}
        </div>
      </SlideAnimation>
    </SlideAnimation>
  );
}

export default Page;
