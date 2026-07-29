"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

const PRIORITY_TONE = { high: "danger", medium: "warning", low: "info" };

export function TaskItem({ task, category, onToggle, onEdit, onDelete, compact = false }) {
  const isDone = task.status === "completed";

  // Backend returns dates in string format. Format them gracefully if needed,
  // or just show them directly if they are YYYY-MM-DD.
  const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : "—";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-primary/50 transition-colors"
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
          <p
            className={cn(
              "font-medium text-[var(--fg)]",
              isDone && "text-[var(--fg-muted)] line-through"
            )}
          >
            {task.title}
          </p>
          <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
        </div>
        
        {task.description && !compact && (
          <p className="mt-1 text-sm text-[var(--fg-muted)] line-clamp-2">
            {task.description}
          </p>
        )}

        {!compact && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--fg-muted)]">
            {category && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium"
                style={{ backgroundColor: `${category.color}1a`, color: category.color }}
              >
                {category.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Due {dueDate}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit?.(task)}
          className="p-1.5 text-[var(--fg-muted)] hover:text-primary hover:bg-[var(--border)] rounded-md transition-colors"
          title="Edit Task"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onDelete?.(task.id)}
          className="p-1.5 text-[var(--fg-muted)] hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
          title="Delete Task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
