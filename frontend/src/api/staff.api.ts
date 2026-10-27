import { API_ENDPOINTS } from "/@/config/ApiConfig";
import { ApiResponse } from "/@/api/schema/ApiResponseSchema";
import { StaffData, StaffPermissions, UpdateStaffAccess, CreateStaffRequest } from "/@/api/schema/StaffSchema";
import {getResource, sendResource} from "/@/api/resource";

export const createStaff = (
    payload: CreateStaffRequest,
    signal?: AbortSignal
) => {
    return sendResource<ApiResponse<StaffData>>(
        "POST",
        API_ENDPOINTS.staff.create_staff,
        payload,
        signal,
    );
};

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

export const updateStaffAccess = (
    staffId: string,
    payload: UpdateStaffAccess,
    signal?: AbortSignal
) => {
    return sendResource<ApiResponse<{role?: string | null; permissions?: StaffPermissions | null}>>(
        "PATCH",
        API_ENDPOINTS.staff.update_staff_access(staffId),
        payload,
        signal,
    );
};
