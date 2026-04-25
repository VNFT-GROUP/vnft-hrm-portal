import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const generateTimeOptions = (startHour = 8, endHour = 20, stepMinutes = 15) => {
  const options = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      if (h === endHour && m > 0) break; // Only include up to endHour:00
      const hs = h.toString().padStart(2, "0");
      const ms = m.toString().padStart(2, "0");
      options.push(`${hs}:${ms}`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

export function TimeSelect({ value, onChange, className }: TimeSelectProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Select value={value} onValueChange={(val) => val && onChange(val)}>
        <SelectTrigger
          className={cn(
            "w-full flex items-center justify-between font-normal h-10 px-3 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-[14px]",
            !value && "text-slate-500 text-[13px]"
          )}
        >
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-slate-400 truncate shrink-0" />
            <SelectValue placeholder="-- Chọn --" />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {TIME_OPTIONS.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
