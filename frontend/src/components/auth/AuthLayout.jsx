import Link from "next/link";
import { GraduationCap, ListChecks, Flame, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const HIGHLIGHTS = [
  { icon: ListChecks, text: "Organize tasks, exams, and deadlines in one workspace" },
  { icon: Flame, text: "Build streaks with focused Pomodoro sessions" },
  { icon: Sparkles, text: "Get AI-assisted study schedules, always in your control" },
];

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <Link href="/" className="relative flex items-center gap-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/15">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">StudySync</span>
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Everything you need to stay consistent, in one workspace.
          </h2>
          <div className="mt-8 space-y-4">
            {HIGHLIGHTS.map((h) => (
              <div key={h.text} className="flex items-center gap-3 text-white/90">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white/15">
                  <h.icon className="h-4 w-4" />
                </div>
                <p className="text-sm">{h.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/60">© 2026 StudySync</p>
      </div>

      <div className="flex flex-col px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-[var(--fg)]">StudySync</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-[var(--fg)]">{title}</h1>
            <p className="mt-1.5 text-sm text-[var(--fg-muted)]">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
