import {AppointmentFilters} from "/@/api/schema/FilterSchemaCollection";
import {AppointmentSchema} from "/@/api/schema/AppointmentSchema";
import {useAppointmentQuery} from "/@/hooks/query/AppointmentQuery";
import {AppointmentProvider} from "/@/context/PaginatedContext";
import AppointmentsTab from "/@/pages/admin/appointments/appointmentsTab";
import AppointmentDetailView from "/@/pages/admin/appointments/appointmentView";
import {createVisitPage} from "/@/components/VisitPage";

export const AppointmentPage = createVisitPage<AppointmentFilters, AppointmentSchema>({
    initialFilters: {
        page: 1,
        page_size: 10,
    },
    useListQuery: useAppointmentQuery,
    Provider: AppointmentProvider,
    Tab: AppointmentsTab,
});

export function AppointmentDetailPage() {
    return (
        <AppointmentDetailView/>
    )

}
