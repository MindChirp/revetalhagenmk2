import React, { type ComponentProps } from "react";
import { Button } from "./button";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

function BookingContact({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Spørsmål? Ris og ros?</CardTitle>
        <CardDescription>
          Ta gjerne kontakt med oss over epost dersom du har spørsmål, eller
          ønsker å dele tankene dine om hvordan bookingprosessen har fungert.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="mailto:post@revetalhagen.no">
          <Button>
            <MailIcon /> Ta kontakt
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default BookingContact;
