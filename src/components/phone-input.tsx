"use client";
import nb from "react-phone-number-input/locale/nb";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import {
  useCallback,
  type ComponentProps,
  type HTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";

export const InputComponent = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <Input className={cn("rounded-l-none border-l-0", className)} {...props} />
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
  return <div>{Flag && <Flag title={countryName} />}</div>;
};

type CountrySelectOption = { label: string; value: RPNInput.Country };

export const CountrySelectComponent = ({
  disabled,
  value,
  options,
  onChange,
}: {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountrySelectOption[];
  onChange: (value: RPNInput.Country) => void;
}) => {
  const handleSelect = useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange],
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("flex gap-1 rounded-s-lg rounded-e-none px-3")}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              "-mr-2 h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-foreground/50 text-sm">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface PhoneInputProps extends RPNInput.DefaultInputComponentProps {
  onChange: ComponentProps<typeof RPNInput.default>["onChange"];
}
export const PhoneInput = ({ onChange, ...props }: PhoneInputProps) => {
  return (
    <RPNInput.default
      className="flex h-12 flex-row"
      flagComponent={FlagComponent}
      labels={nb}
      onChange={onChange}
      defaultCountry="NO"
      countrySelectComponent={CountrySelectComponent}
      inputComponent={InputComponent}
      {...props}
    />
  );
};
