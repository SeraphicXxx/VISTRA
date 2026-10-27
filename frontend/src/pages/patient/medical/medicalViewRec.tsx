import {useMemo} from "react";
import {ArrowLeft, ClipboardList, Printer, User} from "lucide-react";
import {useNavigate} from "react-router-dom";

import {InfoField, getInitials} from "/@/utils/RecordInfo";
import {StatusBadge} from "/@/components/StatusBadge";
import {ROUTES} from "/@/config/RoutePaths";
import {formatDate} from "/@/utils/FormatDate";
import {sessionManager} from "/@/utils/SessionManager";
import {resolveStudentId} from "../appointments/appointmentsData";
import {myMedicalRecords, myVisits} from "./medicalData";

function ReadOnlyBlock({label, value}: {label: string; value?: string | null}) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-textMuted">{label}</p>
            <div className="min-h-[72px] whitespace-pre-wrap rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-textPrimary">
                {value || "—"}
            </div>
        </div>
    );
}

export default function PatientMedicalRecordView() {
    const navigate = useNavigate();
    const user = sessionManager.getUser();
    const studentId = resolveStudentId(user);
    const record = myMedicalRecords[studentId];

    const visits = useMemo(
        () => [...(myVisits[studentId] ?? [])].sort((a, b) => b.date.localeCompare(a.date)),
        [studentId]
    );
    const visit = visits[0];

    if (!record || !visit) {
        return (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                <p className="text-sm text-textMuted">No medical record found.</p>
            </div>
        );
    }

    const address = record.address
        ? `${record.address}${record.barangay ? `, ${record.barangay}` : ""}`
        : undefined;

    return (
        <div className="mx-auto w-full">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />

                <div className="relative p-6 sm:p-8">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.patient.dashboard.medical)}
                            className="inline-flex items-center gap-1.5 px-1.5 py-1 text-xs font-medium text-textMuted hover:text-textPrimary"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to records
                        </button>

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print record
                        </button>
                    </div>

                    <div className="flex items-center gap-5">
                        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                            {getInitials(record.name)}
                        </span>

                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="font-heading text-2xl font-semibold text-primaryDark">
                                    {record.name}
                                </h1>
                                <span className="rounded-md bg-surfaceMuted px-2 py-0.5 text-xs text-textMuted">
                                    {visit.id}
                                </span>
                                <StatusBadge status={visit.status} />
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-textMuted">
                                <span>{record.studentId}</span>
                                <span>•</span>
                                <span>Medical Record</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-border bg-surface shadow-sm">
                    <div className="border-b border-border px-5 py-4">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <h2 className="font-heading text-sm font-semibold text-primaryDark">
                                Patient Information
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-4 p-6">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Course" value={record.course} />
                            <InfoField label="Year and Section" value={record.yearSection} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Age" value={record.age} />
                            <InfoField label="Sex" value={record.sex} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Civil status" value={record.civilStatus} />
                            <InfoField
                                label="Birthday"
                                value={record.birthday ? formatDate(record.birthday) : undefined}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-5">
                            <InfoField label="Address" value={address} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Mobile Number" value={record.mobileNumber} />
                            <InfoField
                                label="Visit Date"
                                value={visit.date ? formatDate(visit.date) : undefined}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface shadow-sm lg:col-span-2">
                    <div className="border-b border-border px-5 py-4">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-primary" />
                            <div>
                                <h2 className="font-heading text-sm font-semibold text-primaryDark">
                                    Consultation
                                </h2>
                                <p className="text-xs text-textMuted">
                                    {visit.doctor
                                        ? `Attending staff: ${visit.doctor}`
                                        : "Visit record details below."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <InfoField
                                label="Visit date"
                                value={visit.date ? formatDate(visit.date) : undefined}
                            />
                            <InfoField label="Attending Staff" value={visit.doctor} />
                            <InfoField label="Visit Type" value={visit.treatmentType} />
                        </div>

                        <div className="mt-6 flex flex-col gap-5">
                            <ReadOnlyBlock label="Complaint / findings" value={visit.complaint} />
                            <ReadOnlyBlock label="Treatment" value={visit.treatment} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}