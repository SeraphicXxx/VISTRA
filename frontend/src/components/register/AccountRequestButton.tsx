import {useState} from "react";
import {UserPlus} from "lucide-react";
import {getPending} from "/@/components/register/pendingStore";

interface AccountRequestButtonProps {
    onClick: () => void;
    // false: icon with red count only. true: icon, text, and red count.
    showLabel?: boolean;
    // Text shown when showLabel is true.
    label?: string;
}

const DEFAULT_LABEL = "Request Accounts";

export function AccountRequestButton({
    onClick,
    showLabel = false,
    label = DEFAULT_LABEL,
}: AccountRequestButtonProps) {
    // Read the pending count when the button mounts.
    const [count] = useState(() => getPending().length);

    const countText = count > 99 ? "99+" : String(count);

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`${label}${count > 0 ? `, ${countText} pending` : ""}`}
            title={label}
            className={`relative inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-textPrimary shadow-sm transition-colors duration-200 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                showLabel ? "px-3.5 py-2" : "h-9 w-9"
            }`}
        >
            <UserPlus className="h-4 w-4" strokeWidth={2} />

            {showLabel && <span>{label}</span>}

            {count > 0 && (
                <span
                    className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ${
                        showLabel ? "" : "absolute -right-1.5 -top-1.5 ring-2 ring-surface"
                    }`}
                >
                    {countText}
                </span>
            )}
        </button>
    );
}