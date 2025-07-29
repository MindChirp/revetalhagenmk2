"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BedIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type ComponentProps } from "react";

const AdminSidebar = () => {
  const path = usePathname();
  return (
    <Card className="h-fit min-w-xs">
      <CardContent>
        <SidebarButton
          href="/admin/booking"
          selected={path === "/admin/booking"}
        >
          <BedIcon /> Booking
        </SidebarButton>
      </CardContent>
    </Card>
  );
};

type SidebarButtonProps = ComponentProps<typeof Button> & {
  selected?: boolean;
  href: string;
};
export const SidebarButton = ({
  className,
  href,
  selected = false,
  ...props
}: SidebarButtonProps) => {
  return (
    <Link href={href}>
      <Button
        className={cn("w-full justify-start", className)}
        variant={selected ? "default" : "ghost"}
        {...props}
        size="lg"
      />
    </Link>
  );
};

export default AdminSidebar;
