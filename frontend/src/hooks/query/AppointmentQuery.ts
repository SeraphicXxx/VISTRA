import {AppointmentFilters} from "/@/api/schema/FilterSchemaCollection";
import {createAppointment, getAllAppointments, getAppointmentById, updateAppointment} from "/@/api/appointments.api";
import type {AppointmentSchema, CreateAppointmentRequest, UpdateAppointmentRequest} from "/@/api/schema/AppointmentSchema";
import {ApiResponse, PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {createDetailQueryHook, createListQueryHook, createMutationHook, createUpdateMutationHook} from "/@/hooks/query/visitQuery";

export const useCreateAppointment = createMutationHook<CreateAppointmentRequest, ApiResponse<AppointmentSchema>>(createAppointment);

export const useAppointmentQuery = createListQueryHook<AppointmentFilters, PaginatedData<AppointmentSchema>>(
    "appointments",
    getAllAppointments,
    "Appointment data is missing",
);

export const useAppointmentByIdQuery = createDetailQueryHook<AppointmentSchema>(
    "appointment",
    getAppointmentById,
    "Appointment data is missing",
);

interface UpdateAppointmentArgs {
    patientId: string;
    appointmentId: string;
    payload: UpdateAppointmentRequest;
}

export const useUpdateAppointment = createUpdateMutationHook<UpdateAppointmentArgs, ApiResponse<AppointmentSchema>>(
    (args) => updateAppointment(args.patientId, args.appointmentId, args.payload)
);
