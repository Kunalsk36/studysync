"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { POMODORO_HISTORY } from "@/constants/mockData";

const DURATIONS = { focus: 25 * 60, short_break: 5 * 60, long_break: 15 * 60 };
const SESSION_LABELS = {
  focus: { label: "Focus Session", icon: Brain, tone: "text-primary" },
  short_break: { label: "Short Break", icon: Coffee, tone: "text-success" },
  long_break: { label: "Long Break", icon: Coffee, tone: "text-info" },
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroPage() {
  const [sessionType, setSessionType] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const changeSession = (value) => {
    setSessionType(value);
    setSecondsLeft(DURATIONS[value]);
    setRunning(false);
  };

  const reset = () => {
    setSecondsLeft(DURATIONS[sessionType]);
    setRunning(false);
  };

  const total = DURATIONS[sessionType];
  const progress = 1 - secondsLeft / total;
  const circumference = 2 * Math.PI * 88;
  const { label, icon: Icon, tone } = SESSION_LABELS[sessionType];

  return (
    <div>
      <PageHeader title="Pomodoro Timer" description="Focused work sessions, structured breaks." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center py-10 lg:col-span-2">
          <Tabs
            tabs={[
              { value: "focus", label: "Focus" },
              { value: "short_break", label: "Short Break" },
              { value: "long_break", label: "Long Break" },
            ]}
            defaultTab="focus"
            onChange={changeSession}
          />

          <div className="relative my-10 flex h-56 w-56 items-center justify-center">
            <svg className="absolute h-full w-full -rotate-90">
              <circle cx="112" cy="112" r="88" strokeWidth="10" className="fill-none stroke-[var(--border)]" />
              <motion.circle
                cx="112"
                cy="112"
                r="88"
                strokeWidth="10"
                strokeLinecap="round"
                className="fill-none stroke-primary"
                style={{ strokeDasharray: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - progress) }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="flex flex-col items-center">
              <Icon className={`mb-2 h-5 w-5 ${tone}`} />
              <span className="text-5xl font-bold tabular-nums text-[var(--fg)]">
                {formatTime(secondsLeft)}
              </span>
              <span className="mt-1 text-sm text-[var(--fg-muted)]">{label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="lg" onClick={() => setRunning((r) => !r)} className="w-36">
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : "Start"}
            </Button>
            <Button size="lg" variant="secondary" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-[var(--fg-muted)]">Linked task: Complete React Course</p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {POMODORO_HISTORY.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-md border border-[var(--border)] p-3">
                <div>
                  <p className="text-sm font-medium text-[var(--fg)]">
                    {SESSION_LABELS[session.type].label}
                  </p>
                  <p className="text-xs text-[var(--fg-muted)]">{session.task || "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--fg)]">{session.minutes}m</p>
                  <p className="text-xs text-[var(--fg-muted)]">{session.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
