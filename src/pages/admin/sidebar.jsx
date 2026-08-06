import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Settings,
  LogOut,
  Stethoscope,
  HeartPulse,
} from "lucide-react";

const navTabs = [
  { path: "./overview/overview", label: "Overview", icon: LayoutDashboard },
  { path: "./medical/medical", label: "Medical Consultation", icon: HeartPulse },
  { path: "./dental/dental", label: "Dental Consultation", icon: Stethoscope },
//   { path: "#", label: "Records", icon: ClipboardList },
  { path: "./appointments/appointments", label: "Appointments", icon: CalendarDays },
//   { path: "#", label: "Settings", icon: Settings },
];

function SidebarLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-textSecondary hover:bg-background hover:text-textPrimary"
        }`
      }
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      {item.label}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <img
          src="/Vistralogo.png"
          alt="Vistra Logo"
          className="h-8 w-auto object-contain"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navTabs.map((item) => (
          <SidebarLink key={item.path} item={item} />
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-textSecondary transition-colors duration-200 hover:bg-background hover:text-danger"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
          Sign out
        </button>
      </div>
    </aside>
  );
}