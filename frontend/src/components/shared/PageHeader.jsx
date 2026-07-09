export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--fg)]">{title}</h1>
        {description && <p className="mt-1 text-sm text-[var(--fg-muted)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
