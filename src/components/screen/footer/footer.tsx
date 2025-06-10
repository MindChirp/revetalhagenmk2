import { cn } from "@/lib/utils";
import { SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";
import Image from "next/image";
import React from "react";
import SocialButton from "./social-button";
import { Separator } from "@/components/ui/separator";

function Footer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative min-h-96 w-full overflow-hidden rounded-t-3xl",
        className,
      )}
    >
      <Image
        src="/images/wide1.jpg"
        alt="Revetalhagen"
        width={2000}
        height={2000}
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="bg-card/50 absolute top-0 left-0 flex h-full w-full items-center justify-center backdrop-blur-md">
        <div className="flex flex-col items-center gap-2.5">
          <h3 className="text-card-foreground text-3xl font-black">
            Revetalhagen
          </h3>
          <div className="bg-card-foreground/50 h-[1px] w-full" />
          <div className="flex flex-row items-center gap-5">
            <SocialButton
              href="https://www.instagram.com/revetalhagen/"
              icon={<SiInstagram />}
              label="Instagram"
            />
            <div className="bg-card-foreground/50 h-10 w-[1px]" />
            <SocialButton
              href="https://www.facebook.com/Revetalhagen"
              icon={<SiFacebook />}
              label="Facebook"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
