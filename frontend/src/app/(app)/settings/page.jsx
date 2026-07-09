"use client";

import { useState } from "react";
import { Moon, Sun, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/Modal";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div>
      <PageHeader title="Settings" description="Configure how StudySync looks and behaves." />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3 sm:w-80">
            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center gap-2 rounded-md border p-4 ${
                theme === "dark" ? "border-primary bg-primary/5" : "border-[var(--border)]"
              }`}
            >
              <Moon className="h-5 w-5 text-[var(--fg)]" />
              <span className="text-sm font-medium text-[var(--fg)]">Dark</span>
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center gap-2 rounded-md border p-4 ${
                theme === "light" ? "border-primary bg-primary/5" : "border-[var(--border)]"
              }`}
            >
              <Sun className="h-5 w-5 text-[var(--fg)]" />
              <span className="text-sm font-medium text-[var(--fg)]">Light</span>
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Switch
              label="Enable notifications"
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />
            <Switch label="Sound effects" checked={soundEnabled} onChange={setSoundEnabled} />
            <p className="text-xs text-[var(--fg-muted)]">
              Notification preferences apply globally in the MVP — per-category controls are planned for
              Version 2.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
          </CardHeader>
          <form className="max-w-sm space-y-4">
            <Input label="Current password" type="password" placeholder="••••••••" />
            <Input label="New password" type="password" placeholder="••••••••" />
            <Button type="submit" variant="secondary">
              Update Password
            </Button>
          </form>
        </Card>

        <Card className="border-danger/30">
          <CardHeader>
            <CardTitle className="text-danger">Danger Zone</CardTitle>
          </CardHeader>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-[var(--fg-muted)]">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </Card>
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete your account?">
        <p className="text-sm text-[var(--fg-muted)]">
          This will permanently remove your tasks, goals, analytics, and achievements. This action cannot
          be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(false)}>
            Yes, delete my account
          </Button>
        </div>
      </Modal>
    </div>
  );
}
