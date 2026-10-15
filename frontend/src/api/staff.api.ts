import { API_ENDPOINTS } from "/@/config/ApiConfig";
import { ApiResponse } from "/@/api/schema/ApiResponseSchema";
import { StaffData, StaffPermissions, UpdateStaffPermissions } from "/@/api/schema/StaffSchema";
import {getResource, sendResource} from "/@/api/resource";

export const getStaffById = (
    staffId: string,
    signal?: AbortSignal
) => {
    return getResource<ApiResponse<StaffData>>(
        API_ENDPOINTS.staff.getStaffById(staffId),
        signal,
    );
};

export const getAllStaff = (
    signal?: AbortSignal
) => {
    return getResource<ApiResponse<StaffData[]>>(
        API_ENDPOINTS.staff.get_all_staff,
        signal,
    );
};

export const deleteStaff = (
    staffId: string,
    signal?: AbortSignal
) => {
    return sendResource<ApiResponse<unknown>>(
        "DELETE",
        API_ENDPOINTS.staff.delete_staff(staffId),
        undefined,
        signal,
    );
};

export const updateStaffPermissions = (
    staffId: string,
    payload: UpdateStaffPermissions,
    signal?: AbortSignal
) => {
    return sendResource<ApiResponse<StaffPermissions>>(
        "PATCH",
        API_ENDPOINTS.staff.update_staff_permissions(staffId),
        payload,
        signal,
    );
};
