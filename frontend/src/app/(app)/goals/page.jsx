"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Target, Trash2, Edit, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { goalService } from "@/services/goalService";
import { GoalModal } from "@/components/goals/GoalModal";
import { ManualStudyEntryModal } from "@/components/goals/ManualStudyEntryModal";
import { useConfirm } from "@/context/ConfirmContext";
import { useToast } from "@/context/ToastContext";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [editingManualEntry, setEditingManualEntry] = useState(null);
  const [activeGoalForManual, setActiveGoalForManual] = useState(null);
  
  const [expandedGoals, setExpandedGoals] = useState({});

  const { confirm } = useConfirm();
  const toast = useToast();

  const fetchGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await goalService.getGoals();
      setGoals(res.data || []);
    } catch (err) {
      setError("Failed to load study goals.");
      toast.showError("Failed to load study goals.");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSaveGoal = async (data, id) => {
    try {
      if (id) {
        await goalService.updateGoal(id, data);
        toast.showSuccess("Goal updated successfully.");
      } else {
        await goalService.createGoal(data);
        toast.showSuccess("Goal created successfully.");
      }
      fetchGoals();
    } catch (err) {
      toast.showError(err.message || "Failed to save goal.");
      throw err;
    }
  };

  const handleDeleteGoal = async (id) => {
    const isConfirmed = await confirm({
      title: "Delete Study Goal?",
      message: "Are you sure you want to delete this study goal? Associated goal progress will be affected according to system rules.",
      confirmText: "Delete",
      isDestructive: true
    });
    if (!isConfirmed) return;

    try {
      await goalService.deleteGoal(id);
      toast.showSuccess("Goal deleted successfully.");
      fetchGoals();
    } catch (err) {
      toast.showError(err.message || "Failed to delete goal.");
    }
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const openCreateManualModal = (goal) => {
    setActiveGoalForManual(goal);
    setEditingManualEntry(null);
    setManualModalOpen(true);
  };

  const openEditManualModal = (goal, entry) => {
    setActiveGoalForManual(goal);
    setEditingManualEntry(entry);
    setManualModalOpen(true);
  };

  const handleSaveManualEntry = async (data, id) => {
    if (!activeGoalForManual) return;
    try {
      if (id) {
        await goalService.updateManualEntry(activeGoalForManual.id, id, data);
        toast.showSuccess("Study time updated.");
      } else {
        await goalService.createManualEntry(activeGoalForManual.id, data);
        toast.showSuccess("Study time logged.");
      }
      fetchGoals(); // Refresh goal progress
      setExpandedGoals(prev => ({ ...prev, [activeGoalForManual.id]: { ...prev[activeGoalForManual.id], refreshToggle: !prev[activeGoalForManual.id]?.refreshToggle } }));
    } catch (err) {
      toast.showError(err.message || "Failed to save study time.");
      throw err;
    }
  };

  const handleDeleteManualEntry = async (goal, entryId) => {
    const isConfirmed = await confirm({
      title: "Delete study-time entry?",
      message: "Removing this entry will reduce the recorded study time for this goal.",
      confirmText: "Delete",
      isDestructive: true
    });
    if (!isConfirmed) return;

    try {
      await goalService.deleteManualEntry(goal.id, entryId);
      toast.showSuccess("Study time deleted.");
      fetchGoals(); // Refresh goal progress
      setExpandedGoals(prev => ({ ...prev, [goal.id]: { ...prev[goal.id], refreshToggle: !prev[goal.id]?.refreshToggle } }));
    } catch (err) {
      toast.showError(err.message || "Unable to delete study-time entry.");
    }
  };

  const toggleExpandGoal = (goalId) => {
    setExpandedGoals(prev => ({
      ...prev,
      [goalId]: prev[goalId] ? null : { refreshToggle: false }
    }));
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Study Goals" description="Loading your goals..." />
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner text="Fetching study goals..." />
        </div>
      </div>
    );
  }

  if (error && goals.length === 0) {
    return (
      <div>
        <PageHeader title="Study Goals" description="Error loading goals" />
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <AlertCircle className="mb-4 h-10 w-10 text-danger" />
          <p className="mb-4 text-[var(--fg-muted)]">{error}</p>
          <Button onClick={fetchGoals}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div>
        <PageHeader title="Study Goals" description="Long-term objectives that keep your daily tasks pointed in the right direction." />
        <EmptyState
          icon={Target}
          title="No study goals yet"
          description="Create your first study goal to start tracking your progress."
          action={{
            label: "Create Goal",
            onClick: openCreateModal
          }}
        />
        <GoalModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveGoal}
          initialData={editingGoal}
        />
      </div>
    );
  }

  const active = goals.filter((g) => g.status === "active");
  const completed = goals.filter((g) => g.status === "completed");
  const cancelled = goals.filter((g) => g.status === "cancelled");

  const renderGoalCard = (goal, isMuted = false) => {
    const completedHours = goal.total_completed_hours || 0;
    const targetHours = goal.target_hours;
    const pct = goal.progress_percentage || 0;
    const pomodoroHours = goal.pomodoro_hours || 0;
    const manualHours = goal.manual_hours || 0;
    const isExpanded = !!expandedGoals[goal.id];

    return (
      <Card key={goal.id} className={`relative group ${isMuted ? 'opacity-75' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col items-end gap-1">
            {goal.status === "active" && goal.target_date && (
              <Badge tone="info">Due {new Date(goal.target_date).toLocaleDateString()}</Badge>
            )}
            {goal.status === "completed" && <Badge tone="success">Completed</Badge>}
            {goal.status === "cancelled" && <Badge tone="neutral">Cancelled</Badge>}
          </div>
        </div>
        
        <div className="mt-3 pr-12">
          <h3 className="font-semibold text-[var(--fg)] break-words">{goal.title}</h3>
          {goal.description && <p className="mt-1 text-sm text-[var(--fg-muted)] line-clamp-2 break-words">{goal.description}</p>}
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[var(--fg-muted)]">
              {completedHours} / {targetHours} hours
            </span>
            <span className="font-medium text-[var(--fg)]">{pct}%</span>
          </div>
          <ProgressBar value={pct} tone={goal.status === "completed" ? "success" : "primary"} />
          
          <div className="mt-3 flex items-center justify-between text-xs text-[var(--fg-muted)] bg-[var(--bg-card)] rounded p-2 border border-[var(--border)]">
            <span>Pomodoro: {pomodoroHours}h</span>
            <span>Manual: {manualHours}h</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {goal.status === "active" && (
            <Button size="sm" variant="secondary" onClick={() => openCreateManualModal(goal)}>
              Log Study Time
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => toggleExpandGoal(goal.id)}>
            {isExpanded ? "Hide Entries" : "View Entries"}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <GoalManualEntries 
              goal={goal} 
              refreshToggle={expandedGoals[goal.id]?.refreshToggle}
              onEdit={(entry) => openEditManualModal(goal, entry)}
              onDelete={(entryId) => handleDeleteManualEntry(goal, entryId)}
            />
          </div>
        )}

        <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:flex-row">
          <button
            onClick={() => openEditModal(goal)}
            className="rounded-full bg-[var(--surface)] p-2 text-[var(--fg-muted)] shadow-sm hover:text-primary border border-[var(--border)]"
            title="Edit Goal"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDeleteGoal(goal.id)}
            className="rounded-full bg-[var(--surface)] p-2 text-[var(--fg-muted)] shadow-sm hover:text-danger border border-[var(--border)]"
            title="Delete Goal"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </Card>
    );
  };

  return (
    <div>
      <PageHeader
        title="Study Goals"
        description="Long-term objectives that keep your daily tasks pointed in the right direction."
        action={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        }
      />

      {active.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
            Active
          </h2>
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            {active.map((goal) => renderGoalCard(goal))}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
            Completed
          </h2>
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            {completed.map((goal) => renderGoalCard(goal, true))}
          </div>
        </>
      )}

      {cancelled.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
            Cancelled
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {cancelled.map((goal) => renderGoalCard(goal, true))}
          </div>
        </>
      )}

      <GoalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveGoal}
        initialData={editingGoal}
      />
      <ManualStudyEntryModal
        open={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onSave={handleSaveManualEntry}
        initialData={editingManualEntry}
      />
    </div>
  );
}

function GoalManualEntries({ goal, refreshToggle, onEdit, onDelete }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await goalService.getManualEntries(goal.id);
        setEntries(res.data || []);
      } catch (err) {
        setError("Unable to load study-time entries.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [goal.id, refreshToggle]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <LoadingSpinner text="Loading entries..." />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-danger text-center p-2">{error}</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center p-4 text-sm text-[var(--fg-muted)]">
        No manual study time recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
      {entries.map((entry) => (
        <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded border border-[var(--border)] bg-[var(--surface)] text-sm group">
          <div className="flex flex-col mb-2 sm:mb-0">
            <span className="font-medium text-[var(--fg)]">
              {new Date(entry.entry_date).toLocaleDateString()} — {entry.minutes} min
            </span>
            {entry.notes && (
              <span className="text-[var(--fg-muted)] text-xs mt-0.5 line-clamp-1" title={entry.notes}>
                {entry.notes}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(entry)}
              className="text-[var(--fg-muted)] hover:text-primary p-1"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => onDelete(entry.id)}
              className="text-[var(--fg-muted)] hover:text-danger p-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
