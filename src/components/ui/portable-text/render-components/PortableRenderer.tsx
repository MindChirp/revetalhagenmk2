import { PortableText } from "@portabletext/react";
import React, { type ComponentProps } from "react";
import PortableH1 from "./h1";
import PortableH2 from "./h2";
import PortableH3 from "./h3";
import PortableQuote from "./quote";
import { cn } from "@/lib/utils";

type PortableBlockValue = {
  children?: Array<{
    text?: string;
  }>;
};

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
              normal: ({ children, value }) => {
                const text = (value as PortableBlockValue | undefined)?.children
                  ?.map((child) => child.text ?? "")
                  .join("");
                const isEmptyBlock = !text || text.trim().length === 0;

                return (
                  <p
                    className={cn(
                      "whitespace-pre-wrap leading-relaxed",
                      isEmptyBlock && "min-h-[1.5em]",
                    )}
                  >
                    {isEmptyBlock ? "\u00A0" : children}
                  </p>
                );
              },
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
