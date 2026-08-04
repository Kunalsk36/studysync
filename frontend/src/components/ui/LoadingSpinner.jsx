import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export function LoadingSpinner({ text = "Loading...", className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-10 gap-3 text-[var(--fg-muted)]", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
