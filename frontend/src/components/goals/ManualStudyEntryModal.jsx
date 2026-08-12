import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function ManualStudyEntryModal({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    minutes: "",
    entryDate: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          minutes: initialData.minutes || "",
          entryDate: initialData.entry_date ? initialData.entry_date.split('T')[0] : "",
          notes: initialData.notes || ""
        });
      } else {
        setFormData({
          minutes: "",
          entryDate: new Date().toISOString().split('T')[0],
          notes: ""
        });
      }
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.minutes || !formData.entryDate) return;

    const minutesValue = parseInt(formData.minutes, 10);
    if (minutesValue <= 0) return;

    const payload = {
      minutes: minutesValue,
      entryDate: formData.entryDate,
      notes: formData.notes || undefined
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
      title={initialData ? "Edit Study Time" : "Log Study Time"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--fg)]">
            Study Time (minutes)
          </label>
          <Input
            name="minutes"
            type="number"
            min="1"
            value={formData.minutes}
            onChange={handleChange}
            placeholder="e.g., 60"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--fg)]">
            Entry Date
          </label>
          <Input
            name="entryDate"
            type="date"
            value={formData.entryDate}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--fg)]">
            Notes (Optional)
          </label>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g., Read chapter 1"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
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
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
