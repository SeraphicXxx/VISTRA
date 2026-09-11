import {apiClient} from "/@/api/axios_client";
import {API_ENDPOINTS} from "/@/config/ApiConfig.js";
import {ApiDataResponse, ApiMessageResponse} from "/@/api/schema/ApiResponseSchema"
import {CreatePatientSchema, PatientProfile} from "/@/api/schema/PatientSchema";

export const createPatientAccount = async (
    request: CreatePatientSchema,
    signal?: AbortSignal
): Promise<ApiMessageResponse> => {
    const {data} = await apiClient<ApiMessageResponse>(
        API_ENDPOINTS.patient.create_patient,
        {
            method: "POST",
            data: request,
            signal,
        }
    );

    return data;
};

export const getAllPatientProfiles = async (): Promise<ApiDataResponse<PatientProfile>> => {
    const {data} = await apiClient<ApiDataResponse<PatientProfile>>(
        API_ENDPOINTS.patient.get_all_patient_profile,
        {
            method: "GET",
        }
    );

    return data;
};
