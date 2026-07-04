import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  readonly value?: string;
  readonly onChange: (value: string | undefined) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

/** A Popover + Calendar date field bound to an ISO "yyyy-MM-dd" string value. */
function DatePicker({
  value,
  onChange,
  placeholder,
  disabled,
}: DatePickerProps) {
  const selected = value ? parseISO(value) : undefined;
  const isSelectedValid = selected && isValid(selected);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !isSelectedValid && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="h-4 w-4" aria-hidden="true" />
          {isSelectedValid
            ? format(selected, "dd MMM yyyy")
            : (placeholder ?? LABELS.PROJECTS.FORM.DATE_PICK_PLACEHOLDER)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={isSelectedValid ? selected : undefined}
          onSelect={(date) =>
            onChange(date ? format(date, "yyyy-MM-dd") : undefined)
          }
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
