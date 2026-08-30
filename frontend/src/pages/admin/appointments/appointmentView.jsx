import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Hourglass,
  RotateCcw,
} from "lucide-react";

const exampleAppointment = {
  id: "APT-1042",
  student: "Kenji Chua",
  course: "BS Computer Science",
  time: "9:00 AM",
  type: "Medical Consultation",
  status: "pending",
};

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const STATUS_META = {
  pending: {
    label: "Pending",
    icon: Hourglass,
    text: "text-warning",
    chip: "bg-warning/10",
    dot: "bg-warning",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    text: "text-success",
    chip: "bg-success/10",
    dot: "bg-success",
  },
  declined: {
    label: "Declined",
    icon: XCircle,
    text: "text-danger",
    chip: "bg-danger/10",
    dot: "bg-danger",
  },
};

function InfoStat({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-textMuted">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-textPrimary">{value || "—"}</p>
    </div>
  );
}

export default function AppointmentDetailView({
  appointment = exampleAppointment,
  onBack,
  onStatusChange,
}) {
  const [status, setStatus] = useState(appointment.status);
  const [decliningReason, setDecliningReason] = useState(false);
  const [reason, setReason] = useState("");

  const meta = STATUS_META[status];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const applyStatus = (next, extra) => {
    setStatus(next);
    setDecliningReason(false);
    onStatusChange?.(appointment.id, next, extra);
  };

  const confirmDecline = () => {
    applyStatus("declined", reason.trim() || undefined);
    setReason("");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          {/* Header */}
          <div className="p-6 sm:p-8">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-textSecondary transition-colors duration-150 hover:bg-background hover:text-textPrimary"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
              Back to appointments
            </button>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-semibold text-primary ring-1 ring-inset ring-primary/15">
                  {getInitials(appointment.student)}
                </span>
                <div>
                  <h1 className="font-heading text-xl font-semibold tracking-tight text-primaryDark">
                    {appointment.student}
                  </h1>
                  <p className="mt-0.5 font-mono text-xs text-textMuted">{appointment.id}</p>
                </div>
              </div>

              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${meta.chip} ${meta.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>
          </div>

          <div className="border-t border-border px-6 py-6 sm:px-8 sm:py-8">
            {/* Appointment info */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <InfoStat label="Time" value={appointment.time} />
              <InfoStat label="Type" value={appointment.type} />
              <InfoStat label="Course" value={appointment.course} />
            </div>

            {/* Notes */}
            <div className="mt-6">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-textMuted">Notes</p>
              <div className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-textMuted">
                No additional notes were submitted with this request.
              </div>
            </div>

            {/* Status actions */}
            <div className="mt-6 border-t border-border pt-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-textMuted">Update status</p>

              {decliningReason ? (
                <div className="space-y-3 rounded-xl border border-danger/25 bg-danger/5 p-4">
                  <label className="block text-xs font-medium text-textSecondary">
                    Reason for declining <span className="text-textMuted">(optional)</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="e.g. Schedule conflict — ask student to rebook"
                    className="w-full rounded-lg border border-border bg-white p-3 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={confirmDecline}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-danger px-4 py-2 text-xs font-medium text-white transition-opacity duration-150 hover:opacity-90"
                    >
                      <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
                      Confirm decline
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecliningReason(false)}
                      className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary transition-colors duration-150 hover:bg-background"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {status !== "confirmed" && (
                    <button
                      type="button"
                      onClick={() => applyStatus("confirmed")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-success px-4 py-2 text-xs font-medium text-white transition-opacity duration-150 hover:opacity-90"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                      Confirm appointment
                    </button>
                  )}

                  {status !== "declined" && (
                    <button
                      type="button"
                      onClick={() => setDecliningReason(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-danger/25 bg-danger/10 px-4 py-2 text-xs font-medium text-danger transition-colors duration-150 hover:bg-danger/15"
                    >
                      <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
                      Decline
                    </button>
                  )}

                  {status !== "pending" && (
                    <button
                      type="button"
                      onClick={() => applyStatus("pending")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary transition-colors duration-150 hover:bg-background"
                    >
                      <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                      Reset to pending
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}