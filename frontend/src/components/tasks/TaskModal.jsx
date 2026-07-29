"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Circle, Trash2, Plus } from "lucide-react";
import { subtaskService } from "@/services/subtaskService";
import { categoryService } from "@/services/categoryService";

export function TaskModal({ open, onClose, onSave, initialData, categories, refreshCategories }) {
  const isEditing = !!initialData;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setCategoryId(initialData.category_id || "");
        setPriority(initialData.priority || "medium");
        // format date for input type="date"
        const dateStr = initialData.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : "";
        setDueDate(dateStr);
        loadSubtasks(initialData.id);
      } else {
        setTitle("");
        setDescription("");
        setCategoryId(categories?.[0]?.id || "");
        setPriority("medium");
        setDueDate("");
        setSubtasks([]);
      }
    }
  }, [open, initialData, categories]);

  const loadSubtasks = async (taskId) => {
    try {
      const res = await subtaskService.getSubtasks(taskId);
      setSubtasks(res.data || []);
    } catch (err) {
      console.error("Failed to load subtasks", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    
    const taskData = {
      title,
      description,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      priority,
      dueDate: dueDate || undefined,
    };

    await onSave(taskData);
    setIsSubmitting(false);
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim() || !initialData) return;
    try {
      const res = await subtaskService.createSubtask(initialData.id, { title: newSubtask });
      setSubtasks([...subtasks, res.data]);
      setNewSubtask("");
    } catch (err) {
      console.error("Failed to add subtask", err);
    }
  };

  const handleToggleSubtask = async (stId) => {
    try {
      await subtaskService.toggleComplete(initialData.id, stId);
      setSubtasks(subtasks.map(st => st.id === stId ? { ...st, is_completed: !st.is_completed } : st));
    } catch (err) {
      console.error("Failed to toggle subtask", err);
    }
  };

  const handleDeleteSubtask = async (stId) => {
    try {
      await subtaskService.deleteSubtask(initialData.id, stId);
      setSubtasks(subtasks.filter(st => st.id !== stId));
    } catch (err) {
      console.error("Failed to delete subtask", err);
    }
  };

  // Inline basic category creation
  const handleCreateCategory = async () => {
    const name = prompt("Enter new category name:");
    if (!name) return;
    try {
      const res = await categoryService.createCategory({ name, color: "#6366F1" }); // default color
      if (refreshCategories) await refreshCategories();
      setCategoryId(res.data.id);
    } catch (err) {
      alert("Failed to create category");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Edit Task" : "Create Task"}>
      <div className="flex flex-col gap-6">
        <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Revise Operating Systems"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
          <Textarea 
            label="Description" 
            placeholder="Optional notes about this task" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--fg)]">Category</label>
                <button type="button" onClick={handleCreateCategory} className="text-xs text-primary hover:underline">
                  + New
                </button>
              </div>
              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-11 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No Category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--fg)]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-11 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input 
              label="Due Date" 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </form>

        {isEditing && (
          <div className="border-t border-[var(--border)] pt-4">
            <h4 className="text-sm font-medium mb-3">Subtasks</h4>
            <div className="space-y-2 mb-3">
              {subtasks.map(st => (
                <div key={st.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleSubtask(st.id)}>
                      {st.is_completed ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <Circle className="h-4 w-4 text-[var(--fg-muted)] hover:text-primary" />
                      )}
                    </button>
                    <span className={`text-sm ${st.is_completed ? "text-[var(--fg-muted)] line-through" : "text-[var(--fg)]"}`}>
                      {st.title}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[var(--fg-muted)] hover:text-danger rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="New subtask..." 
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddSubtask()}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={handleAddSubtask}>
                Add
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="task-form" disabled={isSubmitting}>
            {isEditing ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
