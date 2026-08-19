import React, { useMemo } from "react";
import {Link, useOutletContext} from "react-router-dom";
import { Plus } from "lucide-react";
import { denRecords } from "./dentalData";
import { filterByQuery } from "../../../utils/FilterByQuery.js";
import DentalTable from "./dentalTable";
import PanelHeader from "../../../components/PanelHeader.jsx";

export default function DentalTab() {
    const { searchQuery } = useOutletContext();
  const filteredDentalRecords = useMemo(
    () => filterByQuery(denRecords, searchQuery, ["student", "course", "type", "id"]),
    [searchQuery]
  );

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-card">
      <div className="p-6">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <PanelHeader
              title="Dental Records"
              action={
                <Link
                  to="/admin/dental/new"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primaryDark hover:shadow-md active:translate-y-0"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                  New Dental Record
                </Link>
              }
            />
            <p className="mt-0.5 text-xs text-textMuted">
              {filteredDentalRecords.length}{" "}
              {filteredDentalRecords.length === 1 ? "record" : "records"}
              {searchQuery ? ` matching "${searchQuery}"` : " on file"}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <DentalTable dentalRecords={filteredDentalRecords} />
        </div>
      </div>
    </div>
  );
}