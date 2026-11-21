import {useMemo, useState} from "react";
import {DefaultTablePreset} from "/@/components/table/TableDesignPreset";
import {Column} from "/@/components/table/Table";
import {avatarColor, getInitials} from "/@/components/avatar";
import {
    ACTION_META,
    type ActivityAction,
    type ActivityLog,
    type ActivityTone,
} from "/@/api/schema/ActivityLogSchema";

const PAGE_SIZE = 10;

// Replace with the real query once the audit-log endpoint exists.
const MOCK_LOGS: ActivityLog[] = [
    {id: "1", staff_id: "STF001", staff_name: "Maria Cruz Santos", action: "login", module: "Authentication", target: "Session", details: "Signed in from the clinic workstation.", created_at: "2026-11-17T08:02:00+08:00"},
    {id: "2", staff_id: "STF001", staff_name: "Maria Cruz Santos", action: "update", module: "Medical Records", target: "Patient STF-2401", details: "Updated the clinical notes.", created_at: "2026-11-17T08:40:00+08:00"},
    {id: "3", staff_id: "STF002", staff_name: "Logan Reyes Santos", action: "view", module: "Dental Records", target: "Patient STF-2388", details: "Opened the dental chart.", created_at: "2026-11-17T09:15:00+08:00"},
    {id: "4", staff_id: "STF002", staff_name: "Logan Reyes Santos", action: "create", module: "Appointments", target: "Appointment #1042", details: "Booked a follow-up appointment.", created_at: "2026-11-17T09:31:00+08:00"},
    {id: "5", staff_id: "STF007", staff_name: "kenji briones chua", action: "permission_change", module: "Staff Management", target: "STF-1794098", details: "Granted Dental Records access.", created_at: "2026-11-17T10:05:00+08:00"},
    {id: "6", staff_id: "STF007", staff_name: "kenji briones chua", action: "delete", module: "Patient Records", target: "Patient STF-2412", details: "Deleted a duplicate patient record.", created_at: "2026-11-17T10:22:00+08:00"},
    {id: "7", staff_id: "STF001", staff_name: "Maria Cruz Santos", action: "logout", module: "Authentication", target: "Session", details: "Signed out.", created_at: "2026-11-17T11:50:00+08:00"},
];

// Swap this for the real list query.
function useActivityLogs(): {logs: ActivityLog[]; isLoading: boolean} {
    return {logs: MOCK_LOGS, isLoading: false};
}

function ActionBadge({action}: { action: ActivityAction }) {
    const meta = ACTION_META[action];
    const tones: Record<ActivityTone, string> = {
        primary: "bg-primary/10 text-primary",
        info: "bg-info/10 text-info",
        success: "bg-success/10 text-success",
        danger: "bg-danger/10 text-danger",
    };

    return (
        <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${tones[meta.tone]}`}>
            {meta.label}
        </span>
    );
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleString("en-PH", {dateStyle: "medium", timeStyle: "short"});
}

export function ActivityLogsPage() {
    const {logs, isLoading} = useActivityLogs();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const visibleLogs = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return logs;

        return logs.filter((log) =>
            [log.staff_name, log.staff_id, ACTION_META[log.action].label, log.module, log.target, log.details]
                .some((value) => value.toLowerCase().includes(query)),
        );
    }, [logs, search]);

    const totalPages = Math.max(1, Math.ceil(visibleLogs.length / PAGE_SIZE));

    const columns = useMemo<Column<ActivityLog>[]>(
        () => [
            {
                key: "created_at",
                label: "Date & time",
                render: (_value, log) => (
                    <span className="whitespace-nowrap text-sm tabular-nums text-slate-600">
                        {formatTime(log.created_at)}
                    </span>
                ),
            },
            {
                key: "staff_name",
                label: "Staff",
                render: (_value, log) => (
                    <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(log.staff_name)}`}>
                            {getInitials(log.staff_name)}
                        </div>
                        <div className="min-w-0">
                            <p className="whitespace-nowrap font-medium text-slate-900">{log.staff_name}</p>
                            <p className="whitespace-nowrap text-xs tabular-nums text-slate-500">{log.staff_id}</p>
                        </div>
                    </div>
                ),
            },
            {
                key: "action",
                label: "Action",
                render: (_value, log) => <ActionBadge action={log.action}/>,
            },
            {
                key: "module",
                label: "Module",
                render: (_value, log) => (
                    <span className="whitespace-nowrap text-slate-700">{log.module}</span>
                ),
            },
            {
                key: "details",
                label: "Details",
                render: (_value, log) => (
                    <div className="min-w-[14rem]">
                        <p className="text-sm text-slate-800">{log.details}</p>
                        <p className="text-xs text-slate-500">{log.target}</p>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <DefaultTablePreset<ActivityLog>
            title="Activity Logs"
            subtitle="Every action staff take in the portal, recorded per staff member."
            data={visibleLogs}
            isLoading={isLoading}
            columns={columns}
            totalPages={totalPages}
            page={page}
            onRun={(nextSearch, _filters, nextPage) => {
                setSearch(nextSearch);
                setPage(nextPage);
            }}
        />
    );
}

export default ActivityLogsPage;