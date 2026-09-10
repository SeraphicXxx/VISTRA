import { ROUTES } from "./RoutePaths";
import {
    LayoutDashboard,
    CalendarDays,
    HeartPulse,
    Stethoscope,
    UsersRound,
} from "lucide-react";

export const AdminRoutes = [
    {
        path: ROUTES.staff.dashboard.overview,
        label: "Overview",
        icon: LayoutDashboard,
        component: "overview",
    },
    {
        path: ROUTES.staff.dashboard.medical,
        label: "Medical Consultation",
        icon: HeartPulse,
        component: "medical",
    },
    {
        path: ROUTES.staff.dashboard.dental,
        label: "Dental Consultation",
        icon: Stethoscope,
        component: "dental",
    },
    {
        path: ROUTES.staff.dashboard.appointments,
        label: "Appointments",
        icon: CalendarDays,
        component: "appointments",
    },
    {
        path: ROUTES.staff.dashboard.patients,
        label: "Patient Management",
        icon: UsersRound,
        component: "patients"
    },
];