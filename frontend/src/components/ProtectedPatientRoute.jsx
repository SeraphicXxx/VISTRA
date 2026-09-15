import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "/@/config/RoutePaths";
import { sessionManager } from "/@/utils/SessionManager.ts";

// Static patient used only when VITE_SKIP_AUTH=true, so patient pages have
// something to render while there's no backend to actually log in against.
const MOCK_PATIENT = {
  role: "patient",
  patient_id: "20230518-S",
  first_name: "Jane",
  last_name: "Dela Cruz",
  email: "jane.delacruz@example.edu",
};

// TEMP DEBUG: hardcoded true so you can confirm the guard itself works
// while we figure out why the .env flag isn't being picked up.
// Change back to: import.meta.env.VITE_SKIP_AUTH === "true"
const skipAuth = true;

export default function ProtectedPatientRoute() {
  console.log("VITE_SKIP_AUTH raw value:", import.meta.env.VITE_SKIP_AUTH);
  console.log("skipAuth resolved to:", skipAuth);

  if (skipAuth) {
    if (!sessionManager.getUser()) {
      sessionManager.setUser?.(MOCK_PATIENT);
    }
    return <Outlet />;
  }

  const user = sessionManager.getUser();
  const isPatient = user?.role === "patient";

  if (!isPatient) {
    return <Navigate to={ROUTES.patient.login} replace />;
  }

  return <Outlet />;
}