import React, { type HTMLAttributes } from "react";

function ImageLabelCutout({ color, ...props }: HTMLAttributes<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="81"
      height="50"
      viewBox="0 0 81 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        y="6"
        width="38"
        height="38"
        rx="19"
        fill={color ?? "currentColor"}
        fillOpacity="0.5"
      />
      <rect
        x="43"
        width="38"
        height="8"
        rx="2"
        fill={color ?? "currentColor"}
        fillOpacity="0.5"
      />
      <rect
        x="43"
        y="12"
        width="38"
        height="38"
        rx="2"
        fill={color ?? "currentColor"}
        fillOpacity="0.5"
      />
    </svg>
  );
}

export default ImageLabelCutout;
