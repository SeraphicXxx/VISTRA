interface InfoFieldProps {
    label?: string;
    value?: string;
    span?: string;
}

export function InfoField({ label, value, span }: InfoFieldProps) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-textMuted">{label}</p>
      <p className="text-sm text-textPrimary">{value || "—"}</p>
    </div>
  );
}

export { getInitials } from "./getInitials";