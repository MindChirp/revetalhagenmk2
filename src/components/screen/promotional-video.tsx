"use client";

import React from "react";
import { motion } from "framer-motion";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import { GraduationCap, Users, Sprout, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video } from "../video";

const PromotionalVideo = () => {
  return (
    <section className="relative w-full overflow-hidden py-12 md:py-24">
      {/* Decorative Background Element */}
      <div className="bg-secondary/30 absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
          {/* Text Content */}
          <div className="flex flex-col gap-6 lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SlideAnimation direction="up">
                <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                  Revetalhagens <br />
                  <span className="text-primary">Ungdomsskoleprosjekt</span>
                </h2>
              </SlideAnimation>
            </motion.div>

            <motion.p
              className="text-muted-foreground text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Sammen med Revetal ungdomsskole skaper vi en arena for
              tverrfaglig, praktisk læring som bidrar til variasjon i
              skolehverdagen, mestring og økt motivasjon. Gjennom praktisk
              arbeid i hagen oppfylles læreplanens mål om mer praktisk og
              variert opplæring.
            </motion.p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                  <GraduationCap size={20} />
                </div>
                <span className="font-medium">Praktisk læring</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary/20 text-secondary-foreground flex h-10 w-10 items-center justify-center rounded-full">
                  <Users size={20} />
                </div>
                <span className="font-medium">Fellesskap</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-accent/20 text-accent-foreground flex h-10 w-10 items-center justify-center rounded-full">
                  <Sprout size={20} />
                </div>
                <span className="font-medium">Bærekraft</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Heart size={20} />
                </div>
                <span className="font-medium">Mestring</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4"
            >
              <Link href="/ungdomsskoleprosjektet">
                <Button
                  size="lg"
                  className="rounded-full shadow-lg transition-all hover:scale-105"
                >
                  Les mer om prosjektet <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
          {/* Video Container */}
          <Video
            src="https://www.youtube.com/embed/q0odhjBhfsY?si=uKOWA0C6Mb2Yxxuh"
            className="lg:w-1/2"
          />
        </div>
      </div>
    </section>
  );
};

export default PromotionalVideo;
