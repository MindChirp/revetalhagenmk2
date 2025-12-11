import {
  Button,
  Font,
  Heading,
  Hr,
  Html,
  Img,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type BookingConfirmationTemplateProps = {
  name: string;
  bookingReference: string;
};
function BookingStatusTemplate({
  name = "John Doe",
  bookingReference,
}: BookingConfirmationTemplateProps) {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <Html lang="no">
      <Tailwind>
        <Font fontFamily={"Poppins"} fallbackFontFamily={"Arial"} />

        <Section className="my-[16px]">
          <Img
            alt="Låhnehuset"
            className="w-full rounded-[12px] object-cover"
            height="320"
            src={`https://www.revetalhagen.no/_next/image?url=%2Fimages%2Flaahnehuset.jpg&w=3840&q=75`}
          />
          <Section className="mt-[32px] text-center">
            <Text className="my-[16px] text-[18px] leading-[28px] font-semibold text-indigo-600">
              Hei, {name.split(" ")[0]}
            </Text>
            <Heading
              as="h1"
              className="m-0 mt-[8px] text-[36px] leading-[36px] font-semibold text-gray-900"
            >
              Bookingforespørselen er behandlet
            </Heading>
            <Text className="text-[16px] leading-[24px] text-gray-500">
              Bookingforespørselen din er nå behandlet. Du kan se status ved å
              trykke på knappen under.
            </Text>

            <Hr className="my-[16px] border-t-2 border-gray-300" />

            <Button
              className="mt-[16px] rounded-[8px] bg-indigo-600 px-[40px] py-[12px] font-semibold text-white"
              href={`${isDev ? "http://localhost:3000" : "https://www.revetalhagen.no"}/booking/status/${bookingReference}`}
            >
              Se status
            </Button>
          </Section>
        </Section>
      </Tailwind>
    </Html>
  );
}

export default BookingStatusTemplate;
