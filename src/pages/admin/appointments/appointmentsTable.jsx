import React from "react";
import { ChevronRight } from "lucide-react";
import { statusStyles, statusLabels } from "./appointmentsData";

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export default function AppointmentsTable({ appointments }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-textMuted">Student</th>
            <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-textMuted">Time</th>
            <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-textMuted">Type</th>
            <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-textMuted">Status</th>
            <th className="pb-2" />
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-b border-border last:border-b-0">
              <td className="py-3 pr-4 text-sm font-medium text-textPrimary">{appointment.student}</td>
              <td className="py-3 pr-4 text-sm text-textSecondary">{appointment.time}</td>
              <td className="py-3 pr-4 text-sm text-textSecondary">{appointment.type}</td>
              <td className="py-3 pr-4">
                <StatusBadge status={appointment.status} />
              </td>
              <td className="py-3 text-right">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors duration-200 hover:text-primaryDark"
                >
                  View
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-sm text-textMuted">
                No appointments match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}