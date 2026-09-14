export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}
export interface PaginatedData<T> {
    items: T[];
    page: number;
    page_sizes: number;
    total: number;
    total_pages: number
}
export interface ApiMessageResponse {
    success: boolean;
    message: string;
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
    user: userSessionField;
}

interface userSessionField {
    email: string
    id: string
    staff_id: string
}
