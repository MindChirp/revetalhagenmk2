import React from "react";

function PortableQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-border my-2 border-l-2 pl-5">
      {children}
    </blockquote>
  );
}

export default PortableQuote;
