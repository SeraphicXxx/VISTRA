// Mock data standing in for a real "fetch my appointments" API call.
// Keyed by studentId so it lines up with whatever patient is in session.

export interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  status: string;
}

export const myAppointments: Record<string, Appointment[]> = {
  "20230518-S": [
    {
      id: "APT-2201",
      type: "Dental Cleaning",
      date: "2026-09-18",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: "APT-2202",
      type: "Medical Follow-up",
      date: "2026-09-25",
      time: "2:30 PM",
      status: "pending",
    },
  ],
};

export function getMyAppointments(studentId: string): Appointment[] {
  return myAppointments[studentId] ?? [];
}
