import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapIdToName(
  id: string | null | undefined,
  list: Array<{ id: string; name: string }> | undefined,
  fallback = "-"
): string {
  if (!id) return fallback;
  if (!list || list.length === 0) return id;
  const item = list.find((i) => i.id === id);
  return item ? item.name : id;
}

export function getEmployeeStatusColor(status: string) {
  switch (status) {
    case "Đang làm":
      return "bg-[#10b981] hover:bg-[#10b981]/90 shadow-[#10b981]/20 text-white";
    case "Nghỉ sinh":
      return "bg-pink-500 hover:bg-pink-500/90 shadow-pink-500/20 text-white";
    case "Tạm hoãn":
      return "bg-amber-500 hover:bg-amber-500/90 shadow-amber-500/20 text-white";
    case "Đã nghỉ việc":
      return "bg-slate-300 hover:bg-slate-400 text-foreground shadow-none border-0";
    default:
      return "bg-muted text-muted-foreground border-0";
  }
}
