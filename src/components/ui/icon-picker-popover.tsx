import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import {
  DynamicIcon,
  iconNames as allLucideIconNames,
  type IconName,
} from "lucide-react/dynamic";
import { IconPicker } from "../icon-picker-3";

export function IconPickerPopover({
  value,
  onChange,
}: {
  value: IconName;
  onChange: (value: IconName) => void;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIconNames = useMemo(() => {
    if (!searchTerm.trim()) {
      return allLucideIconNames;
    }
    // Perhaps switch to fuzzy searching in the future
    return allLucideIconNames.filter((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    );
  }, [searchTerm]);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            className={cn(
              "w-16 justify-between",
              !value && "text-muted-foreground",
            )}
          >
            {value ? (
              <div className="flex items-center">
                <DynamicIcon name={value} className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full border border-dashed" />
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-2" align="start">
        <Command shouldFilter={true}>
          <CommandInput
            placeholder="Search icon..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <IconPicker
            icons={filteredIconNames}
            selectedIcon={value}
            onIconSelect={(iconName) => {
              onChange?.(iconName);
              setPopoverOpen(false);
              setSearchTerm("");
            }}
          />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
