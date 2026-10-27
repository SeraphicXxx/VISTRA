import { brand } from "@/constants/theme";
import type { AppointmentStatus } from "@/mock/appointments";
import type { RecordStatus } from "@/mock/records";

export interface StatusStyle {
  label: string;
  color: string;
  background: string;
}

export const STATUS_META: Record<RecordStatus, StatusStyle> = {
  "in-progress": {
    label: "In progress",
    color: "#b45309",
    background: "#fef3c7",
  },
  "follow-up": {
    label: "Follow-up",
    color: "#4338ca",
    background: "#eef2ff",
  },
  completed: {
    label: "Completed",
    color: brand.primaryDark,
    background: "rgba(20,184,166,0.12)",
  },
};

export const APPOINTMENT_STATUS_META: Record<
  AppointmentStatus,
  StatusStyle & { message: string }
> = {
  pending: {
    label: "Pending",
    color: "#b45309",
    background: "#fef3c7",
    message: "Waiting for the clinic to confirm this appointment.",
  },
  upcoming: {
    label: "Upcoming",
    color: "#4338ca",
    background: "#eef2ff",
    message: "Confirmed by the clinic. Please arrive 10 minutes early.",
  },
  completed: {
    label: "Completed",
    color: brand.primaryDark,
    background: "rgba(20,184,166,0.12)",
    message: "This appointment is complete.",
  },
  declined: {
    label: "Declined",
    color: "#dc2626",
    background: "#fee2e2",
    message: "This appointment has been declined. Status can no longer be changed.",
  },
};