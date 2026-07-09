"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ListTodo,
  Flame,
  Clock,
  Target,
  Plus,
  Timer,
  CalendarDays,
  BarChart3,
  Quote,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { TaskItem } from "@/components/tasks/TaskItem";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  TASKS,
  CALENDAR_EVENTS,
  ANALYTICS,
  CURRENT_USER,
  EVENT_TYPE_STYLES,
} from "@/constants/mockData";

const QUICK_ACTIONS = [
  { label: "Create Task", href: "/tasks", icon: Plus },
  { label: "Start Pomodoro", href: "/pomodoro", icon: Timer },
  { label: "Open Calendar", href: "/calendar", icon: CalendarDays },
  { label: "View Analytics", href: "/analytics", icon: BarChart3 },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState(TASKS.filter((t) => t.status !== "completed").slice(0, 4));

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
      )
    );
  };

  const upcomingEvents = CALENDAR_EVENTS.slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${CURRENT_USER.name.split(" ")[0]} 👋`}
        description="Here's what's on your plate today."
      />

      {/* Quick actions */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-2.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm font-medium text-[var(--fg)] transition-colors hover:border-primary hover:bg-primary/5"
          >
            <action.icon className="h-4 w-4 text-primary" />
            {action.label}
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Study Hours Today"
          value={`${ANALYTICS.studyHoursToday}h`}
          tone="primary"
        />
        <StatCard
          icon={Flame}
          label="Study Streak"
          value={`${ANALYTICS.studyStreak} days`}
          tone="warning"
        />
        <StatCard
          icon={ListTodo}
          label="Tasks Completed"
          value={ANALYTICS.completedTasks}
          tone="success"
        />
        <StatCard
          icon={Target}
          label="Weekly Progress"
          value={`${ANALYTICS.completionPercentage}%`}
          tone="info"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's tasks */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Tasks</CardTitle>
              <Link href="/tasks" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} compact />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ListTodo}
                title="No tasks scheduled for today."
                description="Create your first task to start planning."
                action={
                  <Button href="/tasks" size="sm">
                    Create your first task
                  </Button>
                }
              />
            )}
          </Card>

          <Card className="bg-primary/5">
            <div className="flex items-start gap-3">
              <Quote className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-[var(--fg)]">
                  &ldquo;Consistency is what transforms average into excellence.&rdquo;
                </p>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">Your daily motivation</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Goals + calendar widget */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Goals</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-[var(--fg-muted)]">Daily Goal</span>
                  <span className="font-medium text-[var(--fg)]">
                    {ANALYTICS.studyHoursToday}h / {ANALYTICS.dailyGoalHours}h
                  </span>
                </div>
                <ProgressBar value={(ANALYTICS.studyHoursToday / ANALYTICS.dailyGoalHours) * 100} />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-[var(--fg-muted)]">Weekly Goal</span>
                  <span className="font-medium text-[var(--fg)]">
                    {ANALYTICS.weeklyCompletedHours}h / {ANALYTICS.weeklyGoalHours}h
                  </span>
                </div>
                <ProgressBar
                  tone="info"
                  value={(ANALYTICS.weeklyCompletedHours / ANALYTICS.weeklyGoalHours) * 100}
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
              <Link href="/calendar" className="text-sm font-medium text-primary hover:underline">
                Calendar
              </Link>
            </CardHeader>
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const style = EVENT_TYPE_STYLES[event.type];
                return (
                  <div key={event.id} className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: style.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--fg)]">{event.title}</p>
                      <p className="text-xs text-[var(--fg-muted)]">
                        {event.date} · {event.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
