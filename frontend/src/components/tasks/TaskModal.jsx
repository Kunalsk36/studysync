"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { subtaskService } from "@/services/subtaskService";
import { categoryService } from "@/services/categoryService";
import { useToast } from "@/context/ToastContext";
import { mapValidationErrors } from "@/utils/validation";

export function TaskModal({ open, onClose, onSave, initialData, categories, refreshCategories }) {
  const isEditing = !!initialData;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);
  
  // Category inline creation state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [errors, setErrors] = useState({});
  const toast = useToast();

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setCategoryId(initialData.category_id || "");
        setPriority(initialData.priority || "medium");
        setStatus(initialData.status || "pending");
        // format datetime for input type="datetime-local" (YYYY-MM-DDThh:mm)
        if (initialData.due_date) {
          const d = new Date(initialData.due_date);
          const offset = d.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(d - offset)).toISOString().slice(0, 16);
          setDueDate(localISOTime);
        } else {
          setDueDate("");
        }
        loadSubtasks(initialData.id);
      } else {
        setTitle("");
        setDescription("");
        setCategoryId(categories?.[0]?.id || "");
        setPriority("medium");
        setStatus("pending");
        setDueDate("");
        setSubtasks([]);
      }
      setIsCreatingCategory(false);
      setNewCategoryName("");
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]); // removed 'categories' so form doesn't wipe when categories refresh

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
    
    // Convert local datetime back to UTC ISO for the backend
    let parsedDueDate = undefined;
    if (dueDate) {
      parsedDueDate = new Date(dueDate).toISOString();
    }

    const taskData = {
      title,
      description,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      priority,
      status,
      dueDate: parsedDueDate,
    };

    try {
      // 1. Save Task
      const savedTask = await onSave(taskData, isEditing ? initialData.id : null);
      
      // 2. If it's a new task, we need to create the local subtasks that were added in the modal
      if (!isEditing && savedTask?.id && subtasks.length > 0) {
        await Promise.all(subtasks.map(st => 
          subtaskService.createSubtask(savedTask.id, { title: st.title })
        ));
      }
      
      onClose();
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setErrors(mapValidationErrors(err.errors));
        toast.showError("Please correct the highlighted fields.");
      } else {
        toast.showError(err.message || "Failed to save task.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus === "completed") {
      const hasIncompleteSubtasks = subtasks.some(st => !st.is_completed);
      if (hasIncompleteSubtasks) {
        setConfirmCompleteOpen(true);
        return;
      }
    }
    setStatus(newStatus);
  };

  const handleCompleteOnly = () => {
    setConfirmCompleteOpen(false);
    setStatus("completed");
  };

  const handleCompleteAll = async () => {
    setConfirmCompleteOpen(false);
    setStatus("completed");
    
    if (isEditing) {
      try {
        const incomplete = subtasks.filter(st => !st.is_completed);
        await Promise.all(incomplete.map(st => subtaskService.toggleComplete(initialData.id, st.id)));
        setSubtasks(subtasks.map(st => ({ ...st, is_completed: true })));
      } catch (err) {
        console.error(err);
      }
    } else {
      setSubtasks(subtasks.map(st => ({ ...st, is_completed: true })));
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    if (isEditing) {
      try {
        const res = await subtaskService.createSubtask(initialData.id, { title: newSubtask });
        setSubtasks([...subtasks, res.data]);
        setNewSubtask("");
      } catch (err) {
        console.error("Failed to add subtask", err);
      }
    } else {
      // For new tasks, store them locally with a temp id
      setSubtasks([...subtasks, { id: Date.now(), title: newSubtask, is_completed: false }]);
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = async (stId) => {
    if (isEditing) {
      try {
        await subtaskService.toggleComplete(initialData.id, stId);
        setSubtasks(subtasks.map(st => st.id === stId ? { ...st, is_completed: !st.is_completed } : st));
        
        // Auto-transition to in_progress if pending and marking subtask as completed
        const subtask = subtasks.find(st => st.id === stId);
        if (subtask && !subtask.is_completed && status === "pending") {
          setStatus("in_progress");
        }
      } catch (err) {
        console.error("Failed to toggle subtask", err);
      }
    } else {
      setSubtasks(subtasks.map(st => st.id === stId ? { ...st, is_completed: !st.is_completed } : st));
      
      const subtask = subtasks.find(st => st.id === stId);
      if (subtask && !subtask.is_completed && status === "pending") {
        setStatus("in_progress");
      }
    }
  };

  const handleDeleteSubtask = async (stId) => {
    if (isEditing) {
      try {
        await subtaskService.deleteSubtask(initialData.id, stId);
        setSubtasks(subtasks.filter(st => st.id !== stId));
      } catch (err) {
        console.error("Failed to delete subtask", err);
      }
    } else {
      setSubtasks(subtasks.filter(st => st.id !== stId));
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await categoryService.createCategory({ name: newCategoryName, color: "#6366F1" });
      if (refreshCategories) await refreshCategories();
      setCategoryId(res.data.id);
      setIsCreatingCategory(false);
      setNewCategoryName("");
      toast.showSuccess("Category created.");
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setErrors(mapValidationErrors(err.errors));
      } else {
        toast.showError(err.message || "Failed to create category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Edit Task" : "Create Task"}>
      <div className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-2 pb-2">
        <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Complete chapter 4"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: null })) }}
            error={errors.title}
            required
            maxLength={150}
          />
          <Textarea 
            label="Description" 
            placeholder="Optional notes..." 
            value={description}
            onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: null })) }}
            error={errors.description}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--fg)]">Category</label>
                {!isCreatingCategory && (
                  <button type="button" onClick={() => setIsCreatingCategory(true)} className="text-xs text-primary hover:underline">
                    + New
                  </button>
                )}
              </div>
              
              {isCreatingCategory ? (
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      label="New Category Name"
                      placeholder="e.g. Projects"
                      value={newCategoryName}
                      onChange={(e) => { setNewCategoryName(e.target.value); setErrors(prev => ({ ...prev, name: null })) }}
                      error={errors.name}
                      autoFocus
                    />
                  </div>
                  <button type="button" onClick={handleCreateCategory} className="text-sm font-medium text-primary hover:underline whitespace-nowrap mb-2.5">Save</button>
                  <button type="button" onClick={() => setIsCreatingCategory(false)} className="text-sm font-medium text-[var(--fg-muted)] hover:underline whitespace-nowrap mb-2.5">Cancel</button>
                </div>
              ) : (
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
              )}
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

          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--fg)]">Status</label>
              <select
                value={status}
                onChange={handleStatusChange}
                className="h-11 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <Input 
              label="Due Date & Time" 
              type="datetime-local" 
              value={dueDate}
              onChange={(e) => { setDueDate(e.target.value); setErrors(prev => ({ ...prev, dueDate: null })) }}
              error={errors.dueDate}
            />
          </div>
        </form>

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
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevents form submission
                  handleAddSubtask();
                }
              }}
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={handleAddSubtask}>
              Add
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] mt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="task-form" disabled={isSubmitting}>
          {isEditing ? "Save Changes" : "Create Task"}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {confirmCompleteOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
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
    </Modal>
  );
}
