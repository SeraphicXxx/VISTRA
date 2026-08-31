import { apiClient } from "/@/api/client";
import { API_ENDPOINTS } from "/@/config/ApiConfig.js";
import { ApiMessageResponse } from "/@/api/schema/ApiResponseSchema"
import { CreatePatientSchema } from "/@/api/schema/PatientSchema";

export const createPatientAccount = async  (
    request: CreatePatientSchema,
    signal?: AbortSignal
): Promise<ApiMessageResponse> => {
    const { data: apiResponse } = await apiClient<ApiMessageResponse>(
        API_ENDPOINTS.patient.create_patient,
        {
            method: "POST",
            body: JSON.stringify(request),
            signal,
        }
    );
    return apiResponse;
}
