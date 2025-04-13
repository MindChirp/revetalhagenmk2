import SlideAnimation from "@/components/ui/animated/slide-animation";
import EventCalendar from "@/components/ui/event-calendar";

function Page() {
  return (
    <div className="relative flex flex-col items-center gap-5 pt-36">
      <h1 className="text-foreground flex flex-row gap-5 pl-20 text-6xl leading-20">
        Hva
        <SlideAnimation
          direction="right"
          transition={{
            delay: 0.7,
            duration: 0.5,
          }}
        >
          <SlideAnimation
            direction="up"
            className="text-secondary-foreground bg-secondary overflow-hidden rounded-3xl px-2"
            transition={{
              delay: 1.2,
            }}
          >
            skjer
          </SlideAnimation>
        </SlideAnimation>
        i Revetalhagen?
      </h1>
      <div className="relative flex w-full flex-0 flex-col items-center pb-10">
        <EventCalendar />
      </div>
    </div>
  );
}

export default Page;
