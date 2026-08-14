import { ADMIN_ROUTES } from "./RoutePaths";
import {
    LayoutDashboard,
    CalendarDays,
    HeartPulse,
    Stethoscope,
} from "lucide-react";

export const AdminRoutes = [
    {
        path: ADMIN_ROUTES.OVERVIEW,
        label: "Overview",
        icon: LayoutDashboard,
        component: "overview",
    },
    {
        path: ADMIN_ROUTES.MEDICAL,
        label: "Medical Consultation",
        icon: HeartPulse,
        component: "medical",
    },
    {
        path: ADMIN_ROUTES.DENTAL,
        label: "Dental Consultation",
        icon: Stethoscope,
        component: "dental",
    },
    {
        path: ADMIN_ROUTES.APPOINTMENTS,
        label: "Appointments",
        icon: CalendarDays,
        component: "appointments",
    },
];