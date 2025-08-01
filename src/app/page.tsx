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
      <div className="min-h-full w-full">
        <Hero className="relative z-10" />
        <LandingEventList events={events} />
        {/* <AboutUs /> */}
      </div>
    </HydrateClient>
  );
}
