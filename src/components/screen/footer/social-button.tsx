import Link from "next/link";
import React from "react";

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}
function SocialButton({ icon, label, href }: SocialButtonProps) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center">
        {icon}
        {label}
      </div>
    </Link>
  );
}

export default SocialButton;
