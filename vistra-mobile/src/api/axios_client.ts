import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";
import { API_ENDPOINTS, getApiUrl } from "@/config/ApiConfig";

// ---------------------------------------------------------------------------
// Token store (replaces web sessionManager/localStorage).
// SecureStore is async, so these helpers return promises.
// ---------------------------------------------------------------------------

const TOKEN_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER_ID: "user_id",
} as const;

const secureStore = {
    async get(key: string): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(key);
        } catch {
            return null;
        }
    },

    async set(key: string, value: string): Promise<void> {
        await SecureStore.setItem(key, value);
    },

    async remove(key: string): Promise<void> {
        await SecureStore.deleteItemAsync(key);
    },

    async clear(): Promise<void> {
        await Promise.all([
            SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN),
            SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN),
            SecureStore.deleteItemAsync(TOKEN_KEYS.USER_ID),
        ]);
    },
};

// Exported for login/logout flows to persist/clear tokens.
export const setTokens = async (
    accessToken: string,
    refreshToken?: string
): Promise<void> => {
    await secureStore.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
        await secureStore.set(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    }
};

export const clearTokens = async (): Promise<void> => {
    await secureStore.clear();
};

export const getStoredAccessToken = async (): Promise<string | null> => {
    return secureStore.get(TOKEN_KEYS.ACCESS_TOKEN);
};

export const setUserId = async (userId: string): Promise<void> => {
    await secureStore.set(TOKEN_KEYS.USER_ID, userId);
};

export const getStoredUserId = async (): Promise<string | null> => {
    return secureStore.get(TOKEN_KEYS.USER_ID);
};

const API_URL = getApiUrl();

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        const refreshToken = await secureStore.get(TOKEN_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        try {
            const response = await axios.post(
                `${API_URL}${API_ENDPOINTS.auth.refresh_token}`,
                {
                    refresh_token: refreshToken,
                }
            );

            const { access_token, refresh_token } = response.data;

            await secureStore.set(TOKEN_KEYS.ACCESS_TOKEN, access_token);
            if (refresh_token) {
                await secureStore.set(TOKEN_KEYS.REFRESH_TOKEN, refresh_token);
            }

            return access_token;
        } catch (error) {
            await secureStore.clear();
            throw new Error("Session expired");
        }
    })();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
};

// ---------------------------------------------------------------------------
// Axios instance (mirrors web axios_client.ts)
// ---------------------------------------------------------------------------

const axiosClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    async (config) => {
        const accessToken = await secureStore.get(TOKEN_KEYS.ACCESS_TOKEN);

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Error classes (mirrors web api/errors.ts)
// ---------------------------------------------------------------------------

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

export class FastAPIValidationError extends Error {
    public detail: ValidationError[];

    constructor(response: FastAPIErrorResponse) {
        super("Validation failed");
        this.name = "FastAPIValidationError";
        this.detail = response.detail;
    }
}

export class FastAPIConflictError extends Error {
    public detail: string;

    constructor(detail: string) {
        super(detail);
        this.name = "FastAPIConflictError";
        this.detail = detail;
    }
}

// ---------------------------------------------------------------------------
// Response interceptor (mirrors web axios_client.ts)
// ---------------------------------------------------------------------------

axiosClient.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== API_ENDPOINTS.auth.login
        ) {
            originalRequest._retry = true;

            try {
                const accessToken = await refreshAccessToken();

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${accessToken}`,
                };

                return axiosClient(originalRequest);
            } catch (refreshError) {
                await secureStore.clear();
                throw refreshError;
            }
        }

        if (error.response?.status === 422) {
            const data = error.response.data as FastAPIErrorResponse;
            throw new FastAPIValidationError(data);
        }

        if (error.response?.status === 409) {
            const data = error.response.data as { detail: string };
            throw new FastAPIConflictError(data.detail || "Conflict");
        }

        throw error;
    }
);

// ---------------------------------------------------------------------------
// Public wrapper (mirrors web apiClient<T>)
// ---------------------------------------------------------------------------

export async function apiClient<T = unknown>(
    endpoint: string,
    options: AxiosRequestConfig = {}
): Promise<{
    response: Awaited<ReturnType<typeof axiosClient>>;
    data: T;
}> {
    const response = await axiosClient({
        url: endpoint,
        ...options,
    });

    return {
        response,
        data: response.data as T,
    };
}

export default axiosClient;
