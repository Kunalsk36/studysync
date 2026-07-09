export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[var(--border)] px-6 py-14 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
      <div>
        <p className="font-medium text-[var(--fg)]">{title}</p>
        {description && <p className="mt-1 text-sm text-[var(--fg-muted)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
