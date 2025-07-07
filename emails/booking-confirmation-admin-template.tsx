import React from "react";
import {
  Button,
  Column,
  Font,
  Heading,
  Hr,
  Html,
  Img,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { BedIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";

type BookingConfirmationTemplateProps = {
  totalPrice: number;
  name: string;
  item: {
    name: string;
  };
  from: Date;
  to: Date;
  bookingReference: string;
};
function BookingConfirmationAdminTemplate({
  from = new Date(),
  item = { name: "Ukjent gjenstand" },
  name = "John Doe",
  to = new Date(),
  totalPrice = 600,
  bookingReference,
}: BookingConfirmationTemplateProps) {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <Html lang="no">
      <Tailwind>
        <Font fontFamily={"Poppins"} fallbackFontFamily={"Arial"} />

        <Section className="my-[16px]">
          <Section className="mt-[32px] text-center">
            <Text className="my-[16px] text-[18px] leading-[28px] font-semibold text-indigo-600">
              Internt varslingssystem
            </Text>
            <Heading
              as="h1"
              className="m-0 mt-[8px] text-[36px] leading-[36px] font-semibold text-gray-900"
            >
              Ny bookingforespørsel
            </Heading>
            <Text className="text-[16px] leading-[24px] text-gray-500">
              <strong>{name}</strong> har sendt inn en bookingforespørsel for{" "}
              <strong>{item.name}</strong> mellom{" "}
              <strong>{format(from, "dd.MM.yyyy")}</strong> og{" "}
              <strong>{format(to, "dd.MM.yyyy")}</strong> for{" "}
              <strong>{totalPrice} kr</strong>.
            </Text>
            <Text className="text-[16px] leading-[24px] text-gray-500">
              Gå til nettsiden for å se kontaktinformasjon, og hvilke handlinger
              du kan ta.
            </Text>
            <Hr className="my-[16px] border-t-2 border-gray-300" />

            <Button
              className="mt-[16px] rounded-[8px] bg-indigo-600 px-[40px] py-[12px] font-semibold text-white"
              href={`${isDev ? "http://localhost:3000" : "https://www.revetalhagen.no"}/booking/status/${bookingReference}`}
            >
              Behandle søknad
            </Button>
          </Section>
        </Section>
      </Tailwind>
    </Html>
  );
}

export default BookingConfirmationAdminTemplate;
