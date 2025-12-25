import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BedIcon, User } from "lucide-react";
import Link from "next/link";
import React, { type ComponentProps } from "react";

const Admin = () => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div>
        <h1 className="text-3xl font-black md:text-6xl">Admin</h1>
        <span>Hva vil du gjøre?</span>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/booking">
          <AdminAction
            icon={<BedIcon size={32} className="w-20" />}
            title="Bookinger"
            description="Behandle bookingforespørsler og se detaljer om bookinger."
          />
        </Link>
        <Link href="/admin/medlemskap">
          <AdminAction
            icon={<User size={32} className="w-20" />}
            title="Medlemskap"
            description="Se og administrer medlemskapssøknader."
          />
        </Link>
      </div>
    </div>
  );
};

const AdminAction = ({
  icon,
  className,
  title,
  description,
  ...props
}: ComponentProps<typeof Card> & {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <Card className={cn("h-full", className)} {...props}>
      <CardHeader className="flex h-full flex-row items-center gap-2.5">
        {icon}
        <div className="flex h-full flex-col gap-1.5">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

export default Admin;
