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
