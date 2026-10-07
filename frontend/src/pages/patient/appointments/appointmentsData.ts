import {
  CheckCircle2,
  XCircle,
  Hourglass,
  RotateCcw,
  LucideIcon,
} from "lucide-react";

import { ROUTES } from "/@/config/RoutePaths.js";
import { todayISO } from "/@/utils/DateUtils";
import type { AppointmentSchema } from "/@/api/schema/AppointmentSchema";
import { to12Hour } from "/@/utils/DateUtils";

export type AppointmentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "rescheduled";

export interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  location?: string;
  notes?: string;
  rescheduledTo?: {
    date: string;
    time: string;
  };
}

export interface StatusMeta {
  label: string;
  icon: LucideIcon;
  iconText: string;
  dot: string;
  message: string;
}

export const STATUS_META: Record<AppointmentStatus, StatusMeta> = {
  pending: {
    label: "Pending Review",
    icon: Hourglass,
    iconText: "text-amber-600",
    dot: "bg-amber-500",
    message:
      "The clinic is reviewing your request. The outcome will appear here once they respond.",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    iconText: "text-emerald-600",
    dot: "bg-emerald-500",
    message:
      "Your appointment is confirmed. Please arrive a few minutes early.",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    iconText: "text-rose-600",
    dot: "bg-rose-500",
    message:
      "The clinic couldn't approve this request. Read the note below, then submit a new request.",
  },
  rescheduled: {
    label: "Rescheduled",
    icon: RotateCcw,
    iconText: "text-primary",
    dot: "bg-primary",
    message:
      "The clinic proposed a different time. Review the new slot below.",
  },
};

export const APPOINTMENT_TYPES = [
  "Medical Consultation",
  "Dental Consultation",
  "Follow-up",
  "Fit to Work Certificate",
];

export const APPOINTMENT_LOCATIONS = [
  "UCC-South Campus",
  "UCC-North Campus",
] as const;

export type AppointmentLocation = (typeof APPOINTMENT_LOCATIONS)[number];

export const DEFAULT_STUDENT_ID = "20230518-S";

/**
 * Backend (APPOINTMENT row) -> patient portal view model.
 * Backend statuses: pending / confirmed / declined (+ legacy variants).
 */
export function mapBackendAppointmentToAppointment(
  record: AppointmentSchema
): Appointment {
  const [date = "", rawTime = ""] = (record.scheduled_start ?? "").split("T");
  const status = (record.status ?? "").toLowerCase();
  const mappedStatus: AppointmentStatus =
    status === "confirmed" || status === "approved" || status === "cleared"
      ? "approved"
      : status === "declined" || status === "rejected"
        ? "rejected"
        : "pending";

  return {
    id: String(record.id),
    type: record.reason || "Appointment",
    date,
    time: to12Hour(rawTime.slice(0, 5)),
    status: mappedStatus,
    location: record.location ?? undefined,
    notes: record.notes ?? undefined,
  };
}

export function resolveStudentId(user: any): string {
  return (
    user?.user_id ?? user?.patient_id ?? user?.student_id ?? DEFAULT_STUDENT_ID
  );
}

export function getViewPath(id: string): string {
  const base = ROUTES.patient.appointment.viewAppointment as string;

  if (base.includes(":id")) {
    return base.replace(":id", id);
  }

  return `${base}?id=${encodeURIComponent(id)}`;
}

export function getEffectiveSlot(
  appointment: Appointment
): {
  date: string;
  time: string;
} {
  if (
    appointment.status === "rescheduled" &&
    appointment.rescheduledTo
  ) {
    return appointment.rescheduledTo;
  }

  return {
    date: appointment.date,
    time: appointment.time,
  };
}

export function isUpcoming(
  appointment: Appointment
): boolean {
  if (appointment.status === "rejected") {
    return false;
  }

  return getEffectiveSlot(appointment).date >= todayISO();
}

