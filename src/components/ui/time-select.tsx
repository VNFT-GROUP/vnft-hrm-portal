import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimeSelect({ value, onChange, className }: TimeSelectProps) {
  return (
    <div className={cn("relative w-full flex items-center", className)}>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full flex items-center justify-between font-normal h-10 px-3 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-[14px]",
          !value && "text-slate-500",
          "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer z-10 bg-transparent"
        )}
      />
      <Clock className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none z-0" />
    </div>
  );
}
