import { Bell, Search } from "lucide-react";
import {formatDisplayDate, getClinicOperationState, getGreeting} from "../utils/Formatters.js";

const CLINIC_OPERATION_STATES = [
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "break", label: "On Break" },
    { value: "emergency_only", label: "Emergency Only" },
    { value: "appointment_only", label: "Appointment Only" },
];

interface StaffPageHeaderProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

function HeaderActions() {
    return (
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <button
                type="button"
                aria-label="Notifications"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-textSecondary hover:text-textPrimary"
            >
                <Bell className="h-4 w-4" strokeWidth={2} />
            </button>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                LMF
            </div>
        </div>
    );
}

export default function StaffPageHeader({
                                            searchQuery,
                                            setSearchQuery,
                                        }: StaffPageHeaderProps) {
    return (
        <header className="flex flex-col gap-3 border-b border-border bg-surface px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

            <div className="flex items-center justify-between gap-3 lg:justify-start">
                <div className="min-w-0">
                    <h1 className="truncate font-heading text-lg font-semibold text-textPrimary sm:text-xl">
                        {getGreeting()}, Dr. Fiesta
                    </h1>

                    <p className="mt-0.5 text-xs text-textMuted">
                        {formatDisplayDate()} · Clinic{" "}
                        {getClinicOperationState()}
                    </p>
                </div>

                <div className="lg:hidden">
                    <HeaderActions />
                </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">

                <div className="relative min-w-0 flex-1 lg:flex-none">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted"
                        strokeWidth={2}
                    />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(event.target.value)
                        }
                        placeholder="Search..."
                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 lg:w-72"
                    />
                </div>

                <div className="hidden lg:block">
                    <HeaderActions />
                </div>
            </div>
        </header>
    );
}