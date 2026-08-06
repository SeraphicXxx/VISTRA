import React, { useMemo } from "react";
import { Plus } from "lucide-react";
import { medRecords, filterByQuery } from "./medicalData";
import MedicalTable from "./medicalTable";
import PanelHeader from "../../../components/PanelHeader.jsx";

export default function MedicalTab({ searchQuery }) {
  const filteredMedicalRecords = useMemo(
    () => filterByQuery(medRecords, searchQuery, ["student", "type", "id"]),
    [searchQuery]
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <PanelHeader
        title="All Medical Records"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primaryDark"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            New Medical Record
          </button>
        }
      />

      <div className="mt-4">
        <MedicalTable medicalRecords={filteredMedicalRecords} />
      </div>
    </div>
  );
}