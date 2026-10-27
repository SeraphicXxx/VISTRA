import { useMutation } from "@tanstack/react-query";
import { authService, type LoginResponse } from "@/api/services/auth.service";
import { setTokens, setUserId } from "@/api/axios_client";
import { ServiceError } from "@/api/service_helpers";

export function useLogin() {
  return useMutation<LoginResponse, ServiceError, { identifier: string; password: string }>({
    mutationFn: async ({ identifier, password }) => {
      const result = await authService.login(identifier, password);

      if (!result.success) {
        throw new ServiceError(
          result.message,
          result.code,
          result.fieldErrors
        );
      }

      const data = (result as { success: true; data: LoginResponse }).data;
      setTokens(data.access_token, data.refresh_token);

      // Store patient_id (user_id) for fetching patient-scoped data.
      if (data.user?.user_id) {
        await setUserId(data.user.user_id);
      }

      return data;
    },
  });
}
