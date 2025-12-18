import React from "react";

function PortableH3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-semibold md:text-2xl">{children}</h3>;
}

export default PortableH3;
