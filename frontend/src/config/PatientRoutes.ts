import { ROUTES } from "./RoutePaths";
import {
  LayoutDashboard,
  CalendarDays,
  HeartPulse,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface PatientRoute {
  path: string;
  label: string;
  icon: LucideIcon;
  component: string;
  hidden?: boolean;
}

export const PatientRoutes: PatientRoute[] = [
  {
    path: ROUTES.patient.dashboard.overview,
    label: "Overview",
    icon: LayoutDashboard,
    component: "overview",
  },
  {
    path: ROUTES.patient.dashboard.appointments,
    label: "Appointments",
    icon: CalendarDays,
    component: "appointments",
  },
  {
    path: ROUTES.patient.dashboard.medical,
    label: "Medical Records",
    icon: HeartPulse,
    component: "medical",
  },
  {
    path: ROUTES.patient.dashboard.dental,
    label: "Dental Records",
    icon: Stethoscope,
    component: "dental",
  },
  {
    path: ROUTES.patient.profile,
    label: "My Profile",
    icon: UserRound,
    component: "profile",
  },
];

export const PatientNavRoutes = PatientRoutes.filter(
  (route) => !route.hidden
);