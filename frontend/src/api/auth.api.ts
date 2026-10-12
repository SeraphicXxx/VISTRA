import { API_ENDPOINTS } from "/@/config/ApiConfig";
import { LoginRequest, LoginStaffResponse } from "/@/api/schema/AuthSchema";
import {sendResource} from "/@/api/resource";

export const login = async (
    request: LoginRequest
): Promise<LoginStaffResponse> => {
    const result = await sendResource<LoginStaffResponse>(
        "POST",
        API_ENDPOINTS.auth.login,
        request,
    );

    return result.data;
};
