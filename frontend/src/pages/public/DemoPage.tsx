import {GenericTable, GenericTableHeader, GenericTableBody, defaultColumns} from "/@/components/table/Table";
import {APPOINTMENTS, Appointments, appointmentFilters, appointmentFiltersOptions} from "/@/pages/admin/appointments/appointmentsData";
import {ChevronRight} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {TableFilters} from "/@/components/Filters";

export function AppointmentTable() {
    const navigate = useNavigate();

    return (
        <>
            <TableFilters<Appointments>
                filterableColumns={appointmentFilters}
                filterOptions={appointmentFiltersOptions}
            />
            <GenericTable>

                <GenericTableHeader
                    columns={defaultColumns}
                    hasAction
                />

                <GenericTableBody
                    data={APPOINTMENTS}
                    columns={defaultColumns}
                    renderAction={(appointment) => (
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
                    )}
                />
            </GenericTable>
        </>
    );
}
