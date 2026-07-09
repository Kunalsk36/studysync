"use client";

import { Flame, ListChecks, Trophy, Sunrise, Clock, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ICONS = { Flame, ListChecks, Trophy, Sunrise, Clock };

export function AchievementCard({ achievement }) {
  const Icon = ICONS[achievement.icon] || Trophy;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={cn(
        "rounded-md border p-5 text-center transition-shadow",
        achievement.earned
          ? "border-[var(--border)] bg-[var(--surface)] shadow-sm"
          : "border-dashed border-[var(--border)] bg-[var(--surface)]/50"
      )}
    >
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          backgroundColor: achievement.earned ? `${achievement.color}1a` : "var(--border)",
        }}
      >
        {achievement.earned ? (
          <Icon className="h-7 w-7" style={{ color: achievement.color }} />
        ) : (
          <Lock className="h-6 w-6 text-[var(--fg-muted)]" />
        )}
      </div>
      <p className={cn("mt-3 font-semibold", achievement.earned ? "text-[var(--fg)]" : "text-[var(--fg-muted)]")}>
        {achievement.title}
      </p>
      <p className="mt-1 text-xs text-[var(--fg-muted)]">{achievement.description}</p>
      {achievement.earned && (
        <p className="mt-2 text-[11px] font-medium text-success">Earned {achievement.earnedAt}</p>
      )}
    </motion.div>
  );
}
