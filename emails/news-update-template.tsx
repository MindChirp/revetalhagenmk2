import {
  Button,
  Font,
  Heading,
  Html,
  Tailwind,
  Text,
} from "@react-email/components";

type NewsUpdateTemplateProps = {
  title: string;
  preview: string;
  // authorName: string;
  // authorImage: string;
  articleId: string;
};
function NewsUpdateTemplate({
  articleId,
  // authorImage = "https://www.revetalhagen.no/images/author-placeholder.png",
  // authorName = "Ukjent forfatter",
  preview = "Ukjent innhold",
  title = "Ukjent artikkel",
}: NewsUpdateTemplateProps) {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <Html lang="no">
      <Tailwind>
        <Font fontFamily={"Poppins"} fallbackFontFamily={"Arial"} />
        <table
          align="center"
          border={0}
          cellPadding="0"
          cellSpacing="0"
          className="my-[16px] h-[424px] rounded-[12px] bg-blue-600"
          role="presentation"
          style={{
            // This url must be in quotes for Yahoo
            // backgroundImage: "url('/static/my-image.png')",
            backgroundSize: "100% 100%",
          }}
          width="100%"
        >
          <tbody>
            <tr>
              <td align="center" className="p-[40px] text-center">
                <Text className="m-0 font-semibold text-gray-200">
                  Ny artikkel
                </Text>
                <Heading as="h1" className="m-0 mt-[4px] font-bold text-white">
                  {title}
                </Heading>
                <Text className="m-0 mt-[8px] text-[16px] leading-[24px] text-white">
                  {preview}
                </Text>
                <Button
                  className="mt-[24px] rounded-[8px] border border-solid border-gray-200 bg-white px-[40px] py-[12px] font-semibold text-gray-900"
                  href={
                    isDev
                      ? `http://localhost:3000/nyheter/${articleId}`
                      : `https://www.revetalhagen.no/nyheter/${articleId}`
                  }
                >
                  Les mer
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Tailwind>
    </Html>
  );
}

export default NewsUpdateTemplate;
