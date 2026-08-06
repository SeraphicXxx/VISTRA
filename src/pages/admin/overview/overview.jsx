import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import StatsGrid from "./stats";
import { APPOINTMENTS, filterByQuery } from "../appointments/appointmentsData";
import AppointmentsTable from "../appointments/appointmentsTable";

const clinicalRec = [
  { id: "MED-201", student: "Ella Ramos", checkedInAt: "9:52 AM", reason: "Walk-in, fever", department: "Medical", recordUpdate: "New record created" },
  { id: "MED-202", student: "Diego Torres", checkedInAt: "10:05 AM", reason: "Prescription refill", department: "Medical", recordUpdate: "Record updated" },
  { id: "MED-203", student: "Mia Fernandez", checkedInAt: "10:11 AM", reason: "Sports clearance", department: "Medical", recordUpdate: "Record updated" },
  { id: "DENT-204", student: "Carlos Bautista", checkedInAt: "10:20 AM", reason: "Toothache, cavity check", department: "Dental", recordUpdate: "New record created" },
];

const clinicalDesign = {
  Medical: "border-primary/30 bg-primary/10 text-primary",
  Dental: "border-heartRate/30 bg-heartRate/10 text-heartRate",
};

function PanelHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-base font-semibold text-textPrimary">{title}</h2>
      {action}
    </div>
  );
}

function DepartmentBadge({ department }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${clinicalDesign[department]}`}>
      {department}
    </span>
  );
}

function ConsultationsList({ entries }) {
  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-xl border border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-textPrimary">{entry.student}</p>
              <DepartmentBadge department={entry.department} />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-textMuted">Checked in</p>
              <p className="mt-0.5 text-sm text-textSecondary">{entry.checkedInAt}</p>
            </div>
          </div>
          <p className="mt-1 text-xs text-textMuted">{entry.reason}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
            <FileText className="h-3.5 w-3.5" strokeWidth={2} />
            {entry.recordUpdate}
          </div>
        </div>
      ))}
      {entries.length === 0 && (
        <p className="py-6 text-center text-sm text-textMuted">No consultations today.</p>
      )}
    </div>
  );
}

export default function OverviewTab() {
  const { searchQuery } = useOutletContext();

  const filteredAppointments = useMemo(
    () => filterByQuery(APPOINTMENTS, searchQuery, ["student", "type", "id"]),
    [searchQuery]
  );

  return (
    <>
      <StatsGrid />

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <PanelHeader
            title="Medical & Dental Consultations"
            action={
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {clinicalRec.length} today
              </span>
            }
          />
          <div className="mt-4">
            <ConsultationsList entries={clinicalRec} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="mt-4">
            <AppointmentsTable appointments={filteredAppointments} />
          </div>
        </div>
      </div>
    </>
  );
}