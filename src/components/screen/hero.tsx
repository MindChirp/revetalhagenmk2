"use client";

import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  CalendarIcon,
  HomeIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import EditableParagraph from "../editable-paragraph";
import HeroImage from "../hero-image";
import { Button } from "../ui/button";
import { HeroPill } from "../ui/hero-pill";

type HeroProps = React.HTMLProps<HTMLDivElement> & {
  upcomingEventCount?: number;
};

function Hero({
  upcomingEventCount = 0,
  className,
  ...props
}: HeroProps) {
  const { data: session } = authClient.useSession();
  const { data: paragraph, isLoading: paragraphLoading } =
    api.cms.getContent.useQuery({
      slug: "hero-description",
    });
  const trpcUtils = api.useUtils();
  const { mutate } = api.cms.updateContent.useMutation({
    onSuccess: () => {
      void trpcUtils.cms.getContent.invalidate({
        slug: "hero-description",
      });
    },
  });

  const highlights = [
    {
      title: "Fellesskap",
      description: "En åpen samlingsplass for mennesker i alle aldre.",
      Icon: UsersIcon,
    },
    {
      title: "Aktiviteter",
      description:
        upcomingEventCount > 0
          ? `${upcomingEventCount} arrangementer ligger klare i kalenderen.`
          : "Nye arrangementer legges ut fortløpende.",
      Icon: CalendarIcon,
    },
    {
      title: "Utleie",
      description: "Lånehuset og området kan brukes til kurs og samlinger.",
      Icon: HomeIcon,
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full items-center py-28 md:py-20 lg:pb-32">
      <div
        className={cn(
          "mx-auto grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(24rem,1fr)] lg:gap-14",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-6 lg:gap-8">
          <HeroPill
            href="/arrangementer"
            announcement="Året rundt"
            label={
              upcomingEventCount > 0
                ? `${upcomingEventCount} kommende arrangementer`
                : "Natur, booking og aktiviteter"
            }
            className="w-fit border border-white/60 bg-background/70 shadow-sm ring-white/60 backdrop-blur-md"
          />
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.25,
              type: "spring",
              damping: 18,
              duration: 0.6,
            }}
          >
            <p className="text-primary/80 text-sm font-semibold uppercase tracking-[0.28em]">
              Et sted for alle å være
            </p>
            <h1 className="text-foreground max-w-2xl text-4xl leading-tight font-semibold sm:text-5xl md:text-6xl md:leading-[1.05]">
              Velkommen til{" "}
              <span className="bg-secondary/90 text-secondary-foreground inline-flex rounded-[1.75rem] px-4 py-1.5 shadow-sm">
                Revetalhagen
              </span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-foreground/80 md:text-lg">
              Et varmt og inkluderende sted for natur, aktivitet og gode
              samlinger. Her er det rom for både rolige dager, booking og
              arrangementer som samler folk.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/arrangementer">
                Se arrangementer <ArrowRightIcon />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/70 bg-background/65 px-6 backdrop-blur-sm"
            >
              <Link href="/booking">Utforsk booking</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-6">
              <Link href="/bli-medlem">Bli medlem</Link>
            </Button>
          </motion.div>
          <motion.div
            className="grid gap-3 sm:grid-cols-3"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45 }}
          >
            {highlights.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="rounded-[1.75rem] border border-white/60 bg-background/72 p-4 shadow-sm backdrop-blur-sm"
              >
                <div className="bg-secondary/75 text-foreground mb-3 flex size-10 items-center justify-center rounded-full">
                  <Icon className="size-5" />
                </div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-foreground/70">
                  {description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <HeroImage
          src="/images/laahnehuset.jpg"
          cardContent={
            <>
              <p className="text-primary/70 text-xs font-semibold uppercase tracking-[0.22em]">
                Om Revetalhagen
              </p>
              <EditableParagraph
                className="text-sm leading-7 text-foreground/80 md:text-base"
                content={
                  paragraph?.[0]?.content.content ??
                  "Revetalhagen er en inkluderende samlingsplass med natur, arrangementer og rom for frivillighet. Her kan du finne fellesskap, leie lokaler eller bare ta turen innom."
                }
                admin={session?.user?.role === "admin"}
                buttonVariant="secondary"
                onChange={(content) => {
                  if (!paragraph?.[0]?.id) return;
                  mutate({
                    id: paragraph?.[0]?.id,
                    content: {
                      content,
                      title: "",
                    },
                    slug: "hero-description",
                  });
                }}
              />
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <Button asChild className="w-fit rounded-full">
                  <Link href="/om-oss">
                    Les mer <ArrowRightIcon />
                  </Link>
                </Button>
                <p className="max-w-xs text-sm leading-6 text-foreground/60">
                  Fellesskap, hverdagsliv og aktiviteter gjennom hele året.
                </p>
              </div>
            </>
          }
          cardContentLoading={paragraphLoading}
        />
      </div>
    </div>
  );
}

export default Hero;
