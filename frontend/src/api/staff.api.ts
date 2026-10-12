import {apiClient} from "/@/api/axios_client";
import { API_ENDPOINTS } from "/@/config/ApiConfig.js";
import { StaffModel } from "/@/repository/StaffModel.js";
import { ApiResponse } from "/@/api/schema/ApiResponseSchema"

export const getStaffById = async (
    staffId: string,
    signal?: AbortSignal
): Promise<StaffModel> => {
    const { data: apiResponse } = await apiClient<ApiResponse<StaffModel>>(
        API_ENDPOINTS.staff.getStaffById(staffId),
        {
            method: "GET",
            signal,
        }
    );

    if (!apiResponse.data || !apiResponse) {
        throw new Error(`Staff not found for ${staffId}`);
    }

    return new StaffModel(apiResponse.data);
};