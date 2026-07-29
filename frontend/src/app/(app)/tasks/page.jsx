"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, ListTodo, Search, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskModal } from "@/components/tasks/TaskModal";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { taskService } from "@/services/taskService";
import { categoryService } from "@/services/categoryService";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [totalTasks, setTotalTasks] = useState(0);
  
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      const cats = res.data || [];
      setCategories(cats);
      const map = {};
      cats.forEach(c => {
        map[c.id] = c;
      });
      setCategoryMap(map);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchTasks = useCallback(async (isLoadMore = false) => {
    try {
      setIsLoading(true);
      setError("");
      
      const params = { page, limit };
      if (filter !== "all") params.status = filter;
      if (query.trim()) params.search = query.trim();

      const res = await taskService.getTasks(params);
      const newTasks = res.data || [];
      
      if (isLoadMore) {
        setTasks(prev => [...prev, ...newTasks]);
      } else {
        setTasks(newTasks);
      }
      setTotalTasks(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, [filter, query, page, limit]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Reset page when filter or query changes
    setPage(1);
  }, [filter, query]);

  useEffect(() => {
    fetchTasks(page > 1);
  }, [page, filter, fetchTasks]); 
  // We trigger fetch when page or filter changes.
  // Note: we might want to debounce query, but for now we can rely on a search button or let it trigger on enter.
  // Actually, listening to query changes directly might cause too many requests. We can just add a search handler.

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchTasks(false);
    }
  };

  const handleFilterChange = (val) => {
    setFilter(val);
  };

  const toggleTask = async (id) => {
    try {
      await taskService.toggleComplete(id);
      // Optimistically update
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
      ));
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setTotalTasks(prev => prev - 1);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const res = await taskService.updateTask(editingTask.id, taskData);
        setTasks(prev => prev.map(t => t.id === editingTask.id ? res.data : t));
      } else {
        const res = await taskService.createTask(taskData);
        setTasks(prev => [res.data, ...prev]);
        setTotalTasks(prev => prev + 1);
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      alert(err.message || "Failed to save task.");
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Organize, prioritize, and track everything you're working on."
        action={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs tabs={FILTERS} defaultTab={filter} onChange={handleFilterChange} />
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Search tasks (press Enter)..."
            className="h-10 w-full rounded-sm border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm text-[var(--fg)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-md bg-danger/10 p-3 text-sm text-danger flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {isLoading && page === 1 ? (
        <div className="text-center py-10 text-[var(--fg-muted)]">Loading tasks...</div>
      ) : tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              category={categoryMap[task.category_id]}
              onToggle={toggleTask} 
              onEdit={() => openEditModal(task)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
          {tasks.length < totalTasks && (
            <div className="flex justify-center mt-6">
              <Button variant="secondary" onClick={() => setPage(p => p + 1)} disabled={isLoading}>
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={ListTodo}
          title="No tasks found."
          description={query || filter !== "all" ? "Try adjusting your filters or search query." : "Create your first task to start planning."}
          action={<Button onClick={openCreateModal}>Create Task</Button>}
        />
      )}

      {modalOpen && (
        <TaskModal 
          open={modalOpen} 
          onClose={() => { setModalOpen(false); setEditingTask(null); }} 
          onSave={handleSaveTask}
          initialData={editingTask}
          categories={categories}
          refreshCategories={fetchCategories}
        />
      )}
    </div>
  );
}
