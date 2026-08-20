import {apiClient} from "./client.js";
import {API_ENDPOINTS} from "../config/ApiConfig.js";
import {StaffModel} from "../repository/StaffModel.js";

export const getStaffById = async (staffId) => {
    const {data} = await apiClient(API_ENDPOINTS.admin.getStaffById(staffId));
    return new StaffModel(data);
};