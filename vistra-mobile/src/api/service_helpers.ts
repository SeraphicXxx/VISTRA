import {
    AxiosError,
    isAxiosError,
} from "axios";
import {
    FastAPIValidationError,
    FastAPIConflictError,
    type ValidationError,
    type FastAPIErrorResponse,
} from "@/api/axios_client";

/**
 * Success envelope: { success: true, data?, message?, ...extra }
 * Mirrors backend utils/service_helpers.ok()
 */
export function ok<T = unknown>(
    data?: T,
    message?: string,
    extra?: Record<string, unknown>
) {
    const result: Record<string, unknown> = { success: true };

    if (data !== undefined) {
        result.data = data;
    }

    if (message !== undefined) {
        result.message = message;
    }

    if (extra) {
        Object.assign(result, extra);
    }

    return result as { success: true } & Record<string, unknown>;
}

/**
 * Error envelope: { success: false, message, code?, fieldErrors? }
 */
export function fail(
    message: string,
    code?: string | number,
    fieldErrors?: Record<string, string>
) {
    return {
        success: false,
        message,
        ...(code !== undefined ? { code } : {}),
        ...(fieldErrors ? { fieldErrors } : {}),
    };
}

/**
 * Carries structured service errors (code + fieldErrors) across the
 * React Query mutation boundary so screens can map them to form fields.
 */
export class ServiceError extends Error {
    public code: string | number | undefined;
    public fieldErrors: Record<string, string> | undefined;

    constructor(message: string, code?: string | number, fieldErrors?: Record<string, string>) {
        super(message);
        this.name = "ServiceError";
        this.code = code;
        this.fieldErrors = fieldErrors;
    }
}

/**
 * Normalizes any thrown error into a fail() envelope.
 * - FastAPIValidationError → 422 with fieldErrors
 * - FastAPIConflictError → 409
 * - AxiosError 401 → "Unauthorized"
 * - AxiosError 422 → validation errors
 * - AxiosError 409 → conflict
 * - AxiosError 500+ → "Internal server error"
 * - Network/other → message or "Network error"
 */
export function normalizeError(error: unknown) {
    // FastAPIValidationError (422)
    if (error instanceof FastAPIValidationError) {
        const fieldErrors: Record<string, string> = {};
        for (const err of error.detail) {
            const loc = err.loc;
            if (Array.isArray(loc) && loc.length > 0) {
                const field = String(loc[loc.length - 1]);
                fieldErrors[field] = err.msg;
            }
        }
        return fail(
            error.message,
            422,
            Object.keys(fieldErrors).length ? fieldErrors : undefined
        );
    }

    // FastAPIConflictError (409)
    if (error instanceof FastAPIConflictError) {
        return fail(error.detail, 409);
    }

    // Axios errors
    if (isAxiosError(error)) {
        const axiosErr = error as AxiosError;
        const status = axiosErr.response?.status;

        if (status === 401) {
            return fail("Unauthorized", 401);
        }

        if (status === 422) {
            const data = axiosErr.response?.data as FastAPIErrorResponse | undefined;
            const fieldErrors: Record<string, string> = {};
            if (data?.detail) {
                for (const err of data.detail) {
                    const loc = err.loc;
                    if (Array.isArray(loc) && loc.length > 0) {
                        fieldErrors[String(loc[loc.length - 1])] = err.msg;
                    }
                }
            }
            return fail(
                "Validation failed",
                422,
                Object.keys(fieldErrors).length ? fieldErrors : undefined
            );
        }

        if (status === 409) {
            const data = axiosErr.response?.data as { detail?: string } | undefined;
            return fail(data?.detail || "Conflict", 409);
        }

        if (status && status >= 500) {
            return fail("Internal server error", status);
        }

        if (!status) {
            // Network error (no response received)
            return fail(
                axiosErr.message || "Network error",
                "NETWORK"
            );
        }

        return fail(
            axiosErr.message || `Request failed (${status})`,
            status
        );
    }

    // Plain Error
    if (error instanceof Error) {
        return fail(error.message, "UNKNOWN");
    }

    return fail(String(error), "UNKNOWN");
}

/**
 * Service method wrapper. Mirrors backend handle_service_errors.
 *
 * Wraps an async service function so that:
 * - Known error types (FastAPI*, Axios) are normalized via normalizeError()
 * - Unexpected errors are caught and turned into a fail() envelope
 * - Returns { success: true, data } on success or { success: false, ... } on failure
 *
 * Usage:
 *   const login = handleServiceErrors(async (identifier, password) => {
 *       const { data } = await apiClient(...);
 *       return data;
 *   });
 */
export function handleServiceErrors<
    TArgs extends unknown[],
    TReturn
>(
    fn: (...args: TArgs) => Promise<TReturn>
) {
    return async (...args: TArgs) => {
        try {
            const data = await fn(...args);
            return ok(data);
        } catch (error) {
            return normalizeError(error);
        }
    };
}
