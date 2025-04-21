import SlideAnimation from "@/components/ui/animated/slide-animation";
import { Loader } from "lucide-react";
import React from "react";

function Loading() {
  return (
    <SlideAnimation direction="up" transition={{ delay: 0.2 }}>
      <div className="flex h-screen items-center justify-center pt-20">
        <Loader className="animate-spin" />
      </div>
    </SlideAnimation>
  );
}

export default Loading;
