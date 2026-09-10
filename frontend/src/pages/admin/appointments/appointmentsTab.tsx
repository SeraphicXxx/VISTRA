import React from "react";
import {Calendar, ChevronRight} from "lucide-react";
import {appointmentFilters, appointmentFiltersOptions, Appointments, APPOINTMENTS} from "./appointmentsData";
import {DefaultTablePreset} from "/@/components/table/TableDesingPreset";
import {defaultColumns} from "/@/components/table/Table";
import {ROUTES} from "/@/config/RoutePaths.js";
import {HyperlinkText} from "/@/components/Button";

export default function AppointmentsTab() {
    return (
        <DefaultTablePreset<Appointments>
            title="Appointments"
            icon={Calendar}
            filterableColumns={appointmentFilters}
            filterOptions={appointmentFiltersOptions}
            data={APPOINTMENTS}
            columns={defaultColumns}
            renderAction={
                (appointment) => (
                    <HyperlinkText
                        title={`View`}
                        link={`${ROUTES.staff.patient.patientRecordTab}/${appointment.id}`}
                        icon={ChevronRight}
                    />
                )
            }
        />
    );
}
