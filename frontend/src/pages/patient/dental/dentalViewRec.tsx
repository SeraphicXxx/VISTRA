import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ClipboardList, Printer, User, X } from "lucide-react";

import { InfoField, getInitials } from "/@/utils/RecordInfo";
import { ToothArch, upperTeeth, lowerTeeth } from "/@/components/teethDesign.jsx";
import { StatusBadge } from "/@/components/StatusBadge";
import { formatDate } from "/@/utils/FormatDate";
import { sessionManager } from "/@/utils/SessionManager";
import { resolveStudentId } from "../appointments/appointmentsData";

import {
    UPPER_RIGHT,
    UPPER_LEFT,
    LOWER_LEFT,
    LOWER_RIGHT,
    myDentalRecords,
    myDentalVisits,
    emptyDentalRecord,
    type ToothStatus,
} from "./dentalData";

interface DentalNotFoundProps {
    patientId?: string | null;
}

const TOOTH_CONDITION_META: Record<ToothStatus, { label: string; text: string; bg: string; border: string }> = {
    healthy: {
        label: "Healthy",
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
    },
    filled: {
        label: "Filled",
        text: "text-sky-700",
        bg: "bg-sky-50",
        border: "border-sky-200",
    },
    caries: {
        label: "Decayed",
        text: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
    },
    crown: {
        label: "Crown",
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
    },
    missing: {
        label: "Missing",
        text: "text-slate-600",
        bg: "bg-slate-100",
        border: "border-slate-300",
    },
};

const getPosition = (tooth: number) => {
    if (UPPER_RIGHT.includes(tooth)) return "Upper right";
    if (UPPER_LEFT.includes(tooth)) return "Upper left";
    if (LOWER_LEFT.includes(tooth)) return "Lower left";
    if (LOWER_RIGHT.includes(tooth)) return "Lower right";

    return "Unknown";
};

function ToothDetailModal({
    toothNumber,
    condition,
    relatedVisits,
    onClose,
}: {
    toothNumber: number;
    condition: ToothStatus;
    relatedVisits: { id: string; date: string; doctor: string; treatment: string; notes: string }[];
    onClose: () => void;
}) {
    const meta = TOOTH_CONDITION_META[condition];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="tooth-detail-title"
                className="relative w-full max-w-md rounded-2xl border border-border bg-surface shadow-sm"
            >
                <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background font-heading text-lg font-semibold text-primaryDark">
                            {toothNumber}
                        </div>
                        <div>
                            <h2 id="tooth-detail-title" className="font-heading text-sm font-semibold text-primaryDark">
                                Tooth {toothNumber}
                            </h2>
                            <p className="text-xs text-textMuted">{getPosition(toothNumber)} · Permanent</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close tooth details"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-textSecondary hover:bg-surfaceMuted"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="flex flex-col gap-5 p-5">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Dentition" value="Permanent" />
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-medium text-textMuted">Condition</p>
                            <span
                                className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${meta.bg} ${meta.border} ${meta.text}`}
                            >
                                {meta.label}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium text-textMuted">Notes</p>
                        <div className="min-h-[72px] whitespace-pre-wrap rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-textPrimary">
                            {relatedVisits.length > 0
                                ? relatedVisits.map((visit) => visit.notes).filter(Boolean).join("\n") || "—"
                                : "No notes recorded for this tooth."}
                        </div>
                    </div>

                    {relatedVisits.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-medium text-textMuted">Related visits</p>
                            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
                                {relatedVisits.map((visit) => (
                                    <div key={visit.id} className="px-3 py-2.5">
                                        <p className="text-sm font-medium text-primaryDark">{visit.treatment}</p>
                                        <p className="text-xs text-textMuted">
                                            {formatDate(visit.date)} • {visit.doctor}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end border-t border-border px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export function DentalNotFound({ patientId }: DentalNotFoundProps) {
    return (
        <div className="mx-auto w-full">
            <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-primaryDark">
                    Dental record not found
                </h2>

                <p className="mt-2 text-sm text-textMuted">
                    There is no dental record for patient{" "}
                    <span className="font-medium text-textPrimary">{patientId ?? "unknown"}</span>.
                </p>

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to my records
                </button>
            </div>
        </div>
    );
}

export default function PatientDentalRecordView() {
    const user = sessionManager.getUser();
    const studentId = resolveStudentId(user);

    const patientData = myDentalRecords[studentId] ?? emptyDentalRecord;
    const visits = useMemo(
        () => [...(myDentalVisits[studentId] ?? [])].sort((a, b) => b.date.localeCompare(a.date)),
        [studentId]
    );
    const latestVisit = visits[0];

    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

    useEffect(() => {
        if (selectedTooth === null) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setSelectedTooth(null);
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selectedTooth]);

    const toothRecords = useMemo(() => {
        const map: Record<number, { dentition: string; condition: string; notes: string | null }> = {};

        for (const [number, status] of Object.entries(patientData.teeth)) {
            if (status !== "healthy") {
                map[Number(number)] = { dentition: "permanent", condition: status, notes: null };
            }
        }

        return map;
    }, [patientData.teeth]);

    const relatedVisits = useMemo(() => {
        if (selectedTooth === null) return [];

        const pattern = new RegExp(`\\b${selectedTooth}\\b`);

        return visits.filter((visit) => pattern.test(`${visit.treatment} ${visit.notes}`));
    }, [selectedTooth, visits]);

    if (!patientData.recordId) {
        return <DentalNotFound patientId={studentId} />;
    }

    const address = patientData.address
        ? `${patientData.address}${patientData.barangay ? `, ${patientData.barangay}` : ""}`
        : undefined;

    const selectedCondition: ToothStatus | null =
        selectedTooth !== null ? patientData.teeth[selectedTooth] ?? "healthy" : null;

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
                            {getInitials(patientData.name)}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="font-heading text-2xl font-semibold text-primaryDark">
                                    {patientData.name}
                                </h1>

                                <span className="rounded-full border border-border bg-surfaceMuted px-2.5 py-1 text-[10px] font-semibold text-textSecondary">
                                    {patientData.recordId}
                                </span>

                                <StatusBadge status={patientData.status} />
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-textMuted">
                                <span>{studentId}</span>
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
                            <h2 className="font-heading text-sm font-semibold text-primaryDark">
                                Patient Information
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-4 p-6">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Course" value={patientData.course} />
                            <InfoField label="Year and Section" value={patientData.yearSection} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Age" value={patientData.age} />
                            <InfoField label="Sex" value={patientData.sex} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Civil status" value={patientData.civilStatus} />
                            <InfoField
                                label="Birthday"
                                value={patientData.birthday ? formatDate(patientData.birthday) : undefined}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-5">
                            <InfoField label="Address" value={address} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                            <InfoField label="Mobile Number" value={patientData.mobileNumber} />
                            <InfoField
                                label="Exam Date"
                                value={patientData.examDate ? formatDate(patientData.examDate) : undefined}
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
                                    Dental Examination
                                </h2>
                                <p className="text-xs text-textMuted">
                                    {patientData.lastVisit
                                        ? `Last visit: ${formatDate(patientData.lastVisit)}`
                                        : "Visit record details below."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-2 gap-4 border-b border-border pb-5">
                            <InfoField label="Flosses Regularly" value={latestVisit?.floss} />
                            <InfoField label="Brushing Frequency" value={latestVisit?.brushFrequency} />
                            <InfoField label="Calculus" value={latestVisit?.calculus} />
                            <InfoField label="Medication" value={latestVisit?.medication} />
                        </div>

                        {patientData.medicalHistory.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2 border-b border-border pb-5">
                                {patientData.medicalHistory.map((entry) => (
                                    <span
                                        key={entry}
                                        className="rounded-full border border-border bg-surfaceMuted px-2.5 py-1 text-[11px] font-medium text-textSecondary"
                                    >
                                        {entry}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wide text-textMuted">
                                    Dental Chart
                                </p>
                                <p className="text-xs text-textMuted">Click a tooth to view details</p>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-border bg-background p-5">
                                <ToothArch
                                    teeth={upperTeeth}
                                    flip={false}
                                    records={toothRecords}
                                    onToothClick={(toothNumber: number) => setSelectedTooth(toothNumber)}
                                />

                                <div className="my-5 border-t border-dashed border-border" />

                                <ToothArch
                                    teeth={lowerTeeth}
                                    flip={true}
                                    records={toothRecords}
                                    onToothClick={(toothNumber: number) => setSelectedTooth(toothNumber)}
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <InfoField label="Clinical Notes" value={latestVisit?.notes} />
                        </div>
                    </div>
                </div>
            </div>

            {selectedTooth !== null &&
                selectedCondition !== null &&
                createPortal(
                    <ToothDetailModal
                        toothNumber={selectedTooth}
                        condition={selectedCondition}
                        relatedVisits={relatedVisits}
                        onClose={() => setSelectedTooth(null)}
                    />,
                    document.body
                )}
        </div>
    );
}