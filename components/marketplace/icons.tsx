import { cn } from "@/lib/cn";

const paths = {
  back: "M19 12H5m7-7-7 7 7 7",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  northeast: "M6 18 18 6M6 6h12v12",
  search: "m21 21-5-5M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6",
  bookmark: "M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4Z",
  grid: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
  briefcase: "M8 7V4h8v3M3 7h18v14H3V7Zm0 6c6 3 12 3 18 0M10 14h4",
  message:
    "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z",
  settings: "M4 7h16M4 17h16M8 4v6m8 4v6",
  check: "m5 12 4 4L19 6",
  flag: "M5 21V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0",
  plus: "M12 5v14M5 12h14",
  compass:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM16 8l-2.5 5.5L8 16l2.5-5.5L16 8Z",
  "add-square":
    "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM12 7v10M7 12h10",
  "chevron-right": "m9 5 7 7-7 7",
  close: "m6 6 12 12M18 6 6 18",
  menu: "M4 6h16M4 12h16M4 18h16",
  clock: "M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  sliders: "M4 7h16M4 17h16M8 4v6m8 4v6",
  document: "M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8m-8 4h5",
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span
      data-testid="wordmark"
      className="text-[29px] leading-none font-bold tracking-[-1.7px] max-phone:text-[25px]"
    >
      r<span className="text-brand">E</span>cruit
    </span>
  );
}
