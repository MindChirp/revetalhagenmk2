import Hero from "@/components/screen/hero";
import LandingEventList from "@/components/ui/landing-event-list";
import { api, HydrateClient } from "@/trpc/server";
import Image from "next/image";

export default async function Home() {
  const events = await api.events.getEvents({
    from: new Date(),
  });

  return (
    <HydrateClient>
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_top_left,_rgba(222,236,215,0.96),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(47,92,86,0.18),_transparent_30%)]" />
        <div className="pointer-events-none absolute top-32 right-[-6rem] -z-10 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
        <div className="pointer-events-none absolute top-[56rem] left-[-6rem] -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto flex min-h-full w-full max-w-[90rem] flex-col gap-12 px-5 pb-20">
          <section className="relative">
            <Image
              src="/images/skur_kveld.jpg"
              width={1000}
              height={1000}
              alt="Revetalhagen ved kveldstid"
              priority
              sizes="100vw"
              className="absolute inset-x-0 top-0 h-[min(100vh+3rem,62rem)] w-full rounded-b-[2.75rem] object-cover shadow-[0_30px_90px_-60px_rgba(0,0,0,0.65)]"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(100vh+3rem,62rem)] rounded-b-[2.75rem] bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(255,255,255,0.58)_28%,_rgba(255,255,255,0.16)_62%,_rgba(255,255,255,1)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(100vh+3rem,62rem)] rounded-b-[2.75rem] ring-1 ring-white/40" />
            <Hero upcomingEventCount={events.length} className="relative z-10" />
          </section>
          <LandingEventList className="relative z-10" events={events} />
        </div>
      </main>
    </HydrateClient>
  );
}
