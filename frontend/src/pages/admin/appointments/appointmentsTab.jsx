import React from "react";
import { APPOINTMENTS } from "./appointmentsData";
import {RecordsTablePanel} from "../../../components/Table.jsx";
import {getTableColumns} from "../../../utils/TableUtils.js";

export default function AppointmentsTab() {
 return (
     <RecordsTablePanel
         name="Appointments"
         data={APPOINTMENTS}
          showCreate={false} 
         columns={getTableColumns(APPOINTMENTS, ["id"])}
     />
    );
}