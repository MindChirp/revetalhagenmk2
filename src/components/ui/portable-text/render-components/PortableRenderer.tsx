import { PortableText } from "@portabletext/react";
import React, { type ComponentProps } from "react";
import PortableH1 from "./h1";
import PortableH2 from "./h2";
import PortableH3 from "./h3";
import PortableQuote from "./quote";

function PortableRenderer({
  value,
  ...props
}: {
  value?: ComponentProps<typeof PortableText>["value"];
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      {value && (
        <PortableText
          value={value ?? []}
          components={{
            block: {
              h1: ({ children }) => <PortableH1>{children}</PortableH1>,
              h2: ({ children }) => <PortableH2>{children}</PortableH2>,
              h3: ({ children }) => <PortableH3>{children}</PortableH3>,
              blockquote: ({ children }) => (
                <PortableQuote>{children}</PortableQuote>
              ),
            },
          }}
        />
      )}
    </div>
  );
}

export default PortableRenderer;
