import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList, Pencil, Printer, User } from "lucide-react";
import { InfoField, getInitials } from "/@/utils/RecordInfo";
import {
  ToothArch,
  upperTeeth,
  lowerTeeth,
} from "/@/components/teethDesign.jsx";
import { StatusBadge } from "/@/components/StatusBadge";
import {
  EditRecordModal,
  dentalEditFields,
  statusEditFields,
} from "/@/components/editModal";
import { ToothEditModal } from "/@/components/ToothEditModal.jsx";
import { useDentalVisitDetail, useUpdateDentalVisit } from "/@/hooks/query/DentalQuery";
import { formatDate } from "/@/utils/FormatDate";
import { getFieldErrors } from "/@/utils/Formatters";
import type { UpdateDentalVisit, UpdateToothRecord } from "/@/api/schema/DentalSchema";

interface DentalNotFoundProps {
  patientId?: string | null;
  dentalId?: string | null;
}

export function DentalNotFound({ patientId, dentalId }: DentalNotFoundProps) {
  return (
    <div className="mx-auto w-full">
      <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-primaryDark">
          {dentalId
            ? `Dental record No. ${dentalId} not found`
            : "Dental record not found"}
        </h2>

        <p className="mt-2 text-sm text-textMuted">
          There is no dental visit at No. {dentalId ?? "unknown"} for patient{" "}
          <span className="font-medium text-textPrimary">
            {patientId ?? "unknown"}
          </span>
          .
        </p>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-textSecondary hover:bg-surfaceMuted"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to records
        </button>
      </div>
    </div>
  );
}

export function DentalRecordSkeleton() {
  return (
    <div
      className="mx-auto w-full animate-pulse"
      aria-busy="true"
      aria-label="Loading dental record"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="relative p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-4 w-28 rounded bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-7 w-24 rounded-lg bg-surface" />
              <div className="h-7 w-20 rounded-lg bg-surface" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-surface" />
            <div className="min-w-0">
              <div className="h-7 w-52 rounded bg-surface" />
              <div className="mt-2 h-3 w-36 rounded bg-surface" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 h-4 w-36 rounded bg-surface" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-2.5 w-20 rounded bg-border" />
                <div className="h-4 w-32 rounded bg-surface" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 h-4 w-44 rounded bg-surface" />
          <div className="grid grid-cols-2 gap-4 border-b border-border pb-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-2.5 w-20 rounded bg-border" />
                <div className="h-4 w-28 rounded bg-surface" />
              </div>
            ))}
          </div>
          <div className="mt-6 h-40 rounded-xl border border-border bg-background" />
        </div>
      </div>
    </div>
  );
}

export default function DentalRecordView() {
  const { patientId, dentalId } = useParams<{
    patientId: string;
    dentalId: string;
  }>();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examForm, setExamForm] = useState<Record<string, any>>({});
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const updateVisitMutation = useUpdateDentalVisit();

  const {
    data: record,
    isLoading,
    isError,
    refetch,
  } = useDentalVisitDetail(patientId ?? "", dentalId ?? "");

  const toothRecords = useMemo(() => {
    const map: Record<
      number,
      { dentition: string; condition: string; notes: string | null }
    > = {};

    for (const tooth of record?.tooth_records ?? []) {
      map[tooth.tooth_number] = {
        dentition: tooth.dentition ?? "permanent",
        condition: tooth.condition,
        notes: tooth.notes,
      };
    }

    return map;
  }, [record]);

  if (!patientId || !dentalId) {
    return <DentalNotFound patientId={patientId} dentalId={dentalId} />;
  }

  if (isLoading) {
    return <DentalRecordSkeleton />;
  }

  if (isError || !record) {
    return <DentalNotFound patientId={patientId} dentalId={dentalId} />;
  }

  const handleBack = (): void => {
    window.history.back();
  };

  const openExamEdit = (): void => {
    setExamForm({
      date: record.dental_visit_date ?? "",
      lastVisit: record.last_visit ?? "",
      floss: record.floss ?? "",
      brushFrequency: record.brush_frequency ?? "",
      calculus: record.calculus ?? "",
      medication: record.medication ?? "",
      notes: record.notes ?? "",
    });
    setSaveError(null);
    setIsExamModalOpen(true);
  };

  const persistUpdate = (
    payload: UpdateDentalVisit,
    onDone: () => void
  ): void => {
    if (!patientId || !dentalId) return;

    if (
      Object.keys(payload).length === 0 ||
      (Object.keys(payload).length === 1 && payload.tooth_records?.length === 0)
    ) {
      onDone();
      return;
    }

    setSaveError(null);
    updateVisitMutation.mutate(
      { patientId, dentalId, payload },
      {
        onSuccess: () => {
          onDone();
          void refetch();
        },
        onError: (error) => {
          setSaveError(getFieldErrors(error));
        },
      }
    );
  };

  const handleSaveStatus = (form: Record<string, any>): void => {
    const status = String(form.status ?? "").trim();

    if (!status || status === record.status) {
      setIsStatusModalOpen(false);
      return;
    }

    persistUpdate({ status }, () => setIsStatusModalOpen(false));
  };

  const handleSaveExam = (form: Record<string, any>): void => {
    const text = (value: unknown): string | undefined => {
      const trimmed = String(value ?? "").trim();
      return trimmed || undefined;
    };

    const payload: UpdateDentalVisit = {};
    const date = text(form.date);
    const lastVisit = text(form.lastVisit);
    const brushFrequency = text(form.brushFrequency);
    const calculus = text(form.calculus);
    const medication = text(form.medication);
    const notes = text(form.notes);

    if (date && date !== (record.dental_visit_date ?? "")) {
      payload.visit_date = date;
    }

    if (lastVisit && lastVisit !== (record.last_visit ?? "")) {
      payload.last_dental_visit = lastVisit;
    }

    if (form.floss === "Yes" || form.floss === "No") {
      const floss = form.floss === "Yes";

      if (floss !== (record.floss === "Yes")) {
        payload.floss = floss;
      }
    }

    if (brushFrequency && brushFrequency !== (record.brush_frequency ?? "")) {
      payload.brushing_frequency = brushFrequency;
    }

    if (calculus && calculus !== (record.calculus ?? "")) {
      payload.calculus_severity = calculus;
    }

    if (medication && medication !== (record.medication ?? "")) {
      payload.current_medications = medication;
    }

    if (notes && notes !== (record.notes ?? "")) {
      payload.notes = notes;
    }

    persistUpdate(payload, () => setIsExamModalOpen(false));
  };

  const handleSaveTooth = (form: {
    dentition: string;
    condition: string;
    notes: string;
  }): void => {
    if (selectedTooth === null) return;

    const existingId = record.tooth_records.find(
      (tooth) => tooth.tooth_number === selectedTooth
    )?.id;

    const toothRecord: UpdateToothRecord = {
      tooth_number: selectedTooth,
      is_permanent: form.dentition === "permanent",
      condition: form.condition,
      notes: form.notes?.trim() ? form.notes : null,
    };

    if (existingId !== undefined) {
      toothRecord.id = existingId;
    }

    persistUpdate({ tooth_records: [toothRecord] }, () =>
      setSelectedTooth(null)
    );
  };

  const address = record.address
    ? `${record.address}${record.barangay ? `, ${record.barangay}` : ""}`
    : undefined;

  return (
    <>
      {saveError && (
        <div className="fixed inset-x-0 top-4 z-[60] mx-auto w-fit max-w-md rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-medium text-danger shadow-lg">
          {saveError}
        </div>
      )}

      <div className="mx-auto w-full">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />

          <div className="relative p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-textSecondary hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to records
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primaryDark"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Update status
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
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                {getInitials(record.patient_name)}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-heading text-2xl font-semibold text-primaryDark">
                    {record.patient_name}
                  </h1>

                  <span className="rounded-full border border-border bg-surfaceMuted px-2.5 py-1 text-[10px] font-semibold text-textSecondary">
                    DEN-{record.dental_visit_id}
                  </span>

                  <StatusBadge status={record.status} />
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-textMuted">
                  {record.patient_id && <span>{record.patient_id}</span>}
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
                <InfoField label="Course" value={record.course ?? undefined} />
                <InfoField
                  label="Year and Section"
                  value={record.year_section ?? undefined}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <InfoField label="Age" value={record.age ?? undefined} />
                <InfoField label="Sex" value={record.sex ?? undefined} />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <InfoField
                  label="Civil status"
                  value={record.civil_status ?? undefined}
                />
                <InfoField
                  label="Birthday"
                  value={
                    record.birthday ? formatDate(record.birthday) : undefined
                  }
                />
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-5">
                <InfoField label="Address" value={address} />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <InfoField
                  label="Mobile Number"
                  value={record.mobileNumber ?? undefined}
                />
                <InfoField
                  label="Exam Date"
                  value={
                    record.dental_visit_date
                      ? formatDate(record.dental_visit_date)
                      : undefined
                  }
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface shadow-sm lg:col-span-2">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  <div>
                    <h2 className="font-heading text-sm font-semibold text-primaryDark">
                      Dental Examination
                    </h2>
                    <p className="text-xs text-textMuted">
                      {record.last_visit
                        ? `Last visit: ${record.last_visit}`
                        : "Visit record details below."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openExamEdit}
                  aria-label="Edit dental examination"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-textSecondary transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-4 border-b border-border pb-5">
                <InfoField
                  label="Flosses Regularly"
                  value={record.floss ?? undefined}
                />
                <InfoField
                  label="Brushing Frequency"
                  value={record.brush_frequency ?? undefined}
                />
                <InfoField label="Calculus" value={record.calculus ?? undefined} />
                <InfoField
                  label="Medication"
                  value={record.medication ?? undefined}
                />
              </div>

              {record.medical_history.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2 border-b border-border pb-5">
                  {record.medical_history.map((entry) => (
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
                  <p className="text-xs text-textMuted">
                    Click a tooth to edit
                  </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border bg-background p-5">
                  <ToothArch
                    teeth={upperTeeth}
                    flip={false}
                    records={toothRecords}
                    onToothClick={(toothNumber: number) =>
                      setSelectedTooth(toothNumber)
                    }
                  />

                  <div className="my-5 border-t border-dashed border-border" />

                  <ToothArch
                    teeth={lowerTeeth}
                    flip={true}
                    records={toothRecords}
                    onToothClick={(toothNumber: number) =>
                      setSelectedTooth(toothNumber)
                    }
                  />
                </div>
              </div>

              <div className="mt-6">
                <InfoField
                  label="Clinical Notes"
                  value={record.notes ?? undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isStatusModalOpen && (
        <EditRecordModal
          title="Update status"
          fields={statusEditFields}
          data={{ status: record.status }}
          onClose={() => setIsStatusModalOpen(false)}
          onSave={handleSaveStatus}
          isSaving={updateVisitMutation.isPending}
        />
      )}

      {isExamModalOpen && (
        <EditRecordModal
          title="Edit dental examination"
          fields={dentalEditFields.filter((field) => field.key !== "status")}
          data={examForm}
          onClose={() => setIsExamModalOpen(false)}
          onSave={handleSaveExam}
          isSaving={updateVisitMutation.isPending}
        />
      )}

      {selectedTooth !== null && (
        <ToothEditModal
          toothNumber={selectedTooth}
          record={toothRecords[selectedTooth]}
          onClose={() => setSelectedTooth(null)}
          onSave={handleSaveTooth}
          isSaving={updateVisitMutation.isPending}
        />
      )}
    </>
  );
}