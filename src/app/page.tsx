import Hero from "@/components/screen/hero";
import LandingEventList from "@/components/ui/landing-event-list";
import { api, HydrateClient } from "@/trpc/server";

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
          <Hero className="relative z-10" />
          <LandingEventList className="my-20" events={events} />
          {/* <AboutUs /> */}
        </div>
      </div>
    </HydrateClient>
  );
}
