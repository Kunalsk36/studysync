"use client";

import { useMemo, useState } from "react";
import { Plus, ListTodo, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskModal } from "@/components/tasks/TaskModal";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { TASKS } from "@/constants/mockData";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

let nextId = TASKS.length + 1;

export default function TasksPage() {
  const [tasks, setTasks] = useState(TASKS);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t))
    );
  };

  const createTask = ({ title }) => {
    setTasks((prev) => [
      {
        id: nextId++,
        title,
        category: "Personal",
        color: "#6366F1",
        priority: "medium",
        status: "pending",
        dueDate: "—",
        estimatedMinutes: 60,
        actualMinutes: 0,
        tags: [],
        subtasks: [],
      },
      ...prev,
    ]);
  };

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesFilter = filter === "all" || t.status === filter;
      const matchesQuery = t.title.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [tasks, filter, query]);

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Organize, prioritize, and track everything you're working on."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs tabs={FILTERS} defaultTab="all" onChange={setFilter} />
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="h-10 w-full rounded-sm border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm text-[var(--fg)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ListTodo}
          title="No tasks found."
          description="Create your first task to start planning."
          action={<Button onClick={() => setModalOpen(true)}>Create your first task</Button>}
        />
      )}

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={createTask} />
    </div>
  );
}
