import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public Pages
import LandingPage from "../pages/public/landingpage";

// Admin Pages
import AdminHome from "../pages/admin/home";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminHome />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;