import Hero from "@/components/screen/hero";
import AboutUs from "@/components/ui/about-us";
import { HydrateClient } from "@/trpc/server";

export default function Home() {
  // if (typeof window === "undefined") {
  //   void api.post.getLatest.prefetch();
  // }

  return (
    <HydrateClient>
      <div className="min-h-full w-full">
        <Hero className="bg-red relative z-10 pt-32" />
        <AboutUs />
      </div>
    </HydrateClient>
  );
}
