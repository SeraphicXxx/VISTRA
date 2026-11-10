import { SessionUser } from "/@/utils/SessionManager";

export interface LoginRequest {
    identifier?: string;
    email?: string;
    patient_id?: string;
    staff_id?: string;
    password: string;
    on_duty?: boolean;
    accepted_terms?: boolean;
    accepted_at?: string;
}

export interface LoginStaffResponse {
    success: boolean;
    user: SessionUser;
    access_token: string;
    refresh_token: string;
}
