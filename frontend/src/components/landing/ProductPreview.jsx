"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Flame, ListTodo, Timer } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

/**
 * Illustrative dashboard mockup used in place of a real product screenshot
 * (FR-LAND-004). Built from the same components as the real Dashboard so it
 * stays visually accurate as the design system evolves.
 */
export function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto max-w-4xl rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl shadow-primary/10 sm:p-4"
    >
      <div className="flex items-center gap-1.5 px-2 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
      </div>

      <div className="grid gap-3 rounded-md bg-[var(--background)] p-4 sm:grid-cols-3 sm:p-6">
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 sm:col-span-2">
          <p className="text-sm font-medium text-[var(--fg-muted)]">Welcome back, Kunal 👋</p>
          <p className="mt-1 text-xl font-semibold text-[var(--fg)]">
            You&apos;ve studied 2.5h of 4h today
          </p>
          <ProgressBar value={62} className="mt-4" />
          <div className="mt-5 space-y-2">
            {[
              { label: "Complete React Course", done: false },
              { label: "Revise DSA Arrays", done: false },
              { label: "Update Resume", done: true },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2.5 rounded-sm bg-[var(--background)] px-3 py-2.5">
                <CheckCircle2
                  className={`h-4 w-4 ${t.done ? "text-success" : "text-[var(--fg-muted)]"}`}
                />
                <span
                  className={`text-sm ${t.done ? "text-[var(--fg-muted)] line-through" : "text-[var(--fg)]"}`}
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
              <Flame className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--fg)]">7 Days</p>
              <p className="text-xs text-[var(--fg-muted)]">Study Streak</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Timer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--fg)]">12</p>
              <p className="text-xs text-[var(--fg-muted)]">Focus Sessions</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <ListTodo className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--fg)]">42</p>
              <p className="text-xs text-[var(--fg-muted)]">Tasks Completed</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
