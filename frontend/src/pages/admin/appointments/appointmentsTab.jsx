import React from "react";
import { APPOINTMENTS } from "./appointmentsData";
import {RecordsTablePanel} from "../../../components/Table.jsx";
import {ROUTES} from "../../../config/RoutePaths.js";
import {getTableColumns} from "../../../utils/TableUtils.js";

export default function AppointmentsTab() {


 return (
     <RecordsTablePanel
         name="Appointments"
         data={APPOINTMENTS}
         columns={getTableColumns(APPOINTMENTS, ["id"])}
         createRoute={ROUTES.admin.appointment.createNewRecord}
     />
    );
}