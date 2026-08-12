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
import { useConfirm } from "@/context/ConfirmContext";
import { useToast } from "@/context/ToastContext";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  
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
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-[var(--fg-muted)]">
              {completedHours}h of {targetHours}h
            </span>
            <span className="font-medium text-[var(--fg)]">{pct}%</span>
          </div>
          <ProgressBar value={pct} tone={goal.status === "completed" ? "success" : "primary"} />
        </div>

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
    </div>
  );
}
