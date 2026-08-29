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
import DentalRecordView from "../pages/admin/dental/dentalViewRec";

import AppointmentsTab from "../pages/admin/appointments/appointmentsTab";

import PatientsTab from "../pages/admin/patients/patientsTab.jsx"
import NewPatientRecordForm from "../pages/admin/patients/patientNewRec.jsx"
import PatientRecordsPage from "../pages/admin/patients/PatientRecordsPage.jsx"
import ViewStudentRecord from "../pages/admin/patients/ViewStudentRecord.jsx"

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
            <Route path={ROUTES.admin.medical.createNewRecord} element={<PatientRecordForm />} />
            <Route path={ROUTES.admin.medical.viewRecord} element={<PatientRecordView />} />

            <Route path={ROUTES.admin.dashboard.dental} element={<DentalTab />} />
            <Route path={ROUTES.admin.dental.createNewRecord} element={<DentalRecordForm />} />
            <Route path={ROUTES.admin.dental.viewRecord} element={<DentalRecordView />} />

            <Route path={ROUTES.admin.dashboard.patients} element={<PatientsTab/>}/>
            <Route path={ROUTES.admin.patient.createNewRecord} element={<NewPatientRecordForm/>} />
            <Route path={`${ROUTES.admin.patient.patientRecordTab}/:id`} element={<ViewStudentRecord />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;