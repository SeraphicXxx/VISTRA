import {Calendar} from "lucide-react";
import {AppointmentsColumns, AppointmentTableFormat} from "./appointmentsData";
import {ROUTES} from "/@/config/RoutePaths.js";
import {useAppointmentContext} from "/@/context/PaginatedContext";
import {toAppointmentTableRow} from "/@/repository/AppointmentModel";
import {AppointmentFilters} from "/@/api/schema/FilterSchemaCollection";
import {VisitTab} from "/@/components/VisitTab";

interface AppointmentsTabProps {
    setFilters: (filters: AppointmentFilters) => void;
}

export default function AppointmentsTab({setFilters}: AppointmentsTabProps) {
    const {
        items,
        totalPages,
        page,
        isLoading,
    } = useAppointmentContext();

    return (
        <VisitTab
            title="Appointment"
            icon={Calendar}
            columns={AppointmentsColumns}
            items={items}
            toRow={toAppointmentTableRow}
            isLoading={isLoading}
            totalPages={totalPages}
            page={page}
            buildViewLink={(row: AppointmentTableFormat) =>
                ROUTES.staff.appointments.view.build(row.studentId, row.id)
            }
            setFilters={setFilters}
        />
    );
}
