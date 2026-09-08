import {Calendar, ChevronRight} from "lucide-react";

import {
    Appointments,
    appointmentFilters,
    appointmentFiltersOptions,
    APPOINTMENTS
} from "/@/pages/admin/appointments/appointmentsData"
import {DefaultTablePreset} from "/@/components/table/TableDesingPreset";
import {defaultColumns} from "/@/components/table/Table";
import {useNavigate} from "react-router-dom";

export function AppointmentTable() {
    const navigate = useNavigate();
    //TODO: use DefaultTablePreset for all
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
                    <button
                        type="button"
                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors duration-150 hover:bg-primary/10 hover:text-primaryDark"
                    >
                        View

                        <ChevronRight
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                        />
                    </button>
                )
            }
        />
    );
}
