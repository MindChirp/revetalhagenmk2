"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

export interface AnimatedTabsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tabs: { label: string; value: string }[];
  onTabChange?: (value: string) => void;
  defaultValue?: string;
}

export function AnimatedTabs({
  tabs,
  onTabChange,
  defaultValue,
  className,
  ...props
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue ?? tabs[0]?.value);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container && activeTab) {
      onTabChange?.(activeTab);
      const activeTabElement = activeTabRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;

        const clipLeft = offsetLeft + 16;
        const clipRight = offsetLeft + offsetWidth + 16;

        container.style.clipPath = `inset(0 ${Number(
          100 - (clipRight / container.offsetWidth) * 100,
        ).toFixed()}% 0 ${Number(
          (clipLeft / container.offsetWidth) * 100,
        ).toFixed()}% round 17px)`;
      }
    }
  }, [activeTab]);

  return (
    <div
      className={cn(
        "bg-background border-primary/10 relative flex w-fit flex-col items-center rounded-full border px-4 py-2",
        className,
      )}
      {...props}
    >
      <div
        ref={containerRef}
        className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
      >
        <div className="bg-primary relative flex w-full justify-center">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab.value)}
              className="text-primary-foreground flex h-8 items-center rounded-full p-3 text-sm font-medium"
              tabIndex={-1}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex w-full justify-center">
        {tabs.map(({ label, value }, index) => {
          const isActive = activeTab === value;

          return (
            <button
              key={index}
              ref={isActive ? activeTabRef : null}
              onClick={() => setActiveTab(value)}
              className="text-muted-foreground flex h-8 cursor-pointer items-center rounded-full p-3 text-sm font-medium"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
