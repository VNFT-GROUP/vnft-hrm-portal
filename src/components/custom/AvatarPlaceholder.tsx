import React from "react";
import { cn } from "@/lib/utils";

interface AvatarPlaceholderProps {
  name?: string | null;
  className?: string;
  fallback?: string;
}

export function AvatarPlaceholder({ name, className, fallback = "U" }: AvatarPlaceholderProps) {
  const initial = name ? name.charAt(0).toUpperCase() : fallback;
  
  return (
    <div 
      className={cn(
        "flex shrink-0 items-center justify-center font-bold select-none rounded-full bg-[#1E2062]/10 text-[#1E2062] shadow-sm",
        className
      )}
    >
      {initial}
    </div>
  );
}
