import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "/@/config/RoutePaths";
import { useAuth } from "/@/context/AuthContext";
import { sessionManager } from "/@/utils/SessionManager";

export default function ProtectedPatientRoute(): React.JSX.Element {
    const { isAuthenticated } = useAuth();

    // Cross-tab sync: a logout in another tab clears shared storage and
    // this guard re-renders, kicking the patient out immediately.
    if (!isAuthenticated || !sessionManager.isAuthenticated()) {
        return <Navigate to={ROUTES.patient.login} replace />;
    }

    if (!sessionManager.isPatientLike()) {
        return <Navigate to={ROUTES.staff.dashboard.overview} replace />;
    }

    return <Outlet />;
}
