"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

const PRIORITY_TONE = { high: "danger", medium: "warning", low: "info" };

export function TaskItem({ task, onToggle, compact = false }) {
  const isDone = task.status === "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <button onClick={() => onToggle?.(task.id)} className="mt-0.5 shrink-0">
        {isDone ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : (
          <Circle className="h-5 w-5 text-[var(--fg-muted)] hover:text-primary" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={cn("font-medium text-[var(--fg)]", isDone && "text-[var(--fg-muted)] line-through")}>
            {task.title}
          </p>
          <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
        </div>

        {!compact && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--fg-muted)]">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
              style={{ backgroundColor: `${task.color}1a`, color: task.color }}
            >
              {task.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Due {task.dueDate}
            </span>
            {task.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-[var(--border)]/50 px-2 py-0.5">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {!compact && task.subtasks?.length > 0 && (
          <div className="mt-3 space-y-1.5 border-l-2 border-[var(--border)] pl-3">
            {task.subtasks.map((st) => (
              <div key={st.id} className="flex items-center gap-2 text-sm">
                {st.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
                )}
                <span className={cn("text-[var(--fg-muted)]", st.done && "line-through")}>
                  {st.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
