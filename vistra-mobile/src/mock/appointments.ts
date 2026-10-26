export type AppointmentStatus = "pending" | "upcoming" | "completed" | "declined";

export interface PatientAppointment {
  id: string;
  type: string;
  doctor: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  course?: string;
  reason?: string;
}

const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const APPOINTMENT_TYPES = [
  "Medical check-up",
  "Dental cleaning",
  "Dental consultation",
  "Follow-up visit",
];

export const TIME_SLOTS = [
  "08:30 AM",
  "09:30 AM",
  "10:30 AM",
  "01:00 PM",
  "02:00 PM",
  "03:30 PM",
];

export const BOOKING_DAYS = Array.from({ length: 7 }, (_, i) => daysFromNow(i + 1));

export const PATIENT_APPOINTMENTS: PatientAppointment[] = [
  {
    id: "apt-1",
    type: "Dental cleaning",
    doctor: "Dr. Maria Santos",
    date: daysFromNow(3),
    time: "09:30 AM",
    status: "pending",
    course: "BS ENTREP",
  },
  {
    id: "apt-2",
    type: "Medical check-up",
    doctor: "Dr. Jose Reyes",
    date: daysFromNow(18),
    time: "02:00 PM",
    status: "upcoming",
    course: "BS ENTREP",
    reason: "Annual check-up and blood pressure monitoring.",
  },
  {
    id: "apt-3",
    type: "Follow-up visit",
    doctor: "Dr. Jose Reyes",
    date: daysFromNow(-19),
    time: "10:00 AM",
    status: "completed",
    course: "BS ENTREP",
  },
  {
    id: "apt-4",
    type: "Routine cleaning",
    doctor: "Dr. Maria Santos",
    date: daysFromNow(-60),
    time: "03:30 PM",
    status: "completed",
    course: "BS ENTREP",
  },
  {
    id: "apt-5",
    type: "Medical check-up",
    doctor: "Dr. Jose Reyes",
    date: daysFromNow(9),
    time: "04:30 PM",
    status: "declined",
    course: "BS ENTREP",
    reason: "Please bring your previous lab results.",
  },
];