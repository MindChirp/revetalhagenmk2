"use server";

import DynamicBreadcrumbs from "@/components/dynamic-breadcrumbs";
import HybridParagraph from "@/components/screen/om-oss/hybrid-paragraph";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import { api } from "@/trpc/server";
import { HomeIcon } from "lucide-react";

const About = async () => {
  const data = await api.cms.getContent({
    slug: "about",
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-5 pt-24 md:px-10 md:pt-36">
      <SlideAnimation className="flex w-full flex-col gap-5" direction="up">
        <DynamicBreadcrumbs
          items={[
            {
              href: "/",
              label: "Hjem",
              icon: <HomeIcon />,
            },
            {
              href: "/om-oss",
              label: "Om oss",
            },
          ]}
        />
        <HybridParagraph
          initialData={data?.[0]?.content.content}
          slug={"about"}
        />
      </SlideAnimation>
    </div>
  );
};

export default About;
