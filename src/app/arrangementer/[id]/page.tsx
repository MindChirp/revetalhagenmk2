import type { PageProps } from ".next/types/app/arrangementer/[id]/page";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import "quill/dist/quill.snow.css";

async function Page({ params }: PageProps) {
  // Fetch the news article using the ID from params
  const { id } = (await params) as { id: string };
  const data = await api.events.getById({ id: Number(id) });
  return (
    <SlideAnimation
      className="flex flex-col gap-5 px-5 pt-24 pb-10 md:px-10 md:pt-32"
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
        <h1 className="text-foreground flex w-full flex-row gap-5 text-4xl leading-12 md:pl-10 md:text-6xl md:leading-20">
          {data?.event.title}
        </h1>
      </SlideAnimation>
      <div className="flex h-fit w-full flex-col gap-5 md:h-96 md:flex-row">
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
                <h3 className="font-semibold">Opprettet av</h3>
                <h4>{data?.user?.name}</h4>
              </div>
              {data?.event.createdAt && (
                <div>
                  <h3 className="font-semibold">Opprettet </h3>
                  <h4>
                    {format(data.event.createdAt, "do LLL yyy", {
                      locale: nb,
                    })}
                  </h4>
                </div>
              )}
              {data?.event.updatedAt && (
                <div>
                  <h3 className="font-semibold">Oppdatert</h3>
                  <h4>
                    {format(data.event.createdAt, "do LLL yyy", {
                      locale: nb,
                    })}
                  </h4>
                </div>
              )}
            </div>
            {/* <div className="bg-accent text-accent-foreground flex h-fit flex-row items-baseline gap-2.5 rounded-[60px] p-10">
              <h4 className="text-4xl">{data?.news.views}</h4>
              <p className="text-sm">
                visning{data?..views != 1 ? "er" : ""}
              </p>
            </div> */}
          </div>
        </SlideAnimation>
        <SlideAnimation className="h-full w-full">
          <div
            className="bg-accent h-full rounded-[60px] p-10"
            dangerouslySetInnerHTML={{ __html: data?.event.description ?? "" }}
          >
            {/* {data?.news.content} */}
          </div>
        </SlideAnimation>
      </div>
    </SlideAnimation>
  );
}

export default Page;
