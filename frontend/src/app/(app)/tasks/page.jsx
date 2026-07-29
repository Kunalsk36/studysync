"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, ListTodo, Search, AlertCircle, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskModal } from "@/components/tasks/TaskModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { taskService } from "@/services/taskService";
import { categoryService } from "@/services/categoryService";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [totalTasks, setTotalTasks] = useState(0);
  
  // Filters & Sorting
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const [sortBy, setSortBy] = useState("default");
  const [order, setOrder] = useState("asc");

  // Pagination
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

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const params = { page, limit };
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;
      if (categoryFilter !== "all") params.categoryId = categoryFilter;
      if (query.trim()) params.search = query.trim();
      
      params.sortBy = sortBy;
      params.order = order;

      const res = await taskService.getTasks(params);
      setTasks(res.data || []);
      setTotalTasks(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, priorityFilter, categoryFilter, query, sortBy, order, page, limit]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // When filters or sorts change, reset to page 1
  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, categoryFilter, query, sortBy, order]);

  useEffect(() => {
    fetchTasks();
  }, [page, fetchTasks]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchTasks();
    }
  };

  const handleClearFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setSortBy("default");
    setOrder("asc");
    setPage(1);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
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

  const handleSaveTask = async (taskData, existingId) => {
    let savedTask;
    try {
      if (existingId) {
        const res = await taskService.updateTask(existingId, taskData);
        savedTask = res.data;
        setTasks(prev => prev.map(t => t.id === existingId ? savedTask : t));
      } else {
        const res = await taskService.createTask(taskData);
        savedTask = res.data;
        // In this UX pass, we might want to refresh to apply strict multi-sort backend logic
        // But for snappiness, unshifting is fine.
        setTasks(prev => [savedTask, ...prev]);
        setTotalTasks(prev => prev + 1);
      }
      return savedTask;
    } catch (err) {
      throw err;
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

  const totalPages = Math.ceil(totalTasks / limit);

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

      <div className="mb-5 flex flex-col gap-4 p-4 rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Search (press Enter)..."
                className="h-9 w-full rounded-sm border border-[var(--border)] bg-transparent pl-9 pr-3 text-sm text-[var(--fg)] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="w-full sm:w-auto">
            <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 w-full sm:w-32 rounded-sm border border-[var(--border)] bg-transparent px-2 text-sm text-[var(--fg)] outline-none">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">Priority</label>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="h-9 w-full sm:w-32 rounded-sm border border-[var(--border)] bg-transparent px-2 text-sm text-[var(--fg)] outline-none">
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">Category</label>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="h-9 w-full sm:w-32 rounded-sm border border-[var(--border)] bg-transparent px-2 text-sm text-[var(--fg)] outline-none">
              <option value="all">All</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <label className="text-xs font-medium text-transparent mb-1 block select-none">Clear</label>
            <Button variant="secondary" onClick={handleClearFilters} className="h-9 px-3 text-xs w-full sm:w-auto">
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-[var(--fg-muted)]" />
            <span className="text-xs font-medium text-[var(--fg-muted)]">Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="h-8 rounded-sm border border-[var(--border)] bg-transparent px-2 text-xs text-[var(--fg)] outline-none">
              <option value="default">Default (Workflow)</option>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
              <option value="created_at">Created Date</option>
              <option value="updated_at">Updated Date</option>
              <option value="title">Title</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)} disabled={sortBy === 'default'} className="h-8 rounded-sm border border-[var(--border)] bg-transparent px-2 text-xs text-[var(--fg)] outline-none">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--fg-muted)]">Page {page} of {totalPages}</span>
              <div className="flex items-center gap-1">
                <Button variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-8 px-2 py-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-8 px-2 py-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-md bg-danger/10 p-3 text-sm text-danger flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {isLoading && tasks.length === 0 ? (
        <div className="text-center py-10 text-[var(--fg-muted)]">Loading tasks...</div>
      ) : tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              category={categoryMap[task.category_id]}
              onUpdateTask={handleUpdateTask} 
              onEdit={() => openEditModal(task)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--border)]">
              <span className="text-sm text-[var(--fg-muted)]">Showing {tasks.length} of {totalTasks} tasks</span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  Previous
                </Button>
                <Button variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={ListTodo}
          title="No tasks found."
          description={query || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all" ? "Try adjusting your filters or search query." : "Create your first task to start planning."}
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
