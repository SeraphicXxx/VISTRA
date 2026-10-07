export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}
export interface PaginatedData<T> {
    items: T[];
    page: number;
    page_size: number;
    total: number;
    total_pages: number
}
export interface ApiMessageResponse {
    success: boolean;
    message: string;
}