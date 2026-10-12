import {API_ENDPOINTS} from "/@/config/ApiConfig";
import {ApiResponse, ApiMessageResponse, PaginatedData} from "/@/api/schema/ApiResponseSchema"
import {CreatePatientSchema, PatientProfile, PatientInfo, UpdatePatientProfile} from "/@/api/schema/PatientSchema";
import {PatientFilters} from "/@/api/schema/FilterSchemaCollection";
import {getResource, listResource, sendResource} from "/@/api/resource";

export async function createPatientAccount(
    request: CreatePatientSchema,
    signal?: AbortSignal
): Promise<ApiMessageResponse> {
    const {data} = await sendResource<ApiMessageResponse>(
        "POST",
        API_ENDPOINTS.patient.create_patient,
        request,
        signal,
    );

    return data;
}

export function getAllPatientProfiles(
    filters?: PatientFilters,
    signal?: AbortSignal
) {
    return listResource<ApiResponse<PaginatedData<PatientProfile>>>(
        API_ENDPOINTS.patient.get_all_patient_profile,
        filters,
        signal,
    );
}

export function getPatientSummaryRecord(
    patientId: string,
    signal?: AbortSignal
) {
    return getResource<ApiResponse<PatientInfo>>(
        API_ENDPOINTS.patient.get_summary_record(patientId),
        signal,
    );
}

export function updatePatientProfile(
    patientId: string,
    payload: UpdatePatientProfile,
    signal?: AbortSignal
) {
    return sendResource<ApiResponse<PatientProfile>>(
        "PATCH",
        API_ENDPOINTS.patient.update_patient_profile(patientId),
        payload,
        signal,
    );
}
