"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export function Tabs({ tabs, defaultTab, onChange, className }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.value);

  const select = (value) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-sm bg-[var(--border)]/40 p-1",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => select(tab.value)}
          className={cn(
            "relative rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors",
            active === tab.value
              ? "text-primary-foreground"
              : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
          )}
        >
          {active === tab.value && (
            <motion.span
              layoutId="tab-pill"
              className="absolute inset-0 rounded-sm bg-primary"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
