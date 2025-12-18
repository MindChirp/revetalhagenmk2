import React from "react";

function PortableH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-10 text-3xl font-black md:text-7xl md:leading-20">
      {children}
    </h1>
  );
}

export default PortableH1;
