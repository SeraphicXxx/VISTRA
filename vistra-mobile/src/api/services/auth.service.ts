import { apiClient } from "@/api/axios_client";
import { API_ENDPOINTS } from "@/config/ApiConfig";
import { handleServiceErrors, ok } from "@/api/service_helpers";

export type LoginResponse = {
  user: {
    id: string;
    user_id: string;
    email: string;
    role: string;
  };
  access_token: string;
  refresh_token: string;
};

type RefreshResponse = {
  access_token: string;
  refresh_token?: string;
};

type LogoutResponse = unknown;

/**
 * Service methods return { success: true, data } or { success: false, ... }.
 * Errors are normalized by handleServiceErrors — screens/hooks never
 * need try/catch around service calls.
 */
export const authService = {
  login: handleServiceErrors<[string, string], LoginResponse>(
    async (identifier: string, password: string) => {
      const { data } = await apiClient<LoginResponse>(
        API_ENDPOINTS.auth.login,
        {
          method: "POST",
          data: { identifier, password },
        }
      );
      return data;
    }
  ),

  refresh: handleServiceErrors<[string], RefreshResponse>(
    async (refreshToken: string) => {
      const { data } = await apiClient<RefreshResponse>(
        API_ENDPOINTS.auth.refresh_token,
        {
          method: "POST",
          data: { refresh_token: refreshToken },
        }
      );
      return data;
    }
  ),

  logout: handleServiceErrors<[], LogoutResponse>(async () => {
    const { data } = await apiClient<LogoutResponse>(
      API_ENDPOINTS.auth.logout,
      {
        method: "POST",
      }
    );
    return data;
  }),
};
