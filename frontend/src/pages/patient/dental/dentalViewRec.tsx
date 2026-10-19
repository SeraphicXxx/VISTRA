import { useMemo } from "react";
import { ArrowLeft, ClipboardList, Printer, User } from "lucide-react";

import { InfoField, getInitials } from "/@/utils/RecordInfo";
import { ToothArch, upperTeeth, lowerTeeth } from "/@/components/teethDesign.jsx";
import { StatusBadge } from "/@/components/StatusBadge";
import { formatDate } from "/@/utils/FormatDate";
import { sessionManager } from "/@/utils/SessionManager";

import {
    DEFAULT_STUDENT_ID,
    myDentalRecords,
    myDentalVisits,
    emptyDentalRecord,
} from "./dentalData";

interface DentalNotFoundProps {
    patientId?: string | null;
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
    const sessionId = user?.user_id ?? "";
    const studentId = myDentalRecords[sessionId] ? sessionId : DEFAULT_STUDENT_ID;

    const patientData = myDentalRecords[studentId] ?? emptyDentalRecord;
    const visits = myDentalVisits[studentId] ?? [];

    const toothRecords = useMemo(() => {
        const map: Record<number, { dentition: string; condition: string; notes: string | null }> = {};

        for (const [number, status] of Object.entries(patientData.teeth)) {
            if (status !== "healthy") {
                map[Number(number)] = { dentition: "permanent", condition: status, notes: null };
            }
        }

        return map;
    }, [patientData.teeth]);

    if (!patientData.recordId) {
        return <DentalNotFound patientId={studentId} />;
    }

    const address = patientData.address
        ? `${patientData.address}${patientData.barangay ? `, ${patientData.barangay}` : ""}`
        : undefined;

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

                                <StatusBadge status={patientData.status} />
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-textMuted">
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
                                label="Last Cleaning"
                                value={patientData.lastCleaning ? formatDate(patientData.lastCleaning) : undefined}
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
                                    Dental Chart
                                </h2>
                                <p className="text-xs text-textMuted">Current chart and history</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        {patientData.medicalHistory.length > 0 && (
                            <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-5">
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

                        <div className="overflow-x-auto rounded-xl border border-border bg-background p-5">
                            <ToothArch
                                teeth={upperTeeth}
                                flip={false}
                                records={toothRecords}
                                onToothClick={() => {}}
                            />

                            <div className="my-5 border-t border-dashed border-border" />

                            <ToothArch
                                teeth={lowerTeeth}
                                flip={true}
                                records={toothRecords}
                                onToothClick={() => {}}
                            />
                        </div>

                        <div className="mt-6">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-textMuted">
                                Visit History
                            </p>

                            {visits.length === 0 ? (
                                <p className="text-sm text-textMuted">No visits yet.</p>
                            ) : (
                                <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
                                    {visits.map((visit) => (
                                        <div
                                            key={visit.id}
                                            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-primaryDark">
                                                    {visit.complaint}
                                                </p>
                                                <p className="text-xs text-textMuted">
                                                    {formatDate(visit.date)} • {visit.doctor} • {visit.treatment}
                                                </p>
                                            </div>
                                            <StatusBadge status={visit.status} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}