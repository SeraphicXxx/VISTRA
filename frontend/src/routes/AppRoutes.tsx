import {BrowserRouter, Routes, Route} from "react-router-dom";

import {ROUTES} from "/@/config/RoutePaths";
import PublicLayout from "/@/layouts/PublicLayout";
import AdminLayout from "/@/layouts/AdminLayout";
import LandingPage from "/@/pages/public/landingpage";
import StaffLandingPage from "/@/pages/admin/home";
import StaffLoginPage from "/@/pages/admin/login";
import OverviewTab from "/@/pages/admin/overview/Overview";
import MedicalTab from "/@/pages/admin/medical/medicalTab";
import PatientRecordForm from "/@/pages/admin/medical/medicalRecForm";
import PatientRecordView from "/@/pages/admin/medical/medicalViewRec";
import DentalTab from "/@/pages/admin/dental/dentalTab";
import DentalRecordForm from "/@/pages/admin/dental/dentalForm";
import DentalRecordView from "/@/pages/admin/dental/dentalViewRec";
import AppointmentsTab from "/@/pages/admin/appointments/appointmentsTab";
import PageNotFound from "/@/pages/public/PageNotFound";
import ProtectedRoute from "/@/routes/ProtectedRoute.jsx"
import NewPatientRecordForm from "/@/pages/admin/patients/patientNewRec.jsx"
import AppointmentDetailView from "/@/pages/admin/appointments/appointmentView.jsx"
import {createPaginatedContext} from "/@/context/CreatePaginatedContext";
import {PatientProfile} from "/@/api/schema/PatientSchema"
import {PatientsPage, ViewPatientRecord} from "/@/pages/admin/patients/PatientPages";

export const {
    Provider: PatientProvider,
    usePaginatedContext: usePatientContext,
} = createPaginatedContext<PatientProfile>();

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route element={<PublicLayout/>}>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                    {/*<Route path="/DEMO/" element={<DemoPage />} />*/}
                </Route>

                {/* Admin Showcase / Login */}
                <Route path={ROUTES.staff.home} element={<StaffLandingPage/>}/>
                <Route path={ROUTES.staff.login} element={<StaffLoginPage/>}/>

                {/* Admin */}

                <Route element={<ProtectedRoute/>}>
                    <Route element={<AdminLayout/>}>
                        <Route path={ROUTES.staff.dashboard.overview} element={<OverviewTab/>}/>
                        <Route path={ROUTES.staff.dashboard.medical} element={<MedicalTab/>}/>
                        <Route path={ROUTES.staff.medical.createNewRecord} element={<PatientRecordForm/>}/>
                        <Route path={ROUTES.staff.medical.viewRecord} element={<PatientRecordView/>}/>

                        <Route path={ROUTES.staff.dashboard.dental} element={<DentalTab/>}/>
                        <Route path={ROUTES.staff.dental.createNewRecord} element={<DentalRecordForm/>}/>
                        <Route path={ROUTES.staff.dental.viewRecord} element={<DentalRecordView/>}/>

                        <Route path={ROUTES.staff.dashboard.appointments} element={<AppointmentsTab/>}/>
                        <Route path={ROUTES.staff.appointment.viewAppointment} element={<AppointmentDetailView/>}/>

                        <Route
                            path={ROUTES.staff.dashboard.patients}
                            element={<PatientsPage/>}
                        />
                        <Route
                            path={ROUTES.staff.patient.createNewRecord}
                            element={<NewPatientRecordForm/>}
                        />
                        <Route
                            path={`${ROUTES.staff.patient.patientRecordTab}/:id`}
                            element={<ViewPatientRecord/>}
                        />

                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;