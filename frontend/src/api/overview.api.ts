import {ApiResponse} from "/@/api/schema/ApiResponseSchema";
import {apiClient} from "/@/api/axios_client";
import {API_ENDPOINTS} from "/@/config/ApiConfig";
import {OverviewStatsSchema} from "/@/api/schema/OverviewSchema";

export async function getOverviewStats(signal?: AbortSignal) {
    return apiClient<ApiResponse<OverviewStatsSchema>>(
        API_ENDPOINTS.overview.get_stats,
        {
            method: "GET",
            signal,
        }
    );
}
