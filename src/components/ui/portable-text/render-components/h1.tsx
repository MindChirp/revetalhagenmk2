import React from "react";

function PortableH1({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-10 text-7xl leading-20 font-black">{children}</h1>;
}

export default PortableH1;
