import { apiClient } from "/@/api/client";
import { API_ENDPOINTS } from "/@/config/ApiConfig";

interface LoginStaffParams {
    staffId: string;
    password: string;
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
    let result;

    try {
        result = await apiClient<LoginStaffResponse>(
            API_ENDPOINTS.staff.login,
            {
                method: "POST",
                body: JSON.stringify({
                    email: staffId,
                    password,
                }),
            }
        );
    } catch (e) {
        throw new Error(
            "Unable to connect to server. Please try again later."
        );
    }

    const { response, data } = result;

    if (!response.ok) {
        throw new Error(data?.detail ?? "Login failed");
    }

    return data;
};
