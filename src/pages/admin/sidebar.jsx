import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Settings,
  LogOut,
  Stethoscope,
  HeartPulse,
  Menu,
  X,
} from "lucide-react";

const navTabs = [
  { path: "./overview/overview", label: "Overview", icon: LayoutDashboard },
  { path: "./medical/medical", label: "Medical Consultation", icon: HeartPulse },
  { path: "./dental/dental", label: "Dental Consultation", icon: Stethoscope },
  //   { path: "#", label: "Records", icon: ClipboardList },
  { path: "./appointments/appointments", label: "Appointments", icon: CalendarDays },
  //   { path: "#", label: "Settings", icon: Settings },
];

function SidebarLink({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-textSecondary hover:bg-background hover:text-textPrimary"
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close the mobile drawer automatically if the viewport grows into the
  // desktop breakpoint while it's open.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handleChange = (e) => {
      if (e.matches) setIsOpen(false);
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  return (
    <div className="lg:w-64 lg:shrink-0">
      {/* Mobile top bar: hamburger + logo. Fixed + full-width so it can never
          get sucked into the parent layout's flex row as a sibling column. */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <img src="/Vistralogo.png" alt="Vistra Logo" className="h-7 w-auto object-contain" />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-textSecondary transition-colors hover:bg-background hover:text-textPrimary"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: static rail on desktop, slide-in drawer on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] shrink-0 flex-col border-r border-border bg-surface transition-transform duration-200 ease-out
          lg:static lg:z-auto lg:h-full lg:w-64 lg:max-w-none lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between gap-2.5 px-6 py-6">
          <img src="/Vistralogo.png" alt="Vistra Logo" className="h-8 w-auto object-contain" />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-textSecondary transition-colors hover:bg-background hover:text-textPrimary lg:hidden"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4">
          {navTabs.map((item) => (
            <SidebarLink key={item.path} item={item} onNavigate={() => setIsOpen(false)} />
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-textSecondary transition-colors duration-200 hover:bg-background hover:text-danger"
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>
    </div>
  );
}