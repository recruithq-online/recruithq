"use client";
import { Select } from "@/components/ui/input";
import { type HiringRoute } from "@/lib/marketplace";

export function RouteOptions({
  name = "kind",
  id,
  value,
  onChange,
}: {
  name?: string;
  id?: string;
  value?: HiringRoute;
  onChange?: (route: HiringRoute) => void;
}) {
  return (
    <Select
      id={id}
      name={name}
      value={value}
      onChange={(event) => onChange?.(event.target.value as HiringRoute)}
    >
      <option>Hiring for company</option>
      <option>Hiring for myself</option>
    </Select>
  );
}
