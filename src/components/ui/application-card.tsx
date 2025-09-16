"use client";

import React, { type ComponentProps } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Separator } from "./separator";
import { Button } from "./button";
import { AlertTriangle, Check, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ApplicationCard = ({
  className,
  name,
  applicationId,
  email,
  phoneNumber,
  ...props
}: ComponentProps<typeof Card> & {
  name: string;
  email: string;
  applicationId: number;
  phoneNumber: string;
}) => {
  const { mutate, status } = api.member.approveApplication.useMutation();
  const router = useRouter();

  const handleApprove = () => {
    mutate(
      { id: applicationId },
      {
        onError: (error) => {
          toast.error(error.message ?? "Noe gikk galt");
        },
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };
  return (
    <Card className={cn("w-fit min-w-[15rem]", className)} {...props}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {email} <Separator orientation="vertical" /> {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardAction>
          <Button disabled={status === "pending"} onClick={handleApprove}>
            {status === "idle" && (
              <>
                <Check /> Behandlet
              </>
            )}
            {status === "error" && (
              <>
                <AlertTriangle /> Noe gikk galt
              </>
            )}
            {status === "success" && (
              <>
                <Check /> Behandlet
              </>
            )}
            {status === "pending" && <Loader className="animate-spin" />}
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
