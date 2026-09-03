import { apiClient } from "/@/api/client";
import { API_ENDPOINTS } from "/@/config/ApiConfig";

interface LoginStaffParams {
    staffId: string;
    password: string;
}
interface RefreshTokenParam {
    refresh_token: string;
}
interface LoginStaffResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    detail?: string;
}

export const loginStaff = async ({
                                     staffId,
                                     password,
                                 }: LoginStaffParams) => {
    const { response, data } = await apiClient<LoginStaffResponse>(
        API_ENDPOINTS.staff.login,
        {
            method: "POST",
            body: JSON.stringify({
                email: staffId,
                password,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            data?.detail ?? "Login failed"
        );
    }

    return data;
};
