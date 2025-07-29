import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { AlertTriangle, CheckIcon, MailIcon } from "lucide-react";
import { Separator } from "./separator";
import PortableRenderer from "./portable-text/render-components/PortableRenderer";
import type { PortableTextBlock } from "@portabletext/editor";
import Link from "next/link";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type BookingResultCardProps = {
  rejectionReason?: string;
  variant?: "confirmed" | "rejected";
};

function BookingResultCard({
  rejectionReason,
  variant = "confirmed",
}: BookingResultCardProps) {
  return (
    <Card className="my-10">
      <CardHeader>
        <CardTitle
          className={cn(
            "flex items-center gap-2.5",
            variant === "confirmed" ? "text-primary" : "text-amber-600",
          )}
        >
          {variant === "rejected" && (
            <>
              <AlertTriangle /> Avslag på søknad
            </>
          )}
          {variant === "confirmed" && (
            <>
              <CheckIcon /> Søknaden er godkjent
            </>
          )}
        </CardTitle>
        <CardDescription>
          {variant === "rejected"
            ? "Søknaden din ble avslått. Begrunnelse for dette er oppgitt nedenfor."
            : "Søknaden din er godkjent. Du vil motta en epost med mer informasjon."}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="mt-0 flex flex-col gap-5">
        {rejectionReason && variant === "rejected" && (
          <PortableRenderer
            value={JSON.parse(rejectionReason) as PortableTextBlock[]}
          />
        )}
        <div className="flex flex-col gap-2.5">
          {variant === "confirmed" && (
            <>
              <span>
                Vi har nå bekreftet at huset er tilgjengelig, og med det ønsker
                vi deg velkommen!
              </span>
              <span>
                Du vil snart motta en mail med betalingsinstrukser, og annen
                relevant informasjon rundt bookingen din. Hvis du lurer på noe i
                mellomtiden, er det bare å ta kontakt.
              </span>
            </>
          )}
          <Link href="mailto:post@revetalhagen.no" className="w-fit">
            <Button>
              <MailIcon /> Ta kontakt
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingResultCard;
