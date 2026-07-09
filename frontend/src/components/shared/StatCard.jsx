import { Card } from "@/components/ui/Card";

const TONES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
};

export function StatCard({ icon: Icon, label, value, hint, tone = "primary" }) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm ${TONES[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-semibold text-[var(--fg)]">{value}</p>
        <p className="truncate text-xs text-[var(--fg-muted)]">{label}</p>
        {hint && <p className="text-[11px] text-[var(--fg-muted)]">{hint}</p>}
      </div>
    </Card>
  );
}
