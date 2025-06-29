import Image from "next/image";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { StarsIcon } from "lucide-react";
import BookingWizardForm from "../forms/booking-wizard-form/booking-wizard-form";

function BookingWizard() {
  return (
    <div className="relative mx-auto flex h-fit w-[95vw] items-start justify-start rounded-3xl shadow-lg md:h-[70vh] md:items-center md:px-10">
      <Image
        src="/images/wide1.jpg"
        alt="Revetalhagen"
        className="absolute top-0 left-0 h-full w-full rounded-3xl object-cover"
        width={2000}
        height={2000}
      />
      <Card className="bg-card/50 z-10 w-full backdrop-blur-md md:w-fit md:min-w-96">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2.5">
            <StarsIcon /> <span>Hva ser du etter?</span>
          </CardTitle>
          <CardDescription className="text-card-foreground/80">
            Book et rom for overnatting, arrangementer, eller lån utstyr til
            hagen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingWizardForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default BookingWizard;
