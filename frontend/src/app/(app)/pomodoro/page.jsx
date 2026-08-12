"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Brain, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";
import { pomodoroService } from "@/services/pomodoroService";
import { taskService } from "@/services/taskService";
import { goalService } from "@/services/goalService";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const intervalRef = useRef(null);
  const toast = useToast();
  const { confirm } = useConfirm();

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await pomodoroService.getHistory();
      setHistory(res.data || []);
    } catch (err) {
      toast.showError("Failed to load session history.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await taskService.getTasks();
      const activeTasks = (res.data || []).filter(t => t.status !== "completed");
      setTasks(activeTasks);
    } catch (err) {
      // Non-critical, ignore
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await goalService.getGoals();
      const activeGoals = (res.data || []).filter(g => g.status === "active");
      setGoals(activeGoals);
    } catch (err) {
      // Non-critical, ignore
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchTasks();
    fetchGoals();
    
    // Restore from localStorage
    const savedSession = localStorage.getItem("pomodoro_session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.activeSessionId) {
          setActiveSessionId(parsed.activeSessionId);
          setSessionType(parsed.sessionType);
          
          if (parsed.taskId) setSelectedTaskId(parsed.taskId);
          if (parsed.goalId) setSelectedGoalId(parsed.goalId);
          
          if (parsed.running) {
            const elapsed = Math.floor((Date.now() - parsed.timestamp) / 1000);
            const remaining = Math.max(0, parsed.secondsLeft - elapsed);
            setSecondsLeft(remaining);
            setRunning(remaining > 0);
          } else {
            setSecondsLeft(parsed.secondsLeft);
            setRunning(false);
          }
        }
      } catch (e) {
        localStorage.removeItem("pomodoro_session");
      }
    }
  }, []);

  // Save session state to localStorage
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem("pomodoro_session", JSON.stringify({
        activeSessionId,
        sessionType,
        secondsLeft,
        running,
        taskId: selectedTaskId,
        goalId: selectedGoalId,
        timestamp: Date.now()
      }));
    } else {
      localStorage.removeItem("pomodoro_session");
    }
  }, [activeSessionId, sessionType, secondsLeft, running]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            handleEndSession("completed");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, activeSessionId]);

  const handleStartSession = async () => {
    // If resuming from pause, don't create a new session
    if (activeSessionId) {
      setRunning(true);
      return;
    }
    
    try {
      const res = await pomodoroService.startSession({
        taskId: selectedTaskId ? parseInt(selectedTaskId, 10) : undefined,
        goalId: selectedGoalId ? parseInt(selectedGoalId, 10) : undefined,
        sessionType,
        plannedMinutes: Math.round(DURATIONS[sessionType] / 60),
        startedAt: new Date().toISOString()
      });
      setActiveSessionId(res.data.id);
      setRunning(true);
    } catch (err) {
      toast.showError("Failed to start session.");
    }
  };

  const handleEndSession = async (status) => {
    if (!activeSessionId) return;
    
    try {
      const planned = DURATIONS[sessionType];
      const actualSeconds = planned - secondsLeft;
      const actualMinutes = Math.max(0, Math.round(actualSeconds / 60));
      
      await pomodoroService.endSession({
        sessionId: activeSessionId,
        actualMinutes,
        status,
        endedAt: new Date().toISOString()
      });
      
      setActiveSessionId(null);
      fetchHistory();
      
      if (status === "completed") {
        toast.showSuccess("Session completed! Great job.");
      }
    } catch (err) {
      toast.showError("Failed to save session.");
    }
  };

  const changeSession = async (value) => {
    if (activeSessionId) {
      const ok = await confirm({
        title: "Cancel Session?",
        message: "You have an active session. Changing types will cancel it.",
        confirmText: "Cancel Session",
        isDestructive: true
      });
      if (!ok) return;
      await handleEndSession("cancelled");
    }
    
    setSessionType(value);
    setSecondsLeft(DURATIONS[value]);
    setRunning(false);
  };

  const reset = async () => {
    if (activeSessionId) {
      const ok = await confirm({
        title: "Reset Timer?",
        message: "This will cancel your current session.",
        confirmText: "Reset",
        isDestructive: true
      });
      if (!ok) return;
      await handleEndSession("cancelled");
    }
    
    setSecondsLeft(DURATIONS[sessionType]);
    setRunning(false);
  };

  const handleDeleteHistory = async (id) => {
    const ok = await confirm({
      title: "Delete Session?",
      message: "Are you sure you want to delete this session from history?",
      confirmText: "Delete",
      isDestructive: true
    });
    if (!ok) return;

    try {
      await pomodoroService.deleteSession(id);
      toast.showSuccess("Session deleted.");
      fetchHistory();
    } catch (err) {
      toast.showError("Failed to delete session.");
    }
  };

  const handleClearHistory = async () => {
    const ok = await confirm({
      title: "Clear All History?",
      message: "Are you sure you want to permanently delete all your Pomodoro history?",
      confirmText: "Clear History",
      isDestructive: true
    });
    if (!ok) return;

    try {
      await pomodoroService.clearHistory();
      toast.showSuccess("History cleared.");
      fetchHistory();
    } catch (err) {
      toast.showError("Failed to clear history.");
    }
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
              <circle
                cx="112"
                cy="112"
                r="88"
                strokeWidth="10"
                className="fill-none stroke-[var(--border)]"
              />
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
            <Button size="lg" onClick={() => {
              if (running) {
                setRunning(false); // Pause
              } else {
                handleStartSession(); // Play
              }
            }} className="w-36">
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : (activeSessionId ? "Resume" : "Start")}
            </Button>
            <Button size="lg" variant="secondary" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 flex w-full max-w-lg flex-col gap-4 sm:flex-row sm:items-end sm:justify-center">
            <div className="flex-1">
              <label className="text-xs text-[var(--fg-muted)] mb-1 uppercase tracking-wider font-semibold">Study Goal</label>
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--fg)] focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={!!activeSessionId}
              >
                <option value="">No goal selected</option>
                {goals.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-xs text-[var(--fg-muted)] mb-1 uppercase tracking-wider font-semibold">Linked Task</label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--fg)] focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={!!activeSessionId}
              >
                <option value="">No task selected</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>
          
          {goals.length === 0 && !isLoadingHistory && (
             <p className="mt-4 text-xs text-[var(--fg-muted)] text-center">No study goals yet. You can start this session without a goal.</p>
          )}
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Session History</CardTitle>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearHistory} className="h-8 text-xs text-[var(--fg-muted)] hover:text-danger">
                Clear All
              </Button>
            )}
          </CardHeader>
          <div className="space-y-3">
            {isLoadingHistory ? (
              <LoadingSpinner text="Loading history..." />
            ) : history.length === 0 ? (
              <EmptyState 
                icon={Coffee}
                title="No history yet"
                description="Complete your first session to see it here."
              />
            ) : (
              history.slice(0, 10).map((session) => {
                // Ensure session type maps to our styles
                const style = SESSION_LABELS[session.session_type] || SESSION_LABELS.focus;
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-md border border-[var(--border)] p-3 group relative"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--fg)] flex items-center gap-2">
                        <style.icon className={`h-3 w-3 ${style.tone}`} />
                        {style.label}
                      </p>
                      <p className="text-xs text-[var(--fg-muted)] mt-1 truncate max-w-[120px]" title={session.task_title || session.status}>
                        {session.task_title || (session.status === 'completed' ? 'Completed' : session.status === 'interrupted' ? 'Interrupted' : 'Cancelled')}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-sm font-medium text-[var(--fg)]">{session.actual_minutes}m</p>
                      <p className="text-xs text-[var(--fg-muted)] mt-1">
                        {new Date(session.started_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteHistory(session.id)}
                      className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger/80"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
