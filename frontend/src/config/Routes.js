import { ROUTES } from "./RoutePaths.ts";
import {
    LayoutDashboard,
    CalendarDays,
    HeartPulse,
    UsersRound,
} from "lucide-react";
import { TbDental } from "react-icons/tb";
export const AdminRoutes = [
    {
        path: ROUTES.staff.dashboard.overview,
        label: "Overview",
        icon: LayoutDashboard,
        component: "overview",
    },
    {
        path: ROUTES.staff.dashboard.medical,
        label: "Medical Records",
        icon: HeartPulse,
        component: "medical",
    },
    {
        path: ROUTES.staff.dashboard.dental,
        label: "Dental Records",
        icon: TbDental,
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
        component: "patients",
    },
];