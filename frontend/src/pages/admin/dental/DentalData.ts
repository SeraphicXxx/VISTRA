import {Status} from "/@/components/StatusBadge";
import {FilterColumn} from "/@/components/Filters";

export const dentalRecords: DentalData[] = [
  {
    id: "DEN-1042",
    student: "James Bontogon",
    course: "BS Computer Science",
    time: "9:00 AM",
    type: "Dental Consultation",
    status: "completed",
  },
  {
    id: "DEN-1043",
    student: "Heart Combinido",
    course: "BS Psychology",
    time: "9:30 AM",
    type: "Tooth Extraction",
    status: "followUp",
  },
  {
    id: "DEN-1044",
    student: "Angelo Bejamino",
    course: "BS Industrial Engineering",
    time: "10:00 AM",
    type: "Oral Prophylaxis",
    status: "completed",
  },
  {
    id: "DEN-1045",
    student: "Natasha Pinon",
    course: "BS Electronics Engineering",
    time: "10:15 AM",
    type: "Dental Filling",
    status: "referred",
  },
  {
    id: "DEN-1046",
    student: "Rosh Ingel",
    course: "BS Accountancy",
    time: "10:45 AM",
    type: "Dental Consultation",
    status: "ongoingTreatment",
  },
];

export interface DentalData {
  id: string;
  student: string;
  course: string;
  time: string;
  type: string;
  status: Status;
}

export const dentalFilters :FilterColumn<DentalData>[] = [
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

export const dentalFiltersOptions: Record<string, string[]> = {
  status: [
    "ongoingTreatment",
    "followUp",
    "declined",
    "completed",
    "referred",
  ],

  type: [
    "Dental Consultation",
    "Tooth Extraction",
    "Oral Prophylaxis",
    "Dental Filling",
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