import {FilterColumn} from "/@/components/Filters";

export const APPOINTMENTS: Appointments[] = [
  { id: "APT-1042", student: "Kenji Chua", course: "BS Computer Science", time: "9:00 AM", type: "Medical Consultation", status: "pending" },
  { id: "APT-1043", student: "Ivan Mejorada", course: "BS Business Administration", time: "9:30 AM", type: "Follow-up", status: "confirmed" },
  { id: "APT-1044", student: "Cjay Gonzales", course: "BS Psychology", time: "10:00 AM", type: "Dental Consultation", status: "declined" },
  { id: "APT-1045", student: "Joshua Lapitan", course: "BS Nursing", time: "10:15 AM", type: "Fit to Work Certificate", status: "pending" },
  { id: "APT-1046", student: "Gillian Marc Lorenzo", course: "BS Information Technology", time: "10:30 AM", type: "Medical Consultation", status: "confirmed" },
  { id: "APT-1047", student: "Angel Emie Jane Bien", course: "BS Computer Science", time: "11:00 AM", type: "Dental Consultation", status: "pending" },
  { id: "APT-1048", student: "Maria Santos", course: "BS Education", time: "11:30 AM", type: "Follow-up", status: "confirmed" },
  { id: "APT-1049", student: "Daniel Reyes", course: "BS Accountancy", time: "12:00 PM", type: "Medical Consultation", status: "pending" },
  { id: "APT-1050", student: "Sofia Cruz", course: "BS Psychology", time: "1:00 PM", type: "Dental Consultation", status: "confirmed" },
  { id: "APT-1051", student: "Mark Villanueva", course: "BS Information Technology", time: "1:30 PM", type: "Medical Consultation", status: "declined" },
  { id: "APT-1052", student: "Andrea Garcia", course: "BS Nursing", time: "2:00 PM", type: "Follow-up", status: "pending" },
  { id: "APT-1053", student: "Carlo Mendoza", course: "BS Business Administration", time: "2:30 PM", type: "Fit to Work Certificate", status: "confirmed" },
  { id: "APT-1054", student: "Leah Fernandez", course: "BS Computer Science", time: "3:00 PM", type: "Medical Consultation", status: "pending" },
  { id: "APT-1055", student: "Nathan Flores", course: "BS Psychology", time: "3:30 PM", type: "Dental Consultation", status: "confirmed" },
  { id: "APT-1056", student: "Bianca Ramos", course: "BS Education", time: "4:00 PM", type: "Medical Consultation", status: "declined" },
];
export interface Appointments {
  id: string;
  student: string;
  course: string;
  time: string;
  type: string;
  status: string;
}
export const appointmentFilters: FilterColumn<Appointments>[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
  },
  {
    key: "type",
    label: "Type",
    type: "select",
  },
  {
    key: "course",
    label: "Course",
    type: "select",
  },
  {
    key: "time",
    label: "Date",
    type: "date",
  },
]
export const appointmentFiltersOptions: Record<string, string[]> = {
  status: [
    "pending",
    "confirmed",
    "declined",
  ],

  type: [
    "Medical Consultation",
    "Dental Consultation",
    "Follow-up",
    "Fit to Work Certificate",
  ],

  course: [
    "BS Computer Science",
    "BS Business Administration",
    "BS Psychology",
    "BS Nursing",
    "BS Information Technology",
    "BS Education",
    "BS Accountancy",
  ],
}