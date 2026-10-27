import {CreateDentalVisit, DentalRecordDetailSchema, DentalVisitSchema, UpdateDentalVisit} from "/@/api/schema/DentalSchema";
import {ApiMessageResponse, ApiResponse, PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {API_ENDPOINTS} from "/@/config/ApiConfig";
import {DentalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {getResource, listResource, sendResource} from "/@/api/resource";

export function createDentalVisit(
    record: CreateDentalVisit,
    signal?: AbortSignal
) {
    return sendResource<ApiMessageResponse>(
        "POST",
        API_ENDPOINTS.dental.create_dental_visit,
        record,
        signal
    );
}

export function getDentalVisit(
    filter?: DentalVisitFilters,
    signal?: AbortSignal
) {
    return listResource<ApiResponse<PaginatedData<DentalVisitSchema>>>(
        API_ENDPOINTS.dental.get_dental_visit,
        filter,
        signal
    );
}

export function getDentalRecordById(
    patientId: string,
    dentalId: string,
    signal?: AbortSignal
) {
    return getResource<ApiResponse<DentalRecordDetailSchema>>(
        API_ENDPOINTS.dental.get_dental_record(patientId, dentalId),
        signal
    );
}

export function updateDentalVisit(
    patientId: string,
    dentalId: string,
    payload: UpdateDentalVisit,
    signal?: AbortSignal
) {
    return sendResource<ApiResponse<unknown>>(
        "PATCH",
        API_ENDPOINTS.dental.update_dental_visit(patientId, dentalId),
        payload,
        signal
    );
}
