import {useMemo} from "react";
import {ArrowLeft, ClipboardList, Printer, User} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {StatusBadge} from "/@/components/StatusBadge";
import {ToothArch, upperTeeth, lowerTeeth} from "/@/components/teethDesign.jsx";
import {InfoField, getInitials} from "/@/utils/RecordInfo";
import {formatDate} from "/@/utils/FormatDate";
import {usePatientDentalRecordQuery} from "/@/hooks/query/PatientQuery";
import {DentalRecordDetailSchema} from "/@/api/schema/DentalSchema";
import {Status} from "/@/components/StatusBadge";

const TOOTH_CONDITION_META: Record<string, { label: string; text: string; bg: string; border: string }> = {
    healthy: { label: "Healthy", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    filled: { label: "Filled", text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
    caries: { label: "Decayed", text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
    crown: { label: "Crown", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    missing: { label: "Missing", text: "text-slate-600", bg: "bg-slate-100", border: "border-slate-300" },
};

function SkeletonBlock({className}: {className?: string}) {
    return <div className={`animate-pulse rounded-lg bg-border ${className ?? ""}`} />;
}

function DentalRecordSkeleton() {
    return (
        <div className="mx-auto w-full">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <SkeletonBlock className="h-8 w-32" />
                    <SkeletonBlock className="h-8 w-16" />
                </div>
                <div className="flex items-center gap-4">
                    <SkeletonBlock className="h-16 w-16 rounded-full" />
                    <div className="flex flex-1 flex-col gap-2">
                        <SkeletonBlock className="h-6 w-48" />
                        <SkeletonBlock className="h-4 w-32" />
                    </div>
                    <SkeletonBlock className="h-6 w-20" />
                </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <SkeletonBlock className="mb-4 h-5 w-40" />
                    <div className="flex flex-col gap-4">
                        <SkeletonBlock className="h-10" />
                        <SkeletonBlock className="h-10" />
                        <SkeletonBlock className="h-10" />
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
                    <SkeletonBlock className="mb-4 h-5 w-32" />
                    <SkeletonBlock className="mb-4 h-5 w-48" />
                    <SkeletonBlock className="h-48" />
                    <SkeletonBlock className="mt-4 h-24" />
                </div>
            </div>
        </div>
    );
}

function DentalNotFound({ patientId }: { patientId?: string | null }) {
    return (
        <div className="mx-auto w-full">
            <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-primaryDark">Dental record not found</h2>
                <p className="mt-2 text-sm text-textMuted">
                    There is no dental record for patient{" "}
                    <span className="font-medium text-textPrimary">{patientId ?? "unknown"}</span>.
                </p>
            </div>
        </div>
    );
}

export default function PatientDentalRecordView() {
    const navigate = useNavigate();
    const params = useParams<{ dentalId: string }>();
    const dentalId = params.dentalId ?? "";
    const { data: record, isLoading, isError } = usePatientDentalRecordQuery(dentalId);

    const toothRecords = useMemo(() => {
        const map: Record<number, { dentition: string; condition: string; notes: string | null }> = {};
        if (!record?.tooth_records) return map;
        for (const tooth of record.tooth_records) {
            if (tooth.condition && tooth.condition !== "healthy") {
                map[tooth.tooth_number] = {
                    dentition: tooth.dentition ?? "permanent",
                    condition: tooth.condition,
                    notes: tooth.notes,
                };
            }
        }
        return map;
    }, [record?.tooth_records]);

    if (isLoading) {
        return <DentalRecordSkeleton />;
    }

    if (isError || !record) {
        return <DentalNotFound patientId={dentalId} />;
    }

    const address = record.address
        ? `${record.address}${record.barangay ? `, ${record.barangay}` : ""}`
        : undefined;

    const latestVisit = record;

    return (
        <div className="mx-auto w-full">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                <div className="relative p-6">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-textSecondary hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to records
                        </button>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                            {getInitials(record.patient_name)}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="font-heading text-2xl font-semibold text-primaryDark">{record.patient_name}</h1>
                                <span className="rounded-full border border-border bg-surfaceMuted px-2.5 py-1 text-[10px] font-semibold text-textSecondary">
                                    {record.dental_visit_id}
                                </span>
                                <StatusBadge status={record.status as any} />
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-textMuted">
                                <span>{record.patient_id}</span>
                                <span>•</span>
                                <span>Dental Record</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-border bg-surface shadow-sm">
                    <div className="border-b border-border px-5 py-4">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <h2 className="font-heading text-sm font-semibold text-primaryDark">Patient Information</h2>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-4 p-6">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Course" value={record.course ?? undefined} />
                            <InfoField label="Year and Section" value={record.year_section ?? undefined} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Age" value={record.age ?? undefined} />
                            <InfoField label="Sex" value={record.sex ?? undefined} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Civil status" value={record.civil_status ?? undefined} />
                            <InfoField label="Birthday" value={record.birthday ? formatDate(record.birthday) : undefined} />
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-5">
                            <InfoField label="Address" value={address} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Mobile Number" value={record.mobileNumber ?? undefined} />
                            <InfoField label="Exam Date" value={record.dental_visit_date ? formatDate(record.dental_visit_date) : undefined} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface shadow-sm lg:col-span-2">
                    <div className="border-b border-border px-5 py-4">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-primary" />
                            <div>
                                <h2 className="font-heading text-sm font-semibold text-primaryDark">Dental Examination</h2>
                                <p className="text-xs text-textMuted">
                                    {record.last_visit ? `Last visit: ${formatDate(record.last_visit)}` : "Visit record details below."}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-2 gap-4 border-b border-border pb-5">
                            <InfoField label="Flosses Regularly" value={record.floss ?? undefined} />
                            <InfoField label="Brushing Frequency" value={record.brush_frequency ?? undefined} />
                            <InfoField label="Calculus" value={record.calculus ?? undefined} />
                            <InfoField label="Medication" value={record.medication ?? undefined} />
                        </div>

                        {record.medical_history && record.medical_history.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2 border-b border-border pb-5">
                                {record.medical_history.map((entry) => (
                                    <span key={entry} className="rounded-full border border-border bg-surfaceMuted px-2.5 py-1 text-[11px] font-medium text-textSecondary">
                                        {entry}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wide text-textMuted">Dental Chart</p>
                                <p className="text-xs text-textMuted">Click a tooth to view details</p>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-border bg-background p-5">
                                <ToothArch teeth={upperTeeth} flip={false} records={toothRecords} onToothClick={() => {}} />
                                <div className="my-5 border-t border-dashed border-border" />
                                <ToothArch teeth={lowerTeeth} flip={true} records={toothRecords} onToothClick={() => {}} />
                            </div>
                        </div>

                        <div className="mt-6">
                            <InfoField label="Clinical Notes" value={record.notes ?? undefined} />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}