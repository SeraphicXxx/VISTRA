import {AppointmentFilters} from "/@/api/schema/FilterSchemaCollection";
import {ApiResponse, PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {AppointmentSchema, CreateAppointmentRequest} from "/@/api/schema/AppointmentSchema";
import {API_ENDPOINTS} from "/@/config/ApiConfig";
import {getResource, listResource, sendResource} from "/@/api/resource";

export function getAllAppointments(
    filters?: AppointmentFilters,
    signal?: AbortSignal
){
    return listResource<ApiResponse<PaginatedData<AppointmentSchema>>>(
        API_ENDPOINTS.appointment.get_appointment,
        filters,
        signal
    );
}

export function createAppointment(
    request: CreateAppointmentRequest,
    signal?: AbortSignal
){
    return sendResource<ApiResponse<AppointmentSchema>>(
        "POST",
        API_ENDPOINTS.appointment.create_appointment,
        request,
        signal
    );
}

export function getAppointmentById(
    patientId: string,
    appointmentId: string,
    signal?: AbortSignal
){
    return getResource<ApiResponse<AppointmentSchema>>(
        API_ENDPOINTS.appointment.get_appointment_by_id(patientId, appointmentId),
        signal
    );
}
