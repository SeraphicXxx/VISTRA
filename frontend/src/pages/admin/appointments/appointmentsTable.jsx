import React from "react";
import { ROUTES } from "/@/config/RoutePaths";
import { GenericRow, GenericTable } from "/@/components/Table";

const defaultColumns = [
  "Student",
  { key: "course", label: "Course", type: "string" },
  { key: "time", label: "Time", type: "time" },
  { key: "type", label: "Type", type: "string" },
  { key: "status", label: "Status", type: "status" },
];

export default function AppointmentsTable({ appointments, columns = defaultColumns }) {
  return (
    <div className="overflow-x-auto">
      <GenericTable
        data={appointments}
        columns={columns}
        renderRow={(record) => (
          <GenericRow data={record} viewRecordPath={ROUTES.admin.appointment.viewAppointment} />
        )}
      />
    </div>
  );
}