import {API_ENDPOINTS, getApiUrl} from "/@/config/ApiConfig";
import {ApiResponse, ApiMessageResponse, PaginatedData} from "/@/api/schema/ApiResponseSchema"
import {CreatePatientSchema, PatientProfile, PatientInfo, PatientRecord, UpdatePatientProfile} from "/@/api/schema/PatientSchema";
import {PatientFilters, MedicalVisitFilters, DentalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {PatientMedicalTabVisit} from "/@/api/schema/PatientMedicalTabSchema";
import {PatientDentalTabVisit} from "/@/api/schema/PatientDentalTabSchema";
import {MedicalRecordDetailSchema} from "/@/api/schema/MedicalSchema";
import {DentalRecordDetailSchema} from "/@/api/schema/DentalSchema";
import {apiClient} from "/@/api/axios_client";
import {getResource, listResource, sendResource} from "/@/api/resource";

export function uploadProfilePicture(
    file: File,
    signal?: AbortSignal
) {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient<{ success: boolean; data: { path: string }; message: string }>(
        API_ENDPOINTS.profilePicture.upload,
        {
            method: "POST",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            signal,
        }
    );
}

export function getProfilePictureUrl(): string {
    return `${getApiUrl()}${API_ENDPOINTS.profilePicture.get}`;
}

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

export function getPatientMedicalTab(
    filters?: MedicalVisitFilters,
    signal?: AbortSignal
) {
    return listResource<ApiResponse<PaginatedData<PatientMedicalTabVisit>>>(
        API_ENDPOINTS.patient.get_patient_medical_tab,
        filters,
        signal,
    );
}

export function getPatientDentalTab(
    filters?: DentalVisitFilters,
    signal?: AbortSignal
) {
    return listResource<ApiResponse<PaginatedData<PatientDentalTabVisit>>>(
        API_ENDPOINTS.patient.get_patient_dental_tab,
        filters,
        signal,
    );
}

export function getPatientMedicalRecord(
    medicalId: string,
    signal?: AbortSignal
) {
    return getResource<ApiResponse<MedicalRecordDetailSchema>>(
        API_ENDPOINTS.patient.get_patient_medical_record(medicalId),
        signal,
    );
}

export function getPatientDentalRecord(
    dentalId: string,
    signal?: AbortSignal
) {
    return getResource<ApiResponse<DentalRecordDetailSchema>>(
        API_ENDPOINTS.patient.get_patient_dental_record(dentalId),
        signal,
    );
}

export function getPatientMedicalHistory(
    signal?: AbortSignal
) {
    return getResource<ApiResponse<Record<string, unknown>>>(
        API_ENDPOINTS.patient.get_patient_medical_history,
        signal,
    );
}

export function getMyProfile(
    signal?: AbortSignal
) {
    return getResource<ApiResponse<PatientInfo>>(
        API_ENDPOINTS.patient.get_my_profile,
        signal,
    );
}

export function getPatientFamilyHistory(
    signal?: AbortSignal
) {
    return getResource<ApiResponse<Record<string, unknown>>>(
        API_ENDPOINTS.patient.get_patient_family_history,
        signal,
    );
}

export function getLatestVitalSigns(
    patientId: string,
    signal?: AbortSignal
) {
    return getResource<ApiResponse<{
        id: number;
        patient_id: string;
        height: number | null;
        weight: number | null;
        temperature: number | null;
        heart_rate: number | null;
        spo2: number | null;
        recorded_at: string;
    }>>(
        API_ENDPOINTS.patient.get_latest_vital_signs(patientId),
        signal,
    );
}

export function getPatientMedicalDentalSummary(
    signal?: AbortSignal
) {
    return getResource<ApiResponse<{
        medical: PatientRecord[];
        dental: PatientRecord[];
    }>>(
        API_ENDPOINTS.patient.get_patient_medical_dental_summary,
        signal,
    );
}
