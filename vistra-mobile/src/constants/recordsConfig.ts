import type { PatientRecord, RecordKind, RecordStatus } from "@/mock/records";

export type Filter = "all" | RecordKind;
export type Sort = "newest" | "oldest" | RecordStatus;

export const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "medical", label: "Medical" },
  { key: "dental", label: "Dental" },
];

export const SORT_OPTIONS: { key: Sort; label: string }[] = [
  { key: "newest", label: "Date: newest first" },
  { key: "oldest", label: "Date: oldest first" },
  { key: "in-progress", label: "Status: in progress first" },
  { key: "follow-up", label: "Status: follow-up first" },
  { key: "completed", label: "Status: completed first" },
];

export const SORT_LABEL: Record<Sort, string> = {
  newest: "Newest",
  oldest: "Oldest",
  "in-progress": "In progress",
  "follow-up": "Follow-up",
  completed: "Completed",
};

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const KIND_LABEL: Record<RecordKind, string> = {
  medical: "Medical",
  dental: "Dental",
};

export const STATUS_RANK: Record<RecordStatus, number> = {
  "in-progress": 0,
  "follow-up": 1,
  completed: 2,
};

export const isStatusSort = (sort: Sort): sort is RecordStatus =>
  sort !== "newest" && sort !== "oldest";

export const parseDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
};

export const byDateDesc = (a: PatientRecord, b: PatientRecord) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export const sortRecords = (records: PatientRecord[], sort: Sort) =>
  [...records].sort((a, b) => {
    if (isStatusSort(sort)) {
      const aFirst = a.status === sort ? 0 : 1;
      const bFirst = b.status === sort ? 0 : 1;
      return (
        aFirst - bFirst ||
        STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
        byDateDesc(a, b)
      );
    }
    return sort === "newest" ? byDateDesc(a, b) : -byDateDesc(a, b);
  });