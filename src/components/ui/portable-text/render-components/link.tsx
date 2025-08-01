import Link from "next/link";
import { type ComponentProps } from "react";

const PortableLink = ({ ...props }: ComponentProps<typeof Link>) => {
  return <Link {...props} />;
};

export default PortableLink;
