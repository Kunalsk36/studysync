"use client";

import { Plus, Target } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { STUDY_GOALS } from "@/constants/mockData";

export default function GoalsPage() {
  const active = STUDY_GOALS.filter((g) => g.status === "active");
  const completed = STUDY_GOALS.filter((g) => g.status === "completed");

  return (
    <div>
      <PageHeader
        title="Study Goals"
        description="Long-term objectives that keep your daily tasks pointed in the right direction."
        action={
          <Button>
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        }
      />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
        Active
      </h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {active.map((goal) => {
          const pct = Math.round((goal.completedHours / goal.targetHours) * 100);
          return (
            <Card key={goal.id}>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <Badge tone="info">Due {goal.targetDate}</Badge>
              </div>
              <h3 className="mt-3 font-semibold text-[var(--fg)]">{goal.title}</h3>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{goal.description}</p>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-[var(--fg-muted)]">
                    {goal.completedHours}h of {goal.targetHours}h
                  </span>
                  <span className="font-medium text-[var(--fg)]">{pct}%</span>
                </div>
                <ProgressBar value={pct} />
              </div>
            </Card>
          );
        })}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
        Completed
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {completed.map((goal) => (
          <Card key={goal.id} className="opacity-75">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--fg)]">{goal.title}</h3>
              <Badge tone="success">Completed</Badge>
            </div>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">{goal.description}</p>
            <ProgressBar value={100} tone="success" className="mt-4" />
          </Card>
        ))}
      </div>
    </div>
  );
}
