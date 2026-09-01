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