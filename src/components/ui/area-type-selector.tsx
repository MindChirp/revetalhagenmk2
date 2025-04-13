import { cn } from "@/lib/utils";
import { CircleHelpIcon } from "lucide-react";
import React from "react";
import CircularLayout from "../illustrations/circular-layout";
import GridLayout from "../illustrations/grid-layout";

interface AreaTypeSelectorProps {
  selectedType: number;
  onChange?: (type: number) => void;
}
function AreaTypeSelector({ selectedType, onChange }: AreaTypeSelectorProps) {
  return (
    <div>
      <div className="flex w-full flex-row gap-2.5">
        <AreaType
          label="Kvadratisk oppsett"
          illustration={<GridLayout className="text-primary" />}
          selected={selectedType === 0}
          onClick={() => onChange?.(0)}
        />
        <AreaType
          label="Sirkulært oppsett"
          illustration={<CircularLayout className="text-primary" />}
          selected={selectedType === 1}
          onClick={() => onChange?.(1)}
        />
        <AreaType
          label="Uformet oppsett"
          illustration={<CircleHelpIcon size={40} className="text-primary" />}
          selected={selectedType === 2}
          onClick={() => onChange?.(2)}
        />
      </div>
    </div>
  );
}

interface AreaTypeProps {
  selected?: boolean;
  label: string;
  illustration: React.ReactNode;
  onClick?: () => void;
}
const AreaType = ({
  illustration,
  label,
  selected,
  onClick,
}: AreaTypeProps) => {
  return (
    <button
      className={cn(
        "text-foreground flex w-full cursor-pointer flex-col items-center justify-center gap-5 rounded-3xl p-5 transition-colors md:flex-row",
        selected ? "bg-accent" : "hover:bg-accent/50",
      )}
      onClick={onClick}
    >
      {illustration}
      <label>{label}</label>
    </button>
  );
};

export default AreaTypeSelector;
