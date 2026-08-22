import { apiClient } from "./client.ts";
import { API_ENDPOINTS } from "../config/ApiConfig.js";
import { StaffModel } from "../repository/StaffModel.js";

export const getStaffById = async (
    staffId: string,
    signal?: AbortSignal
): Promise<StaffModel> => {
    const { data } = await apiClient(
        API_ENDPOINTS.admin.getStaffById(staffId),
        {
            method: "GET",
            signal,
        }
    );
    if (!data || data.length === 0) {
        throw new Error("Staff member not found");
    }

    return new StaffModel(data.data);
};
