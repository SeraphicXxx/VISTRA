import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyAppointments,
  sortAppointments,
  isUpcoming,
  getEffectiveDate,
  getEffectiveTime,
  getRelativeDay,
  formatTime,
  STATUS_META,
  Appointment,
  AppointmentStatus,
} from "./appointmentsData";
import { sessionManager } from "/@/utils/SessionManager";
import { ROUTES } from "/@/config/RoutePaths.js";
import { formatDate } from "/@/utils/FormatDate";

const DEFAULT_STUDENT_ID = "20230518-S";


const APPOINTMENTS_PATH = ROUTES.patient.dashboard.appointments;
const BOOK_PATH = `${APPOINTMENTS_PATH}/book`;
const viewPath = (id: string) => `${APPOINTMENTS_PATH}/view/${id}`;

type Filter = "upcoming" | "all" | AppointmentStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "all", label: "All" },
];

function matchesFilter(appointment: Appointment, filter: Filter) {
  if (filter === "all") return true;
  if (filter === "upcoming") return isUpcoming(appointment);
  return appointment.status === filter;
}

/** "18 Sep" split into its parts, for the date block on each row. */
function splitDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return { day: "--", month: "" };
  return {
    day: String(parsed.getDate()).padStart(2, "0"),
    month: parsed.toLocaleDateString(undefined, { month: "short" }),
  };
}

function StatusLabel({ status, className = "" }: { status: AppointmentStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-textSecondary ${className}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */

function AppointmentRow({
  appointment,
  isSelected,
  onActivate,
}: {
  appointment: Appointment;
  isSelected: boolean;
  onActivate: () => void;
}) {
  const date = getEffectiveDate(appointment);
  const { day, month } = splitDate(date);
  const relative = getRelativeDay(date);

  return (
    <button
      type="button"
      onClick={onActivate}
      aria-current={isSelected ? "true" : undefined}
      className={`group flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
        isSelected
          ? "border-primary/40 bg-primary/[0.04]"
          : "border-border bg-surface hover:bg-surfaceMuted/40"
      }`}
    >
      <span className="flex w-11 shrink-0 flex-col items-center border-r border-border pr-4">
        <span className="font-heading text-lg font-semibold leading-none text-textPrimary">{day}</span>
        <span className="mt-1 text-[11px] text-textMuted">{month}</span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-textPrimary">{appointment.type}</span>
        <span className="mt-1 block text-xs text-textMuted">
          {formatTime(getEffectiveTime(appointment))}
          {relative ? ` · ${relative}` : ""}
        </span>
      </span>

      <StatusLabel status={appointment.status} className="shrink-0" />
    </button>
  );
}

function DetailPreview({ appointment, onOpen }: { appointment: Appointment; onOpen: () => void }) {
  const meta = STATUS_META[appointment.status];

  return (
    <div className="p-6">
      <StatusLabel status={appointment.status} />

      <h2 className="mt-3 font-heading text-lg font-semibold leading-snug text-textPrimary">
        {appointment.type}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-textSecondary">{meta.hint}</p>

      <dl className="mt-6 divide-y divide-border border-y border-border">
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-xs text-textMuted">Date</dt>
          <dd className="text-right text-sm font-medium text-textPrimary">
            {formatDate(getEffectiveDate(appointment))}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-xs text-textMuted">Time</dt>
          <dd className="text-right text-sm font-medium text-textPrimary">
            {formatTime(getEffectiveTime(appointment))}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-xs text-textMuted">Reference</dt>
          <dd className="text-right font-mono text-sm text-textPrimary">{appointment.id}</dd>
        </div>
      </dl>

      {appointment.status === "rescheduled" && appointment.rescheduledTo && (
        <p className="mt-4 border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-textSecondary">
          Moved from {formatDate(appointment.date)} at {formatTime(appointment.time)}.
        </p>
      )}

      {appointment.notes && (
        <div className="mt-5">
          <p className="text-xs text-textMuted">Notes from the clinic</p>
          <p className="mt-1.5 text-sm leading-relaxed text-textSecondary">{appointment.notes}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onOpen}
        className="mt-6 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-textPrimary transition-colors hover:border-primary/40 hover:text-primary"
      >
        Open full details
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function PatientAppointments() {
  const navigate = useNavigate();

  const user = sessionManager.getUser();
  const sessionId = user?.user_id ?? "";
  const studentId = getMyAppointments(sessionId).length > 0 ? sessionId : DEFAULT_STUDENT_ID;

  const all = useMemo(() => sortAppointments(getMyAppointments(studentId)), [studentId]);

  const [filter, setFilter] = useState<Filter>("upcoming");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(() => all.filter((a) => matchesFilter(a, filter)), [all, filter]);
  const selected = visible.find((a) => a.id === selectedId) ?? visible[0];

  const counts = useMemo(
    () => ({
      upcoming: all.filter((a) => isUpcoming(a)).length,
      pending: all.filter((a) => a.status === "pending").length,
      approved: all.filter((a) => a.status === "approved").length,
      rejected: all.filter((a) => a.status === "rejected").length,
      rescheduled: all.filter((a) => a.status === "rescheduled").length,
      all: all.length,
    }),
    [all],
  );

  // Below `lg` there's no preview panel, so a tap goes straight to the detail
  // page instead of selecting a row nothing will display.
  const handleActivate = (id: string) => {
    const hasPreview =
      typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
    if (hasPreview) setSelectedId(id);
    else navigate(viewPath(id));
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold text-textPrimary">My appointments</h1>
          <p className="mt-1 text-sm text-textMuted">
            {counts.upcoming > 0
              ? `${counts.upcoming} upcoming · ${counts.pending} waiting on the clinic`
              : "Nothing scheduled right now."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(BOOK_PATH)}
          className="w-fit rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-primaryDark"
        >
          Book appointment
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Left — the list */}
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((option) => {
              const active = filter === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    setFilter(option.key);
                    setSelectedId(null);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "text-textMuted hover:bg-surfaceMuted hover:text-textPrimary"
                  }`}
                >
                  {option.label}{" "}
                  <span className={active ? "text-white/70" : "text-textMuted"}>
                    {counts[option.key as keyof typeof counts] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2.5">
            {visible.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
                <p className="text-sm font-medium text-textPrimary">Nothing in this view</p>
                <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-textMuted">
                  Book a slot and it will appear here as soon as you submit it.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(BOOK_PATH)}
                  className="mt-4 text-sm font-semibold text-primary hover:text-primaryDark"
                >
                  Book an appointment
                </button>
              </div>
            ) : (
              visible.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  isSelected={selected?.id === appointment.id}
                  onActivate={() => handleActivate(appointment.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right — detail preview, pinned on desktop */}
        <aside className="hidden lg:sticky lg:top-6 lg:block">
          <div className="rounded-2xl border border-border bg-surface shadow-sm">
            {selected ? (
              <DetailPreview appointment={selected} onOpen={() => navigate(viewPath(selected.id))} />
            ) : (
              <p className="px-6 py-14 text-center text-sm text-textMuted">
                Select an appointment to see its details.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}