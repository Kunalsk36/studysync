import { cn } from "@/utils/cn";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold text-[var(--fg)]", className)} {...props}>
      {children}
    </h3>
  );
}
