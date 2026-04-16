import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface ProfileFormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  requiredAsterisk?: boolean;
}

export function ProfileFormField({ label, requiredAsterisk = false, disabled, value, onChange, placeholder, type = "text", className, ...props }: ProfileFormFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {requiredAsterisk && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type={type}
        disabled={disabled}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-11 rounded-xl ${className || ""}`}
        {...props}
      />
    </div>
  );
}
