import { apiClient } from "/@/api/client";
import { API_ENDPOINTS } from "/@/config/ApiConfig.js";
import { StaffModel } from "/@/repository/StaffModel.js";

interface ApiResponse<T> {
    success: boolean;
    data: Array<T>;
}

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
    if (!apiResponse) {
        throw new Error("Staff member not found");
    }
    console.log(apiResponse);
    return new StaffModel(apiResponse.data[0]);
};
