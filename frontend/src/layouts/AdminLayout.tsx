import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "/@/pages/admin/sidebar";
import StaffPageHeader from "/@/components/StaffPageHeader";
import { GenFooter } from "/@/components/GenFooter";
import { sessionManager } from "/@/utils/SessionManager";
import { AdminAnimStyles } from "/@/components/adminanim.jsx";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HIDDEN_HEADER_PATHS = [
    "/staff/medical/new",
    "/staff/medical/view",
    "/staff/dental/new",
    "/staff/dental/view",
    "/staff/patient/new",
    "/staff/appointments/view/",
    "/staff/patients/new",
    "/staff/patients/record/",
];

export default function AdminLayout() {
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const mainRef = useRef<HTMLElement>(null);

    const hideChrome = HIDDEN_HEADER_PATHS.some((path) =>
        location.pathname.startsWith(path)
    );

    useEffect(() => {
        mainRef.current?.scrollTo({ top: 0 });
    }, [location.pathname]);

    return (
        <div className="page-in layout-in flex h-screen w-full overflow-hidden bg-gradient-to-br from-background via-primary/[0.03] to-primary/10 font-sans text-textPrimary selection:bg-primary/20">
            <AdminAnimStyles />
            <Sidebar />

            <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col pt-14 lg:pt-0">
                {!hideChrome && (
                    <div className="slide-down shrink-0">
                        <StaffPageHeader
                            staffId={sessionManager.getUser()?.user_id || ""}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </div>
                )}

                <main
                    ref={mainRef}
                    className="min-h-0 flex-1 overflow-y-auto py-5 lg:py-6"
                >
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div key={location.pathname} className="route-in">
                            <Outlet context={{ searchQuery }} />
                        </div>
                    </div>
                    {!hideChrome && (
                        <div className="mt-10">
                            <GenFooter />
                        </div>
                    )}
                </main>
            </div>

            <ToastContainer position="bottom-right" autoClose={4000} />
        </div>
    );
}