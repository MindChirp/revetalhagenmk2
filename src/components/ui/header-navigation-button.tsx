"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface HeaderNavigationButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  href: string;
}
function HeaderNavigationButton({
  icon,
  children,
  href,
  style,
  className,
  ...props
}: HeaderNavigationButtonProps) {
  const pathname = usePathname();
  const highlighted = pathname === href;
  return (
    <Link href={href}>
      <button
        className={cn(
          "flex cursor-pointer flex-row gap-2.5 rounded-full p-3 transition-colors",
          highlighted
            ? "bg-secondary text-secondary-foreground"
            : "hover:bg-secondary/30 text-foreground",
          className,
        )}
        style={{
          ...style,
        }}
        {...props}
      >
        {icon}
        {children}
      </button>
    </Link>
  );
}

export default HeaderNavigationButton;
