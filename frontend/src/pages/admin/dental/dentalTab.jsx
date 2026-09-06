import React from "react";
import { Syringe } from "lucide-react";
import { dentalRecords } from "./dentalData";
import { RecordsTablePanel, GenericRow } from "/@/components/Table.tsx";
import { getTableColumns } from "/@/utils/TableUtils.js";
import { ROUTES } from "/@/config/RoutePaths.js";

export default function DentalTab() {
  return (
    <RecordsTablePanel
      name="Dental"
      icon={Syringe}
      data={dentalRecords}
      columns={getTableColumns(dentalRecords, ["id"])}
      createRecordPath={ROUTES.admin.dental.createNewRecord}
      renderRow={(record) => (
        <GenericRow data={record} viewRecordPath={ROUTES.admin.dental.viewRecord} />
      )}
    />
  );
}