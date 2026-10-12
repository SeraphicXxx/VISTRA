import { API_ENDPOINTS } from "/@/config/ApiConfig.js";
import { StaffModel } from "/@/repository/StaffModel.js";
import { ApiResponse } from "/@/api/schema/ApiResponseSchema"
import {getResource} from "/@/api/resource";

export const getStaffById = async (
    staffId: string,
    signal?: AbortSignal
): Promise<StaffModel> => {
    const { data: apiResponse } = await getResource<ApiResponse<StaffModel>>(
        API_ENDPOINTS.staff.getStaffById(staffId),
        signal,
    );

    if (!apiResponse.data || !apiResponse) {
        throw new Error(`Staff not found for ${staffId}`);
    }

    return new StaffModel(apiResponse.data);
};
