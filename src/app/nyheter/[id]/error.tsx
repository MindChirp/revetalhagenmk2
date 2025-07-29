"use client";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function Error() {
  const router = useRouter();
  return (
    <SlideAnimation direction="up" transition={{ delay: 0.2 }}>
      <div className="flex h-screen flex-col items-center justify-center gap-1 pt-20">
        <h1 className="text-6xl font-black">Uffda</h1>
        <span>
          Noe gikk galt da vi prøvde å laste inn denne nyheten. Vennligst prøv
          igjen senere.
        </span>
        <Button size="lg" className="mt-2.5" onClick={() => router.back()}>
          <ArrowLeftIcon />
          Gå tilbake
        </Button>
      </div>
    </SlideAnimation>
  );
}

export default Error;
