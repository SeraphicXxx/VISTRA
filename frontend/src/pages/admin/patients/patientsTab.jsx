import React from "react";

import { patientRecords, patientColumns} from "./patientsData";

import {
  RecordsTablePanel,
  PatientRow,
} from "/@/components/Table.jsx";

import { ROUTES } from "/@/config/RoutePaths.js";

export default function PatientsTab() {
  return (
    <RecordsTablePanel
      name="Patient"
      data={patientRecords}
      columns={patientColumns}
      createRecordPath={ROUTES.admin.patient.createNewRecord}
      renderRow={(record) => (
        <PatientRow
          data={record}
          viewRecordPath={ROUTES.admin.patient.patientRecordTab}
        />
      )}
    />
  );
}