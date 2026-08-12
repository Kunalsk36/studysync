"use client";

import { Bell, CheckCircle2, Trophy, CalendarClock, ListTodo, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";

function formatTime(dateStr) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  } catch {
    return "Just now";
  }
}

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

export function NotificationItem({ notification, onMarkRead, onDelete }) {
  const Icon = ICONS[notification.notification_type] || Bell;
  const isRead = Boolean(notification.is_read);
  const formattedTime = formatTime(notification.created_at);

  return (
    <div
      className={cn(
        "group flex items-start gap-3.5 rounded-md border p-4 transition-colors",
        isRead
          ? "border-[var(--border)] bg-[var(--surface)]"
          : "border-primary/30 bg-primary/5"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          TONES[notification.notification_type] || TONES.system
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-[var(--fg)]">{notification.title}</p>
          {!isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-sm text-[var(--fg-muted)]">{notification.message}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-[var(--fg-muted)]">{formattedTime}</span>
          <div className="flex items-center gap-3">
            {!isRead && (
              <button
                onClick={() => onMarkRead(notification.id)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark as read
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
              className="flex items-center gap-1 text-xs font-medium text-danger/70 hover:text-danger hover:underline opacity-0 transition-opacity group-hover:opacity-100"
              title="Delete notification"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
