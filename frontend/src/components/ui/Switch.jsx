"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export function Switch({ checked = false, onChange, label, className }) {
  return (
    <label className={cn("flex cursor-pointer items-center justify-between gap-3", className)}>
      {label && <span className="text-sm text-[var(--fg)]">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          checked ? "bg-primary" : "bg-[var(--border)]"
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
          style={{ left: checked ? "22px" : "2px" }}
        />
      </button>
    </label>
  );
}
