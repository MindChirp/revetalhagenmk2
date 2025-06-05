"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import React, { useMemo, useState } from "react";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// Function for generating time slots with a 15 minute interval between two dates
const generateTimeSlots = (start: Date, end: Date) => {
  const slots = [];
  const current = new Date(start);
  while (current <= end) {
    slots.push(format(current, "HH:mm"));
    current.setMinutes(current.getMinutes() + 15);
  }
  return slots;
};

interface DateTimePickerProps
  extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
  value?: Date;
  onChange?: (date: Date) => void;
}
function DateTimePicker({
  value = new Date(),
  onChange,
  ...props
}: DateTimePickerProps) {
  const today = new Date();
  const [time, setTime] = useState<string | null>(null);

  const timeSlots = useMemo(() => {
    const start = new Date(); // Dummy date for time slots
    const end = new Date(); // Dummy date for time slots
    start.setHours(8, 0, 0); // Start time
    end.setHours(20, 0, 0); // End time
    return generateTimeSlots(start, end);
  }, []);

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <Input
          type="text"
          value={format(value, "do MMM yyyy HH:mm", {
            locale: nb,
          })}
          {...props}
          readOnly
          className="cursor-pointer"
        />
        {/* <Button className="min-w-32">{value}</Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div>
          <div className="border-border rounded-lg border">
            <div className="flex max-sm:flex-col">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(newDate) => {
                  if (newDate) {
                    onChange?.(newDate);
                    setTime(null);
                  }
                }}
                className="bg-background p-2 sm:pe-5"
                disabled={[{ before: today }]}
              />
              <div className="relative w-full max-sm:h-48 sm:w-40">
                <div className="border-border absolute inset-0 py-4 max-sm:border-t">
                  <ScrollArea className="border-border h-full sm:border-s">
                    <div className="space-y-3">
                      <div className="flex h-5 shrink-0 items-center px-5">
                        <p className="text-sm font-medium">
                          {format(value, "EEEE, d")}
                        </p>
                      </div>
                      <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                        {timeSlots.map((timeSlot) => (
                          <Button
                            key={timeSlot}
                            variant={time === timeSlot ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              onChange?.(
                                new Date(
                                  value.setHours(
                                    parseInt(timeSlot?.split(":")[0] ?? "0"),
                                    parseInt(timeSlot?.split(":")[1] ?? "0"),
                                  ),
                                ),
                              )
                            }
                          >
                            {timeSlot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DateTimePicker };
