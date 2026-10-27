import type { AxiosRequestConfig } from "axios";
import { apiClient } from "/@/api/axios_client";

type QueryParams = AxiosRequestConfig["params"];
type SendMethod = "POST" | "PATCH" | "PUT" | "DELETE";

/** GET collection endpoint with optional ?filters. Returns raw { response, data }. */
export function listResource<T>(url: string, filters?: QueryParams, signal?: AbortSignal) {
    return apiClient<T>(url, { method: "GET", params: filters, signal });
}

/** GET single-resource endpoint. Returns raw { response, data }. */
export function getResource<T>(url: string, signal?: AbortSignal) {
    return apiClient<T>(url, { method: "GET", signal });
}

/** Mutating request (POST/PATCH/PUT/DELETE) with optional body. Returns raw { response, data }. */
export function sendResource<T>(method: SendMethod, url: string, payload?: unknown, signal?: AbortSignal) {
    return apiClient<T>(url, { method, data: payload, signal });
}
