import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function TimeSelect({ value, onChange, className, placeholder = "-- Chọn giờ --" }: TimeSelectProps) {
  const [open, setOpen] = React.useState(false);

  const timeOptions = React.useMemo(() => {
    const options = [];
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        options.push(`${hour}:00`);
        options.push(`${hour}:30`);
    }
    return options;
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "w-full flex items-center justify-between font-normal h-10 px-3 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-[14px]",
          !value && "text-slate-500",
          className
        )}
      >
        <span>{value || placeholder}</span>
        <Clock className="w-4 h-4 text-slate-400" />
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3" align="start">
        <div className="grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto pr-1">
          {timeOptions.map((time) => (
            <Button
              key={time}
              type="button"
              variant={time === value ? "default" : "outline"}
              className={cn(
                "h-9 px-2 text-[13px] font-medium w-full shadow-none",
                time === value 
                  ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
              )}
              onClick={() => {
                onChange(time);
                setOpen(false);
              }}
            >
              {time}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
