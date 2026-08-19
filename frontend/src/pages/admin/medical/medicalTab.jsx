import React from "react";
import { medRecords } from "./medicalData";
import {RecordsTablePanel} from "../../../components/Table.jsx";
import {getTableColumns} from "../../../utils/TableUtils.js";
import {ROUTES} from "../../../config/RoutePaths.js";

export default function MedicalTab() {
    return (
        <RecordsTablePanel
            name="Medical"
            data={medRecords}
            columns={getTableColumns(medRecords, ["id"])}
            createRecordPath={ROUTES.admin.medical.createNewRecord}
        />
  );
}