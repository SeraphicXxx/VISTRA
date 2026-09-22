import {CreateDentalVisit} from "/@/api/schema/DentalSchema";
import {ApiMessageResponse, ApiResponse} from "/@/api/schema/ApiResponseSchema";
import {apiClient} from "/@/api/axios_client";
import {API_ENDPOINTS} from "/@/config/ApiConfig";

export async function createDentalVisit(
    record:CreateDentalVisit,
    signal?: AbortSignal
) {
    return apiClient<ApiMessageResponse>(
        API_ENDPOINTS.dental.createDentalVisit,
        {
            method: "POST",
            data: record,
            signal
        }
    );
}
