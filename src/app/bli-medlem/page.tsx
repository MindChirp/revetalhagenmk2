"use client";
import DynamicBreadcrumbs from "@/components/dynamic-breadcrumbs";
import EditableParagraph from "@/components/editable-paragraph";
import MembershipForm from "@/components/forms/membership-form/membership-form";
import HeroImage from "@/components/hero-image";
import SlideAnimation from "@/components/ui/animated/slide-animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MembershipBenefit from "@/components/ui/membership-benefit";
import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";
import {
  HomeIcon,
  MessageCircleIcon,
  ThumbsUpIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const { mutateAsync } = api.cms.updateContent.useMutation();
  const { data: session } = authClient.useSession();
  const { mutateAsync: createContent } = api.cms.createContent.useMutation();
  const { data: content } = api.cms.getContent.useQuery({
    slug: "become-member",
  });

  const handleContentChange = (data: string) => {
    if (!content?.[0]?.id) {
      // Create it instead
      return createContent({
        slug: "become-member",
        content: {
          content: data,
          title: "Bli medlem",
        },
      })
        .catch(() => {
          toast.error("Kunne ikke opprette innholdet");
        })
        .then(() => {
          toast.success("Innholdet ble opprettet");
        });
    }
    void mutateAsync({
      slug: "become-member",
      content: {
        content: data,
        title: "Bli medlem",
      },
      id: content[0].id,
    }).catch(() => {
      toast.error("Kunne ikke oppdatere innholdet");
    });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-5 pt-24 md:px-10 md:pt-36">
      <SlideAnimation className="flex w-full flex-col gap-5" direction="up">
        <DynamicBreadcrumbs
          items={[
            {
              href: "/",
              label: "Hjem",
              icon: <HomeIcon size={16} />,
            },
            {
              href: "/bli-medlem",
              label: "Bli medlem",
            },
          ]}
        />
        <HeroImage
          src="/images/revetalhagen_fellesskap.png"
          cardContent={
            <div className="flex flex-col gap-2.5">
              <h1 className="text-3xl font-black">Bli medlem i Revetalhagen</h1>
              <p className="">
                Bli en del av fellesskapet! Revetalhagen er et åpent,
                livssynsnøytralt og inkluderende sted for mennesker i alle aldre
              </p>
            </div>
          }
          cardContentLoading={false}
        />

        <div className="mt-40 flex w-full flex-col items-center gap-5">
          <h2 className="text-3xl font-bold">Hvorfor bli medlem?</h2>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
            <MembershipBenefit
              title="Fellesskap"
              description="Møt nye mennesker og bli med på sosiale aktiviteter"
              Icon={MessageCircleIcon}
            />
            <MembershipBenefit
              title="Aktivitetstilgang"
              description="Få prioritet ved arrangementer og booking"
              Icon={UsersIcon}
            />
            <MembershipBenefit
              title="Velvære"
              description="Bidra til et sunt og inkluderende miljø"
              Icon={ThumbsUpIcon}
            />
          </div>
        </div>
        <div className="mt-20 flex w-full flex-col items-center gap-5">
          <h2 className="text-3xl font-bold">Om medlemskap</h2>
          <EditableParagraph
            type="rich"
            onChange={handleContentChange}
            content={content?.[0]?.content.content}
            admin={session?.user?.role === "admin"}
          />
        </div>
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Bli medlem!</CardTitle>
          </CardHeader>
          <CardContent>
            <MembershipForm />
          </CardContent>
        </Card>
      </SlideAnimation>
    </div>
  );
};

export default Page;
