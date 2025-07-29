import { SlashIcon } from "lucide-react";
import React, { type ComponentProps } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
type DynamicBreadcrumbsProps = {
  items: { label: string; href: string; icon?: React.ReactNode }[];
} & Omit<ComponentProps<typeof Breadcrumb>, "children">;
const DynamicBreadcrumbs = ({ items, ...props }: DynamicBreadcrumbsProps) => {
  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem>
              <BreadcrumbLink
                className="flex flex-row items-center gap-1"
                href={item.href}
              >
                {item.icon}
                {item.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumbs;
