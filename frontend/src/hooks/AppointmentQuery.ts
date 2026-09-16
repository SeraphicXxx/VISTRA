import {AppointmentFilters} from "/@/api/schema/FilterSchemaCollection";
import {useQuery} from "@tanstack/react-query";
import {getAllAppointments} from "/@/api/appointments.api";

export function useAppointmentQuery(filters?: AppointmentFilters) {
    return useQuery({
        queryKey: ["appointments", filters],
        queryFn: async ({signal}) => {
            const {data} = await getAllAppointments(
                filters,
                signal
            );

            return data.data;
        },
        refetchOnWindowFocus: false,
    })
}