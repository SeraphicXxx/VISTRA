export interface ApiDataResponse<T> {
    success: boolean;
    message?: string;
    data: Array<T>;
}
export interface ApiMessageResponse {
    success: boolean;
    message: string;
}