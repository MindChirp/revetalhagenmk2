import { cn } from "@/lib/utils";
import React from "react";

function Main({ className, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={cn("relative min-h-screen", className)} {...props}>
      <h1>Revetalhagen</h1>

      <div className="min-h-screen w-full backdrop-blur-[100px]">
        <h1>Hello</h1>
      </div>
    </div>
  );
}

export default Main;
