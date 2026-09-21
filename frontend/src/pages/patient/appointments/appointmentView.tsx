import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
  getMyAppointments,
  getAppointmentById,
  getEffectiveDate,
  getEffectiveTime,
  getRelativeDay,
  formatTime,
  STATUS_META,
  Appointment,
} from "./appointmentsData";
import { sessionManager } from "/@/utils/SessionManager";
import { ROUTES } from "/@/config/RoutePaths.js";
import { formatDate } from "/@/utils/FormatDate";

const DEFAULT_STUDENT_ID = "20230518-S";

const APPOINTMENTS_PATH = ROUTES.patient.dashboard.appointments;
const BOOK_PATH = `${APPOINTMENTS_PATH}/book`;

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3.5">
      <dt className="text-xs text-textMuted">{label}</dt>
      <dd className={`text-right text-sm font-medium text-textPrimary ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

export default function PatientAppointmentView() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const user = sessionManager.getUser();
  const sessionId = user?.user_id ?? "";
  const studentId = getMyAppointments(sessionId).length > 0 ? sessionId : DEFAULT_STUDENT_ID;

  // Handles either a route param (/view/:id) or a query string (?id=...),
  // since it isn't confirmed yet which one links to this page.
  const requestedId = params.id ?? searchParams.get("id") ?? undefined;

  const appointments = getMyAppointments(studentId);
  const appointment: Appointment | undefined = requestedId
    ? getAppointmentById(studentId, requestedId)
    : appointments[0];

  const handleBack = () => navigate(APPOINTMENTS_PATH);

  if (!appointment) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
        <p className="text-sm font-medium text-textPrimary">That appointment isn't in your list</p>
        <p className="mt-1 text-xs leading-relaxed text-textMuted">
          It may have been removed, or the link points to a different patient.
        </p>
        <button
          type="button"
          onClick={handleBack}
          className="mt-5 text-sm font-semibold text-primary hover:text-primaryDark"
        >
          Back to appointments
        </button>
      </div>
    );
  }

  const meta = STATUS_META[appointment.status];
  const date = getEffectiveDate(appointment);
  const relative = getRelativeDay(date);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <button
        type="button"
        onClick={handleBack}
        className="mb-5 inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs font-medium text-textMuted transition-colors hover:text-textPrimary"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Back to appointments
      </button>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Left — the record */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className={`h-1 w-full ${meta.rail}`} aria-hidden="true" />

          <div className="p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-textSecondary">
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>

            <h1 className="mt-3 font-heading text-2xl font-semibold leading-tight text-textPrimary">
              {appointment.type}
            </h1>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-textSecondary">{meta.hint}</p>

            <p className="mt-6 font-heading text-lg font-medium text-textPrimary">
              {formatDate(date)} at {formatTime(getEffectiveTime(appointment))}
            </p>
            {relative && <p className="mt-1 text-xs text-textMuted">{relative}</p>}

            {appointment.status === "rescheduled" && appointment.rescheduledTo && (
              <p className="mt-6 border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-textSecondary">
                The clinic moved this appointment. It was originally set for{" "}
                {formatDate(appointment.date)} at {formatTime(appointment.time)}.
              </p>
            )}

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs text-textMuted">Notes</p>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-textSecondary">
                {appointment.notes || "No additional notes for this appointment."}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => navigate(BOOK_PATH)}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-primaryDark"
              >
                {appointment.status === "rejected" ? "Submit a new request" : "Book another visit"}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-textPrimary transition-colors hover:border-primary/40 hover:text-primary"
              >
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Right — the facts, pinned alongside */}
        <aside className="lg:sticky lg:top-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-heading text-sm font-semibold text-textPrimary">Details</h2>

            <dl className="mt-2 divide-y divide-border">
              <Row label="Date" value={formatDate(date)} />
              <Row label="Time" value={formatTime(getEffectiveTime(appointment))} />
              <Row label="Type" value={appointment.type} />
              <Row label="Reference" value={appointment.id} mono />
              <Row label="Patient" value={studentId} mono />
            </dl>
          </div>

          <p className="mt-4 px-1 text-xs leading-relaxed text-textMuted">
            Bring your student ID. To cancel or move a confirmed slot, contact the clinic at least 24
            hours ahead.
          </p>
        </aside>
      </div>
    </div>
  );
}