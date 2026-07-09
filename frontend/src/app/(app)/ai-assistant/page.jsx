"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Check, X, History } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AI_HISTORY, SUGGESTED_AI_PROMPTS } from "@/constants/mockData";

const MOCK_RESPONSE =
  "Here's a suggested plan based on your current tasks:\n\nMon: React Course (1.5h) • DSA Arrays (1h)\nTue: Aptitude Practice (1h) • React Course (1h)\nWed: Mock Interview Prep (1h)\nThu: React Project (2h)\nFri: Review + light revision (1h)\n\nThis prioritizes your React Course deadline while keeping interview prep on track.";

export default function AiAssistantPage() {
  const [thread, setThread] = useState(AI_HISTORY);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const submit = (text) => {
    const value = text ?? prompt;
    if (!value.trim() || generating) return;
    setPrompt("");
    setGenerating(true);
    // Visual-only: simulates the "Generating Suggestions..." loading state (01-PRD.md §34).
    setTimeout(() => {
      setThread((prev) => [
        {
          id: Date.now(),
          prompt: value,
          response: MOCK_RESPONSE,
          createdAt: "Just now",
          applied: null,
        },
        ...prev,
      ]);
      setGenerating(false);
    }, 1400);
  };

  const respond = (id, applied) => {
    setThread((prev) => prev.map((t) => (t.id === id ? { ...t, applied } : t)));
  };

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Optional suggestions to help you plan — nothing changes without your approval."
      />

      <Card className="mb-6">
        <div className="flex items-center gap-2 rounded-sm border border-[var(--border)] bg-[var(--background)] p-2">
          <Sparkles className="ml-2 h-4 w-4 shrink-0 text-primary" />
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ask StudySync to plan your week, estimate a task, or suggest priorities..."
            className="h-9 flex-1 bg-transparent text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
          />
          <Button size="sm" onClick={() => submit()} loading={generating}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED_AI_PROMPTS.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--fg-muted)] hover:border-primary hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
        <History className="h-4 w-4" />
        History
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {generating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--fg-muted)]"
            >
              <Sparkles className="h-4 w-4 animate-pulse text-primary" />
              Generating suggestions...
            </motion.div>
          )}
        </AnimatePresence>

        {thread.map((item) => (
          <Card key={item.id}>
            <p className="text-sm font-medium text-[var(--fg-muted)]">You asked</p>
            <p className="mt-1 text-[var(--fg)]">{item.prompt}</p>
            <div className="my-4 h-px bg-[var(--border)]" />
            <p className="whitespace-pre-line text-sm text-[var(--fg)]">{item.response}</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-[var(--fg-muted)]">{item.createdAt}</span>
              {item.applied === null || item.applied === undefined ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => respond(item.id, false)}>
                    <X className="h-3.5 w-3.5" />
                    Ignore
                  </Button>
                  <Button size="sm" onClick={() => respond(item.id, true)}>
                    <Check className="h-3.5 w-3.5" />
                    Apply
                  </Button>
                </div>
              ) : (
                <span
                  className={`text-xs font-medium ${item.applied ? "text-success" : "text-[var(--fg-muted)]"}`}
                >
                  {item.applied ? "Applied to schedule" : "Dismissed"}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
