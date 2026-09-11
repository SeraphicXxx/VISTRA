import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import { ROUTES } from "/@/config/RoutePaths";
import PublicLayout from "/@/layouts/PublicLayout";
import AdminLayout from "/@/layouts/AdminLayout.tsx";
import PatientLayout from "/@/layouts/PatientLayout.tsx";

import LandingPage from "/@/pages/public/landingpage";
import PageNotFound from "/@/pages/public/PageNotFound";

// Admin pages
import StaffLandingPage from "/@/pages/admin/home";
import StaffLoginPage from "/@/pages/admin/login";
import OverviewTab from "/@/pages/admin/overview/overview";
import MedicalTab from "/@/pages/admin/medical/medicalTab";
import PatientRecordForm from "/@/pages/admin/medical/medicalRecForm";
import PatientRecordView from "/@/pages/admin/medical/medicalViewRec";
import DentalTab from "/@/pages/admin/dental/dentalTab";
import DentalRecordForm from "/@/pages/admin/dental/dentalForm";
import DentalRecordView from "/@/pages/admin/dental/dentalViewRec";
import AppointmentsTab from "/@/pages/admin/appointments/appointmentsTab";
import AppointmentDetailView from "/@/pages/admin/appointments/appointmentView.jsx";
import PatientsTab from "/src/pages/admin/patients/patientsTab.jsx";
import NewPatientRecordForm from "/@/pages/admin/patients/patientNewRec.jsx";
import ViewStudentRecord from "/@/pages/admin/patients/ViewStudentRecord.jsx";

// Patient pages
import UserLoginPage from "/@/pages/patient/login.tsx";
import PatientOverviewTab from "/@/pages/patient/overview/overview.tsx";
import PatientAppointmentsTab from "/@/pages/patient/appointments/appointmentsTab.tsx";
import PatientMedicalTab from "/@/pages/patient/medical/medicalTab.tsx";
import PatientDentalTab from "/@/pages/patient/dental/dentalTab.tsx";
import PatientProfilePage from "/@/pages/patient/profile/profile.tsx";

import ProtectedRoute from "/@/components/ProtectedRoute.jsx";
import ProtectedPatientRoute from "/@/components/ProtectedPatientRoute.jsx";

import { createPatientAccount } from "/@/api/patient.api.ts";
import { sessionManager } from "/@/utils/SessionManager.ts";
import { PatientProvider } from "/@/context/PatientContext.tsx";

function AppRoutes() {
  // TODO refactor state along with handleSave
  //-ken
  const [errors, setErrors] = useState(null);
  const handleSave = async (record) => {
    const user = sessionManager.getUser();
    const patientData = {
      ...record,
      created_by: user.staff_id,
    };
    console.log(record);
    try {
      setErrors(null);
      const result = await createPatientAccount(patientData);

      console.log("Patient created:", result);
    } catch (error) {
      setErrors(
        error?.detail || [
          {
            msg: error?.message || "Failed to create patient",
          },
        ]
      );
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* Admin Showcase / Login */}
        <Route path={ROUTES.admin.home} element={<StaffLandingPage />} />
        <Route path={ROUTES.admin.login} element={<StaffLoginPage />} />

        {/* Patient Login */}
        <Route path={ROUTES.patient.login} element={<UserLoginPage />} />

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

            <Route path={ROUTES.admin.dashboard.appointments} element={<AppointmentsTab />} />
            <Route path={ROUTES.admin.appointment.viewAppointment} element={<AppointmentDetailView />} />

            <Route
              path={ROUTES.admin.dashboard.patients}
              element={
                <PatientProvider>
                  <PatientsTab />
                </PatientProvider>
              }
            />
            <Route
              path={ROUTES.admin.patient.createNewRecord}
              element={
                <PatientProvider>
                  <NewPatientRecordForm onSave={handleSave} errors={errors} />
                </PatientProvider>
              }
            />
            <Route
              path={`${ROUTES.admin.patient.patientRecordTab}/:id`}
              element={
                <PatientProvider>
                  <ViewStudentRecord />
                </PatientProvider>
              }
            />
          </Route>
        </Route>

        {/* Patient */}
        <Route element={<ProtectedPatientRoute />}>
          <Route element={<PatientLayout />}>
            <Route path={ROUTES.patient.dashboard.overview} element={<PatientOverviewTab />} />
            <Route path={ROUTES.patient.dashboard.appointments} element={<PatientAppointmentsTab />} />
            <Route path={ROUTES.patient.dashboard.medical} element={<PatientMedicalTab />} />
            <Route path={ROUTES.patient.dashboard.dental} element={<PatientDentalTab />} />
            <Route path={ROUTES.patient.profile} element={<PatientProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;