import { apiClient } from "./client";
import { API_ENDPOINTS } from "../config/ApiConfig.js";

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
}

export const loginStaff = async ({
                                     staffId,
                                     password,
                                 }: LoginStaffParams) => {
    return apiClient<LoginStaffResponse>(
        API_ENDPOINTS.staff.login,
        {
            method: "POST",
            body: JSON.stringify({
                email: staffId,
                password,
            }),
        }
    );
};
