"use client";

import { motion } from "framer-motion";

export function BarChart({ data, xKey, yKey, maxValue }) {
  const max = maxValue || Math.max(...data.map((d) => d[yKey]));

  return (
    <div className="flex h-56 items-end gap-3">
      {data.map((item, i) => (
        <div key={item[xKey]} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-44 w-full items-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item[yKey] / max) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="w-full rounded-t-sm bg-primary"
            />
          </div>
          <span className="text-xs text-[var(--fg-muted)]">{item[xKey]}</span>
        </div>
      ))}
    </div>
  );
}
