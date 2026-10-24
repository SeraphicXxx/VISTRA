import type { AppointmentStatus, PatientAppointment } from "@/mock/appointments";

export type Filter = "all" | Exclude<AppointmentStatus, "declined">;
export type AppointmentSort = "soonest" | "latest" | AppointmentStatus;

export const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Done" },
];

export const SORT_OPTIONS: { key: AppointmentSort; label: string }[] = [
  { key: "soonest", label: "Date: soonest first" },
  { key: "latest", label: "Date: latest first" },
  { key: "pending", label: "Status: pending first" },
  { key: "upcoming", label: "Status: upcoming first" },
  { key: "completed", label: "Status: completed first" },
];

export const SORT_LABEL: Record<AppointmentSort, string> = {
  soonest: "Soonest",
  latest: "Latest",
  pending: "Pending",
  upcoming: "Upcoming",
  completed: "Completed",
  declined: "Declined",
};

export const STATUS_RANK: Record<AppointmentStatus, number> = {
  pending: 0,
  upcoming: 1,
  completed: 2,
  declined: 3,
};

export const isStatusSort = (sort: AppointmentSort): sort is AppointmentStatus =>
  sort !== "soonest" && sort !== "latest";

const byDateAsc = (a: PatientAppointment, b: PatientAppointment) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

export const sortAppointments = (list: PatientAppointment[], sort: AppointmentSort) =>
  [...list].sort((a, b) => {
    if (isStatusSort(sort)) {
      const aFirst = a.status === sort ? 0 : 1;
      const bFirst = b.status === sort ? 0 : 1;
      return (
        aFirst - bFirst ||
        STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
        byDateAsc(a, b)
      );
    }
    return sort === "latest" ? -byDateAsc(a, b) : byDateAsc(a, b);
  });