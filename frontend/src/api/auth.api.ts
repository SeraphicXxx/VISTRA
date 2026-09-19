import axios from "axios";

import {apiClient} from "/@/api/axios_client";
import {API_ENDPOINTS} from "/@/config/ApiConfig";
import {
    PasswordAndId,
    LoginStaffResponse
} from "/@/api/schema/ApiResponseSchema";

export const loginStaff = async ({
                                     email,
                                     password,
                                 }: PasswordAndId): Promise<LoginStaffResponse> => {
    const result = await apiClient<LoginStaffResponse>(
        API_ENDPOINTS.staff.login,
        {
            method: "POST",
            data: {
                email,
                password,
            },
        }
    );

    return result.data;
};