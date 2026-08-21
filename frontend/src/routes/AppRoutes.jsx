import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ROUTES } from "../config/RoutePaths";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import LandingPage from "../pages/public/landingpage";
import AdminHome from "../pages/admin/home";
import AdminLoginPage from "../pages/admin/login";

import OverviewTab from "../pages/admin/overview/overview";

import MedicalTab from "../pages/admin/medical/medicalTab";
import PatientRecordForm from "../pages/admin/medical/medicalRecForm";
import PatientRecordView from "../pages/admin/medical/medicalViewRec";

import DentalTab from "../pages/admin/dental/dentalTab";
import DentalRecordForm from "../pages/admin/dental/dentalForm";

import AppointmentsTab from "../pages/admin/appointments/appointmentsTab";


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
        <Route path={ROUTES.admin.home} element={<AdminHome />} />
        <Route path={ROUTES.admin.login} element={<AdminLoginPage />} />

        {/* Admin */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.admin.dashboard.overview} element={<OverviewTab />} />
            <Route path={ROUTES.admin.dashboard.medical} element={<MedicalTab />} />
            <Route path={ROUTES.admin.medical.new} element={<PatientRecordForm />} />
            <Route path={ROUTES.admin.medical.view} element={<PatientRecordView />} />

            <Route path={ROUTES.admin.dashboard.dental} element={<DentalTab />} />
            <Route path={ROUTES.admin.dental.createNewRecord} element={<DentalRecordForm />} />

            <Route path={ROUTES.admin.dashboard.appointments} element={<AppointmentsTab />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;