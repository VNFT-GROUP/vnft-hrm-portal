import { cn } from "@/lib/utils";

interface AvatarPlaceholderProps {
  name?: string | null;
  className?: string;
  fallback?: string;
  src?: string | null;
}

export function AvatarPlaceholder({ name, className, fallback = "U", src }: AvatarPlaceholderProps) {
  if (src) {
    return (
      <div className={cn("shrink-0 overflow-hidden rounded-full shadow-sm border border-border", className)}>
        <img src={src} alt={name || "Avatar"} className="w-full h-full object-cover" />
      </div>
    );
  }

  const initial = name ? name.charAt(0).toUpperCase() : fallback;
  
  return (
    <div 
      className={cn(
        "flex shrink-0 items-center justify-center font-bold select-none rounded-full bg-[#1E2062]/10 text-[#1E2062] shadow-sm border border-transparent",
        className
      )}
    >
      {initial}
    </div>
  );
}
