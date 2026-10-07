import { apiClient } from "/@/api/axios_client";
import { API_ENDPOINTS } from "/@/config/ApiConfig";
import { LoginRequest, LoginStaffResponse } from "/@/api/schema/AuthSchema";

export const login = async (
    request: LoginRequest
): Promise<LoginStaffResponse> => {
    const result = await apiClient<LoginStaffResponse>(
        API_ENDPOINTS.auth.login,
        {
            method: "POST",
            data: request,
        }
    );

    return result.data;
};
