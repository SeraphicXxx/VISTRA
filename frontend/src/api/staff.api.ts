import { apiClient } from "./client.ts";
import { API_ENDPOINTS } from "../config/ApiConfig.js";
import { StaffModel } from "../repository/StaffModel.js";

export const getStaffById = async (
    staffId: string
): Promise<StaffModel> => {
    const { data } = await apiClient(
        API_ENDPOINTS.admin.getStaffById(staffId)
    );
    console.log(data);
    if (!data || data.length === 0) {
        throw new Error("Staff member not found");
    }

    return new StaffModel(data.data);
};
