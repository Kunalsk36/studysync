"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";

export function Input({ label, error, type = "text", className, id, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--fg)]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={isPassword ? (show ? "text" : "password") : type}
          className={cn(
            "h-11 w-full rounded-sm border bg-[var(--surface)] px-3.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
            error ? "border-danger" : "border-[var(--border)]",
            isPassword && "pr-11",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)]"
            tabIndex={-1}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
