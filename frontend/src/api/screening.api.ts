import { sendResource } from "/@/api/resource";
import { API_ENDPOINTS } from "/@/config/ApiConfig";
import {ApiResponse} from "/@/api/schema/ApiResponseSchema"
import { ScreeningPredictRequest, ScreeningPredictionData } from "/@/api/schema/ScreeningSchema";

export async function predictScreening(
    payload: ScreeningPredictRequest,
    signal?: AbortSignal
){
    const {data} = await sendResource<ApiResponse<ScreeningPredictionData>>(
        "POST",
        API_ENDPOINTS.screening.predict,
        payload,
        signal
    );
    return data;
}