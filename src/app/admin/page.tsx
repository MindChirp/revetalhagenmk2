import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BedIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Admin = () => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div>
        <h1 className="text-6xl font-black">Admin</h1>
        <span>Hva vil du gjøre?</span>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/booking">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2.5">
              <BedIcon size={32} className="w-20" />
              <div className="flex flex-col gap-1.5">
                <CardTitle>Bookinger</CardTitle>
                <CardDescription>
                  Behandle bookingforespørsler og se detaljer om bookinger.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
