export interface Visit {
  id: string;
  complaint: string;
  doctor: string;
  treatmentType: string;
  date: string;
}

export interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
}

const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const OVERVIEW_PATIENT = {
  id: "20230519-S",
  name: "Angel Emie Jane Bien",
  medicalStatus: "Cleared",
  dentalStatus: "In treatment",
};

export const OVERVIEW_APPOINTMENTS: Appointment[] = [
  { id: "apt-1", type: "Dental cleaning", date: daysFromNow(3), time: "09:30 AM" },
  { id: "apt-2", type: "Medical check-up", date: daysFromNow(18), time: "02:00 PM" },
];

export const OVERVIEW_VISITS: Visit[] = [
  {
    id: "vis-1",
    complaint: "Tooth sensitivity",
    doctor: "Dr. Maria Santos",
    treatmentType: "Dental",
    date: daysFromNow(-5),
  },
  {
    id: "vis-2",
    complaint: "Fever and cough",
    doctor: "Dr. Jose Reyes",
    treatmentType: "Medical",
    date: daysFromNow(-19),
  },
  {
    id: "vis-3",
    complaint: "Routine cleaning",
    doctor: "Dr. Maria Santos",
    treatmentType: "Dental",
    date: daysFromNow(-60),
  },
];