export const denRecords = [
  { id: "DEN-1042", student: "Kenji Chua",      time: "9:00 AM",  type: "Dental Consultation", status: "completed" },
  { id: "DEN-1043", student: "Ivan Mejorada",   time: "9:30 AM",  type: "Tooth Extraction",    status: "followUp" },
  { id: "DEN-1044", student: "Cjay Gonzales",   time: "10:00 AM", type: "Oral Prophylaxis",    status: "completed" },
  { id: "DEN-1045", student: "Joshua Lapitan",  time: "10:15 AM", type: "Dental Filling",      status: "referred" },
  { id: "DEN-1046", student: "Rosh Ingel",      time: "10:45 AM", type: "Dental Consultation", status: "ongoingTreatment" },
];

export const statusStyles = {
  completed: "border-success/30 bg-success/10 text-success",
  followUp: "border-warning/30 bg-warning/10 text-warning",
  referred: "border-info/30 bg-info/10 text-info",
  ongoingTreatment: "border-treatment/30 bg-treatment/10 text-treatment",
};

export const statusLabels = {
  completed: "Completed",
  followUp: "Follow-up",
  referred: "Referred",
  ongoingTreatment: "Ongoing Treatment",
};

export function filterByQuery(items, query, fields) {
  const normalized = (query ?? "").trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) =>
    fields.some((field) => String(item[field] ?? "").toLowerCase().includes(normalized))
  );
}