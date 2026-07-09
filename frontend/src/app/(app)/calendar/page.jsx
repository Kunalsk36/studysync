"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarDays as CalendarIcon } from "lucide-react";
import { CALENDAR_EVENTS, EVENT_TYPE_STYLES } from "@/constants/mockData";
import { cn } from "@/utils/cn";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  const [cursor, setCursor] = useState(new Date(2026, 6, 1)); // July 2026 — matches mock event dates
  const [selectedDate, setSelectedDate] = useState(toKey(2026, 6, 11));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const event of CALENDAR_EVENTS) {
      map[event.date] = map[event.date] || [];
      map[event.date].push(event);
    }
    return map;
  }, []);

  const changeMonth = (delta) => {
    setCursor(new Date(year, month + delta, 1));
  };

  const selectedEvents = eventsByDate[selectedDate] || [];
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const today = new Date(2026, 6, 8);

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Exams, interviews, deadlines, and study sessions — all in one view."
        action={
          <Button size="sm">
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
              const isToday = key === toKey(today.getFullYear(), today.getMonth(), today.getDate());

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-start gap-1 rounded-sm border p-1.5 text-sm transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-[var(--fg)] hover:bg-[var(--border)]/40",
                    isToday && !isSelected && "border-[var(--border)] font-semibold"
                  )}
                >
                  <span>{day}</span>
                  <div className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: EVENT_TYPE_STYLES[e.type].color }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-[var(--fg)]">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>

          {selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((event) => {
                const style = EVENT_TYPE_STYLES[event.type];
                return (
                  <div key={event.id} className="rounded-md border border-[var(--border)] p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[var(--fg)]">{event.title}</p>
                      <Badge style={{ backgroundColor: `${style.color}1a`, color: style.color }}>
                        {style.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--fg-muted)]">{event.time}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={CalendarIcon} title="No events scheduled." />
          )}
        </Card>
      </div>
    </div>
  );
}
