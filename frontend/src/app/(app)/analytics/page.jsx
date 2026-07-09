"use client";

import { useState } from "react";
import { Clock, Flame, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { BarChart } from "@/components/analytics/BarChart";
import { ANALYTICS } from "@/constants/mockData";

export default function AnalyticsPage() {
  const [range, setRange] = useState("weekly");

  const chartData =
    range === "weekly"
      ? { data: ANALYTICS.weekly, xKey: "day", yKey: "hours" }
      : { data: ANALYTICS.monthly, xKey: "week", yKey: "hours" };

  return (
    <div>
      <PageHeader title="Analytics" description="Understand your productivity patterns over time." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Flame} label="Current Streak" value={`${ANALYTICS.studyStreak} days`} tone="warning" />
        <StatCard icon={CheckCircle2} label="Completed Tasks" value={ANALYTICS.completedTasks} tone="success" />
        <StatCard icon={XCircle} label="Missed Tasks" value={ANALYTICS.missedTasks} tone="danger" />
        <StatCard
          icon={Clock}
          label="Avg. Study Time"
          value={`${Math.round(ANALYTICS.averageStudyTimeMinutes / 60)}h ${ANALYTICS.averageStudyTimeMinutes % 60}m`}
          tone="info"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Study Hours</CardTitle>
            <Tabs
              tabs={[
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
              ]}
              defaultTab="weekly"
              onChange={setRange}
            />
          </CardHeader>
          <BarChart {...chartData} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <div className="flex flex-col items-center py-4">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg className="absolute h-full w-full -rotate-90">
                <circle cx="80" cy="80" r="64" strokeWidth="12" className="fill-none stroke-[var(--border)]" />
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className="fill-none stroke-success"
                  style={{
                    strokeDasharray: 2 * Math.PI * 64,
                    strokeDashoffset: 2 * Math.PI * 64 * (1 - ANALYTICS.completionPercentage / 100),
                  }}
                />
              </svg>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--fg)]">{ANALYTICS.completionPercentage}%</p>
                <p className="text-xs text-[var(--fg-muted)]">Completion</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>Up 6% from last week</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
