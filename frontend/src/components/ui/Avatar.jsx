import { cn } from "@/utils/cn";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

export function Avatar({ initials = "SS", size = "md", className }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary",
        SIZES[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
