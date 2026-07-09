"use client";

import { Bell, CheckCircle2, Trophy, CalendarClock, ListTodo } from "lucide-react";
import { cn } from "@/utils/cn";

const ICONS = {
  task: ListTodo,
  goal: Trophy,
  calendar: CalendarClock,
  achievement: Trophy,
  system: Bell,
};

const TONES = {
  task: "bg-primary/10 text-primary",
  goal: "bg-warning/10 text-warning",
  calendar: "bg-info/10 text-info",
  achievement: "bg-success/10 text-success",
  system: "bg-[var(--border)]/50 text-[var(--fg-muted)]",
};

export function NotificationItem({ notification, onMarkRead }) {
  const Icon = ICONS[notification.type] || Bell;

  return (
    <div
      className={cn(
        "flex items-start gap-3.5 rounded-md border p-4 transition-colors",
        notification.read
          ? "border-[var(--border)] bg-[var(--surface)]"
          : "border-primary/30 bg-primary/5"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          TONES[notification.type]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-[var(--fg)]">{notification.title}</p>
          {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-sm text-[var(--fg-muted)]">{notification.message}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-[var(--fg-muted)]">{notification.time}</span>
          {!notification.read && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
