import { apiClient } from "./client";
import {API_ENDPOINTS} from "../config/ApiConfig.js";


export const loginStaff = async ({ staffId, password }) => {
    return apiClient(API_ENDPOINTS.admin.login, {
        method: "POST",
        body: JSON.stringify({
            email: staffId,
            password,
        }),
    });
};