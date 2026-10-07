import { SessionUser } from "/@/utils/SessionManager";

export interface LoginRequest {
    identifier?: string;
    email?: string;
    patient_id?: string;
    staff_id?: string;
    password: string;
}

export interface PasswordAndId {
    email: string;
    password: string;
}

export interface LoginStaffResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    detail: string
    user: SessionUser;
}
