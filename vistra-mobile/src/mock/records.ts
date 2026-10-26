export type RecordKind = "medical" | "dental";
export type RecordStatus = "in-progress" | "follow-up" | "completed";

export interface PatientRecord {
  id: string;
  kind: RecordKind;
  title: string;
  doctor: string;
  date: string;
  status: RecordStatus;
}

export const PATIENT_RECORDS: PatientRecord[] = [
  {
    id: "r1",
    kind: "dental",
    title: "Tooth sensitivity",
    doctor: "Dr. Maria Santos",
    date: "2026-10-19",
    status: "in-progress",
  },
  {
    id: "r2",
    kind: "medical",
    title: "Routine check-up",
    doctor: "Dr. Ana Reyes",
    date: "2026-10-12",
    status: "completed",
  },
  {
    id: "r3",
    kind: "dental",
    title: "Teeth cleaning",
    doctor: "Dr. Maria Santos",
    date: "2026-08-30",
    status: "completed",
  },
  {
    id: "r4",
    kind: "medical",
    title: "Blood pressure review",
    doctor: "Dr. Ana Reyes",
    date: "2026-07-14",
    status: "follow-up",
  },
  {
    id: "r5",
    kind: "dental",
    title: "Filling (molar)",
    doctor: "Dr. Maria Santos",
    date: "2026-06-02",
    status: "completed",
  },
  {
    id: "r6",
    kind: "medical",
    title: "Annual physical",
    doctor: "Dr. Ana Reyes",
    date: "2026-03-18",
    status: "completed",
  },
];