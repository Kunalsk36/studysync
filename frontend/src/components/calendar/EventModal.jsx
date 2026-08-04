import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { mapValidationErrors } from "@/utils/validation";

const EVENT_TYPES = [
  { value: 'study', label: 'Study Session' },
  { value: 'exam', label: 'Exam' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'interview', label: 'Interview' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'personal', label: 'Personal' }
];

export function EventModal({ open, onClose, onSave, initialData, selectedDate }) {
  const isEditing = !!initialData;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("study");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
  const [location, setLocation] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setEventType(initialData.event_type || "study");
        setLocation(initialData.location || "");
        setIsAllDay(!!initialData.is_all_day);
        
        if (initialData.start_datetime) {
          const d = new Date(initialData.start_datetime);
          const offset = d.getTimezoneOffset() * 60000;
          setStartDatetime((new Date(d - offset)).toISOString().slice(0, 16));
        }
        if (initialData.end_datetime) {
          const d = new Date(initialData.end_datetime);
          const offset = d.getTimezoneOffset() * 60000;
          setEndDatetime((new Date(d - offset)).toISOString().slice(0, 16));
        }
      } else {
        setTitle("");
        setDescription("");
        setEventType("study");
        setLocation("");
        setIsAllDay(false);
        
        if (selectedDate) {
          setStartDatetime(`${selectedDate}T09:00`);
          setEndDatetime(`${selectedDate}T10:00`);
        } else {
          setStartDatetime("");
          setEndDatetime("");
        }
        setErrors({});
      }
    }
  }, [open, initialData, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !startDatetime || !endDatetime) return;
    
    setIsSubmitting(true);
    
    const data = {
      title,
      description,
      eventType,
      startDatetime: new Date(startDatetime).toISOString(),
      endDatetime: new Date(endDatetime).toISOString(),
      location,
      isAllDay
    };

    try {
      await onSave(data, isEditing ? initialData.id : null);
      onClose();
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setErrors(mapValidationErrors(err.errors));
        toast.showError("Please correct the highlighted fields.");
      } else {
        toast.showError(err.message || "Failed to save event.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Edit Event" : "Create Event"}>
      <form id="event-form" onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 pb-2">
        <Input
          label="Event Title"
          placeholder="e.g. Physics Final Exam"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: null })) }}
          error={errors.title}
          required
          maxLength={150}
        />
        
        <Textarea 
          label="Description" 
          placeholder="Optional notes" 
          value={description}
          onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: null })) }}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--fg)]">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="h-11 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {EVENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          
          <Input 
            label="Location" 
            placeholder="Room 101 / Zoom Link" 
            value={location}
            onChange={(e) => { setLocation(e.target.value); setErrors(prev => ({ ...prev, location: null })) }}
            error={errors.location}
            maxLength={255}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input 
            type="checkbox" 
            id="all-day" 
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
            className="h-4 w-4 rounded-sm border-[var(--border)] text-primary focus:ring-primary"
          />
          <label htmlFor="all-day" className="text-sm font-medium text-[var(--fg)]">
            All Day Event
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Start Date & Time" 
            type={isAllDay ? "date" : "datetime-local"} 
            value={isAllDay ? startDatetime.split('T')[0] : startDatetime}
            onChange={(e) => {
              const val = e.target.value;
              setStartDatetime(isAllDay && val ? `${val}T00:00` : val);
              setErrors(prev => ({ ...prev, startDatetime: null }));
            }}
            error={errors.startDatetime}
            required
          />
          <Input 
            label="End Date & Time" 
            type={isAllDay ? "date" : "datetime-local"} 
            value={isAllDay ? endDatetime.split('T')[0] : endDatetime}
            onChange={(e) => {
              const val = e.target.value;
              setEndDatetime(isAllDay && val ? `${val}T23:59` : val);
              setErrors(prev => ({ ...prev, endDatetime: null }));
            }}
            error={errors.endDatetime}
            required
          />
        </div>
      </form>
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] mt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="event-form" disabled={isSubmitting}>
          {isEditing ? "Save Changes" : "Create Event"}
        </Button>
      </div>
    </Modal>
  );
}
