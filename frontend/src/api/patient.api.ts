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
    // Invalidate cached picture before upload
    invalidateProfilePictureCache("me");

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

// Module-level cache for profile picture object URLs.
// Key: patientId or "me" for current user. Value: object URL string.
const profilePictureCache = new Map<string, string>();

export function getCachedProfilePicture(key: string): string | null {
    return profilePictureCache.get(key) ?? null;
}

export function invalidateProfilePictureCache(key?: string): void {
    if (key) {
        const url = profilePictureCache.get(key);
        if (url) URL.revokeObjectURL(url);
        profilePictureCache.delete(key);
    } else {
        // Invalidate all
        for (const url of profilePictureCache.values()) {
            URL.revokeObjectURL(url);
        }
        profilePictureCache.clear();
    }
}

export async function fetchProfilePictureBlob(): Promise<string | null> {
    const cacheKey = "me";
    const cached = profilePictureCache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await apiClient(
            API_ENDPOINTS.profilePicture.get,
            { method: "GET", responseType: "blob" }
        );
        const blob = response.data as Blob;
        if (blob && blob.size > 0) {
            const url = URL.createObjectURL(blob);
            profilePictureCache.set(cacheKey, url);
            return url;
        }
        return null;
    } catch {
        return null;
    }
}

export function getPatientProfilePictureUrl(patientId: string): string {
    return `${getApiUrl()}${API_ENDPOINTS.profilePicture.getPatient(patientId)}`;
}

export async function fetchPatientProfilePictureBlob(patientId: string): Promise<string | null> {
    const cached = profilePictureCache.get(patientId);
    if (cached) return cached;

    try {
        const response = await apiClient(
            API_ENDPOINTS.profilePicture.getPatient(patientId),
            { method: "GET", responseType: "blob" }
        );
        const blob = response.data as Blob;
        if (blob && blob.size > 0) {
            const url = URL.createObjectURL(blob);
            profilePictureCache.set(patientId, url);
            return url;
        }
        return null;
    } catch {
        return null;
    }
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
