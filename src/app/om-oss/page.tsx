"use server";

import HybridParagraph from "@/components/screen/om-oss/hybrid-paragraph";
import { api } from "@/trpc/server";

const About = async () => {
  const data = await api.cms.getContent({
    slug: "about",
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-2.5 pt-36 md:px-10">
      <HybridParagraph
        initialData={data?.[0]?.content.content}
        slug={"about"}
      />
    </div>
  );
};

export default About;
