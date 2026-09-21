// Mock data + in-memory "store" standing in for a real appointments API.
// Keyed by studentId so it lines up with whatever patient is in session.
// Since there's no backend yet, addAppointment() just mutates this module's
// in-memory object — it persists across navigation within the SPA session,
// but resets on a full page reload.

export type AppointmentStatus = "pending" | "approved" | "rejected" | "rescheduled";

export interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  rescheduledTo?: { date: string; time: string };
}

/**
 * Single source of truth for how each status looks. Every screen reads from
 * here, so a colour change lands everywhere at once.
 */
export interface StatusMeta {
  label: string;
  /** Short, patient-facing explanation of what the status means right now. */
  hint: string;
  dot: string;
  tint: string;
  text: string;
  badge: string;
  rail: string;
}

export const STATUS_META: Record<AppointmentStatus, StatusMeta> = {
  pending: {
    label: "Pending review",
    hint: "The clinic is reviewing your request.",
    dot: "bg-amber-500",
    tint: "bg-amber-500/10",
    text: "text-amber-600",
    badge: "bg-amber-500/10 text-amber-700 ring-1 ring-inset ring-amber-500/20",
    rail: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    hint: "Your slot is confirmed. Arrive 10 minutes early.",
    dot: "bg-emerald-500",
    tint: "bg-emerald-500/10",
    text: "text-emerald-600",
    badge: "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20",
    rail: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    hint: "This request wasn't accepted. Check the notes below.",
    dot: "bg-rose-500",
    tint: "bg-rose-500/10",
    text: "text-rose-600",
    badge: "bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/20",
    rail: "bg-rose-500",
  },
  rescheduled: {
    label: "Rescheduled",
    hint: "The clinic moved this to a new slot.",
    dot: "bg-primary",
    tint: "bg-primary/10",
    text: "text-primary",
    badge: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
    rail: "bg-primary",
  },
};

export const APPOINTMENT_TYPES = [
  "Medical Consultation",
  "Dental Consultation",
  "Follow-up",
  "Fit to Work Certificate",
];

const myAppointmentsStore: Record<string, Appointment[]> = {
  "20230518-S": [
    {
      id: "APT-3001",
      type: "Dental Cleaning",
      date: "2026-09-18",
      time: "10:00 AM",
      status: "approved",
    },
    {
      id: "APT-3002",
      type: "Medical Follow-up",
      date: "2026-09-25",
      time: "2:30 PM",
      status: "pending",
    },
    {
      id: "APT-3003",
      type: "Fit to Work Certificate",
      date: "2026-08-30",
      time: "11:00 AM",
      status: "rejected",
      notes: "Requested documents were incomplete. Please resubmit with your latest checkup results.",
    },
    {
      id: "APT-3004",
      type: "Dental Consultation",
      date: "2026-09-10",
      time: "9:00 AM",
      status: "rescheduled",
      rescheduledTo: { date: "2026-09-14", time: "1:00 PM" },
      notes: "Original slot was unavailable due to a clinic closure.",
    },
  ],
};

let nextIdNumber = 3005;

export function getMyAppointments(studentId: string): Appointment[] {
  return myAppointmentsStore[studentId] ?? [];
}

export function getAppointmentById(studentId: string, id: string): Appointment | undefined {
  return getMyAppointments(studentId).find((appointment) => appointment.id === id);
}

export function addAppointment(
  studentId: string,
  data: { type: string; date: string; time: string; notes?: string },
): Appointment {
  const appointment: Appointment = {
    id: `APT-${nextIdNumber++}`,
    type: data.type,
    date: data.date,
    time: data.time,
    notes: data.notes,
    status: "pending",
  };

  if (!myAppointmentsStore[studentId]) {
    myAppointmentsStore[studentId] = [];
  }
  myAppointmentsStore[studentId] = [appointment, ...myAppointmentsStore[studentId]];

  return appointment;
}

/* ------------------------------------------------------------------ */
/* Derived helpers — used by the list, detail and booking screens.     */
/* ------------------------------------------------------------------ */

/**
 * The mock records store time as "10:00 AM" while <input type="time"> hands us
 * "14:30". Normalise both to a single readable form so the UI never shows a
 * mix of formats.
 */
export function formatTime(value: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = match[2];
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${minutes} ${period}`;
}

/** The date that actually applies — a rescheduled slot supersedes the original. */
export function getEffectiveDate(appointment: Appointment): string {
  return appointment.status === "rescheduled" && appointment.rescheduledTo
    ? appointment.rescheduledTo.date
    : appointment.date;
}

export function getEffectiveTime(appointment: Appointment): string {
  return appointment.status === "rescheduled" && appointment.rescheduledTo
    ? appointment.rescheduledTo.time
    : appointment.time;
}

function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export function isUpcoming(appointment: Appointment): boolean {
  if (appointment.status === "rejected") return false;
  return new Date(`${getEffectiveDate(appointment)}T00:00:00`) >= startOfToday();
}

/** Soonest first for upcoming, most recent first for past. */
export function sortAppointments(appointments: Appointment[]): Appointment[] {
  return [...appointments].sort((a, b) => {
    const aUpcoming = isUpcoming(a);
    const bUpcoming = isUpcoming(b);
    if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;

    const aTime = new Date(`${getEffectiveDate(a)}T00:00:00`).getTime();
    const bTime = new Date(`${getEffectiveDate(b)}T00:00:00`).getTime();
    return aUpcoming ? aTime - bTime : bTime - aTime;
  });
}

export function getNextAppointment(studentId: string): Appointment | undefined {
  return sortAppointments(getMyAppointments(studentId)).find(
    (appointment) => isUpcoming(appointment) && appointment.status !== "pending",
  );
}

/** "Today", "Tomorrow", "In 6 days", "3 days ago" — null when it's far out. */
export function getRelativeDay(date: string): string | null {
  const target = new Date(`${date}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;

  const days = Math.round((target.getTime() - startOfToday().getTime()) / 86_400_000);

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 1 && days <= 30) return `In ${days} days`;
  if (days < -1 && days >= -30) return `${Math.abs(days)} days ago`;
  return null;
}