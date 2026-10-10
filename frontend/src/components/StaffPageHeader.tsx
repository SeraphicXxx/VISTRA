import { Bell, Search } from "lucide-react";

import {
    formatDisplayDate,
    getClinicOperationState,
    getGreeting,
} from "../utils/Formatters";

import { useStaffInfo } from "../hooks/StaffInfo";

interface StaffPageHeaderProps {
    staffId: string;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

function HeaderActions() {
    return (
        <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-textSecondary transition-colors hover:bg-primary/5 hover:text-primary"
        >
            <Bell
                className="h-[18px] w-[18px]"
                strokeWidth={2}
            />
        </button>
    );
}

export default function StaffPageHeader({
    staffId,
    searchQuery,
    setSearchQuery,
}: StaffPageHeaderProps) {
    const {
        staffData,
        isLoading,
    } = useStaffInfo(staffId);

    const clinicState = getClinicOperationState();

    return (
        <header className="border-b border-border bg-surface px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                
                {/* Greeting */}
                <div className="min-w-0">
                    <h1 className="truncate font-heading text-xl font-semibold tracking-tight text-textPrimary sm:text-2xl">
                        {getGreeting()},{" "}
                        {isLoading
                            ? "Loading..."
                            : `Dr. ${staffData?.getDisplayName() ?? "Staff"}`}
                    </h1>

                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-textMuted">
                        <span>
                            {formatDisplayDate()}
                        </span>

                        <span className="text-border">
                            •
                        </span>

                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            <span className="font-medium text-success">
                                Clinic {clinicState}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5">
                    {/* <div className="relative min-w-0 flex-1 lg:flex-none">
                        <Search
                            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted"
                            strokeWidth={2}
                        />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                            placeholder="Search..."
                            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-textPrimary placeholder:text-textMuted transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10 sm:w-64 lg:w-72"
                        />
                    </div> */}

                    <HeaderActions />
                </div>
            </div>
        </header>
    );
}

