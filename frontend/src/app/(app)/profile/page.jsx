"use client";

import { useState } from "react";
import { Camera, Flame, ListChecks, Trophy } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/shared/StatCard";
import { CURRENT_USER, ANALYTICS, ACHIEVEMENTS } from "@/constants/mockData";

export default function ProfilePage() {
  const [name, setName] = useState(CURRENT_USER.name);
  const [dailyGoal, setDailyGoal] = useState(CURRENT_USER.dailyGoalHours);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your personal information and productivity goals."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Flame}
          label="Study Streak"
          value={`${ANALYTICS.studyStreak} days`}
          tone="warning"
        />
        <StatCard
          icon={ListChecks}
          label="Tasks Completed"
          value={ANALYTICS.completedTasks}
          tone="success"
        />
        <StatCard
          icon={Trophy}
          label="Achievements"
          value={`${ACHIEVEMENTS.filter((a) => a.earned).length}`}
          tone="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center py-8 text-center lg:col-span-1">
          <div className="relative">
            <Avatar initials={CURRENT_USER.avatarInitials} size="xl" />
            <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-primary text-white">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 font-semibold text-[var(--fg)]">{name}</p>
          <p className="text-sm text-[var(--fg-muted)]">{CURRENT_USER.email}</p>
          <p className="mt-1 text-xs capitalize text-[var(--fg-muted)]">{CURRENT_USER.userType}</p>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
            <Input label="Email address" value={CURRENT_USER.email} disabled />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Daily study goal (hours)"
                type="number"
                min="0.5"
                step="0.5"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--fg)]">Preferred study time</label>
                <select
                  defaultValue="evening"
                  className="h-11 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              {saved && <span className="text-sm font-medium text-success">Profile updated.</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
