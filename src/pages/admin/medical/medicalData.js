export const medRecords = [
  { id: "MED-1042", student: "Kenji Chua", time: "9:00 AM", type: "Medical Consultation", status: "cleared" },
  { id: "MED-1043", student: "Ivan Mejorada", time: "9:30 AM", type: "Follow-up", status: "secondOpinion" },
  { id: "MED-1044", student: "Cjay Gonzales", time: "10:00 AM", type: "Dental Consultation", status: "recovered" },
  { id: "MED-1045", student: "Joshua Lapitan", time: "10:15 AM", type: "Medical Consultation", status: "referred" },
  { id: "MED-1046", student: "Rosh Ingel", time: "10:45 AM", type: "Medical Consultation", status: "ongoingTreatment" },
];

export const statusStyles = {
  cleared: "border-success/30 bg-success/10 text-success",
  secondOpinion: "border-warning/30 bg-warning/10 text-warning",
  recovered: "border-primary/30 bg-primary/10 text-primary",
  referred: "border-info/30 bg-info/10 text-info",
  ongoingTreatment: "border-treatment/30 bg-treatment/10 text-treatment",
};

export const statusLabels = {
  cleared: "Cleared",
  secondOpinion: "Second Opinion",
  recovered: "Recovered",
  referred: "Referred",
  ongoingTreatment: "Ongoing Treatment",
};

export function filterByQuery(items, query, fields) {
  const normalized = (query ?? "").trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) =>
    fields.some((field) => String(item[field]).toLowerCase().includes(normalized))
  );
}