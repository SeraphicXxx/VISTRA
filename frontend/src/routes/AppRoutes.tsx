import {BrowserRouter, Routes, Route} from "react-router-dom";

import {ROUTES} from "/@/config/RoutePaths";
import PublicLayout from "/@/layouts/PublicLayout";
import AdminLayout from "/@/layouts/AdminLayout";
import LandingPage from "/@/pages/public/landingpage";
import StaffLandingPage from "/@/pages/admin/home";
import StaffLoginPage from "/@/pages/admin/login";
import OverviewTab from "/@/pages/admin/overview/Overview";
import {MedicalPage} from "/@/pages/admin/medical/MedicalPage";
import PatientRecordForm from "/@/pages/admin/medical/medicalRecForm";
import PatientRecordView from "/@/pages/admin/medical/medicalViewRec";
import DentalRecordForm from "/@/pages/admin/dental/dentalForm";
import DentalRecordView from "/@/pages/admin/dental/dentalViewRec";
import PageNotFound from "/@/pages/public/PageNotFound";
import ProtectedRoute from "/@/routes/ProtectedRoute";
import GuestRoute from "/@/routes/GuestRoute";
import NewPatientRecordForm from "/@/pages/admin/patients/patientNewRec";
import {PatientsPage, ViewPatientRecord} from "/@/pages/admin/patients/PatientPages";
import ProtectedPatientRoute from "/@/routes/ProtectedPatientRoute";
import PatientLayout from "/@/layouts/PatientLayout";
import PatientLoginPage from "/@/pages/patient/login";
import PatientOverviewTab from "/@/pages/patient/overview/overview";
import PatientAppointmentsTab from "/@/pages/patient/appointments/appointmentsTab";
import PatientBookAppointment from "/@/pages/patient/appointments/appointmentBook";
import PatientAppointmentView from "/@/pages/patient/appointments/appointmentView";
import PatientMedicalTab from "/@/pages/patient/medical/medicalTab";
import PatientDentalTab from "/@/pages/patient/dental/dentalTab";
import PatientProfilePage from "/@/pages/patient/profile/profile";
import {AppointmentDetailPage, AppointmentPage} from "/@/pages/admin/appointments/AppointmentPage";
import {DentalPage} from "/@/pages/admin/dental/DentalPage";
import {RoleManagementPage} from "/@/pages/admin/user_management/userManagment";
import RequireModule from "/@/routes/RequireModule";



function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route element={<PublicLayout/>}>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Route>

                {/* Admin Showcase / Login */}
                <Route path={ROUTES.staff.home} element={<StaffLandingPage/>}/>
                <Route element={<GuestRoute/>}>
                    <Route path={ROUTES.staff.login} element={<StaffLoginPage/>}/>

                    {/* Patient Login (standalone page, no layout) */}
                    <Route path={ROUTES.patient.login} element={<PatientLoginPage/>}/>
                </Route>

                {/* Admin */}

                <Route element={<ProtectedRoute/>}>
                    <Route element={<AdminLayout/>}>
                        <Route path={ROUTES.staff.dashboard.overview} element={<OverviewTab/>}/>
                        <Route path={ROUTES.staff.dashboard.medical} element={<RequireModule module="medical_module"><MedicalPage/></RequireModule>}/>
                        <Route path={ROUTES.staff.medical.createNewRecord} element={<RequireModule module="medical_module"><PatientRecordForm/></RequireModule>}/>
                        <Route path={ROUTES.staff.medical.view.route} element={<RequireModule module="medical_module"><PatientRecordView/></RequireModule>}/>

                        <Route path={ROUTES.staff.dashboard.dental} element={<RequireModule module="dental_module"><DentalPage/></RequireModule>}/>
                        <Route path={ROUTES.staff.dental.createNewRecord} element={<RequireModule module="dental_module"><DentalRecordForm/></RequireModule>}/>
                        <Route path={ROUTES.staff.dental.view.route} element={<RequireModule module="dental_module"><DentalRecordView/></RequireModule>}/>

                        <Route
                            path={ROUTES.staff.dashboard.appointments}
                            element={<RequireModule module="appointment_module"><AppointmentPage/></RequireModule>}
                        />
                        <Route
                            path={ROUTES.staff.appointments.view.route}
                            element={<RequireModule module="appointment_module"><AppointmentDetailPage/></RequireModule>}
                        />

                        <Route
                            path={ROUTES.staff.dashboard.patients}
                            element={<RequireModule module="patient_module"><PatientsPage/></RequireModule>}
                        />
                        <Route
                            path={ROUTES.staff.dashboard.accessControl}
                            element={<RequireModule module="staff_module"><RoleManagementPage/></RequireModule>}
                        />
                        <Route
                            path={ROUTES.staff.patient.createNewRecord}
                            element={<RequireModule module="patient_module"><NewPatientRecordForm/></RequireModule>}
                        />
                        <Route
                            path={`${ROUTES.staff.patient.patientRecordTab}/:id`}
                            element={<RequireModule module="patient_module"><ViewPatientRecord/></RequireModule>}
                        />
                    </Route>
                </Route>

                <Route element={<ProtectedPatientRoute/>}>
                    <Route element={<PatientLayout/>}>
                        <Route path={ROUTES.patient.dashboard.overview} element={<PatientOverviewTab/>}/>
                        <Route path={ROUTES.patient.dashboard.appointments} element={<PatientAppointmentsTab/>}/>
                        <Route path={ROUTES.patient.appointment.bookAppointment} element={<PatientBookAppointment/>}/>
                        <Route path={ROUTES.patient.appointment.viewAppointment} element={<PatientAppointmentView/>}/>
                        <Route path={ROUTES.patient.dashboard.medical} element={<PatientMedicalTab/>}/>
                        <Route path={ROUTES.patient.dashboard.dental} element={<PatientDentalTab/>}/>
                        <Route path={ROUTES.patient.profile} element={<PatientProfilePage/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
