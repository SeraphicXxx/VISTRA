import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Check,
  ClipboardList,
  Clock,
  FileCheck,
  FileText,
  MapPin,
  RefreshCw,
  Smile,
  Stethoscope,
} from "lucide-react";

import {
  APPOINTMENT_LOCATIONS,
  APPOINTMENT_TYPES,
  DEFAULT_STUDENT_ID,
} from "./appointmentsData";
import { sessionManager } from "/@/utils/SessionManager";
import { ROUTES } from "/@/config/RoutePaths.js";
import { getDateParts, to12Hour } from "/@/utils/DateUtils";
import { useCreateAppointment } from "/@/hooks/query/AppointmentQuery";
import { getFieldErrorString } from "/@/utils/Formatters";
import { uploadPatientAttachment } from "/@/api/attachments.api";
import axios from "axios";

const INPUT_CLASS =
  "h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-sm text-textPrimary focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20";

const SELECT_CLASS =
  "h-11 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-3.5 text-sm text-textPrimary focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20";

const TIME_SELECT_CLASS =
  "h-11 min-w-0 flex-1 appearance-none rounded-xl border border-border bg-background px-3 text-center text-sm text-textPrimary focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20";

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0")
);

const NEXT_STEPS = [
  "You submit a request with your preferred date and time.",
  "The clinic reviews it and checks availability.",
  "You get a decision: approved, rejected, or a new time.",
];

const pad = (n: number) => String(n).padStart(2, "0");

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function getBookingWindow() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = today.getFullYear();
  const month = today.getMonth() + 6;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const sixMonthsAhead = new Date(year, month, Math.min(today.getDate(), lastDay));
  const yearEnd = new Date(year, 11, 31);

  return {
    min: toISODate(today),
    max: toISODate(sixMonthsAhead < yearEnd ? sixMonthsAhead : yearEnd),
  };
}

function getTypeIcon(type: string) {
  const value = type.toLowerCase();
  if (value.includes("dental")) return Smile;
  if (value.includes("medical")) return Stethoscope;
  if (value.includes("follow")) return RefreshCw;
  if (value.includes("certificate") || value.includes("fit to work")) return FileCheck;
  return ClipboardList;
}

function SummaryItem({
  icon: Icon,
  filled,
  value,
  placeholder,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  filled: boolean;
  value: string;
  placeholder: string;
}) {
  return (
    <li className="flex items-center gap-3 py-3">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          filled ? "bg-primary/10 text-primary" : "bg-background text-textMuted"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <span
        className={`min-w-0 flex-1 text-sm ${filled ? "font-medium text-textPrimary" : "text-textMuted"}`}
      >
        {filled ? value : placeholder}
      </span>
      {filled && <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />}
    </li>
  );
}

export default function PatientBookAppointment() {
  const navigate = useNavigate();
  const user = sessionManager.getUser();
  const sessionId = user?.user_id ?? "";
  const studentId = sessionId || DEFAULT_STUDENT_ID;

  const [type, setType] = useState(APPOINTMENT_TYPES[0]);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [location, setLocation] = useState<string>(APPOINTMENT_LOCATIONS[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const createAppointmentMutation = useCreateAppointment();

  const bookingWindow = getBookingWindow();
  const time = hour && minute
    ? `${pad((Number(hour) % 12) + (period === "PM" ? 12 : 0))}:${minute}`
    : "";

  const handleBack = () => navigate(ROUTES.patient.dashboard.appointments);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!date || !time) {
      setError("Please select a date and time for your appointment.");
      return;
    }

    if (date < bookingWindow.min) {
      setError("Please choose a date that isn't in the past.");
      return;
    }

    if (date > bookingWindow.max) {
      setError("You can book up to 6 months ahead, within this year.");
      return;
    }

    const now = new Date();
    if (date === bookingWindow.min && time <= `${pad(now.getHours())}:${pad(now.getMinutes())}`) {
      setError("Please choose a time later than now.");
      return;
    }

    if (!location) {
      setError("Please select a campus location.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const toLocalISO = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
    const trimmedNotes = notes.trim();

    try {
      const appointmentResponse = await createAppointmentMutation.mutateAsync({
        patient_id: studentId,
        scheduled_start: toLocalISO(start),
        scheduled_end: toLocalISO(end),
        reason: type,
        location,
        notes: trimmedNotes || null,
      });

      const appointmentId = (appointmentResponse as { data?: { id?: number } })?.data?.id
        ?? (appointmentResponse as { id?: number })?.id;

      // Upload attached files (Fit to Work Certificate only)
      if (type === "Fit to Work Certificate" && attachedFiles.length > 0) {
        for (const file of attachedFiles) {
          try {
            await uploadPatientAttachment(file, "laboratory_result", appointmentId);
          } catch (uploadErr) {
            console.error("Failed to upload attachment:", uploadErr);
          }
        }
      }

      navigate(ROUTES.patient.dashboard.appointments);
    } catch (err) {
      const payload = axios.isAxiosError(err) ? err.response?.data : err;
      setError(
        getFieldErrorString(payload) ||
          "Couldn't submit your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const dateParts = date ? getDateParts(date) : null;
  const maxDateParts = getDateParts(bookingWindow.max);
  const TypeIcon = getTypeIcon(type);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 px-1.5 py-1 text-xs font-medium text-textMuted hover:text-textPrimary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to appointments
      </button>

      <form
        onSubmit={handleSubmit}
        className="mt-3 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
      >
        <aside className="relative flex flex-col overflow-hidden border-b border-border bg-gradient-to-br from-primary/10 via-primary/[0.04] to-background p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
          />

          <div className="relative">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <CalendarPlus className="h-5 w-5" strokeWidth={2} />
            </span>
            <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-textPrimary">
              Book an appointment
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-textSecondary">
              Submit a request and the clinic will confirm your slot.
            </p>
          </div>

          <div className="relative mt-8 rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-textMuted">Your request</p>

            <p className="mt-3 flex items-center gap-3 font-heading text-lg font-semibold text-textPrimary">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TypeIcon className="h-5 w-5" strokeWidth={2} />
              </span>
              {type}
            </p>

            <ul className="mt-4 divide-y divide-border border-t border-border">
              <SummaryItem
                icon={CalendarDays}
                filled={!!dateParts}
                value={dateParts ? `${dateParts.weekday}, ${dateParts.short}` : ""}
                placeholder="No date selected"
              />
              <SummaryItem
                icon={Clock}
                filled={!!time}
                value={time ? to12Hour(time) : ""}
                placeholder="No time selected"
              />
              <SummaryItem
                icon={MapPin}
                filled={!!location}
                value={location}
                placeholder="No location selected"
              />
              <SummaryItem
                icon={FileText}
                filled={!!notes.trim()}
                value="Notes added"
                placeholder="No notes"
              />
            </ul>
          </div>

          <div className="relative mt-8 hidden lg:block">
            <p className="text-xs font-medium uppercase tracking-wide text-textMuted">What happens next</p>
            <ol className="mt-4">
              {NEXT_STEPS.map((step, index) => (
                <li key={step} className="relative flex gap-3 pb-5 last:pb-0">
                  {index < NEXT_STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-0.5 bg-primary/25"
                    />
                  )}
                  <span
                    className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      index === 0
                        ? "bg-primary text-white"
                        : "border border-primary/40 bg-surface text-primaryDark"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed text-textSecondary">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="flex flex-col gap-7 p-6 sm:p-8">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {error}
            </div>
          )}

          <fieldset>
            <legend className="text-sm font-semibold text-textPrimary">Appointment type</legend>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {APPOINTMENT_TYPES.map((option) => {
                const Icon = getTypeIcon(option);
                const selected = type === option;
                return (
                  <label key={option} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={option}
                      checked={selected}
                      onChange={() => setType(option)}
                      className="peer sr-only"
                    />
                    <div
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium text-textPrimary transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:border-textMuted/50"
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-textMuted">
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1">{option}</span>
                      {selected && <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />}
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="mb-1.5 block text-sm font-semibold text-textPrimary">
                Preferred date
              </label>
              <div className="relative">
                <CalendarDays
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted"
                  strokeWidth={2}
                />
                <input
                  id="date"
                  type="date"
                  value={date}
                  min={bookingWindow.min}
                  max={bookingWindow.max}
                  onChange={(e) => setDate(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <p className="mt-1.5 text-xs text-textMuted">
                Up to {maxDateParts.short}
              </p>
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-textPrimary">
                Preferred time
              </span>
              <div className="flex h-11 items-center gap-2">
                <select
                  aria-label="Hour"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className={TIME_SELECT_CLASS}
                >
                  <option value="">--</option>
                  {HOUR_OPTIONS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                <span className="text-sm font-semibold text-textMuted">:</span>

                <select
                  aria-label="Minute"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className={TIME_SELECT_CLASS}
                >
                  <option value="">--</option>
                  {MINUTE_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="AM or PM"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as "AM" | "PM")}
                  className={TIME_SELECT_CLASS}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="location" className="mb-1.5 block text-sm font-semibold text-textPrimary">
              Campus location
            </label>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted"
                strokeWidth={2}
              />
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className={SELECT_CLASS}
              >
                {APPOINTMENT_LOCATIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold text-textPrimary">
              Notes <span className="font-normal text-textMuted">(optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Anything the clinic should know beforehand"
              className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-textPrimary placeholder:text-textMuted focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {type === "Fit to Work Certificate" && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-textPrimary">
                Attachments <span className="font-normal text-textMuted">(optional)</span>
              </label>
              <p className="mb-2 text-xs text-textMuted">
                Upload supporting documents (images or PDF, up to 10 MB each).
              </p>
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setAttachedFiles((prev) => [...prev, ...files]);
                  e.target.value = "";
                }}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-textPrimary file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
              />
              {attachedFiles.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                  {attachedFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2"
                    >
                      <span className="truncate text-xs text-textPrimary">{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="shrink-0 rounded-md p-1 text-textMuted transition-colors hover:bg-background hover:text-textPrimary"
                        aria-label={`Remove ${file.name}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-textPrimary transition-colors hover:bg-surfaceMuted/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit request"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}