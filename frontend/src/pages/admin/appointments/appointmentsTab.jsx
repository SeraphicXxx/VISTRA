import React from "react";
import { Calendar } from "lucide-react";
import { APPOINTMENTS } from "./appointmentsData";
import { RecordsTablePanel } from "/@/components/Table.tsx";
import { ROUTES } from "/@/config/RoutePaths.js";
import { getTableColumns } from "/@/utils/TableUtils.js";
import { GenericRow } from "/@/components/Table.tsx";

export default function AppointmentsTab() {
  return (
    <RecordsTablePanel
      name="Appointments"
      icon={Calendar}
      data={APPOINTMENTS}
      showCreate={false}
      columns={getTableColumns(APPOINTMENTS, ["id"])}
      renderRow={(record) => (
        <GenericRow data={record} viewRecordPath={ROUTES.admin.appointment.viewAppointment} />
      )}
    />
  );
}