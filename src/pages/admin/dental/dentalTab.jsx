import React, { useMemo } from "react";
import { Plus } from "lucide-react";
import { denRecords, filterByQuery } from "./dentalData";
import DentalTable from "./dentalTable";
import PanelHeader from "../../../components/PanelHeader.jsx";

export default function DentalTab({ searchQuery }) {
  const filteredDentalRecords = useMemo(
    () => filterByQuery(denRecords, searchQuery, ["student", "type", "id"]),
    [searchQuery]
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <PanelHeader
        title="All Dental Records"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primaryDark"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            New Dental Record
          </button>
        }
      />

      <div className="mt-4">
        <DentalTable dentalRecords={filteredDentalRecords} />
      </div>
    </div>
  );
}