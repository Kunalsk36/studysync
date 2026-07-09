"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { TASK_CATEGORIES } from "@/constants/mockData";

export function TaskModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title });
    setTitle("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="e.g. Revise Operating Systems"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          required
        />
        <Textarea label="Description" placeholder="Optional notes about this task" />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fg)]">Category</label>
            <select className="h-11 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
              {TASK_CATEGORIES.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fg)]">Priority</label>
            <select
              defaultValue="medium"
              className="h-11 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Due Date" type="date" />
          <Input label="Estimated Time (min)" type="number" placeholder="60" min="1" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Task</Button>
        </div>
      </form>
    </Modal>
  );
}
