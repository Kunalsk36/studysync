import { cn } from "@/utils/cn";

const TONES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
  neutral: "bg-[var(--border)]/50 text-[var(--fg-muted)]",
};

export function Badge({ tone = "neutral", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        TONES[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
