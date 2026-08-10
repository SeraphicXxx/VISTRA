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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* user */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

   
        <Route path="/admin" element={<AdminHome />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="overview/overview" element={<OverviewTab />} />
          <Route path="medical/medical" element={<MedicalTab />} />
          <Route path="dental/dental" element={<DentalTab />} />
          <Route path="appointments/appointments" element={<AppointmentsTab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;