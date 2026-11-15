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
  activePaths?: string[];
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
    activePaths: [
      ROUTES.patient.dashboard.medical,
      // Add the view/add/update prefix here, for example:
      // "/patient/medical-records",
    ],
  },
  {
    path: ROUTES.patient.dashboard.dental,
    label: "Dental Records",
    icon: Stethoscope,
    component: "dental",
    activePaths: [
      ROUTES.patient.dashboard.dental,
      // Add the view/add/update prefix here, for example:
      // "/patient/dental-records",
    ],
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