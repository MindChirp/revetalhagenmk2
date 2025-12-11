import Hero from "@/components/screen/hero";
import LandingEventList from "@/components/ui/landing-event-list";
import { api, HydrateClient } from "@/trpc/server";
import Image from "next/image";

export default async function Home() {
  // if (typeof window === "undefined") {
  //   void api.post.getLatest.prefetch();
  // }
  const events = await api.events.getEvents({
    from: new Date(),
  });

  return (
    <HydrateClient>
      <div className="h-fit w-full overflow-x-hidden">
        <div className="mx-auto min-h-full w-full max-w-[90rem] px-5">
          <Image
            src="/images/skur_kveld.jpg"
            width={1000}
            height={1000}
            alt="Revetalhagen på kvelden"
            className="absolute top-0 left-0 h-[calc(100vh+2rem)] w-screen rounded-b-3xl object-cover shadow-md"
          />
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-transparent to-white to-80%" />
          <Hero className="relative z-10" />
          <LandingEventList className="my-20" events={events} />
          {/* <AboutUs /> */}
        </div>
      </div>
    </HydrateClient>
  );
}
