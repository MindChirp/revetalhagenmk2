import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

type MembershipBenefitProps = {
  title: string;
  description: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const MembershipBenefit = ({
  title,
  description,
  Icon,
}: MembershipBenefitProps) => {
  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle className="flex justify-center">
          <Icon size={40} fill={"currentColor"} className="text-secondary" />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-center">{description}</p>
      </CardContent>
    </Card>
  );
};

export default MembershipBenefit;
