import type { RecordStatus } from "./records";

export type ToothCondition =
  | "sound"
  | "decayed"
  | "filled"
  | "missing"
  | "extraction"
  | "unerupted"
  | "supernumerary";

export type Dentition = "permanent" | "temporary";

export interface ToothRecord {
  dentition: Dentition;
  condition: ToothCondition;
  notes: string | null;
}

export interface DentalVisit {
  id: string;
  date: string;
  complaint: string;
  doctor: string;
  treatment: string;
  status: RecordStatus;
}

export interface DentalChart {
  name: string;
  status: RecordStatus;
  course: string;
  yearSection: string;
  age: string;
  sex: string;
  civilStatus: string;
  birthday: string;
  address: string;
  barangay: string;
  mobileNumber: string;
  lastCleaning: string;
  medicalHistory: string[];
  teeth: Partial<Record<number, ToothRecord>>;
  visits: DentalVisit[];
}

export const DENTAL_CHART: DentalChart = {
  name: "Kenji Chua",
  status: "in-progress",
  course: "BS Information Technology",
  yearSection: "3-A",
  age: "21",
  sex: "Male",
  civilStatus: "Single",
  birthday: "2005-05-19",
  address: "Blk 4 Lot 12 Sampaguita St.",
  barangay: "Brgy. San Isidro",
  mobileNumber: "0917 000 1234",
  lastCleaning: "2026-08-30",
  medicalHistory: ["Asthma", "No known drug allergies"],
  teeth: {
    16: {
      dentition: "permanent",
      condition: "decayed",
      notes: "Sensitive to cold. Monitor.",
    },
    18: { dentition: "permanent", condition: "missing", notes: null },
    28: { dentition: "permanent", condition: "missing", notes: null },
    36: {
      dentition: "permanent",
      condition: "filled",
      notes: "Composite filling, 2 Jun 2026",
    },
    48: {
      dentition: "permanent",
      condition: "unerupted",
      notes: "Wisdom tooth, not yet erupted.",
    },
  },
  visits: [
    {
      id: "r1",
      date: "2026-10-19",
      complaint: "Tooth sensitivity",
      doctor: "Dr. Maria Santos",
      treatment: "Desensitizing treatment",
      status: "in-progress",
    },
    {
      id: "r3",
      date: "2026-08-30",
      complaint: "Teeth cleaning",
      doctor: "Dr. Maria Santos",
      treatment: "Scaling and polishing",
      status: "completed",
    },
    {
      id: "r5",
      date: "2026-06-02",
      complaint: "Filling (molar)",
      doctor: "Dr. Maria Santos",
      treatment: "Composite resin filling",
      status: "completed",
    },
  ],
};