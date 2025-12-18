import React from "react";

function PortableH2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold md:text-4xl">{children}</h2>;
}

export default PortableH2;
