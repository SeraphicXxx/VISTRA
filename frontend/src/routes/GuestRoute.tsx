import { Navigate, Outlet } from "react-router-dom";
import { sessionManager } from "/@/utils/SessionManager";
import { useAuth } from "/@/context/AuthContext";
import { ROUTES } from "/@/config/RoutePaths";

/**
 * Blocks authenticated users from visiting login pages.
 * Staff go to the staff overview, everyone else with a
 * session goes to the patient overview.
 */
export default function GuestRoute(): React.JSX.Element {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated || sessionManager.isAuthenticated()) {
        // Allow the staff login page to stay mounted while the
        // "are you on duty?" prompt is being answered.
        if (sessionStorage.getItem("vistra_duty_prompt_pending") === "true") {
            return <Outlet />;
        }

        const target = sessionManager.isStaff()
            ? ROUTES.staff.dashboard.overview
            : ROUTES.patient.dashboard.overview;

        return <Navigate to={target} replace />;
    }

    return <Outlet />;
}
