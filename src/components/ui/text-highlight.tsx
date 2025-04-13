import { cn } from "@/lib/utils";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TextHighlightProps extends React.HTMLAttributes<HTMLSpanElement> {}
function TextHighlight({ className, ...props }: TextHighlightProps) {
  return (
    <span
      className={cn("bg-secondary rounded-2xl p-2", className)}
      {...props}
    />
  );
}

export default TextHighlight;
