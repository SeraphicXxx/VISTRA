import {AppointmentFilters} from "/@/api/schema/FilterSchemaCollection";
import {createAppointment, getAllAppointments, getAppointmentById} from "/@/api/appointments.api";
import type {AppointmentSchema, CreateAppointmentRequest} from "/@/api/schema/AppointmentSchema";
import {ApiResponse, PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {createDetailQueryHook, createListQueryHook, createMutationHook} from "/@/hooks/query/visitQuery";

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
