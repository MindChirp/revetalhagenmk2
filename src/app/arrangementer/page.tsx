import SlideAnimation from "@/components/ui/animated/slide-animation";
import CreateNews from "@/components/ui/create-news";
import EventCalendar from "@/components/ui/event-calendar";

async function Page() {
  return (
    <div className="relative flex flex-col items-center gap-5 pt-36">
      <h1 className="text-foreground flex flex-row gap-5 pl-20 text-6xl leading-20">
        Hva
        <SlideAnimation
          direction="right"
          className="text-secondary-foreground bg-secondary overflow-hidden rounded-3xl px-2"
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
      <div className="relative flex w-full flex-0 flex-col items-center gap-2.5 pb-10">
        <CreateNews />
        <EventCalendar />
      </div>
    </div>
  );
}

export default Page;
