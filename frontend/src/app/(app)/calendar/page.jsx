"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarDays as CalendarIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { calendarService } from "@/services/calendarService";
import { EventModal } from "@/components/calendar/EventModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useConfirm } from "@/context/ConfirmContext";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Matches colors used in mockData but dynamic now
const EVENT_TYPE_STYLES = {
  study: { label: "Study Session", color: "#6366F1" }, // indigo
  exam: { label: "Exam", color: "#EF4444" }, // red
  meeting: { label: "Meeting", color: "#10B981" }, // emerald
  interview: { label: "Interview", color: "#F59E0B" }, // amber
  deadline: { label: "Deadline", color: "#8B5CF6" }, // violet
  personal: { label: "Personal", color: "#EC4899" }, // pink
};

function toKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  return cells;
}

export default function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(toKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const { confirm } = useConfirm();

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      // For a month view, fetch the events in this month
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      
      const res = await calendarService.getEvents({ startDate, endDate });
      setEvents(res.data || []);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const event of events) {
      // Map event.start_datetime to local YYYY-MM-DD
      const d = new Date(event.start_datetime);
      const key = toKey(d.getFullYear(), d.getMonth(), d.getDate());
      map[key] = map[key] || [];
      map[key].push(event);
    }
    return map;
  }, [events]);

  const changeMonth = (delta) => {
    setCursor(new Date(year, month + delta, 1));
  };

  const selectedEvents = eventsByDate[selectedDate] || [];
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  
  const now = new Date();
  const todayKey = toKey(now.getFullYear(), now.getMonth(), now.getDate());

  const handleSaveEvent = async (eventData, existingId) => {
    try {
      if (existingId) {
        await calendarService.updateEvent(existingId, eventData);
      } else {
        await calendarService.createEvent(eventData);
      }
      fetchEvents();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteEvent = async (id) => {
    const isConfirmed = await confirm({
      title: "Delete Event",
      message: "Are you sure you want to delete this event? This cannot be undone.",
      confirmText: "Delete",
      isDestructive: true
    });
    if (!isConfirmed) return;
    try {
      await calendarService.deleteEvent(id);
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const formatEventTime = (event) => {
    if (event.is_all_day) return "All Day";
    const start = new Date(event.start_datetime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const end = new Date(event.end_datetime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${start} - ${end}`;
  };

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Exams, interviews, deadlines, and study sessions — all in one view."
        action={
          <Button size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--fg)]">{monthLabel}</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => changeMonth(-1)}
                className="rounded-sm p-2 text-[var(--fg-muted)] hover:bg-[var(--border)]/40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="rounded-sm p-2 text-[var(--fg-muted)] hover:bg-[var(--border)]/40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-[var(--fg-muted)]">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const key = toKey(year, month, day);
              const dayEvents = eventsByDate[key] || [];
              const isSelected = key === selectedDate;
              const isToday = key === todayKey;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-start gap-1 rounded-sm border p-1.5 text-sm transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-[var(--fg)] hover:bg-[var(--border)]/40",
                    isToday && !isSelected && "border-[var(--border)] font-semibold text-primary"
                  )}
                >
                  <span className={cn(isToday && "bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center")}>
                    {day}
                  </span>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-auto w-full">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: EVENT_TYPE_STYLES[e.event_type]?.color || "#ccc" }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[9px] leading-none text-[var(--fg-muted)] font-medium">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--fg)]">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <Button size="sm" variant="secondary" onClick={openCreateModal} className="h-8 px-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading events..." />
          ) : selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((event) => {
                const style = EVENT_TYPE_STYLES[event.event_type] || EVENT_TYPE_STYLES.study;
                return (
                  <div key={event.id} className="group rounded-md border border-[var(--border)] p-3.5 hover:border-primary/50 transition-colors relative">
                    <div className="flex items-center justify-between pr-10">
                      <p className="font-medium text-[var(--fg)]">{event.title}</p>
                      <Badge style={{ backgroundColor: `${style.color}1a`, color: style.color }}>
                        {style.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--fg-muted)] flex items-center gap-2">
                      {formatEventTime(event)}
                      {event.location && (
                         <>
                           <span>•</span>
                           <span className="truncate">{event.location}</span>
                         </>
                      )}
                    </p>
                    
                    <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button onClick={() => openEditModal(event)} className="p-1 text-[var(--fg-muted)] hover:text-primary rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="p-1 text-[var(--fg-muted)] hover:text-danger rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={CalendarIcon} title="No events scheduled." description="Enjoy your free time or add a new study session." />
          )}
        </Card>
      </div>

      {modalOpen && (
        <EventModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEvent}
          initialData={editingEvent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}
