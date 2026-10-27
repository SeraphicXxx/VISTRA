import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "/@/config/RoutePaths";
import { useAuth } from "/@/context/AuthContext";
import { sessionManager } from "/@/utils/SessionManager";

export default function ProtectedRoute(): React.JSX.Element {
    const { isAuthenticated, isStaff } = useAuth();

    // Cross-tab sync: if another tab logged out, this guard re-renders
    // (via AuthProvider) and kicks the user out immediately.
    if (!isAuthenticated || !sessionManager.isAuthenticated()) {
        return <Navigate to={ROUTES.staff.login} replace />;
    }

    if (!isStaff && sessionManager.getRole()) {
        return <Navigate to={ROUTES.patient.dashboard.overview} replace />;
    }

    return <Outlet />;
}
