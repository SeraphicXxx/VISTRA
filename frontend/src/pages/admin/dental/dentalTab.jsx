import React from "react";
import { dentalRecords } from "./dentalData";
import {RecordsTablePanel} from "../../../components/Table.jsx";
import {getTableColumns} from "../../../utils/TableUtils.js";
import {ROUTES} from "../../../config/RoutePaths.js";

export default function DentalTab() {
    return (
        <RecordsTablePanel
        name="Dental"
        data={dentalRecords}
        columns={getTableColumns(dentalRecords, ["id"])}
        createRoute={ROUTES.admin.dental.createNewRecord}
    />
    );
}