"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Edit2, Trash2, CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { subtaskService } from "@/services/subtaskService";
import { taskService } from "@/services/taskService";

const PRIORITY_TONE = { high: "danger", medium: "warning", low: "info" };

const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString([], {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export function TaskItem({ task, category, onUpdateTask, onEdit, onDelete, compact = false }) {
  const [subtasks, setSubtasks] = useState([]);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [isLoadingSubtasks, setIsLoadingSubtasks] = useState(false);
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);

  const isDone = task.status === "completed";

  useEffect(() => {
    let mounted = true;
    const fetchSubtasks = async () => {
      setIsLoadingSubtasks(true);
      try {
        const res = await subtaskService.getSubtasks(task.id);
        if (mounted) setSubtasks(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setIsLoadingSubtasks(false);
      }
    };
    fetchSubtasks();
    return () => { mounted = false; };
  }, [task.id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    
    if (newStatus === "completed") {
      const hasIncompleteSubtasks = subtasks.some(st => !st.is_completed);
      if (hasIncompleteSubtasks) {
        setConfirmCompleteOpen(true);
        return;
      }
    }

    try {
      const res = await taskService.updateTask(task.id, { status: newStatus });
      onUpdateTask?.(res.data);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleCompleteOnly = async () => {
    setConfirmCompleteOpen(false);
    try {
      const res = await taskService.updateTask(task.id, { status: "completed" });
      onUpdateTask?.(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteAll = async () => {
    setConfirmCompleteOpen(false);
    try {
      const incomplete = subtasks.filter(st => !st.is_completed);
      await Promise.all(incomplete.map(st => subtaskService.toggleComplete(task.id, st.id)));
      
      const res = await taskService.updateTask(task.id, { status: "completed" });
      
      setSubtasks(subtasks.map(st => ({ ...st, is_completed: true })));
      onUpdateTask?.(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSubtask = async (stId) => {
    try {
      await subtaskService.toggleComplete(task.id, stId);
      
      const subtask = subtasks.find(st => st.id === stId);
      let updatedTaskData = undefined;
      if (subtask && !subtask.is_completed && task.status === "pending") {
        // Automatically transition to in_progress
        const res = await taskService.updateTask(task.id, { status: "in_progress" });
        updatedTaskData = res.data;
      }
      
      setSubtasks(subtasks.map(st => st.id === stId ? { ...st, is_completed: !st.is_completed } : st));
      if (updatedTaskData) {
        onUpdateTask?.(updatedTaskData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    try {
      const res = await subtaskService.createSubtask(task.id, { title: newSubtask });
      setSubtasks([...subtasks, res.data]);
      setNewSubtask("");
    } catch (err) {
      console.error(err);
    }
  };

  const visibleSubtasks = showSubtasks ? subtasks : subtasks.slice(0, 3);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Replace Checkbox with Status Selector */}
        <select
          value={task.status}
          onChange={handleStatusChange}
          className={cn(
            "mt-0.5 h-7 rounded-sm border text-xs font-medium outline-none cursor-pointer",
            task.status === "completed" ? "bg-success/10 text-success border-success/20" :
            task.status === "in_progress" ? "bg-warning/10 text-warning border-warning/20" :
            "bg-[var(--border)] text-[var(--fg)] border-[var(--border)]"
          )}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

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
                Due {formatDateTime(task.due_date)}
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
      </div>

      {/* Inline Subtasks Area */}
      {!compact && subtasks.length > 0 && (
        <div className="ml-10 mt-1 space-y-1.5 border-l-2 border-[var(--border)] pl-3">
          {visibleSubtasks.map((st) => (
            <div key={st.id} className="flex items-center gap-2 text-sm group/st">
              <button onClick={() => handleToggleSubtask(st.id)}>
                {st.is_completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-[var(--fg-muted)] hover:text-primary" />
                )}
              </button>
              <span className={cn("text-[var(--fg-muted)]", st.is_completed && "line-through")}>
                {st.title}
              </span>
            </div>
          ))}
          {subtasks.length > 3 && (
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
            >
              {showSubtasks ? (
                <><ChevronUp className="h-3 w-3" /> Show Less</>
              ) : (
                <><ChevronDown className="h-3 w-3" /> Show {subtasks.length - 3} More</>
              )}
            </button>
          )}
        </div>
      )}

      {/* Inline Quick Add Subtask */}
      {!compact && (
        <div className="ml-10 mt-1 border-l-2 border-[var(--border)] pl-3">
          <form onSubmit={handleAddSubtask} className="flex items-center">
            <input
              type="text"
              placeholder="Add subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="h-7 w-full bg-transparent text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
            />
          </form>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmCompleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-md bg-[var(--surface)] p-6 shadow-lg border border-[var(--border)]">
            <h3 className="mb-2 text-lg font-semibold text-[var(--fg)]">Complete Task?</h3>
            <p className="mb-6 text-sm text-[var(--fg-muted)]">
              This task still contains incomplete subtasks.<br/><br/>
              Would you like to mark the remaining subtasks as completed as well?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button 
                onClick={() => setConfirmCompleteOpen(false)}
                className="rounded-sm border border-[var(--border)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--fg)] hover:bg-[var(--border)]"
              >
                Cancel
              </button>
              <button 
                onClick={handleCompleteOnly}
                className="rounded-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:bg-[var(--border)]"
              >
                Complete Task Only
              </button>
              <button 
                onClick={handleCompleteAll}
                className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Complete Task & All Subtasks
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
