import { API_ENDPOINTS } from "/@/config/ApiConfig";
import { ApiResponse } from "/@/api/schema/ApiResponseSchema";
import { StaffData } from "/@/api/schema/StaffSchema";
import {getResource} from "/@/api/resource";

export const getStaffById = (
    staffId: string,
    signal?: AbortSignal
) => {
    return getResource<ApiResponse<StaffData>>(
        API_ENDPOINTS.staff.getStaffById(staffId),
        signal,
    );
};
