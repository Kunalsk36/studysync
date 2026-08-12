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
      {action && (
        <div className="mt-2">
          {action.label && action.onClick ? (
            <button
              onClick={action.onClick}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              {action.label}
            </button>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
}
