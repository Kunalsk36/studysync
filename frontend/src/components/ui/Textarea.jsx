import { cn } from "@/utils/cn";

export function Textarea({ label, error, className, id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--fg)]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={4}
        className={cn(
          "w-full resize-none rounded-sm border bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
          error ? "border-danger" : "border-[var(--border)]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
