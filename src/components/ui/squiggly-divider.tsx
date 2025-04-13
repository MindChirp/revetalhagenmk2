import React, { type HTMLAttributes } from "react";

function SquigglyDivider() {
  return (
    <div className="relative h-12 w-screen overflow-hidden">
      <div style={ellipse}></div>
      <div
        style={{
          ...ellipse,
          ...{
            backgroundPosition: "0px -20px",
          },
        }}
        className="top-[20px] left-[18px]"
      ></div>
    </div>
  );
}

const ellipse: HTMLAttributes<HTMLDivElement>["style"] = {
  position: "absolute",
  background:
    "radial-gradient(ellipse, transparent, transparent 7px, black 7px, black 10px, transparent 11px);",
  backgroundSize: "36px 40px",
  width: "200px",
  height: "20px",
};
export default SquigglyDivider;
