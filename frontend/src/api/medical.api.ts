import {ApiResponse, PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {API_ENDPOINTS} from "/@/config/ApiConfig";
import {MedicalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {CreateMedicalVisit, CreateMedicalVisitResponse, MedicalRecordDetailSchema, MedicalVisitSchema, UpdateMedicalVisit} from "/@/api/schema/MedicalSchema";
import {getResource, listResource, sendResource} from "/@/api/resource";

export function createMedicalVisit(
    record: CreateMedicalVisit,
    signal?: AbortSignal
) {
    return sendResource<CreateMedicalVisitResponse>(
        "POST",
        API_ENDPOINTS.medical.create_medical_visit,
        record,
        signal
    );
}

export function getMedicalVisit(
    filter?: MedicalVisitFilters,
    signal?: AbortSignal
) {
    return listResource<ApiResponse<PaginatedData<MedicalVisitSchema>>>(
        API_ENDPOINTS.medical.get_medical_visit,
        filter,
        signal
    );
}

export function getMedicalRecordById(
    patientId: string,
    medicalId: string,
    signal?: AbortSignal
) {
    return getResource<ApiResponse<MedicalRecordDetailSchema>>(
        API_ENDPOINTS.medical.get_medical_record(patientId, medicalId),
        signal
    );
}

export function updateMedicalVisit(
    patientId: string,
    medicalId: string,
    payload: UpdateMedicalVisit,
    signal?: AbortSignal
) {
    return sendResource<ApiResponse<unknown>>(
        "PATCH",
        API_ENDPOINTS.medical.update_medical_visit(patientId, medicalId),
        payload,
        signal
    );
}
