import React, { forwardRef, useRef } from "react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { LogOut, Menu, X, UserRound, ChevronRight } from "lucide-react";

import { useSidebar } from "/@/hooks/UseSidebar.js";

import { sessionManager } from "/@/utils/SessionManager.ts";

import { AdminRoutes } from "/@/config/Routes.js";

import { ROUTES } from "/@/config/RoutePaths.js";

import { LogoClickable } from "/@/components/Button.jsx";

const SidebarLink = forwardRef(function SidebarLink(
  { item, onNavigate, isShortcut = false },
  ref,
) {
  const Icon = item.icon;
  const location = useLocation();
  const isActive =
    item.activePaths?.some((path) => location.pathname.startsWith(path)) ||
    location.pathname === item.path;

  return (
    <NavLink
      ref={ref}
      to={item.path}
      onClick={onNavigate}
      className={`group relative flex h-10 items-center gap-3 rounded-lg px-3.5 text-sm font-medium transition-all duration-200 ${
        isShortcut
          ? isActive
            ? "bg-primary text-surface shadow-sm"
            : "text-textSecondary hover:bg-primaryLight/15 hover:text-primary"
          : isActive
            ? "bg-primary text-surface shadow-sm"
            : "text-textSecondary hover:bg-primaryLight/15 hover:text-primary"
      }`}
    >
      <Icon
        className="h-[18px] w-[18px] shrink-0 opacity-85"
        strokeWidth={2.2}
      />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {isActive && !isShortcut && (
        <ChevronRight
          className="h-4 w-4 shrink-0 opacity-60"
          strokeWidth={2.5}
        />
      )}
    </NavLink>
  );
});

export default function Sidebar() {
  const navigate = useNavigate();
  const firstLinkRef = useRef(null);
  const { isOpen, open, close } = useSidebar(firstLinkRef);

  const handleLogout = () => {
    sessionManager.logout();
    close();
    navigate(ROUTES.public.home);
  };

  const mainRoutes = AdminRoutes.filter((item) => !item.isShortcut);
  const shortcuts = AdminRoutes.filter((item) => item.isShortcut);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 shadow-sm lg:hidden">
        <LogoClickable
          className="h-7"
          navigateTo={ROUTES.staff.dashboard.overview}
        />

        <button
          type="button"
          onClick={open}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-textPrimary transition-colors hover:bg-background"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 max-w-[85vw] shrink-0 flex-col overflow-y-auto border-r border-border bg-surface transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-border bg-surface/95 px-4 backdrop-blur-sm">
          <LogoClickable
            className="h-10 mt-10 mb-5"
            navigateTo={ROUTES.staff.dashboard.overview}
          />

          <button
            type="button"
            onClick={close}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-textSecondary transition-colors hover:bg-background hover:text-textPrimary lg:hidden"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-3 py-5">
          <div className="space-y-1.5">
            {mainRoutes.map((item, index) => (
              <SidebarLink
                key={item.path}
                item={item}
                onNavigate={close}
                ref={index === 0 ? firstLinkRef : undefined}
              />
            ))}
          </div>

          {shortcuts.length > 0 && (
            <div className="mt-7">
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-textMuted">
                Quick Access
              </div>

              <div className="space-y-1.5">
                {shortcuts.map((item) => (
                  <SidebarLink
                    key={item.path}
                    item={item}
                    onNavigate={close}
                    isShortcut={true}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 mb-2">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                  <UserRound className="h-5 w-5" strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-primaryDark">
                    Dr. Maria Santos
                  </p>

                  <p className="mt-0.5 truncate text-xs text-text/60">
                    Cardiologist
                  </p>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="text-[11px] font-medium text-text/60">
                      Available
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-danger/20 bg-danger/5 px-3 text-sm font-semibold text-danger transition-all duration-200 hover:bg-danger/10 active:scale-[0.98]"
              >
                <LogOut
                  className="h-[17px] w-[17px]"
                  strokeWidth={2.4}
                />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

