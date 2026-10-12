export const appointmentStatuses = {
    pending: "Pending",
    confirmed: "Confirmed",
    declined: "Declined",
} as const;

export type AppointmentStatus = keyof typeof appointmentStatuses;
