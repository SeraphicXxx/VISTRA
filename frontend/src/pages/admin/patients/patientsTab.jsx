import React from "react";

import { patientRecords } from "./patientsData";
import { RecordsTablePanel, PatientRow } from "../../../components/Table.jsx";

import { getTableColumns } from "../../../utils/TableUtils.js";
import { ROUTES } from "../../../config/RoutePaths.js";

export default function PatientsTab() {
    return (
        <RecordsTablePanel
            name="Patient"
            data={patientRecords}
            columns={getTableColumns(patientRecords, ["id"])}
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