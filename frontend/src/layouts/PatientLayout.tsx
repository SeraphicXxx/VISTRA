import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PatientSidebar from "/@/pages/patient/sidebar";
import PatientPageHeader from "/@/components/PatientPageHeader";
import { sessionManager } from "/@/utils/SessionManager";
import { ROUTES } from "/@/config/RoutePaths";
import { AdminAnimStyles, Reveal } from "/@/components/adminanim";

const HIDDEN_HEADER_PATHS = [
    ROUTES.patient.appointment.bookAppointment,
    ROUTES.patient.appointment.viewAppointment,
    `${ROUTES.patient.dashboard.medical}/record`,
    `${ROUTES.patient.dashboard.dental}/record`,
    ROUTES.patient.profile,

];

export default function PatientLayout() {
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    const hideHeader = HIDDEN_HEADER_PATHS.some((path) =>
        location.pathname.startsWith(path)
    );

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-background via-primary/[0.03] to-primary/10 font-sans text-textPrimary selection:bg-primary/20">
            <AdminAnimStyles />

            <PatientSidebar />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden pt-14 lg:pt-0">
                <Reveal as="div" distance={-8} threshold={0} className="contents">
                    {!hideHeader && (
                        <PatientPageHeader
                            patientId={sessionManager.getUser()?.user_id || ""}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    )}
                </Reveal>

                <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
                    <Reveal key={location.pathname} as="div" distance={14} threshold={0}>
                        <Outlet context={{ searchQuery }} />
                    </Reveal>
                </main>
            </div>
        </div>
    );
}