import {forwardRef, useRef, useState, type ComponentType, type Ref} from "react";

import {NavLink, useLocation, useNavigate} from "react-router-dom";

import {LogOut, Menu, X, UserRound, ChevronRight} from "lucide-react";

import {useSidebar} from "/@/hooks/UseSidebar";
import {useStaffInfo} from "/@/hooks/StaffInfo";

import {sessionManager} from "/@/utils/SessionManager";
import {logoutSession} from "/@/hooks/UseLogout";

import {AdminRoutes} from "/@/config/Routes";

import {ROUTES} from "/@/config/RoutePaths";

import {LogoClickable} from "/@/components/Button";

import {Modal} from "/@/components/editModal";

interface SidebarRouteItem {
    path: string;
    label: string;
    icon: ComponentType<{
        className?: string;
        strokeWidth?: number | string;
    }>;
    isShortcut?: boolean;
    activePaths?: string[];
}

function isRouteActive(
    item: SidebarRouteItem,
    pathname: string
): boolean {
    return (
        item.activePaths?.some((path) => pathname.startsWith(path)) ||
        pathname === item.path
    );
}

interface SidebarLinkProps {
    item: SidebarRouteItem;
    pathname: string;
    onNavigate: () => void;
    isShortcut?: boolean;
}

function SidebarLink(
    {item, pathname, onNavigate, isShortcut = false}: SidebarLinkProps,
    ref: Ref<HTMLAnchorElement>,
) {
    const Icon = item.icon;
    const isActive = isRouteActive(item, pathname);

    return (
        <NavLink
            ref={ref}
            to={item.path}
            onClick={onNavigate}
            className={`group relative flex h-10 items-center gap-3 rounded-lg px-3.5 text-sm font-medium transition-all duration-200 ${
                isActive
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
}

const ForwardedSidebarLink = forwardRef(SidebarLink);

function MobileTopBar({isOpen, onOpen}: { isOpen: boolean; onOpen: () => void }) {
    return (
        <div
            className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 shadow-sm lg:hidden">
            <LogoClickable
                className="h-7"
                navigateTo={ROUTES.staff.dashboard.overview}
            />

            <button
                type="button"
                onClick={onOpen}
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
                aria-controls="mobile-sidebar"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-textPrimary transition-colors hover:bg-background"
            >
                <Menu className="h-5 w-5" strokeWidth={2}/>
            </button>
        </div>
    );
}

function SidebarHeader({onClose}: { onClose: () => void }) {
    return (
        <div
            className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-border bg-surface/95 px-4 backdrop-blur-sm">
            <LogoClickable
                className="h-10 mt-10 mb-5"
                navigateTo={ROUTES.staff.dashboard.overview}
            />

            <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-textSecondary transition-colors hover:bg-background hover:text-textPrimary lg:hidden"
            >
                <X className="h-5 w-5" strokeWidth={2}/>
            </button>
        </div>
    );
}

interface NavSectionProps {
    title?: string;
    items: SidebarRouteItem[];
    pathname: string;
    onNavigate: () => void;
    isShortcut?: boolean;
    firstLinkRef?: Ref<HTMLAnchorElement>;
}

function NavSection({
                        title,
                        items,
                        pathname,
                        onNavigate,
                        isShortcut = false,
                        firstLinkRef,
                    }: NavSectionProps) {
    return (
        <div className={title ? "mt-7" : undefined}>
            {title && (
                <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-textMuted">
                    {title}
                </div>
            )}

            <div className="space-y-1.5">
                {items.map((item, index) => (
                    <ForwardedSidebarLink
                        key={item.path}
                        item={item}
                        pathname={pathname}
                        onNavigate={onNavigate}
                        isShortcut={isShortcut}
                        ref={index === 0 && !title ? firstLinkRef : undefined}
                    />
                ))}
            </div>
        </div>
    );
}

function UserCard({onSignOut}: { onSignOut: () => void }) {
    const user = sessionManager.getUser();
    const {staffData} = useStaffInfo(user?.user_id ?? "");
    const onDuty = staffData?.is_active ?? false;

    return (
        <div className="mt-auto pt-6 mb-2">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                        <UserRound className="h-5 w-5" strokeWidth={1.8}/>
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-primaryDark">
                            {user?.user_id ?? "_"}
                        </p>

                        <div className="mt-1.5 flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${onDuty ? "bg-success" : "bg-danger"}`}/>
                            <span className="text-[11px] font-medium text-text/60">
                {onDuty ? "On Duty" : "Off Duty"}
              </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onSignOut}
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
    );
}

function SignOutConfirmModal({
                                 onClose,
                                 onConfirm,
                             }: {
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <Modal
            title="Sign out?"
            onClose={onClose}
            maxWidth="max-w-sm"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-lg bg-danger px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                    >
                        Sign out
                    </button>
                </>
            }
        >
            <p className="text-sm text-textSecondary">
                Are you sure you want to sign out? You will need to log in again to
                access the dashboard.
            </p>
        </Modal>
    );
}

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
    const {isOpen, open, close} = useSidebar(firstLinkRef);
    const [isSignOutOpen, setIsSignOutOpen] = useState(false);

    const handleLogout = async (): Promise<void> => {
        await logoutSession();
        setIsSignOutOpen(false);
        close();
        navigate(ROUTES.public.home);
    };

    const mainRoutes = (AdminRoutes as SidebarRouteItem[]).filter((item) => !item.isShortcut);
    const shortcuts = (AdminRoutes as SidebarRouteItem[]).filter((item) => item.isShortcut);

    return (
        <>
            <MobileTopBar isOpen={isOpen} onOpen={open}/>

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
                <SidebarHeader onClose={close}/>

                <nav className="flex flex-1 flex-col px-3 py-5">
                    <NavSection
                        items={mainRoutes}
                        pathname={location.pathname}
                        onNavigate={close}
                        firstLinkRef={firstLinkRef}
                    />

                    {shortcuts.length > 0 && (
                        <NavSection
                            title="Quick Access"
                            items={shortcuts}
                            pathname={location.pathname}
                            onNavigate={close}
                            isShortcut={true}
                        />
                    )}

                    <UserCard onSignOut={() => setIsSignOutOpen(true)}/>
                </nav>
            </aside>

            {isSignOutOpen && (
                <SignOutConfirmModal
                    onClose={() => setIsSignOutOpen(false)}
                    onConfirm={handleLogout}
                />
            )}
        </>
    );
}
