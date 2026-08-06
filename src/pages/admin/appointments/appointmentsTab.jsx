import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus } from "lucide-react";
import { APPOINTMENTS, filterByQuery } from "./appointmentsData";
import AppointmentsTable from "./appointmentsTable";
import PanelHeader from "../../../components/PanelHeader.jsx";

export default function AppointmentsTab() {
  const { searchQuery } = useOutletContext();

  const filteredAppointments = useMemo(
    () => filterByQuery(APPOINTMENTS, searchQuery, ["student", "type", "id"]),
    [searchQuery]
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <PanelHeader
        title="All Appointments"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primaryDark"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            New Appointment
          </button>
        }
      />

      <div className="mt-4">
        <AppointmentsTable appointments={filteredAppointments} />
      </div>
    </div>
  );
}