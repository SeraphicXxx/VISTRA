import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList, Pencil, Printer, User } from "lucide-react";

import { InfoField, getInitials } from "/@/utils/RecordInfo";
import { StatusBadge } from "/@/components/StatusBadge";
import { EditRecordModal, statusEditFields } from "/@/components/editModal";
import { useMedicalVisitDetail, useUpdateMedicalVisit } from "/@/hooks/query/MedicalQuery";
import type { MedicalRecordDetailSchema, UpdateMedicalVisit } from "/@/api/schema/MedicalSchema";
import { formatDate } from "/@/utils/FormatDate";
import { getFieldErrorString } from "/@/utils/Formatters";
import { SaveErrorBanner } from "/@/components/SaveErrorBanner";

const USE_DUMMY_DATA =
  import.meta.env.VITE_USE_DUMMY_MEDICAL === "true";

interface NotifiedProfessor {
  name: string;
  role: string;
  course: string;
  email: string;
  sent_at: string;
}

type MedicalVisitView = MedicalRecordDetailSchema & {
  notified_professor?: NotifiedProfessor | null;
};

const DUMMY_MEDICAL_VISIT: MedicalVisitView = {
  medical_visit_id: "1042",
  patient_name: "Kenji Chua",
  patient_id: "20230518-S",
  status: "Cleared",
  course: "BS Computer Science",
  year_section: "3 - A",
  age: "21",
  sex: "Male",
  civil_status: "Single",
  birthday: "2005-01-01",
  address: "123 Main St",
  barangay: "Barangay 1",
  mobileNumber: "09171234567",
  staff_name: "Maria Santos",
  visit_date: "2026-10-11",
  complaint: "Fever, headache since morning",
  treatment: "Paracetamol 500mg, rest advised",
  treatment_type: "Medicine",
  notified_professor: {
    name: "Dr. Maria Santos",
    role: "Professor",
    course: "BS Computer Science",
    email: "maria.santos@vistra-university.test",
    sent_at: "2026-10-11",
  },
};

const consultationEditFields = [
  { key: "visitDate", label: "Visit date", type: "date" },
  {
    key: "complaint",
    label: "Complaint / findings",
    type: "textarea",
    span: true,
  },
  {
    key: "treatment",
    label: "Treatment",
    type: "textarea",
    span: true,
  },
];

/*
 * Status modal options are display labels ("Not Cleared"); the
 * endpoint takes backend keys ("notCleared"). Labels map 1:1 by
 * lowercasing the first letter and stripping spaces.
 */
function toBackendStatus(label: string): string {
  const trimmed = label.trim();
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1).replace(/\s+/g, "");
}

interface MedicalNotFoundProps {
  patientId?: string | null;
  medicalId?: string | null;
}

export function MedicalNotFound({ patientId, medicalId }: MedicalNotFoundProps) {
  return (
    <div className="mx-auto w-full">
      <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-primaryDark">
          {medicalId
            ? `Medical record No. ${medicalId} not found`
            : "Medical record not found"}
        </h2>

        <p className="mt-2 text-sm text-textMuted">
          There is no medical visit at No. {medicalId ?? "unknown"} for patient{" "}
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

function ReadOnlyBlock({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-textMuted">{label}</p>
      <div className="min-h-[72px] whitespace-pre-wrap rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-textPrimary">
        {value || "—"}
      </div>
    </div>
  );
}

export function MedicalRecordSkeleton() {
  return (
    <div
      className="mx-auto w-full animate-pulse"
      aria-busy="true"
      aria-label="Loading medical record"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="relative p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="h-4 w-28 rounded bg-border" />
            <div className="flex gap-2">
              <div className="h-8 w-28 rounded-lg bg-surface" />
              <div className="h-8 w-28 rounded-lg bg-surface" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="h-16 w-16 shrink-0 rounded-full bg-surface" />
            <div>
              <div className="h-7 w-52 rounded bg-surface" />
              <div className="mt-2 h-3 w-36 rounded bg-surface" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-2.5 w-20 rounded bg-border" />
              <div className="h-4 w-28 rounded bg-surface" />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-2">
          <div className="mb-4 h-4 w-40 rounded bg-surface" />
          <div className="rounded-xl border border-border p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-2.5 w-20 rounded bg-border" />
                  <div className="h-4 w-28 rounded bg-surface" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PatientRecordView() {
  const { patientId, medicalId } = useParams<{
    patientId: string;
    medicalId: string;
  }>();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationForm, setConsultationForm] = useState<
    Record<string, any>
  >({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const updateVisitMutation = useUpdateMedicalVisit();

  const {
    data: fetchedVisit,
    isLoading,
    isError,
    refetch,
  } = useMedicalVisitDetail(
    USE_DUMMY_DATA ? undefined : patientId,
    USE_DUMMY_DATA ? undefined : medicalId
  );

  const visit: MedicalVisitView | undefined = USE_DUMMY_DATA
    ? DUMMY_MEDICAL_VISIT
    : fetchedVisit;

  if (!USE_DUMMY_DATA && (!patientId || !medicalId)) {
    return <MedicalNotFound patientId={patientId} medicalId={medicalId} />;
  }

  if (!USE_DUMMY_DATA && isLoading) {
    return <MedicalRecordSkeleton />;
  }

  if (!visit || (!USE_DUMMY_DATA && isError)) {
    return <MedicalNotFound patientId={patientId} medicalId={medicalId} />;
  }

  const handleBack = (): void => {
    window.history.back();
  };

  const openConsultationEdit = () => {
    setConsultationForm({
      visitDate: visit.visit_date
        ? visit.visit_date.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      complaint: visit.complaint ?? "",
      treatment: visit.treatment ?? "",
    });
    setSaveError(null);
    setIsConsultationModalOpen(true);
  };

  const persistUpdate = (
    payload: UpdateMedicalVisit,
    onDone: () => void
  ): void => {
    if (USE_DUMMY_DATA || !patientId || !medicalId) {
      onDone();
      return;
    }

    if (Object.keys(payload).length === 0) {
      onDone();
      return;
    }

    setSaveError(null);
    updateVisitMutation.mutate(
      { patientId, medicalId, payload },
      {
        onSuccess: () => {
          onDone();
          void refetch();
        },
        onError: (error) => {
          setSaveError(getFieldErrorString(error));
        },
      }
    );
  };

  const handleSaveStatus = (form: Record<string, any>): void => {
    const status = toBackendStatus(String(form.status ?? ""));

    if (!status || status === visit.status) {
      setIsStatusModalOpen(false);
      return;
    }

    persistUpdate({ status }, () => setIsStatusModalOpen(false));
  };

  const handleSaveConsultation = (form: Record<string, any>): void => {
    const text = (value: unknown): string | undefined => {
      const trimmed = String(value ?? "").trim();
      return trimmed || undefined;
    };

    const payload: UpdateMedicalVisit = {};
    const visitDate = text(form.visitDate);
    const complaint = text(form.complaint);
    const treatment = text(form.treatment);
    const currentDate = visit.visit_date?.slice(0, 10) ?? "";

    if (visitDate && visitDate !== currentDate) {
      payload.visit_date = visitDate;
    }

    if (complaint && complaint !== (visit.complaint ?? "")) {
      payload.complaint = complaint;
    }

    if (treatment && treatment !== (visit.treatment ?? "")) {
      payload.treatment = treatment;
    }

    persistUpdate(payload, () => setIsConsultationModalOpen(false));
  };

  return (
    <>
      <SaveErrorBanner message={saveError} />

      <div className="mx-auto w-full">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />

          <div className="relative p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-1.5 py-1 text-xs font-medium text-textMuted hover:text-textPrimary"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to records
              </button>

              <div className="flex flex-wrap gap-2">
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
                  Print record
                </button>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                {getInitials(visit.patient_name)}
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-heading text-2xl font-semibold text-primaryDark">
                    {visit.patient_name}
                  </h1>
                  <span className="rounded-md bg-surfaceMuted px-2 py-0.5 text-xs text-textMuted">
                    MED-{visit.medical_visit_id}
                  </span>
                  <StatusBadge status={visit.status} />
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-textMuted">
                  {patientId && <span>{patientId}</span>}
                  <span>•</span>
                  <span>Medical Record</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <h2 className="font-heading text-sm font-semibold text-primaryDark">
                  Patient Information
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <InfoField label="Patient ID" value={patientId ?? visit.patient_id} />
              <InfoField label="Course" value={visit.course ?? undefined} />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <InfoField
                label="Year and Section"
                value={visit.year_section ?? undefined}
              />
              <InfoField label="Age" value={visit.age ?? undefined} />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <InfoField label="Sex" value={visit.sex ?? undefined} />
              <InfoField
                label="Civil status"
                value={visit.civil_status ?? undefined}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <InfoField
                label="Birthday"
                value={visit.birthday ? formatDate(visit.birthday) : undefined}
              />
              <InfoField label="Mobile Number" value={visit.mobileNumber ?? undefined} />
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-5">
              <InfoField label="Address" value={visit.address ?? undefined} />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <InfoField label="Status" value={visit.status} />
              <InfoField
                label="Visit date"
                value={visit.visit_date ? formatDate(visit.visit_date) : undefined}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between gap-2 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                <h2 className="font-heading text-sm font-semibold text-primaryDark">
                  Consultation
                </h2>
              </div>

              <button
                type="button"
                onClick={openConsultationEdit}
                aria-label="Edit consultation"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-textSecondary transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-xl border border-border p-5">
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <InfoField
                  label="Visit date"
                  value={visit.visit_date ? formatDate(visit.visit_date) : undefined}
                />
                <InfoField
                  label="Attending Staff"
                  value={visit.staff_name ?? undefined}
                />
              </div>

              <div className="mt-6 flex flex-col gap-5">
                <ReadOnlyBlock
                  label="Complaint / findings"
                  value={visit.complaint}
                />
                <ReadOnlyBlock label="Treatment" value={visit.treatment} />
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <p className="mb-3 text-xs font-medium text-textMuted">
                  Notified professor
                </p>

                {visit.notified_professor ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      {getInitials(visit.notified_professor.name)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-textPrimary">
                        {visit.notified_professor.name}
                      </p>
                      <p className="truncate text-xs text-textMuted">
                        {visit.notified_professor.role} · {visit.notified_professor.course}
                      </p>
                      <p className="truncate text-xs text-textSecondary">
                        {visit.notified_professor.email}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Emailed
                      </span>
                      <p className="mt-1 text-xs text-textMuted">
                        {formatDate(visit.notified_professor.sent_at)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-border px-3 py-3 text-sm text-textMuted">
                    No professor was notified for this record.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isStatusModalOpen && (
        <EditRecordModal
          title="Update status"
          fields={statusEditFields}
          data={{ status: visit.status }}
          onClose={() => setIsStatusModalOpen(false)}
          onSave={handleSaveStatus}
          isSaving={updateVisitMutation.isPending}
        />
      )}

      {isConsultationModalOpen && (
        <EditRecordModal
          title="Edit consultation"
          fields={consultationEditFields}
          data={consultationForm}
          onClose={() => setIsConsultationModalOpen(false)}
          onSave={handleSaveConsultation}
          isSaving={updateVisitMutation.isPending}
        />
      )}
    </>
  );
}