"use server";
import type { PageProps } from ".next/types/app/arrangementer/page";
import EventChat from "@/components/screen/event-chat";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import EventContextMenu from "@/components/ui/event-context-menu";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { format, isSameDay } from "date-fns";
import { nb } from "date-fns/locale";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import "quill/dist/quill.snow.css";

async function Page({ params }: PageProps) {
  // Fetch the news article using the ID from params
  const { id } = (await params) as { id: string };
  const data = await api.events.getById({ id: Number(id) });
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    // Redirect to 404
    redirect("/404");
  }

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
        className="flex flex-row items-center gap-5"
        transition={{
          delay: 0.6,
          duration: 0.3,
        }}
      >
        <h1 className="text-foreground flex w-fit flex-row gap-5 text-4xl leading-12 md:pl-10 md:text-6xl md:leading-20">
          {data?.event.title}
        </h1>
        {session?.user.role === "admin" && (
          <EventContextMenu event={data?.event} />
        )}
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
          <div className="flex h-fit w-full flex-col gap-5 md:h-full">
            <div className="bg-secondary flex h-full w-full flex-col gap-2.5 rounded-[60px] p-10 md:h-full">
              <div>
                <h3 className="font-semibold">Dato</h3>
                <h4>
                  {isSameDay(data?.event.start, data?.event.end)
                    ? format(data?.event.start, "do LLL yyy", { locale: nb })
                    : format(data?.event.start, "do LLL yyy", { locale: nb }) +
                      " - " +
                      format(data?.event.end, "do LLL yyy", { locale: nb })}
                </h4>
              </div>
              {data?.event.createdAt && (
                <div>
                  <h3 className="font-semibold">Tidspunkt </h3>
                  <h4>
                    {format(data.event.start, "HH:mm", { locale: nb }) +
                      " - " +
                      format(data.event.end, "HH:mm", { locale: nb })}
                  </h4>
                </div>
              )}
              {data?.event.updatedAt && (
                <div>
                  <h3 className="font-semibold">Sted</h3>
                  <h4>
                    {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                    {data?.event.location
                      ? data?.event.location
                      : "Ikke spesifisert"}
                  </h4>
                </div>
              )}
              {data?.event.author && (
                <div>
                  <h3 className="font-semibold">Arrangør</h3>
                  <h4>{data?.user?.name}</h4>
                </div>
              )}
            </div>
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
      {session && (
        <EventChat
          className="max-h-full w-full md:w-fit"
          eventId={Number(id)}
        />
      )}
    </SlideAnimation>
  );
}

export default Page;
