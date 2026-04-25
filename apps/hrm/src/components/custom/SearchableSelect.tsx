import * as React from "react";
import { ChevronsUpDown, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  onRefresh,
  isLoading,
  disabled
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled={disabled} type="button" className="w-full justify-between h-11 rounded-xl bg-background shadow-sm border border-border font-normal text-left px-3 hover:bg-muted flex items-center text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E3192] disabled:pointer-events-none disabled:opacity-50">
          <span className="truncate">
            {value
              ? options.find((opt) => opt.value === value)?.label || placeholder
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[300px] sm:w-[380px] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Tìm kiếm...`} />
            <CommandList>
              <CommandEmpty>Không có dữ liệu.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === opt.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {onRefresh && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-11 w-11 shrink-0 rounded-xl bg-background shadow-sm border-border"
          title="Làm mới"
        >
          <RefreshCw
            className={cn(
              "h-4 w-4 text-muted-foreground",
              isLoading && "animate-spin"
            )}
          />
        </Button>
      )}
    </div>
  );
}
