"use client";
import { useId } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export function Field({
  label,
  name,
  type = "text",
  required = true,
  full = false,
  placeholder,
  maxLength,
  min,
  max,
  value,
  readOnly = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  value?: string;
  readOnly?: boolean;
}) {
  const id = useId();
  return (
    <div
      className={cn(
        `flex min-w-0 flex-col gap-2${full ? " col-span-full" : ""}`,
      )}
    >
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && " *"}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength ?? 100}
        min={min}
        max={max}
        step={type === "number" ? "0.01" : undefined}
        placeholder={placeholder}
        pattern={type === "text" && required ? ".*\\S.*" : undefined}
        {...(readOnly
          ? {
              value: value ?? "",
            }
          : {
              defaultValue: value,
            })}
        readOnly={readOnly}
      />
    </div>
  );
}

export function TextArea({
  label,
  name,
  maxLength = 1000,
  placeholder,
}: {
  label: string;
  name: string;
  maxLength?: number;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-2 col-span-full">
      <label htmlFor={id} className="text-sm font-semibold">
        {label} *
      </label>
      <Textarea
        id={id}
        name={name}
        required
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </div>
  );
}
