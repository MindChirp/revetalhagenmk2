import SlideAnimation from "@/components/ui/animated/slide-animation";
import EventDialog from "@/components/ui/event-dialog";
import EventCalendar from "@/components/ui/event-calendar";
import EventList from "@/components/ui/event-list";
import DynamicBreadcrumbs from "@/components/dynamic-breadcrumbs";
import { HomeIcon } from "lucide-react";

async function Page() {
  return (
    <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-center gap-5 px-5 pt-24 md:pt-36">
      <DynamicBreadcrumbs
        className="mt-5 px-5 md:px-10 md:pl-20"
        items={[
          { href: "/", label: "Hjem", icon: <HomeIcon size={16} /> },
          { href: "/arrangementer", label: "Arrangementer" },
        ]}
      />
      <h1 className="text-foreground flex w-fit flex-row flex-wrap justify-start gap-x-2 pl-5 text-center text-4xl leading-12 md:gap-5 md:pl-20 md:text-6xl md:leading-20">
        Hva
        <SlideAnimation
          direction="right"
          className="text-secondary-foreground bg-secondary w-fit overflow-hidden rounded-3xl px-2"
          transition={{
            delay: 0.4,
            duration: 0.3,
          }}
        >
          <SlideAnimation
            direction="up"
            className=""
            transition={{
              delay: 0.7,
            }}
          >
            skjer
          </SlideAnimation>
        </SlideAnimation>
        i Revetalhagen?
      </h1>
      <div className="relative flex w-full flex-0 flex-col items-center justify-center gap-5 px-5 pb-10 md:flex-row md:items-start md:px-20">
        <div className="flex w-full flex-1 flex-col items-start gap-2.5">
          <h2 className="font-semibold">Kommende arrangementer</h2>
          <EventList className="w-full" />
          <EventDialog className="mx-auto w-full md:mx-0" />
        </div>
        <div className="flex w-full flex-2 flex-col items-start justify-center gap-2.5 md:items-start">
          <h2 className="w-fit font-semibold">Arrangementskalender</h2>
          <EventCalendar />
        </div>
      </div>
    </div>
  );
}

export default Page;
