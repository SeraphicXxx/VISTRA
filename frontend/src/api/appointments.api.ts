import {AppointmentFilters} from "/@/api/schema/FilterSchemaCollection";
import {apiClient} from "/@/api/axios_client";
import {ApiResponse, PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {AppointmentSchema} from "/src/api/schema/AppointmentSchema";
import {API_ENDPOINTS} from "/@/config/ApiConfig";

export async function getAllAppointments(
    filters?: AppointmentFilters,
    signal?: AbortSignal
){
    return apiClient<ApiResponse<PaginatedData<AppointmentSchema>>>(
        API_ENDPOINTS.appointment.get_appointment,
        {
            method: "GET",
            params: filters,
            signal,
        }
    );
}