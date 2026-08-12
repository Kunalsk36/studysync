import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function GoalModal({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetHours: "",
    targetDate: "",
    status: "active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          title: initialData.title || "",
          description: initialData.description || "",
          targetHours: initialData.target_hours || "",
          targetDate: initialData.target_date ? initialData.target_date.split('T')[0] : "",
          status: initialData.status || "active"
        });
      } else {
        setFormData({
          title: "",
          description: "",
          targetHours: "",
          targetDate: "",
          status: "active"
        });
      }
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.targetHours) return;

    const payload = {
      title: formData.title,
      description: formData.description,
      targetHours: parseInt(formData.targetHours, 10),
      targetDate: formData.targetDate || undefined,
      status: formData.status
    };

    setIsSubmitting(true);
    try {
      await onSave(payload, initialData?.id);
      onClose();
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => !isSubmitting && onClose()}
      title={initialData ? "Edit Study Goal" : "New Study Goal"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--fg)]">
            Title
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Learn React"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--fg)]">
            Description
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional details..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--fg)]">
              Target Hours
            </label>
            <Input
              name="targetHours"
              type="number"
              min="1"
              value={formData.targetHours}
              onChange={handleChange}
              placeholder="e.g., 20"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--fg)]">
              Target Date (Optional)
            </label>
            <Input
              name="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
        {initialData && (
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--fg)]">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--fg)] focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Goal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
