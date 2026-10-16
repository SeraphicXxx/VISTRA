import type { ReactNode } from "react";
import type {
  PatientClassification,
  PersonalInfo,
} from "./patient.sample";

export const ID_LABELS: Record<PatientClassification, string> = {
  student: "Student ID",
  faculty: "Faculty ID",
  staff: "Admin ID",
};

export function display(value?: string | number | null): string {
  if (value === undefined || value === null || String(value).trim() === "") {
    return "—";
  }
  return String(value);
}

export function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function ProfileHeader({
  name,
  classification,
  patient_id,
  course,
}: PersonalInfo) {
  const classificationLabel =
    classification.charAt(0).toUpperCase() + classification.slice(1);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 sm:flex-row sm:items-center sm:p-6">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
        {getInitials(name)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-textPrimary">{name}</h2>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {classificationLabel}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-textMuted">
          <span>
            <span className="font-semibold text-primary/70">ID:</span>{" "}
            {patient_id}
          </span>

          {classification === "student" && (
            <span>
              <span className="font-semibold text-primary/70">Course:</span>{" "}
              {display(course)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 px-4 py-3">
      <p className="mb-1 text-xs font-medium text-textMuted">{label}</p>
      <p className="break-words text-sm font-semibold text-textPrimary">
        {display(value)}
      </p>
    </div>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}

export function InfoCard({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-textPrimary sm:text-base">
          {title}
        </h3>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-textMuted transition hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            Edit
          </button>
        )}
      </div>

      {children}
    </section>
  );
}