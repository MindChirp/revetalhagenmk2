import React from "react";
import SlideAnimation from "./animated/slide-animation";
import WaffleHearts from "./waffle-hearts";

function UnderConstruction() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <SlideAnimation
        className="relative flex h-full flex-col items-center justify-center overflow-hidden pt-20"
        direction="up"
      >
        <WaffleHearts
          className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 rotate-12"
          width={800}
          height={800}
        />
        <SlideAnimation
          direction="up"
          transition={{
            delay: 0.25,
          }}
          className="relative z-10 flex flex-col items-start justify-center px-10"
        >
          <h1 className="text-3xl">Denne siden er under arbeid</h1>
          <h2 className="text-lg">
            Kom tilbake om en liten stund, så finner du nok noe mer
          </h2>
        </SlideAnimation>
      </SlideAnimation>
    </div>
  );
}

export default UnderConstruction;
