import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ADMIN_ROUTES } from "../config/RoutePaths";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import LandingPage from "../pages/public/landingpage";
import AdminHome from "../pages/admin/home";
import AdminLoginPage from "../pages/admin/login";

import OverviewTab from "../pages/admin/overview/overview";
import MedicalTab from "../pages/admin/medical/medicalTab";
import DentalTab from "../pages/admin/dental/dentalTab";
import AppointmentsTab from "../pages/admin/appointments/appointmentsTab";
import PatientRecordForm from "../pages/admin/medical/medicalRecForm";
import PatientRecordView from "../pages/admin/medical/medicalViewRec";
import ProtectedRoute from "../components/ProtectedRoute.jsx"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Admin Showcase / Login */}
        <Route path={ADMIN_ROUTES.ADMIN_HOME} element={<AdminHome />} />
        <Route path={ADMIN_ROUTES.ADMIN_LOGIN_PAGE} element={<AdminLoginPage />} />

        {/* Admin */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ADMIN_ROUTES.OVERVIEW} element={<OverviewTab />} />
            <Route path={ADMIN_ROUTES.MEDICAL} element={<MedicalTab />} />
            <Route path={ADMIN_ROUTES.MEDICAL_RECORD_FORM} element={<PatientRecordForm />} />
            <Route path={ADMIN_ROUTES.MEDICAL_RECORD_VIEW} element={<PatientRecordView />} />
            <Route path={ADMIN_ROUTES.DENTAL} element={<DentalTab />} />
            <Route path={ADMIN_ROUTES.APPOINTMENTS} element={<AppointmentsTab />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;