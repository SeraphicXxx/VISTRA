import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "/@/config/RoutePaths";
import { useAuth } from "/@/context/AuthContext";
import { sessionManager } from "/@/utils/SessionManager";
import { apiClient } from "/@/api/axios_client";
import { API_ENDPOINTS } from "/@/config/ApiConfig";

export default function ProtectedPatientRoute(): React.JSX.Element {
    const { isAuthenticated } = useAuth();

    const isPatient = isAuthenticated && sessionManager.isAuthenticated() && sessionManager.isPatientLike();

    const { data, isLoading } = useQuery({
        queryKey: ["patient", "registration-status"],
        queryFn: async () => {
            const { data } = await apiClient(API_ENDPOINTS.patient.registration_status);
            return data as { registration_status?: string } | null;
        },
        enabled: isPatient,
        staleTime: 30_000,
    });

    // Cross-tab sync: a logout in another tab clears shared storage and
    // this guard re-renders, kicking the patient out immediately.
    if (!isAuthenticated || !sessionManager.isAuthenticated()) {
        return <Navigate to={ROUTES.patient.login} replace />;
    }

    if (!sessionManager.isPatientLike()) {
        return <Navigate to={ROUTES.staff.dashboard.overview} replace />;
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
    }

    const status = data?.registration_status;
    if (status && status !== "approved") {
        return <Navigate to={ROUTES.patient.pending} replace />;
    }

    return <Outlet />;
}