import { Bell } from "lucide-react";
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
        <div className="flex shrink-0 items-center">
            <button
                type="button"
                aria-label="Notifications"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-textSecondary transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
                <Bell
                    className="h-[18px] w-[18px]"
                    strokeWidth={2}
                />
            </button>
        </div>
    );
}

export default function StaffPageHeader({
    staffId,
}: StaffPageHeaderProps) {
    const { staffData, isLoading } = useStaffInfo(staffId);
    const clinicState = getClinicOperationState();

    const displayName = isLoading
        ? "Loading..."
        : `Dr. ${staffData?.getDisplayName() ?? "Staff"}`;

    return (
        <header className="w-full min-w-0 border-b border-border bg-surface px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <div className="flex min-w-0 items-start justify-between gap-3 sm:items-center sm:gap-5">
                <div className="min-w-0 flex-1">
                    <h1 className="break-words font-heading text-lg font-semibold leading-snug tracking-tight text-textPrimary sm:text-xl md:text-2xl">
                        {getGreeting()},{" "}
                        <span className="break-words">
                            {displayName}
                        </span>
                    </h1>

                    <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-textMuted sm:text-sm">
                        <span>{formatDisplayDate()}</span>

                        <span
                            aria-hidden="true"
                            className="hidden text-border sm:inline"
                        >
                            •
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                            <span className="font-medium text-success">
                                Clinic {clinicState}
                            </span>
                        </span>
                    </div>
                </div>

                <HeaderActions />
            </div>
        </header>
    );
}
