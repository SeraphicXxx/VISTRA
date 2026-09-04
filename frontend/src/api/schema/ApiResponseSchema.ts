export interface ApiDataResponse<T> {
    success: boolean;
    message?: string;
    data: Array<T>;
}

export interface ApiMessageResponse {
    success: boolean;
    message: string;
}

export interface ValidationError {
    type: string;
    loc: (string | number)[];
    msg: string;
    input?: unknown;
    ctx?: Record<string, unknown>;
}

export interface FastAPIErrorResponse {
    detail: ValidationError[];
}

export interface PasswordAndId {
    staffId: string;
    password: string;
}

export interface LoginStaffResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    detail: string
    user: userSessionField;
}

interface userSessionField {
    email: string
    id: string
    staff_id: string
}
