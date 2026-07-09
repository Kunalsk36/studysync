"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const TONES = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

export function ProgressBar({ value = 0, tone = "primary", className, trackClassName }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[var(--border)]/60",
        trackClassName
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn("h-full rounded-full", TONES[tone], className)}
      />
    </div>
  );
}
