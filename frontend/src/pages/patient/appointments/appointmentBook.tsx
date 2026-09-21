import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { addAppointment, APPOINTMENT_TYPES, formatTime } from "./appointmentsData";
import { sessionManager } from "/@/utils/SessionManager";
import { ROUTES } from "/@/config/RoutePaths.js";
import { formatDate } from "/@/utils/FormatDate";

const DEFAULT_STUDENT_ID = "20230518-S";

const APPOINTMENTS_PATH = ROUTES.patient.dashboard.appointments;

const FIELD_CLASS =
  "w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-textPrimary transition-colors placeholder:text-textMuted focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20";

const STEPS = [
  "You submit this request.",
  "The clinic reviews it, then confirms or proposes another slot.",
  "The result shows up on your appointments list.",
];

export default function PatientBookAppointment() {
  const navigate = useNavigate();
  const user = sessionManager.getUser();
  const sessionId = user?.user_id ?? "";
  const studentId = sessionId || DEFAULT_STUDENT_ID;

  const [type, setType] = useState(APPOINTMENT_TYPES[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const isComplete = Boolean(date && time);

  const handleBack = () => navigate(APPOINTMENTS_PATH);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!date || !time) {
      setError("Pick a date and a time before submitting.");
      return;
    }

    if (date < today) {
      setError("Choose a date from today onwards.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Mock submit — swap for a real API call once the backend exists.
    addAppointment(studentId, { type, date, time, notes: notes.trim() || undefined });

    setIsSubmitting(false);
    navigate(APPOINTMENTS_PATH);
  };

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
        {/* Left — the form */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h1 className="font-heading text-xl font-semibold text-textPrimary">Book an appointment</h1>
          <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-textMuted">
            Tell us what you need and when suits you. The clinic confirms your slot.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-textPrimary">
                What is the visit for?
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={FIELD_CLASS}
              >
                {APPOINTMENT_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-textPrimary">
                  Preferred date
                </label>
                <input
                  id="date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label htmlFor="time" className="mb-1.5 block text-sm font-medium text-textPrimary">
                  Preferred time
                </label>
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-textPrimary">
                Notes <span className="font-normal text-textMuted">(optional)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Symptoms, documents you're bringing, anything the clinic should know"
                className={`${FIELD_CLASS} resize-none`}
              />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3 border-t border-border pt-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting…" : "Submit request"}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl px-3 py-3 text-sm font-medium text-textMuted transition-colors hover:text-textPrimary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Right — live summary of what will be sent */}
        <aside className="lg:sticky lg:top-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-heading text-sm font-semibold text-textPrimary">Your request</h2>

            <dl className="mt-3 divide-y divide-border border-t border-border">
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-xs text-textMuted">Type</dt>
                <dd className="text-right text-sm font-medium text-textPrimary">{type}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-xs text-textMuted">Date</dt>
                <dd
                  className={`text-right text-sm font-medium ${date ? "text-textPrimary" : "text-textMuted"}`}
                >
                  {date ? formatDate(date) : "Not set"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-xs text-textMuted">Time</dt>
                <dd
                  className={`text-right text-sm font-medium ${time ? "text-textPrimary" : "text-textMuted"}`}
                >
                  {time ? formatTime(time) : "Not set"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-xs text-textMuted">Patient</dt>
                <dd className="text-right font-mono text-sm text-textPrimary">{studentId}</dd>
              </div>
            </dl>

            <p
              className={`mt-3 text-xs font-medium ${isComplete ? "text-emerald-600" : "text-textMuted"}`}
            >
              {isComplete ? "Ready to submit" : "Pick a date and time to continue"}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-surfaceMuted/40 p-6">
            <h3 className="text-sm font-semibold text-textPrimary">What happens next</h3>
            <ol className="mt-3 flex flex-col gap-3">
              {STEPS.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-textSecondary">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}