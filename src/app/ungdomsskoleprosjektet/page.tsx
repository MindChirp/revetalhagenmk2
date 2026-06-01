import DynamicBreadcrumbs from "@/components/dynamic-breadcrumbs";
import HybridParagraph from "@/components/screen/om-oss/hybrid-paragraph";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import { Video } from "@/components/video";
import { api } from "@/trpc/server";
import { HomeIcon } from "lucide-react";
import React from "react";

export default async function UngdomsskoleprosjektetPage() {
  const data = await api.cms.getContent({
    slug: "youth-project",
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-5 pt-24 pb-20 md:px-10 md:pt-36">
      <SlideAnimation className="flex w-full flex-col gap-8" direction="up">
        <DynamicBreadcrumbs
          items={[
            {
              href: "/",
              label: "Hjem",
              icon: <HomeIcon size={16} />,
            },
            {
              href: "/ungdomsskoleprosjektet",
              label: "Ungdomsskoleprosjektet",
            },
          ]}
        />

        <div className="flex w-full flex-col gap-4">
          <Video
            className="my-10 w-lg max-w-full"
            src={
              "https://www.youtube.com/embed/q0odhjBhfsY?si=uKOWA0C6Mb2Yxxuh"
            }
          />
          <h1 className="text-2xl font-bold tracking-tight md:text-6xl">
            Revetalhagens <br className="hidden md:block" />
            <span className="text-primary">Ungdomsskoleprosjekt</span>
          </h1>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-[3rem] p-8 md:p-12 md:pl-0">
          {/* Decorative background blob */}
          <div className="bg-primary/10 absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full blur-3xl" />

          <HybridParagraph
            initialData={data?.[0]?.content?.content}
            slug="youth-project"
          />
        </div>
      </SlideAnimation>
    </div>
  );
}
