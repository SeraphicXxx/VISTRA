import {AppointmentFilters} from "/@/api/schema/FilterSchemaCollection";
import {useQuery} from "@tanstack/react-query";
import {createAppointment, getAllAppointments, getAppointmentById} from "/@/api/appointments.api";
import type {AppointmentSchema, CreateAppointmentRequest} from "/@/api/schema/AppointmentSchema";
import {ApiResponse} from "/@/api/schema/ApiResponseSchema";
import {PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {createListQueryHook, createMutationHook} from "/@/hooks/query/visitQuery";

export const useCreateAppointment = createMutationHook<CreateAppointmentRequest, ApiResponse<AppointmentSchema>>(createAppointment);

export const useAppointmentQuery = createListQueryHook<AppointmentFilters, PaginatedData<AppointmentSchema>>(
    "appointments",
    getAllAppointments,
    "Appointment data is missing",
);

export function useAppointmentByIdQuery(
    appointmentId: string,
    patientId: string
) {
    return useQuery({
        queryKey: ["appointment", appointmentId, patientId],
        queryFn: async ({signal}) => {
            const {data} = await getAppointmentById(
                appointmentId,
                patientId,
                signal
            );

            if (!data.data) {
                throw new Error("Appointment data is missing");
            }

            return data.data;
        },
        refetchOnWindowFocus: false,
    })
}
