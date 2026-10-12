import { API_ENDPOINTS } from "/@/config/ApiConfig";
import { LoginRequest, LoginStaffResponse } from "/@/api/schema/AuthSchema";
import {sendResource} from "/@/api/resource";

export async function login(
    request: LoginRequest,
    signal?: AbortSignal
) {
    return sendResource<LoginStaffResponse>(
        "POST",
        API_ENDPOINTS.auth.login,
        request,
        signal,
    );
}
