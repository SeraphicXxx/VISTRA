import React from "react";
import {Calendar, ChevronRight} from "lucide-react";
import {appointmentFilters, appointmentFiltersOptions, Appointments, APPOINTMENTS} from "./appointmentsData";
import {DefaultTablePreset} from "/@/components/table/TableDesingPreset";
import {defaultColumns} from "/@/components/table/Table";
import {ROUTES} from "/@/config/RoutePaths.js";
import {LinkButton} from "/@/components/Button";

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
                    <LinkButton
                        title={`View`}
                        route={`${ROUTES.admin.patient.patientRecordTab}/${appointment.id}`}
                        icon={ChevronRight}
                    />
                )
            }
        />
    );
}
