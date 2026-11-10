import { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-surfaceMuted/30 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-textPrimary">{title}</p>
      {description && (
        <p className="max-w-md text-xs text-textMuted">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}