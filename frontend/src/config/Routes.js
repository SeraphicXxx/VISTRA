import { ROUTES } from "./RoutePaths.ts";
import {
    LayoutDashboard,
    CalendarDays,
    HeartPulse,
    UsersRound,
    Users,
    UserPlus,
} from "lucide-react";
import { TbDental } from "react-icons/tb";

// "/staff/medical/:id" -> "/staff/medical"
const toPrefix = (pattern) => pattern.split("/:")[0];

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
        activePaths: [
            ROUTES.staff.dashboard.medical,
            ROUTES.staff.medical.createNewRecord,
            toPrefix(ROUTES.staff.medical.view.route),
        ],
    },
    {
        path: ROUTES.staff.dashboard.dental,
        label: "Dental Records",
        icon: TbDental,
        component: "dental",
        activePaths: [
            ROUTES.staff.dashboard.dental,
            ROUTES.staff.dental.createNewRecord,
            toPrefix(ROUTES.staff.dental.view.route),
        ],
    },
    {
        path: ROUTES.staff.dashboard.appointments,
        label: "Appointments",
        icon: CalendarDays,
        component: "appointments",
        activePaths: [
            ROUTES.staff.dashboard.appointments,
            toPrefix(ROUTES.staff.appointments.view.route),
        ],
    },
    {
        path: ROUTES.staff.dashboard.patients,
        label: "Patient Management",
        icon: UsersRound,
        component: "patients",
        activePaths: [
            ROUTES.staff.dashboard.patients,
            ROUTES.staff.patient.createNewRecord,
            ROUTES.staff.patient.patientRecordTab,
        ],
    },
    {
        path: ROUTES.staff.dashboard.registrations,
        label: "Registrations",
        icon: UserPlus,
        component: "registrations",
        activePaths: [
            ROUTES.staff.dashboard.registrations,
        ],
    },
    {
        path: ROUTES.staff.dashboard.accessControl,
        label: "User Management",
        icon: Users,
        component: "members",
    },
];