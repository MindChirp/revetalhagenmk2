import DynamicBreadcrumbs from "@/components/dynamic-breadcrumbs";
import AdminSidebar from "@/components/screen/admin-sidebar/admin-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon } from "lucide-react";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="mt-28 flex h-0 min-h-[calc(100vh_-_10rem)] w-full flex-col gap-5 px-10 pb-10">
        <DynamicBreadcrumbs
          items={[
            { href: "/", label: "Hjem", icon: <HomeIcon size={16} /> },
            { href: "/admin", label: "Admin" },
          ]}
        />
        <div className="flex h-full gap-5">
          <AdminSidebar />
          <Card className="h-full w-full">
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Layout;
