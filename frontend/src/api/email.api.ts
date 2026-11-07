import {API_ENDPOINTS} from "/@/config/ApiConfig";
import {ApiMessageResponse, ApiResponse} from "/@/api/schema/ApiResponseSchema";
import {sendResource} from "/@/api/resource";

export interface SendEmailRequest {
    to: string;
    subject: string;
    body: string;
}

export function sendEmail(
    request: SendEmailRequest,
    signal?: AbortSignal
) {
    return sendResource<ApiResponse<SendEmailRequest>>(
        "POST",
        API_ENDPOINTS.email.send,
        request,
        signal,
    );
}