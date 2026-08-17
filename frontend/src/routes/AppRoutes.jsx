import { BrowserRouter, Routes, Route } from "react-router-dom";

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

import DentalRecordForm from "../pages/admin/dental/dentalForm";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Admin Showcase / Login */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard/overview" element={<OverviewTab />} />
          <Route path="/admin/dashboard/medical" element={<MedicalTab />} />
          <Route path="/admin/medical/new" element={<PatientRecordForm />} />
          <Route path="/admin/medical/records/view" element={<PatientRecordView />} />
          <Route path="/admin/dashboard/dental" element={<DentalTab />} />
          <Route path="/admin/dental/new" element={<DentalRecordForm />} />
          <Route path="/admin/dashboard/appointments" element={<AppointmentsTab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;