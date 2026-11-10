import {ArrowLeft, ClipboardList, Printer, User} from "lucide-react";
import {useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {StatusBadge} from "/@/components/StatusBadge";
import {SkeletonBlock} from "/@/components/SkeletonBlock";
import {ROUTES} from "/@/config/RoutePaths";
import {formatDate} from "/@/utils/FormatDate";
import {sessionManager} from "/@/utils/SessionManager";
import {usePatientMedicalRecordQuery} from "/@/hooks/query/PatientQuery";
import {MedicalRecordDetailSchema} from "/@/api/schema/MedicalSchema";

function Field({label, value}: {label: string; value?: string | null}) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-textMuted">{label}</span>
            <span className="text-sm">{value || "—"}</span>
        </div>
    );
}



function MedicalRecordSkeleton() {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
                <SkeletonBlock className="h-8 w-24" />
                <SkeletonBlock className="h-8 w-16" />
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    <SkeletonBlock className="h-16 w-16 rounded-full" />
                    <div className="flex flex-1 flex-col gap-2">
                        <SkeletonBlock className="h-6 w-48" />
                        <SkeletonBlock className="h-4 w-32" />
                    </div>
                    <SkeletonBlock className="h-6 w-20" />
                </div>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                <SkeletonBlock className="mb-4 h-5 w-32" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <SkeletonBlock className="h-12" />
                    <SkeletonBlock className="h-12" />
                    <SkeletonBlock className="h-12" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                    <SkeletonBlock className="mb-4 h-5 w-40" />
                    <div className="flex flex-col gap-4">
                        <SkeletonBlock className="h-10" />
                        <SkeletonBlock className="h-10" />
                        <SkeletonBlock className="h-10" />
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-card lg:col-span-2">
                    <SkeletonBlock className="mb-4 h-5 w-32" />
                    <div className="flex flex-col gap-4">
                        <SkeletonBlock className="h-10" />
                        <SkeletonBlock className="h-24" />
                        <SkeletonBlock className="h-24" />
                    </div>
                </div>
            </div>
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
    const params = useParams<{ medicalId: string }>();
    const medicalId = params.medicalId ?? "";
    const { data: record, isLoading, isError } = usePatientMedicalRecordQuery(medicalId);

    if (isLoading) {
        return <MedicalRecordSkeleton />;
    }

    if (isError || !record) {
        return (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
                <p className="text-sm text-textMuted">No medical record found.</p>
            </div>
        );
    }

    const address = record.address
        ? `${record.address}${record.barangay ? `, ${record.barangay}` : ""}`
        : undefined;

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
                        {getInitialsFrom(record.patient_name)}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                        <h1 className="text-xl font-semibold text-primaryDark">{record.patient_name}</h1>
                        <p className="text-sm text-textMuted">Medical Record</p>
                    </div>
                    <StatusBadge status={record.status} />
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                <h2 className="mb-4 text-base font-semibold text-primaryDark">Visit Summary</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <Field label="Visit Date" value={record.visit_date ? formatDate(record.visit_date) : undefined} />
                    <Field label="Attending Staff" value={record.staff_name} />
                    <Field label="Visit Type" value={record.treatment_type} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                    <div className="border-b border-border px-5 py-4">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <h2 className="text-base font-semibold text-primaryDark">Patient Information</h2>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-4 p-6">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <Field label="Course" value={record.course} />
                            <Field label="Year and Section" value={record.year_section} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <Field label="Age" value={record.age} />
                            <Field label="Sex" value={record.sex} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <Field label="Civil status" value={record.civil_status} />
                            <Field label="Birthday" value={record.birthday ? formatDate(record.birthday) : undefined} />
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-5">
                            <Field label="Address" value={address} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <Field label="Mobile Number" value={record.mobileNumber} />
                            <Field label="Visit Date" value={record.visit_date ? formatDate(record.visit_date) : undefined} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 shadow-card lg:col-span-2">
                    <div className="border-b border-border px-5 py-4">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-primary" />
                            <div>
                                <h2 className="text-base font-semibold text-primaryDark">Consultation</h2>
                                <p className="text-xs text-textMuted">
                                    {record.staff_name
                                        ? `Attending staff: ${record.staff_name}`
                                        : "Visit record details below."}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <Field label="Visit date" value={record.visit_date ? formatDate(record.visit_date) : undefined} />
                            <Field label="Attending Staff" value={record.staff_name} />
                            <Field label="Visit Type" value={record.treatment_type} />
                        </div>
                        <div className="mt-6 flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-medium text-textMuted">Complaint / findings</p>
                                <div className="min-h-[72px] whitespace-pre-wrap rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-textPrimary">
                                    {record.complaint || "—"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-medium text-textMuted">Treatment</p>
                                <div className="min-h-[72px] whitespace-pre-wrap rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-textPrimary">
                                    {record.treatment || "—"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}