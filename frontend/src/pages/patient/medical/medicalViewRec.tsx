import {ArrowLeft, Printer} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {StatusBadge} from "/@/components/StatusBadge";
import {ROUTES} from "/@/config/RoutePaths";
import {sessionManager} from "/@/utils/SessionManager";
import {myMedicalRecords, myVisits, DEFAULT_STUDENT_ID} from "./medicalData";

function Field({label, value}: {label: string; value?: string | null}) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-textMuted">{label}</span>
            <span className="text-sm">{value || "—"}</span>
        </div>
    );
}

function getInitialsFrom(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
}

export default function PatientMedicalRecordView() {
    const navigate = useNavigate();
    const user = sessionManager.getUser();
    const studentId = user?.user_id ?? DEFAULT_STUDENT_ID;
    const record = myMedicalRecords[studentId];
    const visits = myVisits[studentId] ?? [];

    if (!record) {
        return (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
                <p className="text-sm text-textMuted">No medical record found.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.patient.dashboard.medical)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-primaryDark shadow-card transition hover:bg-surfaceMuted"
                >
                    <ArrowLeft className="h-4 w-4"/>
                    Back
                </button>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-primaryDark shadow-card transition hover:bg-surfaceMuted"
                >
                    <Printer className="h-4 w-4"/>
                    Print
                </button>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                        {getInitialsFrom(record.name)}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                        <h1 className="text-xl font-semibold text-primaryDark">{record.name}</h1>
                        <p className="text-sm text-textMuted">Medical Record</p>
                    </div>
                    <StatusBadge status={record.status}/>
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                <h2 className="mb-4 text-base font-semibold text-primaryDark">Visit Summary</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <Field label="Total visits" value={String(visits.length)}/>
                    <Field label="Latest visit" value={visits[visits.length - 1]?.date}/>
                    <Field label="Pending visits" value={String(visits.filter((v) => v.status === "pending").length)}/>
                </div>
            </div>
        </div>
    );
}