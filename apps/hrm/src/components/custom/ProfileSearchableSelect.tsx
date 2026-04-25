import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export function ProfileSearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  getTranslation,
  disabled
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  getTranslation?: (val: string) => string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const displayValue = value ? (getTranslation ? getTranslation(value) : value) : t(placeholder);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-card px-3 text-sm text-foreground shadow-sm hover:bg-muted/30 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden"
      >
        <span className="truncate">{displayValue}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="p-0 rounded-xl w-[calc(100vw-2rem)] sm:w-[350px] md:w-[450px]" align="start">
        <Command>
          <CommandInput 
            placeholder={t("editProfile.searchableSelect.searchPlaceholder", { defaultValue: "Tìm kiếm..." })} 
            onValueChange={() => {
              if (listRef.current) {
                listRef.current.scrollTop = 0;
              }
            }}
          />
          <CommandList ref={listRef} className="max-h-[350px]">
            <CommandEmpty>{t("editProfile.searchableSelect.noResults", { defaultValue: "Không tìm thấy kết quả." })}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={getTranslation ? getTranslation(opt) : opt}
                  onSelect={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${value === opt ? "opacity-100" : "opacity-0"}`} />
                  {getTranslation ? getTranslation(opt) : opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
